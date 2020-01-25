<?php
	namespace App;
?>
<?php if(isset($tankArray) && isset($google) && $google->type=="success"): ?>

	<div style="width: 400px; margin: auto;">
		<table class="table table-bordered">
			<tr><td>Název</td><td><?php echo Escape::html(Helpers::getFormValue('carname')); ?></td>
			<tr><td>Šofér</td><td><?php echo Escape::html(Helpers::getFormValue('driver')); ?></td>
			<tr><td>Cena</td><td><?php echo Escape::html(Helpers::getFormValue('price')); ?></td>
			<tr><td>Tankováno</td><td><?php echo Escape::html(Helpers::getFormValue('liters')); ?></td>
			<tr><td>Stav</td><td><?php echo Escape::html(Helpers::getFormValue('km_stav')); ?></td>
			<tr><td>Poznámka</td><td><?php echo Escape::html(Helpers::getFormValue('note')); ?></td>
		</table>
	</div>

<?php else: ?>

	<form action="" method="post" style="width: 400px; margin: auto;">

		<div class="input-group">
			<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Název auta</span></div>
			<input type="text" name="carname" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('carname')); ?>">
		</div>

		<div class="input-group">
			<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Šofér</span></div>
			<input type="text" name="driver" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('driver')); ?>">
		</div>

		<div class="input-group">
			<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Cena</span></div>
			<input type="number" name="price" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('price')); ?>">
			<div class="input-group-append"><span class="input-group-text">Kč</span></div>
		</div>

		<div class="input-group">
			<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Tankováno</span></div>
			<input type="number" name="liters" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('liters')); ?>">
			<div class="input-group-append"><span class="input-group-text">Litrů</span></div>
		</div>

		<div class="input-group">
			<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Stav</span></div>
			<input type="number" name="km_stav" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('km_stav')); ?>">
			<div class="input-group-append"><span class="input-group-text">Kilometrů</span></div>
		</div>

		<div class="input-group">
			<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Poznámka</span></div>
			<textarea type="text" name="note" class="form-control" rows="1"><?php echo Escape::html(Helpers::getFormValue('note')); ?></textarea>
		</div>

		<input type="hidden" name="action" value="form-tank">
		<input type="submit" name="submit" value="Natankovat" class="btn btn-primary" style="width: 100%;">
	</form>

<?php endif; ?>
