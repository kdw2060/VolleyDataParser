<?php header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
?>
<?php echo file_get_contents('https://mijnbeheer.sportafederatie.be/competities/publiek/rangschikking/4/json?type=league'); ?>