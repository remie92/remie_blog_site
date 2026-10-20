<?php
$username = $_POST["name"];
$password = $_POST["password"];
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$db = DatabaseConnection::getInstance()->getConnection();

$stmt = $db->prepare("SELECT * FROM `users` WHERE username=?");

$stmt->execute([$username]);

$found_account=$stmt->fetch();

if ($found_account) {
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