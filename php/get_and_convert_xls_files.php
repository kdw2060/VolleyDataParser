<?php header('Access-Control-Allow-Origin: *', false);
?>
<?php
    $xlsurls = array(
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Wedstrijden+AA-2153+Osta+Berchem+&a=me&se=13&pi=&si=&ti=&ci=11306&mm=&ssi=12450&st=%25&w=%25&f=1&lng=nl"=>"heren1.xls",
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Wedstrijden+AA-2153+Osta+Berchem+&a=me&se=13&pi=&si=&ti=&ci=11306&mm=&ssi=12455&st=%25&w=%25&f=1&lng=nl"=>"dames1.xls",
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Wedstrijden+AA-2153+Osta+Berchem+&a=me&se=13&pi=&si=&ti=&ci=11306&mm=&ssi=11700&st=%25&w=%25&f=1&lng=nl"=>"dames2.xls",
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Wedstrijden+AA-2153+Osta+Berchem+&a=me&se=13&pi=&si=&ti=&ci=11306&mm=&ssi=11701&st=%25&w=%25&f=1&lng=nl"=>"dames5.xls",
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Wedstrijden+AA-2153+Osta+Berchem+&a=me&se=13&pi=&si=&ti=&ci=11306&mm=&ssi=11706&st=%25&w=%25&f=1&lng=nl"=>"dames_beker_gew.xls",
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Wedstrijden+AA-2153+Osta+Berchem+&a=me&se=13&pi=&si=&ti=&ci=11306&mm=&ssi=11705&st=%25&w=%25&f=1&lng=nl"=>"dames_beker_prov.xls",
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=AHP3-A%20Heren%20Promo%203%20A&a=re&se=12&pi=&si=&ti=&ci=&mm=&ssi=11118&st=&w=%&f=&lng=nl"=>"AHP3A.xls",
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=AHP3-A%20Heren%20Promo%203%20A&a=re&se=12&pi=&si=&ti=&ci=&mm=&ssi=11118&st=&w=%&f=&lng=nl"=>"ADP3B.xls",
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=DAP4A%20Dames%201ste%20gewest%20Antwerpen&a=re&se=12&pi=&si=&ti=&ci=&mm=&ssi=10535&st=&w=%&f=&lng=nl"=>"ADP4A.xls",
        "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(DAP5AB)%20OSTA%20BERCHEM%20C&a=re&se=12&pi=&si=&ti=94065&ci=&mm=&ssi=&st=&w=%&f=&lng=nl"=>"ADP5AA.xls"
        );
    // TODO: competitiestanden/rankings urls nog aanpassen (nog niet beschikbaar)
    foreach ($xlsurls as $v => $team) {
        $xls = fopen("$v", 'r');
        file_put_contents("$team", $xls);
    }

//pauzeren voor filewrites
sleep(13);

require 'libraries/php_xlsx_to_json/vendor/autoload.php';

$filenames = array("heren1.xls"=>"heren1.json", "dames1.xls"=>"dames1.json", "dames2.xls"=>"dames2.json", "dames5.xls"=>"dames5.json", "dames_beker_gew.xls"=>"dames_beker_gew.json", "dames_beker_prov.xls"=>"dames_beker_prov.json");

$filenames_ranking = array("AHP3A.xls"=>"AHP3A.json", "ADP3B.xls"=>"ADP3B.json", "ADP4A.xls"=>"ADP4A.json", "ADP5AA.xls"=>"ADP5AA.json");


foreach ($filenames as $f => $jsonfile) {
    $inputFileName = './' . $f;
    $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($inputFileName);
    $sheetData = $spreadsheet->getActiveSheet()->toArray();

    $data = [];

    echo "Converting file $f\n";

    // header
    $headers = $sheetData[0];
    unset($sheetData[0]);

    // data
    $index = 1;
    foreach ($sheetData as $row){
        //echo "Process row #$index\n";

        $item = [];
        foreach ($row as $key => $value){
            $column = $headers[$key];
            $item[$column] = $value;
        }

        $data[] = $item;
        $index++;
    }

    //echo "Save to file\n";

    $json = json_encode($data, JSON_UNESCAPED_UNICODE);
    $outputFileName = './' . $jsonfile;
    file_put_contents($outputFileName, $json);

    //echo "Job is done\n";
}

foreach ($filenames_ranking as $f => $jsonfile) {
    $inputFileName = './' . $f;
    $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($inputFileName);
    $sheetData = $spreadsheet->getActiveSheet()->toArray();

    $data = [];

    echo "Converting file $f\n";

    // header
    $headers = $sheetData[1];
    unset($sheetData[1]);

    // data
    $index = 1;
    foreach ($sheetData as $row){
        //echo "Process row #$index\n";

        $item = [];
        foreach ($row as $key => $value){
            $column = $headers[$key];
            $item[$column] = $value;
        }

        $data[] = $item;
        $index++;
    }

    //echo "Save to file\n";

    $json = json_encode($data, JSON_UNESCAPED_UNICODE);
    $outputFileName = './' . $jsonfile;
    file_put_contents($outputFileName, $json);

    //echo "Job is done\n";
}

?>