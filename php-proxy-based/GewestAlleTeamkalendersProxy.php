<?php header('Access-Control-Allow-Origin: http://www.ostaberchem.be', false);
header('Content-Type: text/calendar');
?>
<?php echo file_get_contents('http://www.volleyscores.be/calendar/club/11306'); ?>