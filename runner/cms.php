<?php

if (isset($_SESSION["logged_in"])){
    if ($_SESSION["permission"] >= $runnerData["min_permission"]) {
        if ($runnerData["data"] == "home") {
            require 'views/cms_home.php';
        } elseif ($runnerData["data"] == "editor") {
            $db = DatabaseConnection::getInstance()->getConnection();
            $stmt = $db->prepare("SELECT * FROM tables WHERE read_permission<=? and read_permission!=-1;");
            $stmt->execute([$_SESSION["permission"]]);
            $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $selected_id=$tables[0]["id"];
            if (isset($_GET["selected"])){
                $selected_id=$_GET["selected"];
            }
            $selected=$tables[0];
            $tableFields=array();
            foreach ($tables as $table) {
                array_push($tableFields, $table["name"]);
                if ($selected_id==$table["id"]){
                    $selected=$table;
                }
            }
            $can_edit=($selected["write_permission"]<=$_SESSION["permission"] and $selected["write_permission"]!=-1);
            $stmt = $db->prepare("SELECT * FROM ".$selected["name"]." LIMIT 20");
            $stmt->execute(array());
            $tableData = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $db->prepare("DESCRIBE `" . $selected["name"] . "`");
            $stmt->execute(array());

            $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $tableFields=array();
            foreach ($columns as $column) {
                array_push($tableFields, $column["Field"]);
            }

            require 'views/cms_edit.php';
        }
    } else{
        require 'views/not_enough_permission.php';
    }
} else{
 require 'views/login_cms.php';
}

