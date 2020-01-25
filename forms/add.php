<?php
	namespace App;
?>
<?php if(isset($addArray) && isset($google) && $google->type=="success"): ?>

	<div style="width: 400px; margin: auto;">
		<table class="table table-bordered">
			<tr><td>Název auta</td><td><?php echo Escape::html(Helpers::getFormValue('carname')); ?></td>
			<tr><td>Odkud</td><td><?php echo Escape::html(Helpers::getFormValue('odkud')); ?></td>
			<tr><td>Přes</td><td><?php echo Escape::html(Helpers::getFormValue('pres')); ?></td>
			<tr><td>Kam</td><td><?php echo Escape::html(Helpers::getFormValue('kam')); ?></td>
			<tr><td>Šofér</td><td><?php echo Escape::html(Helpers::getFormValue('driver')); ?></td>
			<tr><td>Ujeto</td><td><?php echo Escape::html(Helpers::getFormValue('km-ujeto')); ?></td>
			<tr><td>Stav</td><td><?php echo Escape::html(Helpers::getFormValue('km_stav')); ?></td>
			<tr><td>Poznámka</td><td><?php echo Escape::html(Helpers::getFormValue('note')); ?></td>
			<tr><td>Typ</td><td><?php echo Escape::html(Helpers::getFormValue('type')); ?></td>
		</table>
	</div>

<?php else: ?>

<form action="" method="post" style="width: 400px; margin: auto;">

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Název auta</span></div>
		<input type="text" name="carname" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('carname')); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Odkud</span></div>
		<input type="text" name="odkud" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('odkud')); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Přes</span></div>
		<input type="text" name="pres" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('pres')); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Kam</span></div>
		<input type="text" name="kam" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('kam')); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Šofér</span></div>
		<input type="text" name="driver" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('driver')); ?>">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Ujeto</span></div>
		<input type="text" name="km-ujeto" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('km-ujeto')); ?>">
		<div class="input-group-append"><span class="input-group-text">Kilometrů</span></div>
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Stav</span></div>
		<input type="number" name="km_stav" class="form-control" value="<?php echo Escape::html(Helpers::getFormValue('km_stav')); ?>">
		<div class="input-group-append"><span class="input-group-text">Kilometrů</span></div>
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Poznámka</span></div>
		<textarea type="text" name="note" class="form-control" rows="1"><?php echo Escape::html(Helpers::getFormValue('note')); ?></textarea>
	</div>

	<div class="input-group">
		<div class="btn-group" data-toggle="buttons" style="width: 100%;">
			<span class="input-group-prepend" style="width: 30%"><span class="input-group-text" style="width: 100%;">Typ</span></span>
			<select name="type" class="custom-select" value="<?php echo(Helpers::getFormValue('type')); ?>">
				<option value="Služební" <?php if(Helpers::getFormValue('type')=="Služební"){echo("selected");} ?>>Služební</option>
				<option value="Osobní" <?php if(Helpers::getFormValue('type')=="Osobní"){echo("selected");} ?>>Osobní</option>
			</select>
		</div>
	</div>

	<input type="hidden" name="action" value="form-add">
	<input type="submit" name="submit" value="Zaznamenat" class="btn btn-primary" style="width: 100%;">
</form>

<?php endif; ?>
