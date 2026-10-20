<?php require 'views/general_blocks/head.php'; ?>
<body>
<?php require 'views/general/cms_nav.php'; ?>
<h1>Welcome to the CMS <?php echo $_SESSION["username"]?></h1>
<h3>You have permission level <?php echo $_SESSION["permission"]?></h3>

<?php require 'views/general/cms_logout.php'; ?>

</body>
</html>