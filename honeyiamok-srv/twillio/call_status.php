<?php
    $myfile = fopen($_GET["uuid"].".txt", "w") or die("Unable to open file!");
    $line = $_GET["CallDuration"]."\n";
    fwrite($myfile, $line);
    $line = $_GET["CallStatus"]."\n";
    fwrite($myfile, $line);
    fclose($myfile);
?>