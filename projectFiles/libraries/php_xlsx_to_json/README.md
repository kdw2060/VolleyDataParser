# Xlsx to json converter

Made with php, and PhpSpreadsheet
https://github.com/PHPOffice/PhpSpreadsheet

# Install

1 . Clone repository

```
git clone git@github.com:antonshell/php_xlsx_to_json.git
```

2 . Install dependencies

```
composer install
```

# Usage

1 . Set filenames in ```convert.php```

```
$inputFileName = './demo.xlsx';
$outputFileName = './data/demo.json';
```

2 . Convert to json

```
php convert.php
```