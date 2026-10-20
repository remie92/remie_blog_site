<?php

include_once 'includes/setup.php';
include_once 'includes/functions.php';

$can_save=true;

if (isset($_GET['actie'])) {
    if ($_GET['actie'] != "opslaan") {
        $can_save=false;
    }
} else {
    $can_save=false;
}


$name="Brood";
if (isset($_GET['name'])) {
    $name=$_GET['name'];
    if (strlen($_GET['name'])<5) {
        $can_save=false;
        echo "De naam moet 5 of meer karakters hebben! <br>";
    }
} else {
    $can_save=false;
}
$ingredients="1 blik soep";
if (isset($_GET['ingredients'])) {
    $ingredients=$_GET['ingredients'];
    if (strlen($_GET['ingredients'])<10) {
        $can_save=false;
        echo "De ingredienten moeten 10 of meer karakters zijn! <br>";
    }
} else {
    $can_save=false;
}
$steps="Maak het blik soep open";
if (isset($_GET['steps'])) {
    $steps=$_GET['steps'];
    if (strlen($_GET['steps'])<10) {
        $can_save=false;
        echo "De stappenlijst moet 10 of meer karakters zijn! <br>";
    }
} else {
    $can_save=false;
}

if ($can_save) {
    $db = DatabaseConnection::getInstance()->getConnection();

    $stmt = $db->prepare("INSERT INTO `recepten` (`naam`, `ingredienten`, `instructies`) VALUES (?, ?, ?)");

    $stmt->execute([$_GET['name'], $_GET['ingredients'], $_GET['steps']]);
    header('Location: /');
    die();
}



echo "<form action=\"/edit_recept.php\">";
echo "<input type=\"hidden\" name=\"actie\" value=\"opslaan\" />";
echo "<label for=\"name\">Recept naam:</label><br>";
echo "<input type=\"text\" id=\"name\" name=\"name\" value=\"".$name."\"><br>";
echo "<label for=\"ingredients\">Ingredienten:</label><br>";
echo "<input type=\"text\" id=\"ingredients\" name=\"ingredients\" value=\"".$ingredients."\"><br>";
echo "<label for=\"steps\">Stappen:</label><br>";
echo "<input type=\"text\" id=\"steps\" name=\"steps\" value=\"".$steps."\"><br><br>";
echo "<input type=\"submit\" value=\"Submit\">";
echo "</form>";




