<?php
	namespace App;
?>

<table class="table table-bordered">
	<tr><td>Název auta</td><td>Majitel</td><td>Uživatel</td><td>Stav [km]</td><td>Car ID</td></tr>

<?php
	$rows = "";
	$keys = $storage->findKeys();
	foreach ($keys as $key) {
		$car = $storage->getByKey($key);
		$rows = ""
			."<tr>"
			."<td>".$car['carname']."</td>"
			."<td>".$car['owner']."</td>"
			."<td>".$car['driver']."</td>"
			."<td>".$car['km_stav']."</td>"
			.'<td><a href="'.'/change/'.$car['carId'].'">'.$car['carId']."</td>"
			."</tr>"
			.$rows;
	}
	echo $rows;
?>

</table>
