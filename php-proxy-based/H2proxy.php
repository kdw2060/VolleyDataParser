<?php header('Access-Control-Allow-Origin: http://www.ostaberchem.be', false);
header('Content-Type: application/json');
?>
<?php echo file_get_contents('https://mijnbeheer.sportafederatie.be/competities/publiek/schema/4/json?organisation=1684&team=351'); ?>