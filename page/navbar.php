
<nav class="navbar navbar-dark bg-dark">

<div style="width: 550px; margin: auto;">
    <div class="btn-group" role="group" style="width: 100%">

        <a 	class="btn <?php if ($page == "add")    {echo("btn-success");}else{echo("btn-secondary");}?>"
        	href="<?= $basePath; ?>/add"
        	id="button_add">
        	Jízda
        </a>

        <a 	class="btn <?php if ($page == "tank")   {echo("btn-success");}else{echo("btn-secondary");}?>"
        	href="<?= $basePath; ?>/tank"
        	id="button_tank">
        	Tankovat
        </a>

        <a  class="btn <?php if ($page == "create") {echo("btn-success");}else{echo("btn-secondary");}?>"
            href="<?= $basePath; ?>/create"
            id="button_create">
            Registrace
        </a>

        <a  class="btn <?php if ($page == "show") {echo("btn-success");}else{echo("btn-secondary");}?>"
            href="<?= $basePath; ?>/show"
            id="button_create">
            Seznam aut
        </a>

    </div>
</div>

</nav>
