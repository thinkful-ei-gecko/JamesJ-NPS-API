'use strict';

// Make request to NPS API using an array of one or more
// states, as well as with a limit that defaults to 10 items

// parse all params into one string of expected format
let parseParams = function(obj) {
  let paramString = Object.keys(obj)
    .map(key => `${key}=${obj[key]}`);
  return paramString.join('&');
};

let getNPSData = function(states, limit = 10) {
  let base = 'https://developer.nps.gov/api/v1/parks';
  let apiKey = '3vLaIg7VdZQ3qzEW32lYb5V8mZumILTeANZsdUJJ';
  let regParams = {
    key: apiKey,
    limit
  };
  let stateParams = generateStatesParam(states);
  let url = base + '?' + parseParams(regParams) + stateParams;
  console.log(url);
};

// Iterate through an array and turn into comma-separated string
// when multiple items are in array

let generateStatesParam = function(string) {
  string = string.replace(/\s+/g, '');
  let states = string.split(',');
  let stateParam = '';
  if (states.length > 1) { 
    states.forEach(state => {
      stateParam += `&stateCode=${state}`;
    });
  } else {
    stateParam = `&stateCode=${states}`;
  }
  return stateParam;
};

let testStates = 'FL';
console.log(generateStatesParam(testStates));
getNPSData('Fl,GA, TX');