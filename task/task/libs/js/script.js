//get ids
let oceanButton = document.getElementById('oceanBtn');
let timeZoneButton = document.getElementById('timeZoneBtn');
let weatherButton = document.getElementById('weatherBtn');
let list1 = document.getElementById('list1');
let list2 = document.getElementById('list2');
let list3 = document.getElementById('list3');
let list4 = document.getElementById('list4');
let resultText = document.getElementById('result');


//ocean script
oceanButton.onclick = function(){
  //console.dir($('#latitude').val());
  //console.dir($('#longitude').val());

  $.ajax({
    url: "libs/php/task.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: $('#latitude').val(),
      lng: $('#longitude').val()
    },
    success: function(result) {

      console.log(JSON.stringify(result));
      //console.dir(result);
      //console.dir(result['data'][0]);

      if (result.status.name == "ok") {
        hideList();
        let oceanName = result['data']['name'];
        let resultText = document.getElementById('result');
        resultText.innerHTML = oceanName;
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });
};

//Time zone script
timeZoneButton.onclick = function(){
  //console.dir($('#latitudeTimeZone').val());
  //console.dir($('#longitudeTimeZone').val());

  $.ajax({
    url: "libs/php/task2.php",
    type: 'POST',
    dataType: 'json',
    data: {
      lat: $('#latitudeTimeZone').val(),
      lng: $('#longitudeTimeZone').val()
    },
    success: function(result) {

      console.log(JSON.stringify(result));
      //console.dir(result);

      if (result.status.name == "ok") {
        let countryName = result['data']['countryName'];
        let timezoneId = result['data']['timezoneId'];
        let time = result['data']['time'];

        if(Object.keys(result['data']).length == 5) {

          hideList();
          resultText.innerHTML = "The latitude and longitude do not lie on land.";

        } else {

          showList();

          let getDate = result['data']['time'];
          let sliceDate = getDate.slice(0,10);
          let getTime = result['data']['time'];
          let sliceTime = getTime.slice(11,16);

          list1.innerHTML = "Country Name : " + countryName;
          list2.innerHTML = "Time Zone : " + timezoneId;
          list3.innerHTML = "Date : " + sliceDate;
          list4.innerHTML = "Time : " + sliceTime;
        };
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });
};

//Weather script
weatherBtn.onclick = function(){
  //console.dir($('#north').val());
  //console.dir($('#south').val());
  //console.dir($('#east').val());
  //console.dir($('#west').val());

  $.ajax({
    url: "libs/php/task3.php",
    type: 'POST',
    dataType: 'json',
    data: {
      north: $('#north').val(),
      south: $('#south').val(),
      east: $('#east').val(),
      west: $('#west').val()
    },
    success: function(result) {

      console.log(JSON.stringify(result));
      console.dir(result);

      if (result.status.name == "ok") {

        let stationName = result['data']['stationName'];
        let datetime = result['data']['datetime'];
        let weatherCondition = result['data']['weatherCondition'];
        let temperature = result['data']['temperature'];
        let humidity = result['data']['humidity'];
        let clouds = result['data']['clouds'];
        let windSpeed = result['data']['windSpeed'];

        if(result['data']['weatherObservations']){
          hideList();
          resultText.innerHTML = "Weather conditons are unavailable";
        } else {
            showList();
            list1.innerHTML = "Station: " + stationName;
            list2.innerHTML = "Date and Time: " + datetime;
            list3.innerHTML = "Weather Condition: " + weatherCondition;
            list4.innerHTML = "Temperature: " + temperature;
            list5.innerHTML = "Humidity: " + humidity;
            list6.innerHTML = "Cloud Coverage: " + clouds;
            list7.innerHTML = "Wind Speed: " + windSpeed;
        };



      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    }
  });
};

function showList(){
  document.getElementById("result").style.display = "none";
  document.getElementById("list1").style.display = "block";
  document.getElementById("list2").style.display = "block";
  document.getElementById("list3").style.display = "block";
  document.getElementById("list4").style.display = "block";
  document.getElementById("list5").style.display = "block";
  document.getElementById("list6").style.display = "block";
  document.getElementById("list7").style.display = "block";
}

function hideList(){
  document.getElementById("result").style.display = "inline";
  document.getElementById("list1").style.display = "none";
  document.getElementById("list2").style.display = "none";
  document.getElementById("list3").style.display = "none";
  document.getElementById("list4").style.display = "none";
  document.getElementById("list5").style.display = "none";
  document.getElementById("list6").style.display = "none";
  document.getElementById("list7").style.display = "none";
}
