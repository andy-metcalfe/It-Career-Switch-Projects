<?php
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='http://api.geonames.org/weatherJSON?north=' . $_REQUEST['north'] . '&south=' . $_REQUEST['south'] . '&east=' . $_REQUEST['east'] . '&west=' . $_REQUEST['west'] . '&username=andy8980';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

// im telling it to get the first section no matter what so itll always get the status check VVVV the [0] below

	//$output['data'] = $decode['weatherObservations'][0];

	if (empty($decode['weatherObservations'])) {
    $output['data'] = $decode;
}	else {
		$output['data'] = $decode['weatherObservations'][0];
}

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
?>
