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
$stmt->execute();
$stmt = $db->prepare("DELETE FROM `elite_screenshots`");
$stmt->execute();
$stmt = $db->prepare("DELETE FROM `elite_jump_routes`");

$stmt->execute();

$invalid_entry_counter = 0;
$not_saved_entry_counter = 0;
$FSDJump_counter = 0;
$FSDTarget_counter = 0;
$screenshot_counter = 0;

$last_position = array(0, 0, 0);
$last_system = "";
$last_system_id = null;

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
                $invalid_entry_counter += 1;
                continue; // Skip invalid JSON lines
            }
            if (!in_array($entry['event'], $events_to_save)) {
                $not_saved_entry_counter += 1;
                continue; // Skip invalid JSON lines
            }

            if ($entry['event'] == "FSDJump") {

                $FSDJump_counter += 1;
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

                $stmt->execute([$entry['SystemAddress'], $entry['StarPos'][0], $entry['StarPos'][1], $entry['StarPos'][2], $entry['StarSystem'], date('Y-m-d H:i:s', strtotime($entry['timestamp'])), $entry['SystemAllegiance'], $entry['Population']]);
                if ($last_system_id != null) {
                    $system1 = min($last_system_id, $entry['SystemAddress']);
                    $system2 = max($last_system_id, $entry['SystemAddress']);
                    $stmt = $db->prepare("SELECT * FROM `elite_jump_routes` where SystemAddress1=? and SystemAddress2=?;");

                    $stmt->execute([$system1, $system2]);
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($row) {
                        $stmt = $db->prepare("UPDATE elite_jump_routes 
                            SET jump_amount = jump_amount + 1 
                            WHERE SystemAddress1 = ? AND SystemAddress2 = ?;");

                        $stmt->execute([$system1, $system2]);
                    } else {
                        $stmt = $db->prepare("
                        INSERT INTO elite_jump_routes
                            (coordX1,coordY1,coordZ1,coordX2,coordY2,coordZ2,SystemAddress1,SystemAddress2)
                        VALUES (?, ?, ?, ?, ?, ?,?,?)");
                        if ($last_system_id == $system1) {
                            $stmt->execute([$last_position[0], $last_position[1], $last_position[2], $entry['StarPos'][0], $entry['StarPos'][1], $entry['StarPos'][2], $system1, $system2]);
                        } else {
                            $stmt->execute([$entry['StarPos'][0], $entry['StarPos'][1], $entry['StarPos'][2], $last_position[0], $last_position[1], $last_position[2], $system1, $system2]);
                        }

                    }


                }
                $last_system = $entry['StarSystem'];
                $last_position = array($entry['StarPos'][0], $entry['StarPos'][1], $entry['StarPos'][2]);
                $last_system_id = $entry['SystemAddress'];
            }
            if ($entry['event'] == "FSDTarget") {
                $FSDTarget_counter += 1;
                $stmt = $db->prepare("
                    INSERT INTO elite_star_systems
                        (SystemAddress, star_type, name, timestamp)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        star_type = VALUES(star_type),
                        name = VALUES(name),
                        timestamp = VALUES(timestamp)
                ");

                $stmt->execute([$entry['SystemAddress'], $entry['StarClass'], $entry['Name'], date('Y-m-d H:i:s', strtotime($entry['timestamp']))]);

            }

            if ($entry['event'] == "Screenshot") {
                $screenshot_counter += 1;
                if (!isset($entry['System']) || $entry['System'] === null) {
                    $entry['System'] = $last_system;
                }
                $stmt = $db->prepare("
                        INSERT INTO elite_screenshots
                            (url, coordX, coordY, coordZ, system_name, timestamp)
                        VALUES (?, ?, ?, ?, ?, ?)
                    ");

                $stmt->execute([convertScreenshotPath($entry["Filename"], true), $last_position[0], $last_position[1], $last_position[2], $entry['System'], date('Y-m-d H:i:s', strtotime($entry['timestamp']))]);

            }


//            echo var_dump($entry);
//            echo "<br>";
//            echo "<br>";
//            echo "<br>";
        }

        fclose($handle);


    }


//    $stmt = $db->prepare("INSERT INTO `checked_elite_logs` (`log_name`) VALUES (?)");
//
//    $stmt->execute([$file]);

}

echo "Invalid entries: " . $invalid_entry_counter . "\n";
echo "<br>";
echo "not saved: " . $not_saved_entry_counter . "\n";
echo "<br>";
echo "FSD Jumps: " . $FSDJump_counter . "\n";
echo "<br>";
echo "FSD Targets: " . $FSDTarget_counter . "\n";
echo "<br>";
echo "Screenshots: " . $screenshot_counter . "\n";