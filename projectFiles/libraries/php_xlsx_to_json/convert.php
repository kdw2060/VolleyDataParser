<?php

require 'vendor/autoload.php';

$inputFileName = '../../dames1.xls';
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
    echo "Process row #$index\n";

    $item = [];
    foreach ($row as $key => $value){
        $column = $headers[$key];
        $item[$column] = $value;
    }

    $data[] = $item;
    $index++;
}

echo "Save to file\n";

$json = json_encode($data, JSON_UNESCAPED_UNICODE);
$outputFileName = './data/d1.json';
file_put_contents($outputFileName, $json);

echo "Job is done\n";