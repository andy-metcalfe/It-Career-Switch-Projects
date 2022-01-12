<?php


//$url4='http://api.geonames.org/wikipediaSearchJSON?q=ml&maxRows=5&username=andy8980';

$url4='http://api.geonames.org/wikipediaSearchJSON?q=' . $_REQUEST['countryName'] . '&username=andy8980';
$Newurl4 = preg_replace('/\s+/', '%20', $url4);
// may need to replace " " with %

//-----------------------------------------------Rest Countries
//$url5 = 'https://restcountries.com/v2/alpha/gb';
$url5='https://restcountries.com/v2/alpha/'. $_REQUEST['countryCode'];



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

}

  return $return;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";

$output['wikipedia'] = runAPI($Newurl4, 'wikipedia');
$output['restCountries'] = runAPI($url5, 'restCountries');

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
