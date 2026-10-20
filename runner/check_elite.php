<?php
$directory="data";
$events_to_save=array(
    "Screenshot",
    "FSDJump"
);

$files = scandir($directory);

$files = array_filter($files, function ($file) {
    return preg_match('/^Journal\.\d{4}-\d{2}-\d{2}T\d{6}\.01\.log$/', $file);
});

sort($files);

var_dump($files);




$db = DatabaseConnection::getInstance()->getConnection();
foreach ($files as $file) {
    $file = dirname(__DIR__) . '/data/' . $file;
    $stmt = $db->prepare("SELECT * FROM `checked_elite_logs` WHERE log_name=?");

    $stmt->execute([$file]);
    $output = $stmt->fetch(PDO::FETCH_ASSOC);
    if(!($output)){

    $handle = fopen($file, 'r');

    if ($handle) {
        while (($line = fgets($handle)) !== false) {
            $entry = json_decode($line, true);

            if ($entry === null) {
                continue; // Skip invalid JSON lines
            }
            if (!in_array($entry['event'], $events_to_save)) {
                continue; // Skip invalid JSON lines
            }

            $stmt = $db->prepare("INSERT INTO `elite_events` (`data`) VALUES (?)");

            $stmt->execute([$line]);

            echo var_dump($entry);
            echo "<br>";
            echo "<br>";
            echo "<br>";
        }

        fclose($handle);
    }


    $stmt = $db->prepare("INSERT INTO `checked_elite_logs` (`log_name`) VALUES (?)");

    $stmt->execute([$file]);
}
}