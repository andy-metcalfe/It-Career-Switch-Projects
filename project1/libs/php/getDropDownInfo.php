<?php

  $executionStartTime = microtime(true) / 1000;

  $result = file_get_contents('countryBorders.geo.json');

  $border = json_decode($result,true);
  $countryInfo = json_decode($result,true);

  $countries = $border['features'];

  $i = 0;
  $length = count($countries);

  while($i < $length){
    $name = $countries[$i]['properties']['name'];
    $is02 = $countries[$i]['properties']['iso_a2'];

    $output['data']['is02'][$i] = $is02;
    $output['data']['names'][$i] = $name;

    $i++;
  }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>
