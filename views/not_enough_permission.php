<?php require 'views/general_blocks/head.php'; ?>
<body>
<?php require 'views/general/cms_nav.php'; ?>
<h1>NIET GENOEG PERMISSIE!</h1>
<h1>Welcome to the CMS <?php echo $_SESSION["username"]?></h1>
<h3>You have permission level <?php echo $_SESSION["permission"]?></h3>
<a href="/cms/editor">Naar de editor?</a><br>
<a href="/logout_endpoint">Uitloggen</a>

</body>
</html>