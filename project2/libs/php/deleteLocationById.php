<?php


	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {

		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}

	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$data = [];

	$locationId = $_REQUEST['locationId'];

	$count = "SELECT COUNT(name) as departments FROM department d WHERE d.locationID = $locationId";

	$pushdata = $conn->query($count);

	while ($row = mysqli_fetch_assoc($pushdata)) {

		array_push($data, $row);

	}

	$length = $data[0]['departments'];


	if($length > 0) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "cannot-delete";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;
	}


	$query = $conn->prepare('DELETE FROM location WHERE id = ?');

	$query->bind_param("i", $locationId);

	$query->execute();

	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

?>
