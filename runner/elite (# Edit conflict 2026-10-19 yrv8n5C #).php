<!--<canvas id="spaceMap" width="800" height="600" style="border:1px solid black;">-->
<!--</canvas>-->
<script src="/web/scripts/p5.js"></script>




<?php
//require 'views/elite.php';

$system_coordinates = [];
$screenshots=[];
//var_dump($funky);
//
//if(in_array([0,0,8],$funky)){
//    echo "hi1";
//} else{
//    echo "hi2";
//}




$stmt = $db->prepare("SELECT * FROM `elite_events`");

$stmt->execute();
$output = $stmt->fetchAll(PDO::FETCH_ASSOC);


function coordinateToString($coordinate) {
    return "[".$coordinate[0].",".$coordinate[1].",".$coordinate[2]."]";
}

function convertScreenshotPath(string $path, bool $thumbnail = false): string
{
    $filename = basename(str_replace('\\', '/', $path));

    $filename = preg_replace('/\.bmp$/i', '.webp', $filename);

    $directory = $thumbnail ? 'converted_thumbnail' : 'converted';

    return "/web/images/elite_screenshots/{$directory}/{$filename}";
}

$current_pos=array(0,0,0);
foreach ($output as $event){
    $entry = json_decode($event["data"], true);
    if ($entry["event"] == "FSDJump"){
        //echo "Moved from ".coordinateToString($current_pos)." to ".coordinateToString($entry["StarPos"])."\n";
        $current_pos=$entry["StarPos"];
        array_push($system_coordinates,$current_pos);
    }
    if ($entry["event"] == "Screenshot"){
        array_push($screenshots,[$current_pos,convertScreenshotPath($entry["Filename"],true),$entry["System"]]);
//        echo "Made screenshot linked: ";
//        echo "<a href=".convertScreenshotPath($entry["Filename"],false)."> here!</a>";
//
//        echo " at ".coordinateToString($current_pos)."\n";
//        echo "<br>";
//        echo "<img src=\"".convertScreenshotPath($entry["Filename"],true)."\" alt='screenshot' width='500'>";
    }
    //echo $entry["timestamp"]." ".$entry["event"]." ".$entry["StarPos"][0]." ".$entry["StarPos"][1]." ".$entry["StarPos"][2];
//    echo "<br>";
//    echo "<br>";
}


?>


<script>
    // json_encode safely translates PHP arrays/objects directly into JavaScript syntax
    const star_systems = <?php echo json_encode($system_coordinates); ?>;
    const screenshots = <?php echo json_encode($screenshots); ?>;
    console.log(screenshots);
</script>

<script src="/web/scripts/elite.js"></script>