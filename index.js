'use strict';

// Make request to NPS API using an array of one or more
// states, as well as with a limit that defaults to 10 items

// parse all params into one string of expected format
let parseParams = function(obj) {
  let paramString = Object.keys(obj)
    .map(key => `${key}=${obj[key]}`);
  return paramString.join('&');
};

// Iterate through an array and turn into comma-separated string
// when multiple items are in array

let generateStatesParam = function(string) {
  string = string.trim();
  if(string.indexOf(' ') > 0 && string.indexOf(',') === -1) {
    string = string.replace(/\s+/g, ',');
  }
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

// handle call to NPS API with all params
let getNPSData = function(states, limit = 10) {
  let base = 'https://developer.nps.gov/api/v1/parks';
  let apiKey = '3vLaIg7VdZQ3qzEW32lYb5V8mZumILTeANZsdUJJ';
  let regParams = {
    api_key: apiKey,
    limit
  };
  let stateParams = generateStatesParam(states);
  let url = base + '?' + parseParams(regParams) + stateParams;

  fetch(url)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error (response);
    })
    // .then(responseJson => {
    //   responseJson.data.forEach( park => {
    //     let latlong = parseCoordinateString(park.latLong);
    //     let address = getAddressFromCoordinates(latlong);
    //     console.log(address);
    //   });
    //   return responseJson;
    // })
    .then(responseJson => {
      console.log(responseJson);
      return handleParkResults(responseJson);
    })
    .catch(err => `${err}`);
};

// fetch real address for each park too

let getAddressFromCoordinates = function(coordinates){
  let point = `${coordinates}`; 
  let base = `http://dev.virtualearth.net/REST/v1/Locations/${point}`;
  let params = {
    key: 'ApNOlhgS_B03nU4RFyrQtYOUcNhTos4ZzMZ6d007LFZ7K2YlcnTXTnF_dRjCO3jS', // api key here 
  };
  let url = base + '?' + parseParams(params);
  return fetch(url)
    .then( response => {
      if(response.ok) {
        return response.json();
      } 
      throw new Error ('Something went wrong');
    })
    .then( responseJson => responseJson)
    .catch(`${Error}`);
};
// parse string lat and long into just numbers
let parseCoordinateString = function(string){
  return string = string.replace(/[a-z]/gi, '').replace(/:/g, '').replace(/\s+/g, '');
};

// parse api results and update DOM
let handleParkResults = function(responseJson){
  $('.js-results').html('');
  if(responseJson.total === 0 ) {
    $('.js-results').html(
      '<p>No results found for this search!</p>'
    );
  } else {
    responseJson.data.forEach( park => {
      // let latlong = parseCoordinateString(park.latLong);
      // let address = getAddressFromCoordinates(latlong)
      //   .then(res => res.resourceSets[0].resources[0].address.formattedAddress);
      $('.js-results').append(
        `
        <h2><a href="${park.url}">${park.name}</a></h2>
        <ul>
          <li>Website: <a href="${park.url}">${park.url}</a></li>
          <li>${park.description}</li>
        </ul>
        `
      );
    }
    );
  }
};

// event listeners
let handleParkFormSubmit = function(){
  $('#js-park-form').on('submit', e => {
    e.preventDefault();
    let stateInput = $('#location').val();
    let maxResultInput = $('#result-limit').val();
    getNPSData(stateInput, maxResultInput);
  });
};

let main = function(){
  handleParkFormSubmit();
};

$(main);

