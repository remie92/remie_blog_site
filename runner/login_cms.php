<?php
$username = isset($_POST["name"]) ?? $_POST["name"];
$password = isset($_POST["password"]) ?? $_POST["password"];

$db = DatabaseConnection::getInstance()->getConnection();

$stmt = $db->prepare("SELECT * FROM `users` WHERE username=?");

$stmt->execute([$username]);

$found_account=$stmt->fetch();

if ($found_account&&is_string($username)&&is_string($password)) {
    if (password_verify($password, $found_account['password_hash'])) {
        $_SESSION['username'] = $found_account['username'];
        $_SESSION["logged_in"]=true;
        $_SESSION["permission"]=$found_account['permission'];
    } else {
        echo '<script>alert("Wrong username or password!");</script>';
    }
} else{
    echo '<script>alert("Wrong username or password!");</script>';
}

header('Location: /cms');