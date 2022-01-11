//all required ids
let capitalTitle = document.getElementById("capital-title");
let populationTitle = document.getElementById("population-title");
let languageTitle = document.getElementById("language-title");
let placeholderText = document.getElementById("placeholder");
let link1Text = document.getElementById("link1");
let link2Text = document.getElementById("link2");
let link3Text = document.getElementById("link3");
let link4Text = document.getElementById("link4");
let link5Text = document.getElementById("link5");
let header = document.getElementById("country-name");
let continentTitle = document.getElementById("continent-title");
let dateText = document.getElementById("date-text");
let clockText = document.getElementById("clock-container");
let sunRiseText = document.getElementById("sun-rise-text");
let sunSetText = document.getElementById("sun-set-text");
let tempText = document.getElementById("temp-text");
let windText = document.getElementById("wind-title");
let skyText = document.getElementById("sky-conditions-title");
let humidityText = document.getElementById("humidity-title");

//welcome message with ? btn
function help() {
    alert('Welcome to World Information!\nTo move around on computer click and drag to where you want to go. Zoom in and out with the mouse scroll. On a mobile device move around the map by dragging and pinch to zoom in and out.\nSelect a country to find out more information.\nOnce clicked you will be able to see all the countrys information.\nIf it is currently night in that country the pop-up will be put into dark mode.\nUse the currency converter to compare that country\'s currency to others.\n(The deafult currency will be the selected country)\nYou can find out even more about the country by using the Wikipedia links at the bottom of the page.');
}

//set view of map
var map = L.map('map').setView([15, 25], 2);

//tile overlay
var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 12,
  minZoom: 2
}).addTo(map);

//find user location
map.locate({setView: true, maxZoom: 6});

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

//click map function
map.on('click', function(e) {
	//console.log("Lat: " + e.latlng.lat);
	//console.log("Lon : " + e.latlng.lng);

//lets user click anywhere on map
//if long is over 180 or under -180
	lon = e.latlng.lng;
		while(lon < -180){
		  lon +=360;
		}
		while (lon > 180){
		  lon -= 360;
		}

	$.ajax({
		url: "libs/php/project1.php",
		type: 'GET',
		dataType: 'json',
		data: {
			lat: e.latlng.lat,
			lng: lon,
		},
		success: function(result) {
			//console.dir(result);
			let countryCode = result.openCage.country_code;
			let countryName = result.openCage.country;
			let iso3CountryCode = result.openCage['ISO_3166-1_alpha-3'];

      //prevents user clicking ocean
			if(result.openCage._category == 'natural/water'){
				alert("Country Not Selected: Please select a country");
			} else if(result.openCage.country) {

              //modal pop-up
						  $("#pop-up-tab").modal('show');

              //go to click and zoom
							map.flyTo([e.latlng.lat,e.latlng.lng ], 5, {
											animate: true,
											duration: 1
							});

              // adds marker to map
							L.marker(e.latlng).addTo(map).bindPopup(result['openCage']['country']).openPopup(); // marker on map?

					$.ajax({
							url: "libs/php/countryBorder.php",
							type: 'POST',
							dataType: 'json',
							success: function(result) {
								//console.dir(result);

                //put border around selected country
								var border;
								let name = iso3CountryCode;
								const filterData = result.data.border.features.filter((a) => (a.properties.iso_a3 === name));
								border = L.geoJSON(filterData[0]).addTo(map);
								map.fitBounds(border.getBounds());

					},
							error: function(jqXHR, textStatus, errorThrown) {
							console.log(errorThrown);
						},
					});

					$.ajax({
						url: "libs/php/project1v2.php",
						type: 'GET',
						dataType: 'json',
						data: {
							countryCode: countryCode,
							countryName: countryName
						},
						beforeSend: function(){
						// Show loader before page renders
						$("#loader-box").show();
					 },
						success: function(result) {
							console.dir(result);

              //change all data
              updateCapital();
              updatePopulation();
              updateLanguage();
              updateFlag();
              updatePlaceholder();
              getCurrencyValue();
              updateLinks();
              updateWikiImage();

              //functions
              function updateCapital(){
                let capitalName = result['restCountries']['capital'];
                capitalTitle.innerHTML = capitalName;
              }

              function updatePopulation(){
                let populationName = result['restCountries']['population'];
                const numb = populationName;
                //add commas
                function separator(numb) {
                  var str = numb.toString().split(".");
                  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  return str.join(".");
                }

                finalPopulation = separator(populationName);
                populationTitle.innerHTML = finalPopulation;
              }

              function updateLanguage(){
                let languageName = result['restCountries']['languages'][0]['name'];
                languageTitle.innerHTML = languageName;
              }

              function updateFlag(){
                let flagLink = result['restCountries']['flags']['png'];
  							document.getElementById("flag-image").src= flagLink;
              }

              function updatePlaceholder(){
                //reset form each time
                document.getElementById("currency-form").reset();
                clearVal();


                let currencyPlaceHolder = result['restCountries']['currencies'][0]['code'];
                placeholderText.innerHTML = 'Your Currency is: ' + currencyPlaceHolder;
                document.getElementById("placeholder").value = currencyPlaceHolder;
                console.log(placeholderText.value);
              }

              function getCurrencyValue(){
                resultFrom = document.getElementById('placeholder').value;
                fromCurrecy.addEventListener('change', (event) => {
                  resultFrom = `${event.target.value}`;
                });
              }

              function updateLinks(){
                let link1Final = result['wikipedia']['geonames'][0]['wikipediaUrl'];
                link1Text.innerHTML = 'Wikipedia Link 1';
                link1Text.href = 'https://' + link1Final;

                let link2Final = result['wikipedia']['geonames'][1]['wikipediaUrl'];
                link2Text.innerHTML = 'Wikipedia Link 2';
                link2Text.href = 'https://' + link2Final;

                let link3Final = result['wikipedia']['geonames'][2]['wikipediaUrl'];
                link3Text.innerHTML = 'Wikipedia Link 3';
                link3Text.href = 'https://' + link3Final;

                let link4Final = result['wikipedia']['geonames'][3]['wikipediaUrl'];
                link4Text.innerHTML = 'Wikipedia Link 4';
                link4Text.href = 'https://' + link4Final;

                let link5Final = result['wikipedia']['geonames'][4]['wikipediaUrl'];
                link5Text.innerHTML = 'Wikipedia Link 5';
                link5Text.href = 'https://' + link5Final;
              }

              function updateWikiImage(){
                let wikiImage = result['wikipedia']['geonames'][0]['thumbnailImg'];
                document.getElementById("wikipedia-image").src= wikiImage;
              }

						},
						error: function(jqXHR, textStatus, errorThrown) {
							console.log(errorThrown);
						},
						complete:function(data){
				       $("#loader-box").hide();
				},
					});

          //change other data
          updateHeader();
          updateContinent();
          updateDate();
          updateTime();
          updateSunrise();
          updateSunset();
          updateTemp();
          updateWeatherIcon();
          updateWind();
          updateSkyConditions();
          updateHumidity();
          darkModeToggle();

					function updateHeader(){
            let countryCountry = result['openCage']['country'];
  					header.innerHTML = countryCountry;
          }

          function updateContinent(){
            let continentName = result['openCage']['continent'];
  		      continentTitle.innerHTML = continentName;
          }

          function updateDate(){
  		      let getDate = result['timeZone']['time'];
  		      let sliceDate = getDate.slice(0,10);
  					let year = getDate.slice(0,4);
  					let day = getDate.slice(5,7);
  					let month = getDate.slice(8,10);
  		      dateText.innerHTML = month + '-' + day + '-' + year;
          }

          function updateTime(){
            let getTime = result['timeZone']['time'];
  		      let sliceTime = getTime.slice(11,16);
  		      clockText.innerHTML = sliceTime;
          }

          function updateSunrise(){
            if(result['timeZone']['sunrise']){
  						let getSunRiseTime = result['timeZone']['sunrise'];
  						let newGetSunRiseTime = getSunRiseTime.slice(11,16);
  						sunRiseText.innerHTML = newGetSunRiseTime;
  					}
          }

          function updateSunset(){
            if(result['timeZone']['sunset']){
  			      let getSunSetTime = result['timeZone']['sunset'];
  			      let newGetSunSetTime = getSunSetTime.slice(11,16);
  			      sunSetText.innerHTML = newGetSunSetTime;
  					}
          }

          function updateTemp(){
            let kelvinTemp = result['openWeather']['main']['temp'];
  		      let finalTemp = Math.round(kelvinTemp - 273.15);
  		      tempText.innerHTML = finalTemp + '&#8451;';
          }

          function updateWeatherIcon(){
            var iconCode = result.openWeather.weather[0].icon;
  		      var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
  		      document.getElementById("weather-icon-image").src= iconUrl;
          }

		      function updateWind(){
            let countryWind = result['openWeather']['wind']['speed'];
  		      let finalWind = Math.round(countryWind * 2.237);
  		      windText.innerHTML = finalWind + 'mph';
          }

		      function updateSkyConditions(){
            let countrySky = result['openWeather']['weather'][0]['main'];
  		      skyText.innerHTML = countrySky;
          }

          function updateHumidity(){
            let countryHumidity = result['openWeather']['main']['humidity'];
  		      humidityText.innerHTML = countryHumidity + '%';
          }

          function darkModeToggle(){
            let realTime = result['openWeather']['dt'];
						let sunriseTime = result['openWeather']['sys']['sunrise'];
						let sunsetTime = result['openWeather']['sys']['sunset'];

						if(realTime > sunriseTime && realTime < sunsetTime){
							lightMode();
							document.getElementById('loader-box').style.backgroundColor = lightBC;
						} else {
							darkMode();
							document.getElementById('loader-box').style.backgroundColor = darkBC;
		 				}
          }

			} //if else end
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		}
	});
});

//-----------------------------------------------------------------------------------------dark mode
//dark mode variables
var darkBC = '#303134';
var darkT = '#ffffff';
var darkB = '1px solid #3E3F42';
var darkBC2 = '#202124';

//light variables
var lightBC = '#ededed';
var lightT = 'black';
var lightB = '1px solid #dedede';
var lightBC2 = '#ffffff';

function darkMode(){
	changeDivs('summary-container', darkBC, darkT, darkB);
	changeDivs('flag-container', darkBC, darkT, darkB);
	changeDivs('date-container', darkBC, darkT, darkB);
	changeDivs('time-container', darkBC, darkT, darkB);
	changeDivs('currency-container', darkBC, darkT, darkB);
	changeDivs('temperature-container', darkBC, darkT, darkB);
	changeDivs('weather-icon-container', darkBC, darkT, darkB);
	changeDivs('weather-summary-container', darkBC, darkT, darkB);
	changeDivs('wikipedia-img-container', darkBC, darkT, darkB);
	changeDivs('wikipedia-link-container', darkBC, darkT, darkB);
	changeBackground('content-container', darkBC2);
	changeText('country-name', darkT);
	changeText('amount-to-convert-text', darkT);
	changeText('countrys-currency-text', darkT);
	changeText('convert-to-text', darkT);
	changeText('converted-currency-text', darkT);
	changeText('sun-rise-sun-set-white-text', darkT);
};

function lightMode(){
	changeDivs('summary-container', lightBC, lightT, lightB);
	changeDivs('flag-container', lightBC, lightT, lightB);
	changeDivs('date-container', lightBC, lightT, lightB);
	changeDivs('time-container', lightBC, lightT, lightB);
	changeDivs('currency-container', lightBC, lightT, lightB);
	changeDivs('temperature-container', lightBC, lightT, lightB);
	changeDivs('weather-icon-container', lightBC, lightT, lightB);
	changeDivs('weather-summary-container', lightBC, lightT, lightB);
	changeDivs('wikipedia-img-container', lightBC, lightT, lightB);
	changeDivs('wikipedia-link-container', lightBC, lightT, lightB);
	changeBackground('content-container', lightBC2);
	changeText('country-name', lightT);
	changeText('amount-to-convert-text', lightT);
	changeText('countrys-currency-text', lightT);
	changeText('convert-to-text', lightT);
	changeText('converted-currency-text', lightT);
	changeText('sun-rise-sun-set-white-text', lightT);
};

// functions for toggle darkmode
function changeDivs(id, backgroundColor, text, border){
	document.getElementById(id).style.backgroundColor = backgroundColor;
	document.getElementById(id).style.color = text;
	document.getElementById(id).style.border = border;
}

function changeBackground(id, backgroundColor){
	document.getElementById(id).style.backgroundColor = backgroundColor;
}

function changeText(id, text){
	document.getElementById(id).style.color = text;
}

//--------------------------------------------------------------------------------currency change
const api = "https://api.exchangerate-api.com/v4/latest/USD";

var search = document.querySelector(".searchBox");
var convert = document.querySelector(".convert");
var fromCurrecy = document.querySelector(".from");
var toCurrecy = document.querySelector(".to");
var finalValue = document.getElementById("final-value");
var finalAmount = document.getElementById("final-amount");
var resultFrom;
var resultTo;
var searchValue;

toCurrecy.addEventListener('change', (event) => {
	resultTo = `${event.target.value}`;
});

search.addEventListener('input', updateValue);

function updateValue(e) {
	searchValue = e.target.value;
}

convert.addEventListener("click", getResults);

function getResults() {
	fetch(`${api}`)
		.then(currency => {
			return currency.json();
		}).then(displayResults);
}

function displayResults(currency) {
	let fromRate = currency.rates[resultFrom];
	let toRate = currency.rates[resultTo];
	finalValue.innerHTML = ((toRate / fromRate) * searchValue).toFixed(2);
	finalAmount.style.display = "block";

}

function clearVal() {
	document.getElementById("final-value").innerHTML = "";
};
