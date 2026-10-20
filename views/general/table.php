<?php
//Make a tableData 2D array, it grabs data from that!
//Also, make a tableFields array, those are the names!
echo "<table>";
echo "    <tr>";
foreach ($tableFields as $field) {
    echo "        <th>" . $field . "</th>";
}
echo "    </tr>";
foreach ($tableData as $row) {
    echo "    <tr>";
    foreach ($row as $val) {
        echo "        <td>" . $val . "</td>";
    }
    echo "    </tr>";
}
echo "</table>";

?>



