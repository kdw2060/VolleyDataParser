<?php header('Access-Control-Allow-Origin: *', false);
?>
<?php
    $xlsurls = array("https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(H1GA)%20Osta%20Berchem&a=me&se=5&pi=&si=&ti=20456&ci=&mm=&ssi=&st=&w=%&f="=>"heren1.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(D2GAB)%20Osta%20Berchem%20A&a=me&se=5&pi=&si=&ti=20455&ci=&mm=&ssi=&st=&w=%&f="=>"dames1.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(D3GA)%20Osta%20Berchem%20B&a=me&se=5&pi=&si=&ti=20454&ci=&mm=&ssi=&st=&w=%&f="=>"dames2.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(MU15RR2)%20OSTA%20BERCHEM&a=me&se=5&pi=&si=&ti=20458&ci=&mm=&ssi=&st=&w=%&f="=>"mu15.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Ploeg%20(JU15RR1%20)%20OSTA%20BERCHEM%20(bc)&a=me&se=5&pi=&si=&ti=20459&ci=&mm=&ssi=&st=&w=%&f="=>"ju15.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20H1GA%20Heren%201e%20gewest%20Antwerpen%20(A)&a=re&se=5&pi=&si=&ti=&ci=&mm=&ssi=2387&st=&w=%&f="=>"H1GA.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20D2GAB%20Dames%202de%20gewest%20Antwerpen%20B%20(A)&a=re&se=5&pi=&si=&ti=&ci=&mm=&ssi=2833&st=&w=%&f="=>"D2GAB.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20D3GA%20Dames%203de%20gewest%20Antwerpen%20(A)&a=re&se=5&pi=&si=&ti=&ci=&mm=&ssi=2391&st=&w=%&f="=>"D3GA.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20MU15RR2%20Meisjes%20U15%20Regionaal%20reeks%202%20(A)&a=re&se=5&pi=&si=&ti=&ci=&mm=&ssi=2925&st=&w=%&f="=>"MU15stand.xls", "https://www.volleyscores.be/index.php?v=2&isActiveSeason=1&t=Reeks%20JU15RR1%20%20Jongens%20U15%20Regionaal%20reeks%201%20%20%20(A)&a=re&se=5&pi=&si=&ti=&ci=&mm=&ssi=2330&st=&w=%&f="=>"JU15stand.xls");
    
    foreach ($xlsurls as $v => $team) {
        $xls = fopen("$v", 'r');
        file_put_contents("$team", $xls);
    }

//pauzeren voor filewrites
sleep(13);

require 'libraries/php_xlsx_to_json/vendor/autoload.php';

$filenames = array("heren1.xls"=>"heren1.json", "dames1.xls"=>"dames1.json", "dames2.xls"=>"dames2.json", "mu15.xls"=>"mu15.json", "ju15.xls"=>"ju15.json");

$filenames_ranking = array("H1GA.xls"=>"H1GA.json", "D2GAB.xls"=>"D2GAB.json", "D3GA.xls"=>"D3GA.json", "MU15stand.xls"=>"MU15stand.json", "JU15stand.xls"=>"JU15stand.json");


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