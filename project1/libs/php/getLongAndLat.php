<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$url='https://maps.googleapis.com/maps/api/geocode/json?address='. $_REQUEST['country'] .'&key=AIzaSyD-vI3kSQynFymweNZlbnLua8C_mjis21k';
$url1 = preg_replace('/\s+/', '%20', $url);

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url1);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$output['longLat'] = $decode['results'][0]['geometry']['location'];
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";



header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);




?>
