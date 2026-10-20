<?php
include_once 'includes/setup.php';
include_once 'includes/functions.php';

$db = DatabaseConnection::getInstance()->getConnection();

$stmt = $db->prepare("SELECT * FROM `routing` WHERE uri=?");

$stmt->execute([getCurrentUri()]);

$routingData=$stmt->fetch();
if ($routingData) {
    $runnerData=["uri"=>$routingData["uri"],"runner"=>$routingData["runner"],"data"=>$routingData["data"],"title"=>$routingData["title"],"min_permission"=>$routingData["min_permission"]];
    if ($runnerData["min_permission"]!=-1){
        if (isset($_SESSION["permission"])){
            if ($_SESSION["permission"]>=$runnerData["min_permission"]){
                require 'runner/' . $routingData["runner"];
            } else{
                require 'runner/404.php';
            }
        } else{
            require 'runner/cms.php';
        }
    } else{
        require 'runner/' . $routingData["runner"];
    }

} else {
    require 'runner/404.php';
}