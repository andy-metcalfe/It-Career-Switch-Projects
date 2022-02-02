<?php

$url1='https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['lat'] . ',' . $_REQUEST['lng'] . '&pretty=1&key=677e9be1b3f2466a92e02e82caac371b';

$url2='http://api.geonames.org/timezoneJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=andy8980';

$url3='https://api.openweathermap.org/data/2.5/onecall?lat='. $_REQUEST['lat'] . '&lon=' . $_REQUEST['lng'] . '&exclude=minutely,hourly,alerts&appid=8ba959d2821ecdf0a2103458d80f8c44';


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
}

  return $return;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";

$output['openCage'] = runAPI($url1, 'openCage');
$output['timeZone'] = runAPI($url2, 'timeZone');
$output['openWeather'] = runAPI($url3, 'openWeather');

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
