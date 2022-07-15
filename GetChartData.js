//const fetch = require('node-fetch');
//const cheerio = require('cheerio');
import fetch from 'node-fetch';
import cheerio from 'cheerio';

const BASE_URL = 'https://musicchartsarchive.com';

// Gets the HTML of a given URL
const getRawData = (URL) => {
  return fetch(URL)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
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
const getArtistData = async (artist, track, type, cb) => {
  let artistName = artist;
  let trackName = track;
  let recordType = type;

  if (typeof artistName === 'function') {
    // No name was specified
  }

  if (typeof trackName === 'function') {
    // No track was specified
  }

  if (typeof type === 'function') {
    // No type was specified
  }

  //https://musicchartsarchive.com/singles/kendrick-lamar/pride
  var url = `${BASE_URL}/${recordType}/${artistName}/${trackName}`;

  const chart = {};
  chart.weeks = [];

  // Get the plain HTML
  const html = await getRawData(url);
  //console.log(html);

  // Load the HTML into cheerio to help parse
  var $ = cheerio.load(html);

  // Gets a list containing each week the record charted
  var dirtyChartData = [];
  $('.history-table')
    .find('tr')
    .find('td')
    .each(function (i, tr) {
      dirtyChartData.push($(tr).text());
    });

  // Get rid of header text
  dirtyChartData.shift();

  var myJsonString = JSON.stringify(dirtyChartData);
  console.log(myJsonString);

  /**
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
  console.log(chartData);
};

getArtistData('future', 'wait-for-u', 'singles', (err, chart) => {
  console.log(chart);
});

//module.exports = { getArtistData };
