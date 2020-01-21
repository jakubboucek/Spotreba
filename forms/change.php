<?php
	namespace App;

	$car = null;
	$keys = $storage->findKeys();
	$want_id = preg_replace('/.*?change\//i', "", $requestPath);
	foreach ($keys as $key) {
		$temp_car = $storage->getByKey($key);
		if ($temp_car['carId']==$want_id) {$car=$temp_car; }
	}
?>

<?php if($car instanceOf Car): ?>
<?php elseif($car['carId'] == $want_id): ?>

	<?php if(!isset($carWasChanged) || !$carWasChanged): ?>

		<form action="" method="post" style="width: 400px; margin: auto;">

			<div class="input-group">
				<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Název auta</span></div>
				<input type="text" name="carname" class="form-control" value="<?php echo( $error ? Helpers::getFormValue('carname') : $car['carname']); ?>">
			</div>

			<div class="input-group">
				<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Majitel</span></div>
				<input type="text" name="owner" class="form-control" value="<?php echo( $error ? Helpers::getFormValue('owner') : $car['owner']); ?>">
			</div>

			<div class="input-group">
				<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Šofér</span></div>
				<input type="text" name="driver" class="form-control" value="<?php echo( $error ? Helpers::getFormValue('driver') : $car['driver']); ?>">
			</div>

			<div class="input-group">
				<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Stav</span></div>
				<input type="number" name="km_stav" class="form-control" value="<?php echo( $error ? Helpers::getFormValue('km_stav') : $car['km_stav']); ?>">
				<div class="input-group-append"><span class="input-group-text">Kilometrů</span></div>
			</div>

			<input type="hidden" name="action" value="form-change">
			<input type="hidden" name="carId" value="<?php echo(Escape::html($temp_car['carId'])); ?>">
			<input type="submit" name="submit" value="Upravit auto" class="btn btn-warning" style="width: 100%;">
		</form>
	<?php else: ?>
		<div style="width: 400px; margin: auto;">
			<table class="table table-bordered">
				<tr><td>Název auta</td><td><?php echo Escape::html($data['carname']); ?></td>
				<tr><td>Majitel</td><td><?php echo Escape::html($data['owner']); ?></td>
				<tr><td>Šofér</td><td><?php echo Escape::html($data['driver']); ?></td>
				<tr><td>Stav [km]</td><td><?php echo Escape::html($data['km_stav']); ?></td>
				<tr><td>ID auta</td><td><?php echo Escape::html($data['carId']); ?></td>
			</table>
			<div class="btn-group" style="width: 400px; margin: auto;">
				<a href="<?php echo('/change/'.$data['carId']); ?>" class="btn btn-primary">Upravit znovu</a>
				<a href="/show" class="btn btn-success">Zobrazit seznam aut</a>
			</div>
		</div>
	<?php endif; ?>

<?php else: ?>
	<h1 style="text-align: center;">Tohle auto nebylo nalezeno</h1>
<?php endif; ?>
