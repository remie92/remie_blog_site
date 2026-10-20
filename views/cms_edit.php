<?php require 'views/general_blocks/head.php'; ?>
<body>
<?php require 'views/general/cms_nav.php'; ?>
<h1>Select the table to edit:</h1>
<?php require 'views/parts/cms_editor_nav.php'; ?>
<?php echo '<h3>Technical name: "'.$selected["name"].'"</h3>'?>
<?php echo '<h3>'.($can_edit ? "You can edit this table." : "You can't edit this table.").'</h3>' ?>
<br>
<?php require 'views/general/table.php'; ?>

<?php require 'views/general/cms_logout.php'; ?>
</body>
</html>