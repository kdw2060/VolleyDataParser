// Globale variabelen
//var webserverpad = "/ploegdata/"; 
//pas bovenstaande waarde aan naar de map waar je op je webserver de bestanden geupload hebt en comment de volgende regel uit
var webserverpad = "";
var h2cal = ics();
var h3cal = ics();
var d3cal = ics();
var d4cal = ics();
var d5cal = ics();

// Helper functies
String.prototype.capitalize = function(){
        return this.toLowerCase().replace( /\b\w/g, function (m) {
            return m.toUpperCase();
        });
    };
function makeMatch(id, dt, comp, home, away, rslt, loc) {
    this.uid = id;
    this.datetime = dt;
    this.division = comp;
    this.team_home = home;
    this.team_away = away;
    this.result = rslt;
    this.location = loc;
}
function hernoemGewestPloegen(matchObj){
    if (matchObj.division === 'Heren 1e gewest Antwerpen') {
        matchObj.division = 'H1GA';
         if (matchObj.team_home === 'Osta Berchem') {matchObj.team_home = 'Osta Heren 1'}
         if (matchObj.team_away === 'Osta Berchem') {matchObj.team_away = 'Osta Heren 1'}
         }
    if (matchObj.division === 'Dames 2de gewest Antwerpen B') {
        matchObj.division = 'D2GA-B';
        if (matchObj.team_home === 'Osta Berchem A') {matchObj.team_home = 'Osta Dames 1'}
        if (matchObj.team_away === 'Osta Berchem A') {matchObj.team_away = 'Osta Dames 1'}
                }
    if (matchObj.division === 'Dames 3de gewest Antwerpen') {
        matchObj.division = 'D3GA';
        if (matchObj.team_home === 'Osta Berchem B') {matchObj.team_home = 'Osta Dames 2'}
        if (matchObj.team_away === 'Osta Berchem B') {matchObj.team_away = 'Osta Dames 2'}
        }
    if (matchObj.division === 'Meisjes U15 Regionaal reeks 2') {
        matchObj.division = 'MU15 Regionaal reeks 2';
        if (matchObj.team_home === 'OSTA BERCHEM') {matchObj.team_home = 'Osta Meisjes U15'}
        if (matchObj.team_away === 'OSTA BERCHEM') {matchObj.team_away = 'Osta Meisjes U15'}
        }
    if (matchObj.division === 'Jongens U15 Regionaal reeks 1  ') {
        matchObj.division = 'JU15 Regionaal reeks 1';
        if (matchObj.team_home === 'OSTA BERCHEM (bc)') {matchObj.team_home = 'Osta Jongens U15'}
        if (matchObj.team_away === 'OSTA BERCHEM (cc)') {matchObj.team_away = 'Osta Jongens U15'}
        }
}
function styleUitslagen(matchObj) {
    if (matchObj.result != null) {
        let uitslagParts = matchObj.result.split(" - ");
        let thuis = matchObj.team_home;
        let uit = matchObj.team_away;
        if ((uitslagParts[0] == 3 && thuis.includes('Osta')) || (uitslagParts[1] == 3 && uit.includes('Osta')) ){
            matchObj.result = '<span class="badge win">' + matchObj.result + '</span>';
        }
        else {
            matchObj.result = '<span class="badge loss">' + matchObj.result + '</span>';
        }
    }
}

// Angular functies
    var app = angular.module("app", []);

    app.controller('MainController', function ($scope, $http, $rootScope) {
        $scope.H1wedstrijden = [];
        $scope.H2wedstrijden = [];
        $scope.H3wedstrijden = [];
        $scope.D1wedstrijden = [];
        $scope.D2wedstrijden = [];
        $scope.D3wedstrijden = [];
        $scope.D4wedstrijden = [];
        $scope.D5wedstrijden = [];
        $scope.MU15wedstrijden = [];
        $scope.JU15wedstrijden = [];
        $scope.alleGewestWedstrijden = [];
        $scope.alleSportaWedstrijden = [];
        $scope.alleSportaWedstrijden2 = [];
        $scope.alleWedstrijden = [];
        $scope.Onedone;
        $scope.Twodone;
        $scope.Threedone;
        $scope.Fourdone;
        $scope.Fivedone;
        $scope.Sixdone;
        $scope.ready1;
        $scope.ready2;
        
        function getAndProcessAll() {
            console.log('getAll functie gestart');   
            getSportaData();
            getAndProcessGewestData();
        }
        
        function joinData() {
            if ($scope.ready1 && $scope.ready2) { 
                console.log('samenvoegen gestart');
                //data gewest en sporta samenvoegen in 1 array
                $scope.alleWedstrijden = $scope.alleGewestWedstrijden;
                for (i = 0 ; i < $scope.alleSportaWedstrijden2.length; i++) {
                    $scope.alleWedstrijden.push($scope.alleSportaWedstrijden2[i]);
                }
            };
            makeVcalFiles();
        }
        
        function getAndProcessGewestData() {
            let jsonfiles = ['heren1.json', 'dames1.json', 'dames2.json', 'mu15.json', 'ju15.json', 'bekerwedstrijdengewest.json'];
            
            //https://stackoverflow.com/questions/26100329/xhr-response-with-for-loop-not-working?lq=1    

            for (i = 0; i < jsonfiles.length; i++) {
                (function(index, files) {
                var xobj = new XMLHttpRequest();
                xobj.overrideMimeType("application/json");
                xobj.open('GET', webserverpad + files[index], true);
                xobj.onreadystatechange = function () {
                      if (xobj.readyState == 4 && xobj.status == "200") {
                        let data = JSON.parse(xobj.responseText);
                        for (j=0; j < data.length; j++) {
                            var dateParts = data[j].Datum.split("/");
                            var timeParts = data[j].Uur.split(":");
                            var dateObj = new Date(dateParts[2], dateParts[1] -1,dateParts[0],timeParts[0], timeParts[1],0);                        
                            var matchObject = new makeMatch(data[j].Wedstrijdnr, dateObj, data[j].Reeks, data[j].Thuis, data[j].Bezoekers, data[j].Uitslag, data[j].Sporthall);
                            hernoemGewestPloegen(matchObject);
                            styleUitslagen(matchObject);
                            $scope.alleGewestWedstrijden.push(matchObject);
                        };
                        if (index == 0) {$scope.Onedone = true}
                        if (index == 1) {$scope.Twodone = true}
                        if (index == 2) {$scope.Threedone = true}
                        if (index == 3) {$scope.Fourdone = true}
                        if (index == 4) {$scope.Fivedone = true}
                        if (index == 5) {$scope.Sixdone = true;}
                        
                        if ($scope.Onedone && $scope.Twodone && $scope.Threedone && $scope.Fourdone && $scope.Fivedone && $scope.Sixdone) {
                            console.log('alle json files geladen');
                            filterGewestData();
                        }
                      }
                };
                xobj.send(null);
                })(i, jsonfiles)
                }
            };
        
        function filterGewestData() {
            //filteren per ploeg
            $scope.H1wedstrijden = $scope.alleGewestWedstrijden.filter(function (n){
                 if (n.division==='H1GA' || n.division==='Beker (HGA)') {return n;}
            });
            $scope.D1wedstrijden = $scope.alleGewestWedstrijden.filter(function (n){
                if (n.division==='D2GA-B' || n.division==='Beker (DGA)'){return n;}
            });
            $scope.D2wedstrijden = $scope.alleGewestWedstrijden.filter(function (n){
                return n.division==='D3GA';});
            $scope.MU15wedstrijden = $scope.alleGewestWedstrijden.filter(function (n){
                return n.division==='MU15 Regionaal reeks 2';});
            $scope.JU15wedstrijden = $scope.alleGewestWedstrijden.filter(function (n){
                return n.division==='JU15 Regionaal reeks 1';});
            $scope.ready1 = true;            
            console.log('process Gewest klaar');
            joinData();
        }
        
        function getSportaData(){
            //Data sporta-ploegen ophalen
            console.log('sporta kalenders ophalen gestart');
            $http.get(webserverpad + "SportaAlleTeamkalendersProxy.php").then(function(data){
                processSportaData(data);
            });
        }
        
        function processSportaData(res){
            $scope.alleSportaWedstrijden = res.data;
            //datum van string naar datumobject converteren
            angular.forEach($scope.alleSportaWedstrijden, function(value,index){
                var dateParts = value.date.split("/");
                var timeParts = value.time.split(":");
                var dateObj = new Date(dateParts[2], dateParts[1] -1,dateParts[0],timeParts[0], timeParts[1],0);
                value.datetime = dateObj;
            });
            //data normaliseren naar eigen dataformaat
            angular.forEach($scope.alleSportaWedstrijden, function(value,index){
                var id = value.number;
                var competitie = value.division;
                var datum = value.datetime;
                var cleanHome = value.team_home.replace(/<\/?[^>]+(>|$)/g, "");
                var home = cleanHome;
                var cleanAway = value.team_away.replace(/<\/?[^>]+(>|$)/g, "");
                var away = cleanAway;
                var cleanUitslag = value.result.replace(/<\/?[^>]+(>|$)/g, "");
                var uitslag = cleanUitslag;
                var locatie = value.location;
                //ploegen hernoemen
                if (competitie == '<span title=\"HEREN 3B\">H3B</span>' && home.includes('Osta Berchem 1')) {home = 'Osta Heren 2';}
                if (competitie == '<span title=\"HEREN 3B\">H3B</span>' && away.includes('Osta Berchem 1')) {away = 'Osta Heren 2';}
                if (competitie == '<span title=\"HEREN 4A\">H4A</span>' && home.includes('Osta Berchem 2')) {home = 'Osta Heren 3';}
                if (competitie == '<span title=\"HEREN 4A\">H4A</span>' && away.includes('Osta Berchem 2')) {away = 'Osta Heren 3';}
                if (competitie == '<span title=\"DAMES 4B\">D4B</span>' && home.includes('Osta Berchem 1')) {home = 'Osta Dames 3';}
                if (competitie == '<span title=\"DAMES 4B\">D4B</span>' && away.includes('Osta Berchem 1')) {away = 'Osta Dames 3';}
                if (competitie == '<span title=\"DAMES 5A\">D5A</span>' && home.includes('Osta Berchem 2')) {home = 'Osta Dames 4';}
                if (competitie == '<span title=\"DAMES 5A\">D5A</span>' && away.includes('Osta Berchem 2')) {away = 'Osta Dames 4';}
                if (competitie == '<span title=\"DAMES 5B\">D5B</span>' && home.includes('Osta Berchem 3')) {home = 'Osta Dames 5';}
                if (competitie == '<span title=\"DAMES 5B\">D5B</span>' && away.includes('Osta Berchem 3')) {away = 'Osta Dames 5';}
                //einde hernoemen ploegen
                //Sporthalcodes hernoemen
                if (locatie == 'BER2') {locatie = 'Sporthal Rooi 2 - Berchem'}
                if (locatie == 'CAP') {locatie = 'Capenberg, Borsbeeksesteenweg 45, Boechout'}
                if (locatie == 'DRAB') {locatie = 'Den Drab, Drabstraat 47, Mortsel'}
                if (locatie == 'KAT') {locatie = 'Kattenbroek, Kattenbroek 14, Edegem'}
                if (locatie == 'KON') {locatie = 'De Nachtegaal, Duffelsesteenweg, Kontich'}
                if (locatie == 'VOL') {locatie = 'Atheneum Ekeren, Pastoor de Vosstraat 19, Ekeren'}
                if (locatie == 'WIJN') {locatie = 'Sporthal Wijnegem, Kasteellei 67, Wijnegem'}
                if (locatie == 'ZEUR') {locatie = 'De Zeurt, Eksterdreef, Schoten'}
                if (locatie == 'WIL') {locatie = 'Den Willecom, Terelststraat 2, Edegem'}
                if (locatie == 'OCL2') {locatie = 'De Witte Merel, Liersesteenweg 25, Lint'}
                if (locatie == 'EHR') {locatie = 'Hemelrijk, Moerkantsebaan 32-34, Essen'}
                if (locatie == 'WOM') {locatie = 'Sportcomplex Brieleke, Brieleke, Wommelgem'}
                if (locatie == 'DBH') {locatie = 'Don Bosco, Schoonselhoflei, Hoboken'}
                if (locatie == 'SL') {locatie = 'Sporthal Luchtbal, Santiagostraat 2, Antwerpen'}
                if (locatie == 'BOR') {locatie = 'Sporthal Borgerhout, Plantin & Moretuslei, Borgerhout'}
                if (locatie == 'BB') {locatie = 'Ter Smisse, L. Van Regenmortellei 6, Borsbeek'}
                if (locatie == 'LOEN') {locatie = 'Sporthal Loenhout, Kerkblokstraat 16, Loenhout'}
                if (locatie == 'NIEL') {locatie = 'Gem. Sporthal Niel, J. Wauterslaan, Niel'}
                if (locatie == 'KAB') {locatie = 'Sporthal KAB, Brasschaatsesteenweg 35, Kalmthout'}
                if (locatie == 'LOO') {locatie = 'Het Loo, Antwerpsesteenweg 59, Broechem'}
                if (locatie == 'SIN') {locatie = 'Ter Beken, Hoek van de Dries en de Vleeshouwerstraat, Sinaai-Waas'}
                if (locatie == 'PLA') {locatie = 'De Plaon, Eksterstraat 100, Mechelen'}
                if (locatie == 'PUU') {locatie = 'De Kollebloem, Kloosterhof 1, Puurs'}
                if (locatie == 'VEN') {locatie = 'Sporthal Vennebos, Hoevedreef, Schilde'}
                //einde hernoemen sporthalcodes
                var matchObject = new makeMatch(id, datum, competitie, home, away, uitslag, locatie);
                if (matchObject.result == '') {matchObject.result = null;}
                styleUitslagen(matchObject);
                $scope.alleSportaWedstrijden2.push(matchObject);
            });
            //filteren per ploeg
            $scope.H2wedstrijden = $scope.alleSportaWedstrijden2.filter(function (n){
                if (n.division==='<span title=\"HEREN 3B\">H3B</span>' || n.division==='<span title=\"Heren Lager\">HL<\/span>' && (n.team_home.includes('Osta Berchem 1') || n.team_away.includes('Osta Berchem 1'))) {
                    return n;
                }
            });
            $scope.H3wedstrijden = $scope.alleSportaWedstrijden2.filter(function (n){
               if (n.division==='<span title=\"HEREN 4A\">H4A</span>' || n.division==='<span title=\"Heren Lager\">HL<\/span>' && (n.team_home.includes('Osta Berchem 2') || n.team_away.includes('Osta Berchem 2'))) {
                    return n;
                }
            });
            $scope.D3wedstrijden = $scope.alleSportaWedstrijden2.filter(function (n){
               if (n.division==='<span title=\"DAMES 4B\">D4B</span>' || n.division==='<span title=\"Dames Lager\">DL<\/span>' && (n.team_home.includes('Osta Berchem 1') || n.team_away.includes('Osta Berchem 1'))) {
                    return n;
                }
            });
            $scope.D4wedstrijden = $scope.alleSportaWedstrijden2.filter(function (n){
                if (n.division==='<span title=\"DAMES 5A\">D5A</span>' || n.division==='<span title=\"Dames Lager\">DL<\/span>' && (n.team_home.includes('Osta Berchem 2') || n.team_away.includes('Osta Berchem 2'))) {
                    return n;
                }
            });
            $scope.D5wedstrijden = $scope.alleSportaWedstrijden2.filter(function (n){
                if (n.division==='<span title=\"DAMES 5B\">D5B</span>' || n.division==='<span title=\"Dames Lager\">DL<\/span>' && (n.team_home.includes('Osta Berchem 3') || n.team_away.includes('Osta Berchem 3'))) {
                    return n;
                }
            });
            $scope.ready2 = true;
            console.log('process Sporta klaar');
            joinData();
        }
        
        //Vcal files maken voor de Sporta-ploegen
        function makeVcalFiles() {
            for (i=0; i < $scope.H2wedstrijden.length; i++) {
                let wedstrijd = $scope.H2wedstrijden[i].team_home + ' - ' + $scope.H2wedstrijden[i].team_away;
                let desc = '';
                let loc = $scope.H2wedstrijden[i].location;
                let begin = $scope.H2wedstrijden[i].datetime;
                let end = begin;
                h2cal.addEvent(wedstrijd, desc, loc, begin, end);
            }
            for (i=0; i < $scope.H3wedstrijden.length; i++) {
                let wedstrijd = $scope.H3wedstrijden[i].team_home + ' - ' + $scope.H3wedstrijden[i].team_away;
                let desc = '';
                let loc = $scope.H3wedstrijden[i].location;
                let begin = $scope.H3wedstrijden[i].datetime;
                let end = begin;
                h3cal.addEvent(wedstrijd, desc, loc, begin, end);
            }
            for (i=0; i < $scope.D3wedstrijden.length; i++) {
                let wedstrijd = $scope.D3wedstrijden[i].team_home + ' - ' + $scope.D3wedstrijden[i].team_away;
                let desc = '';
                let loc = $scope.D3wedstrijden[i].location;
                let begin = $scope.D3wedstrijden[i].datetime;
                let end = begin;
                d3cal.addEvent(wedstrijd, desc, loc, begin, end);
            }
            for (i=0; i < $scope.D4wedstrijden.length; i++) {
                let wedstrijd = $scope.D4wedstrijden[i].team_home + ' - ' + $scope.D4wedstrijden[i].team_away;
                let desc = '';
                let loc = $scope.D4wedstrijden[i].location;
                let begin = $scope.D4wedstrijden[i].datetime;
                let end = begin;
                d4cal.addEvent(wedstrijd, desc, loc, begin, end);
            }
            for (i=0; i < $scope.D5wedstrijden.length; i++) {
                let wedstrijd = $scope.D5wedstrijden[i].team_home + ' - ' + $scope.D5wedstrijden[i].team_away;
                let desc = '';
                let loc = $scope.D5wedstrijden[i].location;
                let begin = $scope.D5wedstrijden[i].datetime;
                let end = begin;
                d5cal.addEvent(wedstrijd, desc, loc, begin, end);
            }
        }
        
        getAndProcessAll();
      });

    app.controller('RankingsController', function ($scope, $http, $rootScope){
        $scope.SportaCompetitiestanden = [];
        $scope.SportaH3B = [];
        $scope.SportaH4A = [];
        $scope.SportaD4B = [];
        $scope.SportaD5A = [];
        $scope.SportaD5B = [];
        $scope.H1GAstand = [];
        $scope.D2GABstand = [];
        $scope.D3GAstand = [];
        $scope.MU15stand = [];
        $scope.JU15stand = [];
        
        function getAllRankings(){
            let jsonfiles_stand = ["H1GA.json", "D2GAB.json", "D3GA.json", "MU15stand.json", "JU15stand.json"];
            
            function laadRankingFiles(bestand) {
                var xobj2 = new XMLHttpRequest();
                xobj2.overrideMimeType("application/json");
                xobj2.open('GET', webserverpad + bestand, true);
                xobj2.onreadystatechange = function () {
                    if (xobj2.readyState == 4 && xobj2.status == "200") {
                        let data = JSON.parse(xobj2.responseText);
                        if (bestand == "H1GA.json") {
                            $scope.H1GAstand = data;
                            $scope.H1GAstand.splice(0,1);
                        }
                        if (bestand == "D2GAB.json") {
                            $scope.D2GABstand = data;
                            $scope.D2GABstand.splice(0,1);
                        }
                        if (bestand == "D3GA.json") {
                            $scope.D3GAstand = data;
                            $scope.D3GAstand.splice(0,1);
                        }
                        if (bestand == "MU15stand.json") {
                            $scope.MU15stand = data;
                            $scope.MU15stand.splice(0,1);
                        }
                        if (bestand == "JU15stand.json") {
                            $scope.JU15stand = data;
                            $scope.JU15stand.splice(0,1);
                        }
                    }
                };
                xobj2.send(null);
            }
        
        for (i = 0; i < jsonfiles_stand.length; i++) {
            laadRankingFiles(jsonfiles_stand[i]);
            console.log('gewest rankings ophalen');
            }
        }
        
        console.log('sporta rankings ophalen gestart');
        $http.get(webserverpad + "SportaCompetitiestandenProxy.php").then(function(data){
            processSportaData2(data);
        });
        
        function processSportaData2(res) {
            var data = res.data;
            var arr = [];
            for (var x in data) {arr.push(data[x]);};
            $scope.SportaCompetitiestanden = arr;
            //filteren per ploeg/competitie
            $scope.SportaH3B = $scope.SportaCompetitiestanden[11].standing;           
            $scope.SportaH4A = $scope.SportaCompetitiestanden[12].standing;
            $scope.SportaD4B = $scope.SportaCompetitiestanden[5].standing;
            $scope.SportaD5A = $scope.SportaCompetitiestanden[6].standing; 
            $scope.SportaD5B = $scope.SportaCompetitiestanden[7].standing;
        }
        getAllRankings();
    });
        
    app.filter('orderObjectBy', function() {
      return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
          filtered.push(item);
        });
        filtered.sort(function (a, b) {
          return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
      };
    });
    app.filter('trustAsHtml',['$sce', function($sce) {
        return function(text) {
          return $sce.trustAsHtml(text);
        };
    }]);
    app.filter('recenteWedstrijden', function() {
      return function(items) {
          let recentvoorbij = moment().subtract(3, 'd');
          let nabijtoekomst = moment().add(7, 'd');
          return items.filter(function(item){
              return moment(item.datetime).isBetween(recentvoorbij, nabijtoekomst);
          })
      };
    });


// Functie om Volleyscores.be vcal-data om te zetten naar json | ter referentie - niet meer in gebruik
//var reeksen = ['JU15', 'MU15', 'D2GA', 'D3GA', 'H1GA'];
//function parseVcalToJson(data){
//        var jcalData = ICAL.parse(data);
//        var comp = new ICAL.Component(jcalData);
//        var vevents = comp.getAllSubcomponents("vevent");
//        var gewestWedstrijdenJson = [];
//
//            for (i=0; i < vevents.length; i++) {
//                var event = new ICAL.Event(vevents[i]);
//                    var id = event.uid;
//                    var summary = event.summary;
//                    var matchday = event.startDate;
//                    var locatie = event.location.slice(0, -7);
//                    var datum = new Date(matchday);
//                    var wedstrijd = summary.split(": ").pop().capitalize();
//                    var teams = wedstrijd.split(' - ');
//                    var home = teams[0];
//                    var away = teams[1];
//                    for (j=0; j < 6 ; j++){
//                        if (event.summary.indexOf(reeksen[j]) > -1)
//                        var competitie = reeksen[j];
//                        }
//                    var uitslag = '';
//                    //naar eigen json-object omzetten
//                    var matchObject = new makeMatch(id, datum, competitie, home, away, uitslag, locatie);
//                    gewestWedstrijdenJson.push(matchObject);
//            }
//        return gewestWedstrijdenJson;
//    }


//Acknowledgements
//This project uses:
//  ics.js - https://github.com/nwcell/ics.js -> to generate an ics file
//  php_xlsx_to_json - https://github.com/antonshell/php_xlsx_to_json
//  ical.js - https://github.com/mozilla-comm/ical.js/wiki -> to parse vcal/ical data to Json (no longer used)
//  Moment - https://momentjs.com/ -> to parse, edit and create date objects
//  Angular - https://angularjs.org/ -> to render all the data in tables
//  an endless list of answers by various StackOverflow heroes