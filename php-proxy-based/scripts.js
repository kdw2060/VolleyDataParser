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
function makeMatch(dt, comp, wed, rslt, loc) {
    this.datum = dt;
    this.competitie = comp;
    this.wedstrijd = wed;
    this.uitslag = rslt;
    this.locatie = loc;
}

// Volleyscores.be data omzetten naar Json
var reeksen = ['JU15', 'MU15', 'MU17', 'D2GA', 'D3GA', 'H1GA'];
function parseVcalToJson(data){
        var jcalData = ICAL.parse(data);
        var comp = new ICAL.Component(jcalData);
        var vevents = comp.getAllSubcomponents("vevent");
        var gewestWedstrijdenJson = [];

            for (i=0; i < vevents.length; i++) {
                var event = new ICAL.Event(vevents[i]);
                    var summary = event.summary;
                    var matchday = event.startDate;
                    var locatie = event.location;
                    //lelijke vcaldata leesbaar maken
                    var datum = new Date(matchday);
                    var wedstrijd = summary.split(": ").pop().capitalize();
                    for (j=0; j < 6 ; j++){
                        if (event.summary.indexOf(reeksen[j]) > -1)
                        var competitie = reeksen[j];
                        }
                    var uitslag = '';
                    //naar eigen json-object omzetten
                    var matchObject = new makeMatch(datum, competitie, wedstrijd, uitslag, locatie);
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
        $scope.MU17wedstrijden = [];
        $scope.JU15wedstrijden = [];
        $scope.alleGewestWedstrijden = [];
        $scope.alleSportaWedstrijden = [];
        $scope.alleWedstrijden = [];
        
        $http.get(webserverpad + "GewestAlleTeamkalendersProxy.php").success(function (res) {
            var wedstrijdenJson = parseVcalToJson(res);
            $scope.alleGewestWedstrijden = wedstrijdenJson;
            
            var H1GAwedstrijden = wedstrijdenJson.filter(function (n, i){
                return n.competitie==='H1GA';});
            $scope.H1wedstrijden = H1GAwedstrijden;
            
            var D2GAwedstrijden = wedstrijdenJson.filter(function (n, i){
                return n.competitie==='D2GA';});
            $scope.D1wedstrijden = D2GAwedstrijden;
            
            var D3GAwedstrijden = wedstrijdenJson.filter(function (n, i){
                return n.competitie==='D3GA';});
            $scope.D2wedstrijden = D3GAwedstrijden;
            
            var MU15wedstrijden = wedstrijdenJson.filter(function (n, i){
                return n.competitie==='MU15';});
            $scope.MU15wedstrijden = MU15wedstrijden;
            
            var MU17wedstrijden = wedstrijdenJson.filter(function (n, i){
                return n.competitie==='MU17';});
            $scope.MU17wedstrijden = MU17wedstrijden;
            
            var JU15wedstrijden = wedstrijdenJson.filter(function (n, i){
                return n.competitie==='JU15';});
            $scope.JU15wedstrijden = JU15wedstrijden;
        });
    
        $http.get(webserverpad + "SportaAlleTeamkalendersProxy.php").success(function (res) {
            $scope.alleSportaWedstrijden = res;
                angular.forEach($scope.alleSportaWedstrijden, function(value,index){
                var dateParts = value.date.split("/");
                var timeParts = value.time.split(":");
                var dateObj = new Date(dateParts[2], dateParts[1] -1,dateParts[0],timeParts[0], timeParts[1],0);
                value.datetime = dateObj;
            })
        });
        $http.get(webserverpad + "H2proxy.php").success(function (res) {
            $scope.H2wedstrijden = res;
            angular.forEach($scope.H2wedstrijden, function(value,index){
                var dateParts = value.date.split("/");
                var timeParts = value.time.split(":");
                var dateObj = new Date(dateParts[2], dateParts[1] -1,dateParts[0],timeParts[0], timeParts[1],0);
                value.datetime = dateObj;
            })
        });
        $http.get(webserverpad + "H3proxy.php").success(function (res) {
            $scope.H3wedstrijden = res;
            angular.forEach($scope.H3wedstrijden, function(value,index){
                var dateParts = value.date.split("/");
                var timeParts = value.time.split(":");
                var dateObj = new Date(dateParts[2], dateParts[1] -1,dateParts[0],timeParts[0], timeParts[1],0);
                value.datetime = dateObj;
            })
        });
        $http.get(webserverpad + "D3proxy.php").success(function (res) {
            $scope.D3wedstrijden = res;
            angular.forEach($scope.D3wedstrijden, function(value,index){
                var dateParts = value.date.split("/");
                var timeParts = value.time.split(":");
                var dateObj = new Date(dateParts[2], dateParts[1] -1,dateParts[0],timeParts[0], timeParts[1],0);
                value.datetime = dateObj;
            })
        });
        $http.get(webserverpad + "D4proxy.php").success(function (res) {
            $scope.D4wedstrijden = res;
            angular.forEach($scope.D4wedstrijden, function(value,index){
                var dateParts = value.date.split("/");
                var timeParts = value.time.split(":");
                var dateObj = new Date(dateParts[2], dateParts[1] -1,dateParts[0],timeParts[0], timeParts[1],0);
                value.datetime = dateObj;
            })
        });
        $http.get(webserverpad + "D5proxy.php").success(function (res) {
            $scope.D5wedstrijden = res;
            angular.forEach($scope.D5wedstrijden, function(value,index){
                var dateParts = value.date.split("/");
                var timeParts = value.time.split(":");
                var dateObj = new Date(dateParts[2], dateParts[1] -1,dateParts[0],timeParts[0], timeParts[1],0);
                value.datetime = dateObj;
            })
        });
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