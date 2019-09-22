<?php header('Access-Control-Allow-Origin: *', false);
?>
<?php
    $xlsurls = array("https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(H3PB)%20Osta%20Berchem&a=me&se=6&pi=&si=&ti=30490&ci=&mm=&ssi=&st=&w=%&f="=>"heren1.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(BvASH)%20OSTA%20BERCHEM%203P%20+2&a=me&se=6&pi=&si=&ti=31519&ci=&mm=&ssi=&st=&w=%&f="=>"heren1beker.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(D2GAB)%20Osta%20Berchem%20A&a=me&se=6&pi=&si=&ti=30488&ci=&mm=&ssi=&st=&w=%&f="=>"dames1.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(BvGASDG)%20OSTA%20BERCHEM%20A%20(2G)&a=me&se=6&pi=&si=&ti=30491&ci=&mm=&ssi=&st=&w=%&f="=>"dames1beker.xls","https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(D2GAA)%20Osta%20Berchem%20B&a=me&se=6&pi=&si=&ti=30489&ci=&mm=&ssi=&st=&w=%&f="=>"dames2.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(BvGASDG)%20OSTA%20BERCHEM%20B%20(2G)&a=me&se=6&pi=&si=&ti=30492&ci=&mm=&ssi=&st=&w=%&f="=>"dames2beker.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(MU15RR3)%20OSTA%20BERCHEM%20BC&a=me&se=6&pi=&si=&ti=30890&ci=&mm=&ssi=&st=&w=%&f="=>"mu15.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(JU15R)%20OSTA%20BERCHEM%20(bc)&a=me&se=6&pi=&si=&ti=30889&ci=&mm=&ssi=&st=&w=%&f="=>"ju15.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20H3PB%20Heren%203de%20Provinciale%20B%20Antwerpen%20(A)&a=re&se=6&pi=&si=&ti=&ci=&mm=&ssi=4064&st=&w=%&f="=>"H3PB.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20D2GAB%20Dames%202de%20gewest%20Antwerpen%20B%20(A)&a=re&se=6&pi=&si=&ti=&ci=&mm=&ssi=4155&st=&w=%&f="=>"D2GAB.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20D2GAA%20Dames%202de%20gewest%20Antwerpen%20(A)&a=re&se=6&pi=&si=&ti=&ci=&mm=&ssi=3719&st=&w=%&f="=>"D2GAA.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20MU15RR3%20Meisjes%20U15%20Regionaal%20reeks%203%20(A)&a=re&se=6&pi=&si=&ti=&ci=&mm=&ssi=4060&st=&w=%&f="=>"MU15stand.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20JU15R%20%20Jongens%20U15%20Regionaal%20%20%20(A)&a=re&se=6&pi=&si=&ti=&ci=&mm=&ssi=3878&st=&w=%&f="=>"JU15stand.xls");
    
    foreach ($xlsurls as $v => $team) {
        $xls = fopen("$v", 'r');
        file_put_contents("$team", $xls);
    }

//pauzeren voor filewrites
sleep(13);

require 'libraries/php_xlsx_to_json/vendor/autoload.php';

$filenames = array("heren1.xls"=>"heren1.json", "heren1beker.xls"=>"heren1beker.json", "dames1.xls"=>"dames1.json", "dames1beker.xls"=>"dames1beker.json", "dames2.xls"=>"dames2.json", "dames2beker.xls"=>"dames2beker.json","mu15.xls"=>"mu15.json", "ju15.xls"=>"ju15.json");

$filenames_ranking = array("H3PB.xls"=>"H3PB.json", "D2GAB.xls"=>"D2GAB.json", "D2GAA.xls"=>"D2GAA.json", "MU15stand.xls"=>"MU15stand.json", "JU15stand.xls"=>"JU15stand.json");


foreach ($filenames as $f => $jsonfile) {
    $inputFileName = './' . $f;
    $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($inputFileName);
    $sheetData = $spreadsheet->getActiveSheet()->toArray();

    $data = [];

    echo "Convert xlsx to json\n";

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

    echo "Convert xlsx to json\n";

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