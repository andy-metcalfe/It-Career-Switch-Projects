<?php

//get country name
$countryNameCode = $_REQUEST['countryName'];
//only country with strange country output
if($countryNameCode == 'United Kingdom of Great Britain and Northern Ireland'){
  $countryNameCode = 'United Kingdom';
}
//api for opencage -- general
$url10='https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['lat'] . ',' . $_REQUEST['lng'] . '&pretty=1&key=677e9be1b3f2466a92e02e82caac371b';
//api for timezone
$url20='http://api.geonames.org/timezoneJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=andy8980';
//api for weather
$url30='https://api.openweathermap.org/data/2.5/onecall?lat='. $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&exclude=minutely,hourly,alerts&appid=8ba959d2821ecdf0a2103458d80f8c44';

//
$countryCode = $_REQUEST['countryCode'];
$countryName = $_REQUEST['countryName'];

//api for wikipedia and replace and gaps with % to complete api
$url1='http://api.geonames.org/wikipediaSearchJSON?q=' . $countryName . '&country=' . $countryCode . '&maxRows=10&username=andy8980';
$url1 = preg_replace('/\s+/', '%20', $url1);

//api for rest countries
$url2='https://restcountries.com/v2/alpha/'. $_REQUEST['countryCode'];

//api for news and replace and gaps with % to complete api
$url3='https://newsdata.io/api/1/news?apikey=pub_3562b243c2a2bd88e77fbb4107711296c724&&language=en&q=' . $countryNameCode;
$url3 = preg_replace('/\s+/', '%20', $url3);

//returns wrong is02
$code = $_REQUEST['countryCode'];
if($code == 'GB'){
  $code = 'UK';
}
//api for points of interest and needs to be lowercase
$code = strtolower($code);
$url4='https://www.triposo.com/api/20220104/poi.json?fields=name,coordinates&count=10&countrycode=' . $code . '&account=UKCO6QP6&token=9oox3g4hjao59jyuav5zg34za7wfvdkz';

//api for corona and needs to be lowercase
$is02Code = $_REQUEST['countryCode'];
$is02Code = strtolower($is02Code);
$url5='https://corona-api.com/countries/' . $is02Code;

//api for national holidays
$url6 = 'https://calendarific.com/api/v2/holidays?&api_key=ffc8fd0f912fcfd27043581a71d027ab5ab3c51a&country=' . $_REQUEST['countryCode'] . '&year=2022&type=national';

//api for images and replace spaces with %
$url7 = 'https://pixabay.com/api/?key=25514484-f79c4311eb632191deba1b7ca&q=' . $countryNameCode . '&image_type=photo&page=1&per_page=10&orientation=horizontal&category=travel';
$url7 = preg_replace('/\s+/', '%20', $url7);

//api for exchange rate
$url8='https://api.exchangerate-api.com/v4/latest/' . $_REQUEST['currencyCode'];

//api for bounding box to put into earthquake api call
$url9='http://api.geonames.org/countryInfoJSON?lang=it&country=' . $_REQUEST['countryCode'] . '&username=andy8980';


function runAPI($url, $apiType) {

  ini_set('display_errors', 'On');
  error_reporting(E_ALL);
  $executionStartTime = microtime(true);

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL,$url);

  $result=curl_exec($ch);

  curl_close($ch);

  $decode = json_decode($result,true);

//switch statement to set api data
switch ($apiType) {
    case $apiType == 'openCage':
        $return = $decode['results'][0]['components'];
        break;
    case $apiType == 'timeZone':
        $return = $decode;
        break;
    case $apiType == 'openWeather':
        $return = $decode;
        break;
    case $apiType == 'wikipedia':
        $return = $decode;
        break;
    case $apiType == 'restCountries':
        $return = $decode;
        break;
    case $apiType == 'news':
        $return = $decode;
        break;
    case $apiType == 'pointsOfInterest':
        $return = $decode;
        break;
    case $apiType == 'covid':
        $return = $decode['data']['latest_data'];
        break;
    case $apiType == 'nationalHolidays':
         $return = $decode['response'];
          break;
    case $apiType == 'images':
          $return = $decode['hits'];
          break;
    case $apiType == 'currency':
          $return = $decode;
          break;
    case $apiType == 'northEastSouthWest':
          $return = $decode['geonames'][0];
          break;
}

  return $return;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";

// run function to gather info for each api
$output['openCage'] = runAPI($url10, 'openCage');
$output['timeZone'] = runAPI($url20, 'timeZone');
$output['openWeather'] = runAPI($url30, 'openWeather');
$output['wikipedia'] = runAPI($url1, 'wikipedia');
$output['restCountries'] = runAPI($url2, 'restCountries');
$output['news'] = runAPI($url3, 'news');
$output['pointsOfInterest'] = runAPI($url4, 'pointsOfInterest');
$output['covid'] = runAPI($url5, 'covid');
$output['nationalHolidays'] = runAPI($url6, 'nationalHolidays');
$output['images'] = runAPI($url7, 'images');
$output['currency'] = runAPI($url8, 'currency');
$output['northEastSouthWest'] = runAPI($url9, 'northEastSouthWest');

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
