<?php
session_start();
include 'includes/config.php';

spl_autoload_register(function ($class_name) {
    include 'classes/' . $class_name . '.php';
});

