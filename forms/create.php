<?php
	namespace App;
?>

<?php if($car instanceof Car): ?>

<div style="width: 400px; margin: auto;">
	<table class="table table-bordered">
		<?php $data = $car->toArray(); ?>
		<tr><td>Název auta</td><td><?php echo Escape::html($data['carname']); ?></td>
		<tr><td>Majitel</td><td><?php echo Escape::html($data['owner']); ?></td>
		<tr><td>Šofér</td><td><?php echo Escape::html($data['driver']); ?></td>
		<tr><td>Stav [km]</td><td><?php echo Escape::html($data['km_stav']); ?></td>
		<tr><td>ID auta</td><td><?php echo Escape::html($data['carId']); ?></td>
	</table>
</div>


<?php else: ?>

<form action="" method="post" style="width: 400px; margin: auto;">

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Název auta</span></div>
		<input type="text" name="carname" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('carname')); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Majitel</span></div>
		<input type="text" name="owner" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('owner')); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Šofér</span></div>
		<input type="text" name="driver" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('driver')); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Stav</span></div>
		<input type="number" name="km_stav" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('km_stav')); ?>">
		<div class="input-group-append"><span class="input-group-text">Kilometrů</span></div>
	</div>

	<input type="hidden" name="action" value="form-create">
	<input type="submit" name="submit" value="Přidat auto" class="btn btn-primary" style="width: 100%;">
</form>

<?php endif; ?>
