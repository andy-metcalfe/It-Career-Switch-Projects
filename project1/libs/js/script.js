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

//icons
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

var myStyle = {
	 "color": 'red',
	 "weight": 3,
	 "opacity": 0.65
};

//set view of map
var map = L.map('map').setView([15, 25], 2);

//tile overlay
var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 12,
  minZoom: 2
}).addTo(map);

map.locate({setView: false});

map.on('locationfound', onLocationFound);

function onLocationFound(e) {
    var radius = e.accuracy;
    radius = radius.toFixed(0);

    L.marker(e.latlng, {icon: homeIcon}).addTo(map);
		console.log(e.latlng);
        //.bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);

		let lat = e.latlng.lat;
		let lng = e.latlng.lng;

		initalBorder(lat, lng);
}

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

				//make drop down list
        var names = result['data']['names'];
        var is02 = result['data']['is02'];

        for (let i = 0; i < names.length; i++) {
          var x = document.getElementById("country-dd");
          var option = document.createElement("option");
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

//------------------------------------------------------------------------------select input drop down
let selectCountry = document.querySelector(".form-select");

selectCountry.addEventListener('change', (event) => {
  resultCountry = `${event.target.value}`;
		getAll();
});

function getAll(){

  $.ajax({
      url: "libs/php/getLongAndLat.php",
      type: 'POST',
      dataType: 'json',
      data: {
        country: resultCountry
      },
      success: function(result) {
				console.log('getLongLat')
        console.dir(result);

        let countryLatitude = result['longLat']['latlng'][0];
        let countryLongitude = result['longLat']['latlng'][1];
        let countryCodes = result['longLat']['alpha2Code'];
        let countryNames = result['longLat']['name'];
        let currencyCode = result['longLat']['currencies'][0]['code'];
        console.log(countryCodes);
        console.log(countryNames);

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

				    //overview
						let countryCountry = result['openCage']['country'];
						let continentName = result['openCage']['continent'];
						let getDate = result['timeZone']['time'];
						let getSunRiseTime = result['timeZone']['sunrise'];
						let newGetSunRiseTime = getSunRiseTime.slice(11,16);
            let getTime = result['timeZone']['time'];
			      let sliceTime = getTime.slice(11,16);
            let countryHour = sliceTime.slice(0,2);
            let countryMin = sliceTime.slice(3,6);
            let countryYear = getTime.slice(0,4);
            let countryMonth = getTime.slice(5,7);
            let countryDay = getTime.slice(8,10);
            let capitalName = result['restCountries']['capital'];
            let populationName = result['restCountries']['population'];
            let languageName = result['restCountries']['languages'][0]['name'];
            let flagLink = result['restCountries']['flags']['png'];
            let currencyOverview = result['restCountries']['currencies'][0]['name'];
            let independentOverview = result['restCountries']['independent'];

            reformatDate(getDate);

            if(result['timeZone']['sunset']){
			         let getSunSetTime = result['timeZone']['sunset'];
			         let newGetSunSetTime = getSunSetTime.slice(11,16);
			        document.getElementById('sun-set-text').innerHTML = newGetSunSetTime;
			      }

            if(independentOverview == true){
              independentOverview = 'Independent';
            } else {
              independentOverview = 'Not Independent';
            }

            //add commas
            let numb = populationName;
            function separator(numb) {
              var str = numb.toString().split(".");
              str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              return str.join(".");
            }
            let finalPopulation = separator(populationName);

            document.getElementById("clock-container").innerHTML = sliceTime;
						document.getElementById('country').innerHTML = countryCountry;
						document.getElementById('continent-title').innerHTML = continentName
						document.getElementById('date-text').innerHTML = fullDateString;
						document.getElementById('sun-rise-text').innerHTML = newGetSunRiseTime;
            document.getElementById('population-title').innerHTML = finalPopulation;
            document.getElementById('capital-title').innerHTML = capitalName;
            document.getElementById('population').innerHTML = finalPopulation;
            document.getElementById('language-title').innerHTML = languageName;
            document.getElementById("flag-image").src= flagLink;
            document.getElementById('independent-title').innerHTML = independentOverview;
            document.getElementById('currency-title').innerHTML = currencyOverview;
            document.getElementById('currency-header').innerHTML = currencyOverview;

            //clock
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

                document.getElementById("clock-container").innerHTML = currentTime;
            }

						//weather
						let iconCode = result['openWeather']['current']['weather'][0]['icon'];
			      let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
						let kelvinTemp = result['openWeather']['current']['temp'];
			      let finalTemp = Math.round(kelvinTemp - 273.15);
						let countryWind = result['openWeather']['current']['wind_speed'];
						let countrySky = result['openWeather']['current']['weather'][0]['description'];
						let countryHumidity = result['openWeather']['current']['humidity'];

						document.getElementById('location-text').innerHTML = countryCountry;
			      document.getElementById('temp-text').innerHTML = finalTemp + '&#186;';
						document.getElementById("weather-icon-image").src= iconUrl;
 						document.getElementById("wind-title").innerHTML = countryWind + ' mph';
						document.getElementById("sky-conditions-title").innerHTML = countrySky;
						document.getElementById("humidity-title").innerHTML = countryHumidity + '%';

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


            //points of interest
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
              });
              marker.bindPopup(title);
              markers.addLayer(marker);
            }

          	map.addLayer(markers);

            //currency form
            document.getElementById("currency-form").reset();
            clearVal();

            let currencyPlaceHolder = result['restCountries']['currencies'][0]['code'];
            placeholderText.innerHTML = 'Your Currency is: ' + currencyPlaceHolder;

            document.getElementById("placeholder").value = currencyPlaceHolder;

            //images
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

            //news
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

            //covid
            let covidConfirmed = result['covid']['confirmed'];
            let covidCritical = result['covid']['critical'];
            let covidDeaths = result['covid']['deaths'];
            let covidRecovered = result['covid']['recovered'];
            let covidCPM = result['covid']['calculated']['cases_per_million_population'];
            let covidDeathRate = result['covid']['calculated']['death_rate'];
            let covidRecoveryRate = result['covid']['calculated']['recovery_rate'];

            function separator(variable) {
              var str = variable.toString().split(".");
              str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              return str.join(".");
            }

            document.getElementById('covid-confirmed').innerHTML = separator(covidConfirmed);
            document.getElementById('covid-critical').innerHTML = separator(covidCritical);
            document.getElementById('covid-deaths').innerHTML = separator(covidDeaths);
            document.getElementById('covid-recovered').innerHTML = separator(covidRecovered);
            document.getElementById('covid-cpm').innerHTML = separator(covidCPM);
            document.getElementById('covid-death-rate').innerHTML = covidDeathRate.toFixed(3);
            document.getElementById('covid-recovery-rate').innerHTML = covidRecoveryRate.toFixed(3);

            //national holidays
            const emptyNationalHolidays = document.getElementById("national-holiday-table");
            emptyNationalHolidays.innerHTML = '';

            let nationalHolidaysAll = result['nationalHolidays']['holidays'];

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

            //wikipedia
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

            //wikipedia markers
            if(wikiMarkers != undefined){
            map.removeLayer(wikiMarkers);
            }

            let wikipediaAllMarkers = result['wikipedia']['geonames'];
            wikiMarkers = L.markerClusterGroup();

            for (var i = 0; i < wikipediaAllMarkers.length; i++) {
              let wikiLat = wikipediaAllMarkers[i]['lat'];
              let wikiLng = wikipediaAllMarkers[i]['lng'];
              let wikiName = wikipediaAllMarkers[i]['title'];
              let wTitle = wikiName;

              wikiMarker = L.marker(new L.LatLng(wikiLat, wikiLng), {icon: wikipediaPins}, {
                title: wTitle
              });

              wikiMarker.bindPopup(wTitle);
              wikiMarkers.addLayer(wikiMarker);
            }
            map.addLayer(wikiMarkers);

            //currency
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

    								//border around country
    								//remove and existing borders or markers
    								 d = {
    									 lat: countryLatitude,
    									 lng: countryLongitude
    								 };

                     let group;

    								 let borderLines = result['data']['border'];

    	                if(countryMarker != undefined){
                       map.removeLayer(countryMarker);
     	 								}

                      if(border != undefined){
                       map.removeLayer(border);
     	 								}

    								 countryMarker = L.marker(d,{icon: countryClick});
    								 countryMarker.addTo(map).bindPopup(countryCountry).openPopup();

    								 border = L.geoJSON(borderLines,{style: myStyle}).addTo(map);

                     group = L.featureGroup([border,countryMarker]).addTo(map);
                     map.fitBounds(border.getBounds());

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

//make inital border around users country
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

			iso3CountryCode = result.openCage['ISO_3166-1_alpha-3'];

		 $.ajax({
				 url: "libs/php/getCountryBorder.php",
				 type: 'POST',
				 dataType: 'json',
				 data: {
					 code: iso3CountryCode
				 },
				 success: function(result) {
					 border = L.geoJSON(result['data']['border'],{style: myStyle}).addTo(map);
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

//
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
