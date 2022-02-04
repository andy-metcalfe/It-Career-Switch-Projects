<?php

$url1='https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['lat'] . ',' . $_REQUEST['lng'] . '&pretty=1&key=677e9be1b3f2466a92e02e82caac371b';



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
}

  return $return;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";

$output['openCage'] = runAPI($url1, 'openCage');

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>
