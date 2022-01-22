<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$code = $_REQUEST['ios2Code'];

if($code == 'GB'){
  $code = 'UK';
}

$code = strtolower($code);

$url='https://www.triposo.com/api/20220104/poi.json?fields=name,coordinates&count=10&countrycode=' . $code . '&account=UKCO6QP6&token=9oox3g4hjao59jyuav5zg34za7wfvdkz';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output['pointsOfInterest'] = $decode;
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";



header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);




?>
