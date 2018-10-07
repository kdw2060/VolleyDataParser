// Globale variabelen
//var webserverpad = "/ploegdata/"; 
//pas bovenstaande waarde aan naar de map waar je op je webserver de bestanden geupload hebt en comment de volgende regel uit
var webserverpad = "";

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

// Functie om Volleyscores.be vcal-data om te zetten naar json
var reeksen = ['JU15', 'MU15', 'D2GA', 'D3GA', 'H1GA'];
function parseVcalToJson(data){
        var jcalData = ICAL.parse(data);
        var comp = new ICAL.Component(jcalData);
        var vevents = comp.getAllSubcomponents("vevent");
        var gewestWedstrijdenJson = [];

            for (i=0; i < vevents.length; i++) {
                var event = new ICAL.Event(vevents[i]);
                    var id = event.uid;
                    var summary = event.summary;
                    var matchday = event.startDate;
                    var locatie = event.location.slice(0, -7);
                    var datum = new Date(matchday);
                    var wedstrijd = summary.split(": ").pop().capitalize();
                    var teams = wedstrijd.split(' - ');
                    var home = teams[0];
                    var away = teams[1];
                    for (j=0; j < 6 ; j++){
                        if (event.summary.indexOf(reeksen[j]) > -1)
                        var competitie = reeksen[j];
                        }
                    var uitslag = '';
                    //naar eigen json-object omzetten
                    var matchObject = new makeMatch(id, datum, competitie, home, away, uitslag, locatie);
                    gewestWedstrijdenJson.push(matchObject);
            }
        return gewestWedstrijdenJson;
    }

// Angular functies
    var app = angular.module("app", []);

    app.controller('MainController', function ($scope, $http) {
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
        $scope.ready1;
        $scope.ready2;
        
        function getAndProcessAll() {
            console.log('getAll functie gestart');   
            getGewestData();
            getSportaData();
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
        }
        
        function getGewestData(){
            //Data gewest-ploegen ophalen
            console.log('gewest ophalen gestart');
            $http.get(webserverpad + "GewestAlleTeamkalendersProxy.php").then(function(data){
                processGewestData(data);
            });
        }
        
        function processGewestData(res) {
            //vcaldata parsen
            var wedstrijdenJson = parseVcalToJson(res.data);            
            //ploegen hernoemen
            wedstrijdenJson = wedstrijdenJson.filter(function (n){
                if (n.division === 'H1GA') {
                    if (n.team_home === 'Osta Berchem') {n.team_home = 'Osta Heren 1'}
                    if (n.team_away === 'Osta Berchem') {n.team_away = 'Osta Heren 1'}
                }
                if (n.division === 'D2GA') {
                    if (n.team_home === 'Osta Berchem A') {n.team_home = 'Osta Dames 1'}
                    if (n.team_away === 'Osta Berchem A') {n.team_away = 'Osta Dames 1'}
                }
                if (n.division === 'D3GA') {
                    if (n.team_home === 'Osta Berchem B') {n.team_home = 'Osta Dames 2'}
                    if (n.team_away === 'Osta Berchem B') {n.team_away = 'Osta Dames 2'}
                }
                if (n.division === 'MU15') {
                    if (n.team_home === 'Osta Berchem') {n.team_home = 'Osta Meisjes U15'}
                    if (n.team_away === 'Osta Berchem') {n.team_away = 'Osta Meisjes U15'}
                }
                if (n.division === 'JU15') {
                    if (n.team_home === 'Osta Berchem (Bc)') {n.team_home = 'Osta Jongens U15'}
                    if (n.team_away === 'Osta Berchem (Bc)') {n.team_away = 'Osta Jongens U15'}
                }
                return n;
            })
            //einde hernoemen
            $scope.alleGewestWedstrijden = wedstrijdenJson;
            //filteren per ploeg
            $scope.H1wedstrijden = wedstrijdenJson.filter(function (n){
                return n.division==='H1GA';});
            $scope.D1wedstrijden = wedstrijdenJson.filter(function (n){
                return n.division==='D2GA';});
            $scope.D2wedstrijden = wedstrijdenJson.filter(function (n){
                return n.division==='D3GA';});
            $scope.MU15wedstrijden = wedstrijdenJson.filter(function (n){
                return n.division==='MU15';});
            $scope.JU15wedstrijden = wedstrijdenJson.filter(function (n){
                return n.division==='JU15';});
            $scope.ready1 = true;            
            console.log('process Gewest klaar');
            joinData();
        }
        
        function getSportaData(){
            //Data sporta-ploegen ophalen
            console.log('sporta ophalen gestart');
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
            
        getAndProcessAll();

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


// TODO: ergens iets maken om winnaar vet te zetten
//        var uitslagParts = uitslag.split(" - ");
//        var part1 = uitslagParts[0];
//        var part2 = uitslagParts[1];
//        if (part1 > part2) {
//             jQuery('#hometeam').addClass('vet');
//              }
//        else {jQuery('#awayteam').addClass('vet');}
