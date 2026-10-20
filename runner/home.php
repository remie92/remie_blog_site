<?php

include_once 'includes/setup.php';
include_once 'includes/functions.php';

$db = DatabaseConnection::getInstance()->getConnection();


$stmt = $db->prepare("SELECT * FROM recepten");
$stmt->execute(array());
require 'views/homescreen.php';
?>
