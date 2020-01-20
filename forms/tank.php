
<form action="" method="post" style="width: 400px; margin: auto;">

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Název auta</span></div>
		<input type="text" name="carname" class="form-control">
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Šofér</span></div>
		<input type="text" name="driver" class="form-control">
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Cena</span></div>
		<input type="number" name="price" class="form-control">
		<div class="input-group-append"><span class="input-group-text">Kč</span></div>
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Tankováno</span></div>
		<input type="number" name="liters" class="form-control">
		<div class="input-group-append"><span class="input-group-text">Litrů</span></div>
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Stav</span></div>
		<input type="number" name="km_stav" class="form-control">
		<div class="input-group-append"><span class="input-group-text">Kilometrů</span></div>
	</div>

	<div class="input-group">
		<div class="input-group-prepend"><span class="input-group-text" style="width: 100px;">Poznámka</span></div>
		<textarea type="text" name="note" class="form-control" rows="1"></textarea>
	</div>

	<input type="hidden" name="action" value="form-tank">
	<input type="submit" name="submit" value="Natankovat" class="btn btn-primary" style="width: 100%;">
</form>
