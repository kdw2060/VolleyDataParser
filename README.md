# VolleyDataParser

Dit is een Angular project om de wedstrijdgegevens van volleyscores.be en mijnbeheer.sportafederatie.be te downloaden, parsen en samenvoegen voor hergebruik op volleybalclub-websites.

Houd wedstrijdkalenders en uitslagen automatisch in sync.

Deze code is in gebruik op https://ostaberchem.be en mag vrij aangepast en gebruikt worden door andere volleybalclubs.

## Aanpassen

### PHP proxy en parser

In de map `php` vind je proxy-scripts terug die de Sporta Mijn Beheer api aanspreekt om live kalenders en rankings op te halen.
In deze files moet je het organisation-id aanpassen naar dat van jouw club en de Access-Control header aanpassen met de url van jouw website
(proxy is nodig omdat de api calls client-side uitgevoerd worden en je anders CORS violations krijgt).

De file `get_and_convert_xls_files.php` downloadt dan weer kalenders en rankings van volleyscores.be voor ploegen die in gewest, provinciale of landelijke reeksen spelen en zet de data om naar json. Hierin moet je de arrays met ploegen en url's van de respectievelijke kalenders/rankings aanpassen naar die van jouw ploegen. Die info is te bekomen door met de dev-tools van je browser de network-requests van volleyscores.be te bekijken.

### Angular code

Ik ga er van uit dat je reeds vertrouwd bent met Angular development. In de `src/app` folder vind je de project-files terug.
De enige file die aanpassingen vereist is `getData.service.ts`. Hierin moet je alle referenties naar de gewestFiles aanpassen in overeenstemming met de waarden uit je `get_and_convert_xls_files.php` bestand.
Voor de Sporta wedstrijdkalenders is geen aanpassing aan de code vereist, voor de rankings ga je de voor jou relevante competities in het respons-array moeten selecteren.

De functies voor het hernoemen van ploegen en stylen van de uitslagen pas je ofwel aan of kun je ook wissen als je die zaken niet belangrijk vindt (en dan de aanroepen van deze functies ook wissen).

## Builden en installeren

De php files moet je ergens op je webserver een plek geven. Pas vervolgens ook de waarde van `webserverpad` aan in `getData.service.ts` naar de map die je gebruikt hebt.
`get_and_convert_xls_files.php` moet je vervolgens met een cron-job ook op regelmatige basis aanroepen om wanneer nodig de nieuwste data binnen te halen (typisch in het weekend en op maandag).

De Angular code moet gebuild worden tot een enkele javascript file die je net als de php files op je webserver een plek moet geven.

Gebruik tijdens het developen:

```bash
npm run ng build --configuration development
```

--> dit levert in de /dist folder een niet minified bestand op waardoor het makkelijker is om issues te debuggen.

Eens alles op punt staat gebruik je:

```bash
npm run ng build
```

--> dit levert in de /dist folder een `main.js` bestand op dat geoptimaliseerd en minified is.

Het .js bestand moet je vervolgens ergens in je website code inladen met een `<script>` tag of op de manier die past voor het CMS dat je gebruikt.

## Snippets gebruiken

Als het Angular script correct ingeladen is kun je vervolgens op webpagina's deze drie componenten oproepen:

```html
<all-matches-widget filter="ploegnaam"></all-matches-widget>
```

De filter is optioneel en gebruik je om enkel de wedstrijden van de ploeg in kwestie te tonen.

```html
<recent-matches-widget></recent-matches-widget>
```

Toont standaard alle westrijden tot 3 dagen terug en 5 dagen in de toekomst.

```html
<ranking-table-widget ranking-key="competitieNaam" highlight="ploegnaam"></ranking-table-widget>
```

De waarde voor de `ranking-key` is de naam van de ranking zoals je die in `getData.service.ts` gedefinieerd hebt, bv. 'SportaH2'.
