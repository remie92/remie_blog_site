<?php
$directory = "data";
$events_to_save = array("Screenshot", "FSDJump", "FSDTarget");

$files = scandir($directory);

$files = array_filter($files, function ($file) {
    return preg_match('/^Journal\.\d{4}-\d{2}-\d{2}T\d{6}\.01\.log$/', $file);
});

sort($files);


$db = DatabaseConnection::getInstance()->getConnection();

$stmt = $db->prepare("DELETE FROM `elite_star_systems`");
$stmt = $db->prepare("DELETE FROM `elite_screenshots`");

$stmt->execute();

$last_position=array(0,0,0);


function convertScreenshotPath(string $path, bool $thumbnail = false): string
{
    $filename = basename(str_replace('\\', '/', $path));

    $filename = preg_replace('/\.bmp$/i', '.webp', $filename);

    $directory = $thumbnail ? 'converted_thumbnail' : 'converted';

    return "/web/images/elite_screenshots/{$directory}/{$filename}";
}


foreach ($files as $file) {
    $file = dirname(__DIR__) . '/data/' . $file;

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

            if ($entry['event'] == "FSDJump") {
                $stmt = $db->prepare("
                    INSERT INTO elite_star_systems
                        (SystemAddress, coordX, coordY, coordZ, name, timestamp,allegiance,population)
                    VALUES (?, ?, ?, ?, ?, ?,?,?)
                    ON DUPLICATE KEY UPDATE
                        coordX = VALUES(coordX),
                        coordY = VALUES(coordY),
                        coordZ = VALUES(coordZ),
                        name = VALUES(name),
                        timestamp = VALUES(timestamp),
                        allegiance = VALUES(allegiance),
                        population = VALUES(population)
                ");

                $stmt->execute([
                    $entry['SystemAddress'],
                    $entry['StarPos'][0],
                    $entry['StarPos'][1],
                    $entry['StarPos'][2],
                    $entry['StarSystem'],
                    date('Y-m-d H:i:s', strtotime($entry['timestamp'])),
                    $entry['SystemAllegiance'],
                    $entry['Population']
                ]);
                $last_position=array($entry['StarPos'][0],$entry['StarPos'][1],$entry['StarPos'][2]);
            }
            if ($entry['event'] == "FSDTarget") {
                $stmt = $db->prepare("
                    INSERT INTO elite_star_systems
                        (SystemAddress, star_type, name, timestamp)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        star_type = VALUES(star_type),
                        name = VALUES(name),
                        timestamp = VALUES(timestamp)
                ");

                $stmt->execute([
                    $entry['SystemAddress'],
                    $entry['StarClass'],
                    $entry['Name'],
                    date('Y-m-d H:i:s', strtotime($entry['timestamp']))
                ]);
            }

            if ($entry['event'] == "Screenshot") {
                $stmt = $db->prepare("
                    INSERT INTO elite_screenshots
                        (url, coordX, coordY, coordZ, system_name, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");

                $stmt->execute([
                    convertScreenshotPath($entry["Filename"],true),
                    $last_position[0],
                    $last_position[1],
                    $last_position[2],
                    $entry['System'],
                    date('Y-m-d H:i:s', strtotime($entry['timestamp']))
                ]);
            }


            echo var_dump($entry);
            echo "<br>";
            echo "<br>";
            echo "<br>";
        }

        fclose($handle);
    }


//    $stmt = $db->prepare("INSERT INTO `checked_elite_logs` (`log_name`) VALUES (?)");
//
//    $stmt->execute([$file]);

}