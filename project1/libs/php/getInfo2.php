<?php

$countryCode = $_REQUEST['countryCode'];
$countryName = $_REQUEST['countryName'];

$url1='http://api.geonames.org/wikipediaSearchJSON?q=' . $countryName . '&country=' . $countryCode . '&maxRows=10&username=andy8980';
$url1 = preg_replace('/\s+/', '%20', $url1);

$url2='https://restcountries.com/v2/alpha/'. $_REQUEST['countryCode'];

$url3='https://newsdata.io/api/1/news?apikey=pub_3562b243c2a2bd88e77fbb4107711296c724&&language=en&q=' . $_REQUEST['countryName'];
$url3 = preg_replace('/\s+/', '%20', $url3);

$code = $_REQUEST['ios2Code'];
if($code == 'GB'){
  $code = 'UK';
}
$code = strtolower($code);
$url4='https://www.triposo.com/api/20220104/poi.json?fields=name,coordinates&count=10&countrycode=' . $code . '&account=UKCO6QP6&token=9oox3g4hjao59jyuav5zg34za7wfvdkz';

$is02Code = $_REQUEST['ios2Code'];
$is02Code = strtolower($is02Code);
$url5='https://corona-api.com/countries/' . $is02Code;

$url6 = 'https://calendarific.com/api/v2/holidays?&api_key=424d9d1296bba07acb85b71bf08358c045c1938a&country=' . $_REQUEST['ios2Code'] . '&year=2022&type=national';

$url7 = 'https://pixabay.com/api/?key=25514484-f79c4311eb632191deba1b7ca&q=' . $_REQUEST['countryName'] . '&image_type=photo&page=1&per_page=10&orientation=horizontal&category=travel';
$url7 = preg_replace('/\s+/', '%20', $url7);



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
}

  return $return;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";

$output['wikipedia'] = runAPI($url1, 'wikipedia');
$output['restCountries'] = runAPI($url2, 'restCountries');
$output['news'] = runAPI($url3, 'news');
$output['pointsOfInterest'] = runAPI($url4, 'pointsOfInterest');
$output['covid'] = runAPI($url5, 'covid');
$output['nationalHolidays'] = runAPI($url6, 'nationalHolidays');
$output['images'] = runAPI($url7, 'images');

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
