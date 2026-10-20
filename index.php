<?php
include_once 'includes/setup.php';
include_once 'includes/functions.php';

echo "<h1>".getCurrentUri()."</h1>";
echo "<h1>".$_SERVER['REQUEST_URI']."</h1>";

$db = DatabaseConnection::getInstance()->getConnection();


$stmt = $db->prepare("SELECT * FROM recepten");
$stmt->execute(array());

foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $recept) {
    echo $recept["naam"]."<br />";

}

?>


<a href="/edit_recept.php">Nieuw recept toevoegen?</a>
