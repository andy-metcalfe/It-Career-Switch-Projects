var dropdownSelect = document.getElementById("country-dd");
var search = document.querySelector(".searchBox");
var convert = document.querySelector(".convert");
var fromCurrecy = document.querySelector(".from");
var toCurrecy = document.querySelector(".to");
var finalValue = document.getElementById("final-value");
var finalAmount = document.getElementById("final-amount");
let placeholderText = document.getElementById("placeholder");
var resultFrom;
var resultTo;
var searchValue;
let year;
let day;
let after = '';
let month;
let fullDateString;
let overviewButton;
let currencyButton;
let weatherButton;
let newsButton;
let imagesButton;
let covidButton;
let nationalHolidaysButton;
let wikipediaButton;
let markers;
let border;
let countryMarker;
let wikiMarkers;
let resultCountry;
let clockInterval;
let homeMarker;
var toggle;
let group;
let earthquakeMarkers;
let earthquakeLatitude;
let earthquakeLongitude;
let earthquakeMagnitude;
let radius;
let earthquakeDate;

//map load
var map = L.map('map').setView([15, 25], 2);

//icons and styles
var travelDestination = L.ExtraMarkers.icon({
  icon: 'fas fa-map-pin',
  markerColor: 'blue',
  shape: 'star',
  prefix: 'fa'
});

var wikipediaPins = L.ExtraMarkers.icon({
  icon: 'fas fa-search',
	iconColor: 'black',
  markerColor: 'white',
  shape: 'circle',
  prefix: 'fa'
});

var countryClick = L.ExtraMarkers.icon({
  icon: 'fas fa-globe-americas',
  markerColor: 'red',
  shape: 'square',
  prefix: 'fa'
});

var homeIcon = L.ExtraMarkers.icon({
  icon: 'fas fa-home',
  markerColor: 'green',
  shape: 'penta',
  prefix: 'fa'
});

var borderStyle = {
	 "color": '#DB0000',
	 "weight": 3,
	 "opacity": 0.65
};

var earthquakeMarker = {
     fillColor: '#FFFF00',
     color: '#E0E000'
 };

//map tile options
var defaultMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 12,
  minZoom: 2
}).addTo(map);

var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var lightsMap = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
});




//------------------------------------------------------------map loading
// on page load create drop down list and put in a-z order
window.onload = function(e) {
  $.ajax({
      url: "libs/php/getDropDownInfo.php",
      type: 'POST',
      dataType: 'json',
			beforeSend: function(){
			showLoader();
		 },
      success: function(result){
        console.dir(result);

        map.locate({setView: false});

        map.on('locationfound', onLocationFound);

        var names = result['data']['names'];
        var is02 = result['data']['is02'];

        for (let i = 0; i < names.length; i++) {
          var x = document.getElementById("country-dd");
          var option = document.createElement("option");
          option.classList.add('country-option');
          option.value = is02[i];
          option.text = names[i];

          x.add(option);
        }

				//make list in a-z order
        sortSelect(dropdownSelect);

        function sortSelect(selElem) {
            var tmpAry = new Array();
            for (var i=0;i<selElem.options.length;i++) {
                tmpAry[i] = new Array();
                tmpAry[i][0] = selElem.options[i].text;
                tmpAry[i][1] = selElem.options[i].value;
            }
            tmpAry.sort();
            while (selElem.options.length > 0) {
                selElem.options[0] = null;
            }
            for (var i=0;i<tmpAry.length;i++) {
                var op = new Option(tmpAry[i][0], tmpAry[i][1]);
                selElem.options[i] = op;
            }
            return;
        }
  },
      error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
			showErrorBox();
    },
		complete:function(data){
			 hideLoader();
			}
  });
};

function onLocationFound(e) {
		let lat = e.latlng.lat;
		let lng = e.latlng.lng;

    //put border around users country
		initalBorder(lat, lng);

    //if user allows location show markers checkboxes
    document.getElementById('checkbox-markers').style.display = 'block';
}




//country drop down - when changed run api call to gather all info at once
let selectCountry = document.querySelector(".form-select");

selectCountry.addEventListener('change', (event) => {
  resultCountry = `${event.target.value}`;
		getAll(resultCountry);
});




function getAll(countryCode){
  //hide tile menu and check all boxes for markers
  tilePopup.style.display = 'none';
  countryCheckbox.checked = true;
  poiCheckbox.checked = true;
  earthquakeCheckbox.checked = true;
  wikiCheckbox.checked = true;

  $.ajax({
      url: "libs/php/getLongAndLat.php",
      type: 'POST',
      dataType: 'json',
      data: {
        country: countryCode
      },
      success: function(result) {
				console.log('getLongLat')
        console.dir(result);

        // all info needed for php call
        let countryLatitude = result['longLat']['latlng'][0];
        let countryLongitude = result['longLat']['latlng'][1];
        let countryCodes = result['longLat']['alpha2Code'];
        let countryNames = result['longLat']['name'];
        let currencyCode = result['longLat']['currencies'][0]['code'];

				$.ajax({
			    url: "libs/php/getInfo1.php",
			    type: 'GET',
			    dataType: 'json',
			    data: {
			      lat: countryLatitude,
			      lng: countryLongitude,
            countryCode: countryCodes,
            countryName: countryNames,
            currencyCode: currencyCode
			    },
          beforeSend: function(){
    			showLoader();
    		 },
			    success: function(result) {
			      console.log('getInfo1');
			      console.dir(result);

            //add side buttons once country is selected
            addButtons();
            //all functions gather information and fill modal pop ups
            overviewLoad(result);
            weatherLoad(result);
            pointsOfInterestLoad(result);
            imagesLoad(result);
            newsLoad(result);
            covidLoad(result);
            nationalHolidaysLoad(result);
            wikiLoad(result);
            wikiMarkersLoad(result);
            currencyLoad(result);

            // values needed to gather earthquake info
              let north = result['northEastSouthWest']['north'];
              let south = result['northEastSouthWest']['south'];
              let east = result['northEastSouthWest']['east'];
              let west = result['northEastSouthWest']['west'];

              $.ajax({
                  url: "libs/php/earthquakes.php",
                  type: 'POST',
                  dataType: 'json',
                  data: {
                    north: north,
                    south: south,
                    east: east,
                    west: west
                  },
                  success: function(result) {
                   console.log('earthquakes');
                   console.dir(result);

                   //creates earthquake markers
                   earthquakeLoad(result);

              },
                  error: function(jqXHR, textStatus, errorThrown) {
                  console.log(errorThrown);
                  showErrorBox();
                }
              });

              let countryCountry = result['openCage']['country'];
					    let iso3CountryCode = result.openCage['ISO_3166-1_alpha-3'];

    					 $.ajax({
    							 url: "libs/php/getCountryBorder.php",
    							 type: 'POST',
    							 dataType: 'json',
    							 data: {
    								 code: iso3CountryCode
    							 },
    							 success: function(result) {
    								console.log('getCountryBorder');
    								console.dir(result);

                    //puts border around selected country
                    borderLoad(result,countryLatitude,countryLongitude,countryCountry);

    					 },
    							 error: function(jqXHR, textStatus, errorThrown) {
    							 console.log(errorThrown);
    							 showErrorBox();
    						 }
    					 });
			    },
          complete:function(data){
      			 hideLoader();
           },
			    error: function(jqXHR, textStatus, errorThrown) {
			      console.log(errorThrown);
						showErrorBox();
			    }
			  });
      },
      error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
			showErrorBox();
    }
  });
}

//make inital border around users country and gather all information
function initalBorder(lat,lng){
	$.ajax({
		url: "libs/php/openCage.php",
		type: 'GET',
		dataType: 'json',
		data: {
			lat: lat,
			lng: lng
		},
		success: function(result) {
      console.dir(result);

			iso3CountryCode = result.openCage['ISO_3166-1_alpha-3'];

      let countryPlaceholder = result['openCage']['country'];
      let countryValue = result['openCage']['ISO_3166-1_alpha-2'];

      var x = document.getElementById("country-dd");
      var option = document.createElement("option");

      option.text = countryPlaceholder;
      option.selected = 'selected';
      option.value = countryValue;
      x.prepend(option);

      getAll(countryValue);

		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
			showErrorBox();
		}
	});
}




//--------------------------------------------------------------------functions
//get and set all overview information
function overviewLoad(result){
  //change all basic data that needs no editing
  $('#country').html(result['openCage']['country']);
  $('#continent-title').html(result['openCage']['continent']);
  $('#capital-title').html(result['restCountries']['capital']);
  $('#language-title').html(result['restCountries']['languages'][0]['name']);
  $('#flag-image').attr('src', result['restCountries']['flags']['png']);
  $('#currency-title').html(result['restCountries']['currencies'][0]['name']);

  //reformat date to read date month year
  let getTime = result['timeZone']['time'];
  let sliceTime = getTime.slice(11,16);
  let countryHour = sliceTime.slice(0,2);
  let countryMin = sliceTime.slice(3,6);
  let countryYear = getTime.slice(0,4);
  let countryMonth = getTime.slice(5,7);
  let countryDay = getTime.slice(8,10);
  let getDate = result['timeZone']['time'];

  reformatDate(getDate);

  $('#clock-container').html(sliceTime);
  $('#date-text').html(fullDateString);

  //change sunrise and sunset if sunset exists
  let getSunRiseTime = result['timeZone']['sunrise'];
  let newGetSunRiseTime = getSunRiseTime.slice(11,16);

  if(result['timeZone']['sunset']){
     let getSunSetTime = result['timeZone']['sunset'];
     let newGetSunSetTime = getSunSetTime.slice(11,16);
    $('#sun-rise-text').html(newGetSunSetTime);
  }
  $('#sun-set-text').html(newGetSunRiseTime);

  //change independent or not independent
  let independentOverview = result['restCountries']['independent'];
  if(independentOverview == true){independentOverview = 'Independent';} else {
     independentOverview = 'Not Independent';}
  $('#independent-title').html(independentOverview);


  //add commas to population
  let populationNumb = result['restCountries']['population'];

  let numb = populationNumb;
  function separator(numb) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }

  let finalPopulation = separator(populationNumb);

  $('#population-title').html(finalPopulation);
  $('#population').html(finalPopulation);

  //working clock
  var startTime;
  var mytime
  var diff;
  var seconds;
  var minutes;
  var hours;
  var currentTime;

  if(clockInterval) {clearInterval(clockInterval)}
  clock();
  clockInterval = setInterval(clock,1000);

  startTime = new Date();
  function clock() {

      mytime = new Date(countryYear, countryMonth, countryDay, countryHour, countryMin, 00, 567);
      diff = new Date() - startTime;

      mytime.setMilliseconds(mytime.getMilliseconds() + diff);

       seconds = mytime.getSeconds();
       minutes = mytime.getMinutes();
       hours = mytime.getHours();

      if(seconds < 10){
        seconds = '0' + seconds;
      }
      if(minutes < 10){
        minutes = '0' + minutes;
      }
      if(hours < 10){
        hours = '0' + hours;
      }

      currentTime = hours + ":" + minutes + ":" + seconds;
      $('#clock-container').html(currentTime);
  }
}

//get and set all weather information
function weatherLoad(result){
  //sets data that doesnt need to be edited
  $('#location-text').html(result['openCage']['country']);
  $('#wind-title').html(result['openWeather']['current']['wind_speed'] + ' mph');
  $('#sky-conditions-title').html(result['openWeather']['current']['weather'][0]['description']);
  $('#humidity-title').html(result['openWeather']['current']['humidity'] + '%');

  //changes temp to degrees
  let kelvinTemp = result['openWeather']['current']['temp'];
  let finalTemp = Math.round(kelvinTemp - 273.15);
  $('#temp-text').html(finalTemp + '&#186;');

  //sets weather icon
  let iconCode = result['openWeather']['current']['weather'][0]['icon'];
  let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  $('#weather-icon-image').attr('src', iconUrl);

  //creates next 5 day forecasts
  forecastDay(1);
  forecastDay(2);
  forecastDay(3);
  forecastDay(4);
  forecastDay(5);

  setForecast(0);
  setForecast(1);
  setForecast(2);
  setForecast(3);
  setForecast(4);

  function forecastDay(number){
    let forecastDay = 'forecastDay' + number;
    forecastDay = result['openWeather']['daily'][number]['dt'];
    var xx = new Date();
    xx.setTime(forecastDay*1000);
    forecastDay = xx.toUTCString();
    forecastDay = forecastDay.slice(0,3);
    document.getElementById("day" + number).innerHTML= forecastDay;
  }

  function setForecast(number){
    let forecastTemp = 'forecast' + number + 'Temp';
    forecastTemp = result['openWeather']['daily'][number]['temp']['day'];
    forecastTemp = Math.round(forecastTemp - 273.15);
    document.getElementById('temp' + number).innerHTML = forecastTemp + '&#186;';

    let forecastIcon = 'forecast' + number + 'Icon';
    forecastIcon = result['openWeather']['daily'][number]['weather'][0]['icon'];
    forecastIcon = "http://openweathermap.org/img/w/" + forecastIcon + ".png";
    document.getElementById("icon" + number).src= forecastIcon;
  }
}

//get and set all points of interest information
function pointsOfInterestLoad(result){
  //markers to be removed from previous load
  if(markers != undefined){
  map.removeLayer(markers);
  }

  let myStringArray = result['pointsOfInterest']['results'];
  markers = L.markerClusterGroup();

  for (var i = 0; i < myStringArray.length; i++) {
    let poiLat = myStringArray[i]['coordinates']['latitude'];
    let poiLng = myStringArray[i]['coordinates']['longitude'];
    let poiName = myStringArray[i]['name'];
    let title = poiName;

    marker = L.marker(new L.LatLng(poiLat, poiLng), {icon: travelDestination}, {
      title: title
    })
    marker.bindPopup(title);
    markers.addLayer(marker);
    markers.addTo(map);
  }
}

//get and set all images
function imagesLoad(result){
  //fill a carousel with up to 10 images of the country
  let imagesAll = result['images'];

  const emptyImages = document.getElementById("carousel");
  emptyImages.innerHTML = '';

  if(imagesAll.length == 0){
    emptyImages.innerHTML = 'No images available';
  }

  for (let i = 0; i < imagesAll.length; i++) {
    var imagesDiv = document.createElement("div");
    var imagesImg = document.createElement("img");
    var carousel = document.getElementById("carousel");

    if(i == 0){
      imagesDiv.classList.add('active');
    }
      imagesDiv.classList.add('carousel-item');
      carousel.append(imagesDiv);
      imagesImg.classList.add('d-block');
      imagesImg.classList.add('w-100');
      imagesImg.src = imagesAll[i]['largeImageURL'];
      imagesDiv.append(imagesImg);
  }
}

//get and set all news information
function newsLoad(result){
  //fills table with up to 10 news stories with links to web page
  const emptyNews = document.getElementById("news-table");
  emptyNews.innerHTML = '';

  let newsAll = result['news']['results'];

  var table = document.getElementById("news-table");
  var tr = document.createElement("tr");
  var newsCell = document.createElement("td");
  var newsA = document.createElement("a");

  if(newsAll.length == 0){
    tr.classList.add('table-row');
    table.append(tr);
    tr.append(newsCell);
    newsCell.append(newsA);
    newsA.innerHTML = 'No news available at this time';
  }

  for (let i = 0; i < newsAll.length; i++) {
      var tr = document.createElement("tr");
      var newsCell = document.createElement("td");
      var newsA = document.createElement("a");
      tr.classList.add('table-row');
      newsA.innerHTML = newsAll[i]['title'];
      newsA.href = newsAll[i]['link'];
      newsA.target = '_blank';
      table.append(tr);
      tr.append(newsCell);
      newsCell.append(newsA);
  }
}

//get and set all covid information
function covidLoad(result){
  //adds commas
  function separator(variable) {
    var str = variable.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }

  //sets covid data
  $('#covid-confirmed').html(separator(result['covid']['confirmed']));
  $('#covid-critical').html(separator(result['covid']['critical']));
  $('#covid-deaths').html(separator(result['covid']['deaths']));
  $('#covid-recovered').html(separator(result['covid']['recovered']));
  $('#covid-cpm').html(separator(result['covid']['calculated']['cases_per_million_population']));
  $('#covid-death-rate').html(result['covid']['calculated']['death_rate'].toFixed(3));
  $('#covid-recovery-rate').html(result['covid']['calculated']['recovery_rate'].toFixed(3));
}

//get and set all national holiday information
function nationalHolidaysLoad(result){
  //fills table with all national holidays
   const emptyNationalHolidays = document.getElementById("national-holiday-table");
   emptyNationalHolidays.innerHTML = '';

   let nationalHolidaysAll = result['nationalHolidays']['holidays'];

   if(nationalHolidaysAll){
     for (let i = 0; i < nationalHolidaysAll.length; i++) {
       var x = document.getElementById("national-holiday-table");
       var option = document.createElement("tr");
       option.classList.add('table-row');
       x.append(option);

       var nationHolidayDate = document.createElement("th");
       nationalHolidayDateReformat = nationalHolidaysAll[i]['date']['iso'];
       newNationalHolidayDateReformat = reformatDate(nationalHolidayDateReformat);
       nationHolidayDate.innerHTML = fullDateString;
       option.append(nationHolidayDate);

       var nationHolidayDescription = document.createElement("td");
       nationHolidayDescription.innerHTML = nationalHolidaysAll[i]['name'];
       option.append(nationHolidayDescription);
     }
   } else {
     var x = document.getElementById("national-holiday-table");
     var option = document.createElement("tr");
     option.classList.add('table-row');
     x.append(option);

     var nationHolidayDate = document.createElement("th");

     nationHolidayDate.innerHTML = 'No data available at this time';
     option.append(nationHolidayDate);
   }
}

//get and set all wiki information
function wikiLoad(result){
  //fills table with up to 10 wiki pages
  const emptyWikipedia = document.getElementById("wikipedia-table");
  emptyWikipedia.innerHTML = '';

  let wikipediaAll = result['wikipedia']['geonames'];

  for (let i = 0; i < wikipediaAll.length; i++) {
    var x = document.getElementById("wikipedia-table");

    var option = document.createElement("tr");
    var wikipediaTitle = document.createElement("th");
    var wikipediaCell = document.createElement("td");
    var wikipediaA = document.createElement("a");

    option.classList.add('table-row');
    wikipediaTitle.classList.add('wiki-th');
    wikipediaA.classList.add('wiki-a');

    x.append(option);
    option.append(wikipediaTitle);
    option.append(wikipediaCell);

    wikipediaTitle.innerHTML = result['wikipedia']['geonames'][i]['title'];

    wikipediaURL = result['wikipedia']['geonames'][i]['wikipediaUrl'];
    fullWikiUrl = 'https://' + wikipediaURL;

    if(wikipediaURL.length > 40){
      wikipediaShortLink = wikipediaURL.slice(0,40);
      wikipediaA.innerHTML = wikipediaShortLink;
    } else {
      wikipediaA.innerHTML = wikipediaURL;
    }
    wikipediaA.href = 'https://' + wikipediaURL;
    wikipediaA.target = '_blank';
    wikipediaCell.append(wikipediaA);
  }
}

//get and set all wiki markers
function wikiMarkersLoad(result){
  //deletes existing markers
  if(wikiMarkers != undefined){
  map.removeLayer(wikiMarkers);
  }

  var wikiStyle = {
       fillColor: 'white',
       color: 'black'
   };

  let wikipediaAllMarkers = result['wikipedia']['geonames'];
  wikiMarkers = L.markerClusterGroup();

  for (var i = 0; i < wikipediaAllMarkers.length; i++) {
    let wikiLat = wikipediaAllMarkers[i]['lat'];
    let wikiLng = wikipediaAllMarkers[i]['lng'];
    let wikiName = wikipediaAllMarkers[i]['title'];
    let wTitle = wikiName;

    wikipediaURL = result['wikipedia']['geonames'][i]['wikipediaUrl'];
    fullWikiUrl = 'https://' + wikipediaURL;

    wikiMarker = L.marker(new L.LatLng(wikiLat, wikiLng), {icon: wikipediaPins}, {
      title: wTitle
    }).bindPopup('<a target="_blank" href=' + fullWikiUrl + '>' + wTitle + '</a>').openPopup();

    //wikiMarker.bindPopup(wTitle);
    wikiMarkers.addLayer(wikiMarker);
    wikiMarkers.addTo(map);
  }
}

//get and set all currency information
function currencyLoad(result){
  //currency form reset
  document.getElementById("currency-form").reset();
  clearVal();

  //tells users their currency
  let currencyPlaceHolder = result['restCountries']['currencies'][0]['code'];
  placeholderText.innerHTML = 'Your Currency is: ' + currencyPlaceHolder;
  document.getElementById("placeholder").value = currencyPlaceHolder;

  //currency page title
  $('#currency-header').html(result['restCountries']['currencies'][0]['name']);

  //converts the country currency to any other
  currencyConverter();

  function currencyConverter(){
    getCurrencyValue();

    toCurrecy.addEventListener('change', (event) => {
      resultTo = `${event.target.value}`;
    });

    function getCurrencyValue(){
      resultFrom = document.getElementById('placeholder').value;
    }

    fromCurrecy.addEventListener('change', (event) => {
      resultFrom = `${event.target.value}`;
    });

    search.addEventListener('input', updateValue);

    function updateValue(e) {
      searchValue = e.target.value;
    }

    convert.addEventListener("click", displayResults);

    function displayResults(currency) {
      let fromRate = result['currency']['rates'][resultFrom];
      let toRate = result['currency']['rates'][resultTo];
      finalValue.innerHTML = ((toRate / fromRate) * searchValue).toFixed(2);
      finalAmount.style.display = "block";
    }
  }
}

//get and set all earthquake information
//places earthquakes onto map
function earthquakeLoad(result){
  let earthquakesAll = result['earthquakes']['earthquakes'];

   if(earthquakeMarkers != undefined){
   map.removeLayer(earthquakeMarkers);
   }

 earthquakeMarkers = L.layerGroup();

  for (var i = 0; i < earthquakesAll.length; i++) {
    earthquakeLatitude = earthquakesAll[i]['lat'];
    earthquakeLongitude = earthquakesAll[i]['lng'];
    earthquakeMagnitude = earthquakesAll[i]['magnitude'];
    earthquakeDate = earthquakesAll[i]['datetime'];
    earthquakeDate = earthquakeDate.slice(0,11);
    reformatDate(earthquakeDate);

    d = {
      lat: earthquakeLatitude,
      lng: earthquakeLongitude
    };

  //size of radius based on magnitude
   if(earthquakeMagnitude < 1){radius = 5000;} else
   if(earthquakeMagnitude < 2){radius = 10000;} else
   if(earthquakeMagnitude < 3){radius = 20000;} else
   if(earthquakeMagnitude < 4){radius = 30000;} else
   if(earthquakeMagnitude < 5){radius = 40000;} else
   if(earthquakeMagnitude < 6){radius = 50000;} else
   if(earthquakeMagnitude < 7){radius = 60000;} else
   if(earthquakeMagnitude < 8){radius = 70000;} else
   if(earthquakeMagnitude < 9){radius = 80000;} else
   if(earthquakeMagnitude >= 9){radius = 90000;}

   //hover over radius to see info
    earthquakeCircle = L.circle(d, radius,earthquakeMarker).bindPopup('<p>'+ fullDateString +'</p><p> Magnitude: '+ earthquakeMagnitude +'</p>');

    earthquakeMarkers.addLayer(earthquakeCircle);
    earthquakeMarkers.addTo(map);

    earthquakeCircle.on('mouseover', function (e) {
           this.openPopup();
       });
       earthquakeCircle.on('mouseout', function (e) {
           this.closePopup();
       });
     }
}

//get and set all border information
function borderLoad(result,countryLatitude,countryLongitude,countryCountry){
  //border around country
   d = {
     lat: countryLatitude,
     lng: countryLongitude
   };

   let group;
   let borderLines = result['data']['border'];

  //remove and existing borders or markers
   if(countryMarker != undefined){map.removeLayer(countryMarker);}
   if(border != undefined){map.removeLayer(border);}

   countryMarker = L.marker(d,{icon: countryClick});
   countryMarker.addTo(map).bindPopup(countryCountry);

   border = L.geoJSON(borderLines,{style: borderStyle}).addTo(map);

   //group = L.featureGroup([border,countryMarker]).addTo(map);
   map.fitBounds(border.getBounds());
}


//----------------------------------------------------------add buttons
function addButtons(){

	removeButton(overviewButton);
	removeButton(currencyButton);
	removeButton(weatherButton);
	removeButton(newsButton);
	removeButton(imagesButton);
	removeButton(covidButton);
	removeButton(nationalHolidaysButton);
	removeButton(wikipediaButton);

	function removeButton(button){
		if(button != undefined){
			button.remove();
		}
	}

	overviewButton = L.easyButton('fa-globe', function(btn, map){
		$("#overview-pop-up").modal('show');
	}).addTo(map);

	currencyButton = L.easyButton('fas fa-pound-sign', function(btn, map){
	  $("#currency-pop-up").modal('show');
	}).addTo(map);

	weatherButton = L.easyButton('fas fa-cloud', function(btn, map){
	  $("#weather-pop-up").modal('show');
	}).addTo(map);

	newsButton = L.easyButton('fas fa-bullhorn', function(btn, map){
	  $("#news-pop-up").modal('show');
	}).addTo(map);

	imagesButton = L.easyButton('far fa-images', function(btn, map){
	  $("#images-pop-up").modal('show');
	}).addTo(map);

	covidButton = L.easyButton('fas fa-virus', function(btn, map){
	  $("#covid-pop-up").modal('show');
	}).addTo(map);

	nationalHolidaysButton = L.easyButton('far fa-calendar-alt', function(btn, map){
	  $("#national-holidays-pop-up").modal('show');
	}).addTo(map);

	wikipediaButton = L.easyButton('fas fa-search', function(btn, map){
	  $("#wikipedia-pop-up").modal('show');
	}).addTo(map);
}

//close and open markers and map tile control
var tilePopup = document.getElementById("layer-dropdown-hide");

var layerButton = L.easyButton('fas fa-layer-group', function(){
  tilePopup.style.display = 'block';
}, {position: 'topright'}).addTo(map);

var closeTileMenu = document.getElementById("x");
closeTileMenu.addEventListener('click', function() {
  tilePopup.style.display = 'none';
});

//checkboxes to control markers
var countryCheckbox = document.getElementById("country-markers");
var poiCheckbox = document.getElementById("poi-markers");
var earthquakeCheckbox = document.getElementById("earthquake-markers");
var wikiCheckbox = document.getElementById("wikipedia-markers");

countryCheckbox.addEventListener('click', function() {
  if(countryCheckbox.checked == true){map.addLayer(countryMarker);}
  if(countryCheckbox.checked == false){map.removeLayer(countryMarker);}
});

poiCheckbox.addEventListener('click', function() {
  if(poiCheckbox.checked == true){map.addLayer(markers);}
  if(poiCheckbox.checked == false){map.removeLayer(markers);}
});

earthquakeCheckbox.addEventListener('click', function() {
  if(earthquakeCheckbox.checked == true){map.addLayer(earthquakeMarkers);}
  if(earthquakeCheckbox.checked == false){map.removeLayer(earthquakeMarkers);}
});

wikiCheckbox.addEventListener('click', function() {
  if(wikiCheckbox.checked == true){map.addLayer(wikiMarkers);}
  if(wikiCheckbox.checked == false){map.removeLayer(wikiMarkers);}
});

//removing and adding map tiles
var defaultRadio = document.getElementById("default-map");
var satelliteRadio = document.getElementById("satellite-map");
var lightsRadio = document.getElementById("lights-map");
var streetRadio = document.getElementById("street-map");

changeMapTile(defaultRadio, defaultMap);
changeMapTile(satelliteRadio, satelliteMap);
changeMapTile(lightsRadio, lightsMap);
changeMapTile(streetRadio, streetMap);

function changeMapTile(radio,mapTile){

  radio.addEventListener('change', function() {

    if(defaultMap){defaultMap.remove(map);}
    if(streetMap){streetMap.remove(map);}
    if(satelliteMap){satelliteMap.remove(map);}
    if(lightsMap){lightsMap.remove(map);}

    if (this.checked) {
      mapTile.addTo(map);
    }
  });
}

//show loading box
function showLoader(){
	$("#loader-box").fadeIn();
}

//hide loading box
function hideLoader(){
	$("#loader-box").fadeOut();
}

//error box
function showErrorBox(){
	document.getElementById('hide').style.display = 'block';
}

//clear final value in form
function clearVal() {
  document.getElementById("final-value").innerHTML = "";
};

//reset currency form final value
buttonReset = document.getElementById('button-reset');
buttonReset.addEventListener('click', (event) => {
  document.getElementById("final-value").innerHTML = "";
});

//change date format
function reformatDate(fullDate){
	year = fullDate.slice(0,4);
	month = fullDate.slice(5,7);
	day = fullDate.slice(8,10);
	after = '';
	changeMonthToText(month);
	changeTextAfterDate(day);

	if(day.charAt(0) == 0){
		day = day.substring(1);
	}

	fullDateString = day + after + ' ' + month + ' ' + year;
}

function changeTextAfterDate(date){
	if(date == 1){
		after = 'st';
	} else if (date == 2) {
		after = 'nd';
	} else if (date == 3) {
		after = 'rd';
	} else if (date > 3 && date < 21) {
		after = 'th';
	} else if (date == 21) {
		after = 'st';
	} else if(date == 22){
		after = 'nd';
	} else if (date == 23) {
		after = 'rd';
	} else if (date > 23 && date < 31) {
		after = 'th';
	} else if (date == 31) {
		after = 'st';
	}
}

function changeMonthToText(monthVariable){
	switch(monthVariable) {
	case monthVariable = '01':
	month = 'Jan'
	break;
	case monthVariable = '02':
	month = 'Feb'
	break;
	case monthVariable = '03':
	month = 'Mar';
	break;
	case monthVariable = '04':
	month = 'Apr';
	break;
	case monthVariable = '05':
	month = 'May';
	break;
	case monthVariable = '06':
	month = 'Jun';
	break;
	case monthVariable = '07':
	month = 'Jul';
	break;
	case monthVariable = '08':
	month = 'Aug';
	break;
	case monthVariable = '09':
	month = 'Sep';
	break;
	case monthVariable = '10':
	month = 'Oct';
	break;
	case monthVariable = '11':
	month = 'Nov';
	break;
	case monthVariable = '12':
	month = 'Dec';
	break;
}
}
