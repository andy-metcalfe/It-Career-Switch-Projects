<?php

    $executionStartTime = microtime(true) / 1000;

    $result = file_get_contents('countryBorders.geo.json');

    $border = json_decode($result,true);
    $countryInfo = json_decode($result,true);



    //echo json_encode($border);

  $code = $_REQUEST['code'];

  $countries = $border['features'];
  $i = 0;
  $length = count($countries);

  while($i < $length){
    $iso3Code = $countries[$i]['properties']['iso_a3'];
    if($iso3Code == $code){
      $output['data']['border'] = $countries[$i]['geometry'];
      $i++;
    } else {
      $i++;
    }
  }


    // $output['data']['border'] = $border;
    //  $output['data']['countryInfo'] = $countryInfo;


    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";



    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>
