<?php
include_once 'includes/setup.php';
include_once 'includes/functions.php';

$db = DatabaseConnection::getInstance()->getConnection();
$stmt = $db->prepare("DELETE FROM `table_fields`");
$stmt->execute(array());

$stmt = $db->prepare("SELECT * FROM tables");
$stmt->execute(array());
$tables = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($tables as $table) {
    echo $table["id"] . "<br>";
    echo $table["name"] . "<br>";

    $stmt = $db->prepare("DESCRIBE `" . $table["name"] . "`");
    $stmt->execute();

    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $keys=array();
    foreach ($columns as $column) {
        array_push($keys,$column["Field"]);
        var_dump($column);
        echo $column["Field"] . "<br />";
        $is_primary='0';
        if ($column["Key"] == "PRI") {
            $is_primary='1';
        }
        $stmt = $db->prepare("INSERT INTO `table_fields` (`table_id`, `name`, `is_primary`) VALUES (?,?,?)");
        $stmt->execute([$table["id"],$column["Field"],$is_primary]);
    }
    #


    echo "<br><br>";
}