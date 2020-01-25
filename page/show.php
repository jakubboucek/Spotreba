<?php
	namespace App;

	$keys = $storage->findKeys();
?>

<?php if($keys): ?>
	<table class="table table-bordered">
		<tr><td>Název auta</td><td>Majitel</td><td>Uživatel</td><td>Stav [km]</td><td>Car ID</td></tr>
	<?php
		$rows = "";
		foreach ($keys as $key) {
			$car = $storage->getByKey($key);
			$rows = ""
				."<tr>"
				."<td>".$car['carname']."</td>"
				."<td>".$car['owner']."</td>"
				."<td>".$car['driver']."</td>"
				."<td>".$car['km_stav']."</td>"
				."</tr>"
				.$rows;
		}
		echo $rows;
	?>
	</table>
<?php else: ?>
	<h1 style="text-align: center;">Žádné auto nebylo nalezeno</h1>
<?php endif; ?>
