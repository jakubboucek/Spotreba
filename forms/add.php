
<form action="" method="post" style="width: 400px; margin: auto;">

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Název auta</span></div>
		<input type="text" name="carname" class="form-control">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Odkud</span></div>
		<input type="text" name="odkud" class="form-control">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Přes</span></div>
		<input type="text" name="pres" class="form-control">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Kam</span></div>
		<input type="text" name="kam" class="form-control">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Šofér</span></div>
		<input type="text" name="driver" class="form-control">
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Ujeto</span></div>
		<input type="text" name="km-ujeto" class="form-control">
		<div class="input-group-append"><span class="input-group-text">Kilometrů</span></div>
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Stav</span></div>
		<input type="number" name="km_stav" class="form-control">
		<div class="input-group-append"><span class="input-group-text">Kilometrů</span></div>
	</div>

	<div class="input-group">
		<div class="input-group-prepend" style="width: 30%;"><span class="input-group-text" style="width: 100%;">Poznámka</span></div>
		<textarea type="text" name="note" class="form-control" rows="1"></textarea>
	</div>

	<div class="input-group">
		<div class="btn-group btn-group-toggle" data-toggle="buttons" style="width: 100%;"><span class="input-group-text" style="width: 30%">Typ</span>
			<label class="btn btn-info"><input type="radio" name="type" id="type_sluzebni" autocomplete="off">Služební</label>
			<label class="btn btn-info"><input type="radio" name="type" id="type_osobni" autocomplete="off">Osobní</label>
		</div>
	</div>

	<input type="hidden" name="action" value="form-add">
	<input type="submit" name="submit" value="Zaznamenat" class="btn btn-primary" style="width: 100%;">
</form>
