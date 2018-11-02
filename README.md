# Toelichting

Code om de wedstrijdgegevens van volleyscores.be en mijnbeheer.sportafederatie.be te downloaden, parsen en samenvoegen voor hergebruik op volleybalclub-websites.

Houd wedstrijdkalenders en uitslagen automatisch in sync.

Deze code is in gebruik op http://ostaberchem.be en mag vrij gebruikt worden door andere volleybalclubs.

#### Beknopte instructies
- plaats de bestanden uit de projectFiles map op jouw webserver
- pas in de .php bestanden de url's aan naar die van jouw club/ploegen
- maak een cron-job aan voor get_and_convert_xls_files.php om op regelmatige basis de volleyscores.be data te downloaden naar je webserver (ik gebruik [cron-job.org](http://cron-job.org))
- pas in scripts.js de variabele-namen en de if statements aan om te matchen met jouw ploegen
- de code in de html bestanden hergebruik je op jouw website op de respectievelijke ploegpagina's. Vergeet niet om eventuele relatieve paden aan te passen.

De code kan serieus vereenvoudigd en ingekort worden als in jouw club alle ploegen in dezelfde competitie spelen. Alles voor het normaliseren en samenvoegen van de data kan dan weggelaten worden.



# Dit project gebruikt

- ics.js - https://github.com/nwcell/ics.js
- php_xlsx_to_json - https://github.com/antonshell/php_xlsx_to_json
- Moment - https://momentjs.com/ 
- Angular - https://angularjs.org/

En check ook ical.js - https://github.com/mozilla-comm/ical.js/wiki als je vcal/ical data naar Json wil omzetten (wel niet langer gebruikt in dit project).