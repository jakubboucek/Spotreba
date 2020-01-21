<?php
	namespace App;

	$car = null;
	$keys = $storage->findKeys();
	$want_id = "9g3we";
	foreach ($keys as $key) {
		$temp_car = $storage->getByKey($key);
		if ($temp_car['carId']==$want_id) {$car=$temp_car; }
	}
?>

<?php if($car instanceOf Car): ?>
<?php elseif($car['carId'] == $want_id): ?>

<form action="" method="post" style="width: 400px; margin: auto;">

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Název auta</span></div>
		<input type="text" name="carname" class="form-control" value="<?php echo($car['carname']); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Majitel</span></div>
		<input type="text" name="owner" class="form-control" value="<?php echo($car['owner']); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Šofér</span></div>
		<input type="text" name="driver" class="form-control" value="<?php echo($car['driver']); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Stav</span></div>
		<input type="number" name="km_stav" class="form-control" value="<?php echo($car['km_stav']); ?>">
		<div class="input-group-append"><span class="input-group-text">Kilometrů</span></div>
	</div>

	<input type="hidden" name="action" value="form-change">
	<input type="submit" name="submit" value="Přidat auto" class="btn btn-primary" style="width: 100%;">
</form>

<?php endif; ?>
