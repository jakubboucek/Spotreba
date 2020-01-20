<?php
	namespace App;
?>

<?php if($car instanceof Car): ?>
	<div class="alert alert-success" role="alert" id="statusbar" style="text-align: center;">Úspěšně zaregistrováno nové auto</div>
<?php elseif($error): ?>
	<div class="alert alert-danger" role="alert" id="statusbar" style="text-align: center;"><?php echo(Escape::html($error)); ?></div>
<?php else: ?>
	<div class="alert alert-info" role="alert" id="statusbar" style="text-align: center;">Zapiš</div>
<?php endif; ?>
