<?php
	namespace App;
?>

<?php if(isset($testCar) && $testCar instanceof Car): ?>
	<div class="alert alert-success" role="alert" id="statusbar" style="text-align: center;">Auto bylo úspěšně upraveno</div>
<?php elseif(isset($google) && $google->type=="success"): ?>
	<div class="alert alert-success" role="alert" id="statusbar" style="text-align: center;"><?=$google->message?></div>
<?php elseif(isset($google)): ?>
	<div class="alert alert-danger" role="alert" id="statusbar" style="text-align: center;"><?=$google->message?></div>
<?php elseif(isset($error) && $error): ?>
	<div class="alert alert-danger" role="alert" id="statusbar" style="text-align: center;"><?php echo(Escape::html($error)); ?></div>
<?php elseif($page == "404"): ?>
	<div class="alert alert-info" role="alert" id="statusbar" style="text-align: center;"><strong>Vyber z menu &#8593;</strong></div>
<?php else: ?>
	<div class="alert alert-info" role="alert" id="statusbar" style="text-align: center;">Zapiš</div>
<?php endif; ?>
