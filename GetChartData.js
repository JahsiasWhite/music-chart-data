//const fetch = require('node-fetch');
//const cheerio = require('cheerio');
//import fetch from 'node-fetch';
import axios from 'axios';
import cheerio from 'cheerio';

const BASE_URL = 'https://musicchartsarchive.com';

// Gets the HTML of a given URL
const getRawData = (URL) => {
  return (
    axios
      .get(URL)
      //.then((response) => response.text())
      .then((data) => {
        return data.data;
      })
  );
};

/**
 *
 * @description Gets chart data of a given track
 *
 * @param {String} artist Artist name with spaces replaced by '-'. Example: kendrick-lamar
 * @param {String} track Track name with spaces replaced by '-'. Example: wait-for-you
 * @param {String} type Format of the given track. Can be 'singles', 'album'.
 * @param {*} cb
 */
const getChartData = async (artist, track, type, cb) => {
  let artistName = artist;
  let trackName = track;
  let recordType = type;

  if (typeof artistName === 'function') {
    // No name was specified
    console.log('No artist name specified');
    return;
  }

  if (typeof trackName === 'function') {
    // No track was specified
    console.log('No track name specified');
    return;
  }

  if (typeof type === 'function') {
    // No type was specified
    console.log('No type specified');
    return;
  }

  // That's what you meant, right?
  if (recordType == 'album') {
    recordType = 'albums';
  } else if (recordType == 'single') {
    recordType = 'singles';
  }

  //https://musicchartsarchive.com/singles/kendrick-lamar/pride
  var url = `${BASE_URL}/${recordType}/${artistName}/${trackName}`;

  const chart = {};
  chart.weeks = [];

  // Get the plain HTML
  const html = await getRawData(url);

  // Load the HTML into cheerio to help parse
  var $ = cheerio.load(html);

  // Gets a list containing each week the record charted
  var dirtyChartData = [];
  $('.history-table')
    .find('tr') // each row
    .find('td')
    .each(function (i, tr) {
      dirtyChartData.push($(tr).text());
    });

  // Checks if we were able to parse through the data
  if (dirtyChartData.length == 0) {
    console.log('No data found for: ', trackName, ' by ', artistName);
    return;
  }

  // Get rid of header text
  dirtyChartData.shift();

  /**
   *
   * Puts the chart data into an object
   *
   * var chartData = {
   *     week=1 : {
   *         "date": "2022-07-16",
   *         "position": "3"
   *     },
   *     week-2 : {
   *         "date": "2022-07-19",
   *         "position": "2"
   *     }
   * }
   *
   */

  var chartData = {};
  for (let i = 2; i < dirtyChartData.length; i += 2) {
    var sectionName = 'week-' + i / 2;
    chartData[sectionName] = {};
    chartData[sectionName].date = dirtyChartData[i];
    chartData[sectionName].position = dirtyChartData[i + 1];
    chartData[sectionName].id = i / 2;
  }

  return chartData;
};

console.log(await getChartData('kanye-west', 'donda', 'album'));

export default getChartData;
