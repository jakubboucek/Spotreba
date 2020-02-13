<?php
	namespace App;
	$data = $uploader->showData();
?>

<datalist id="known_carnames">
	<?php foreach ($data->carnames as $key) {
		echo '<option value="' . $key . '"></option>';
	} ?>
</datalist>

<datalist id="known_drivers">
	<?php foreach ($data->drivers as $key) {
		echo '<option value="' . $key[0] . '"></option>';
	} ?>
</datalist>

<datalist id="known_cities">
	<?php foreach ($data->cities as $key) {
		echo '<option value="' . $key[0] . '"></option>';
	} ?>
</datalist>
