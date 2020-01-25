<?php

namespace App;

$data = $uploader->showData();
$carnames = $data->carnames;
$drivers = $data->drivers;
$cities = $data->cities;

?>


<datalist id="known_carnames">
	<?php foreach ($carnames as $key) {
		echo '<option value="' . $key . '"></option>';
	} ?>
</datalist>

<datalist id="known_drivers">
	<?php foreach ($drivers as $key) {
		echo '<option value="' . $key[0] . '"></option>';
	} ?>
</datalist>

<datalist id="known_cities">
	<?php foreach ($cities as $key) {
		echo '<option value="' . $key[0] . '"></option>';
	} ?>
</datalist>
