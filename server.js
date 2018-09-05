//Import and config libraries
var express = require('express');
var bodyparser = require('body-parser');
var http = require('http');
var request = require('request');
var app = express();
app.use(express.static('client'));
var port = normalizePort(process.env.PORT || '3002');
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
var ICAL = require('ical.js');
const icalGenerator = require('ical-generator');

//Globale variabelen
var sportaWedstrijden
var sportaRankings;
var gewestWedstrijdenVcal;
var gewestWedstrijdenJson = [];
// ter referentie: de structuur van het json object
//    {
//        uid: '',
//        datum: '',
//        competitie: '',
//        wedstrijd: '',
//        uitslag: '',
//        locatie: ''
//    }
var JU15wedstrijden;
var MU15wedstrijden;
var MU17wedstrijden;
var D2GAwedstrijden;
var D3GAwedstrijden;
var H1GAwedstrijden;
var D3wedstrijden;
var D4wedstrijden;
var D5wedstrijden;
var H2wedstrijden;
var H3wedstrijden;
var gewestRankings;
var reeksen = ['JU15', 'MU15', 'MU17', 'D2GA', 'D3GA', 'H1GA'];


//Helper functies
String.prototype.capitalize = function(){
        return this.toLowerCase().replace( /\b\w/g, function (m) {
            return m.toUpperCase();
        });
    };
function makeMatch(uid, dt, comp, wed, rslt, loc) {
    this.uid = uid;
    this.datum = dt;
    this.competitie = comp;
    this.wedstrijd = wed;
    this.uitslag = rslt;
    this.locatie = loc;
}

function maakIcalFeed(datum, uur, home, away){
    icalGenerator({
        domain:'ostaberchem.be',
        events: [
            {
                start: '' ,
                end: '' ,
                timestamp: '',
                summary: home +' - ' + away,
                organizer: 'Osta Berchem'
            }
        ]
    }).toString();
    return;
}

//Data verkrijgen, parsen en aanbieden aan client pagina's
request.get('https://mijnbeheer.sportafederatie.be/competities/publiek/rangschikking/1/json?type=league', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        sportaRankings = body;
    }
});

//ter referentie: D3 = 284, D4 = 296, D5 = 306, H2 = 351, H3 = 362
request.get('https://mijnbeheer.sportafederatie.be/competities/publiek/schema/4/json?organisation=1684', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        sportaWedstrijden = body;
    }
});

request.get('https://mijnbeheer.sportafederatie.be/competities/publiek/schema/4/json?organisation=1684&team=284', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        D3wedstrijden = body;
    }
});
request.get('https://mijnbeheer.sportafederatie.be/competities/publiek/schema/4/json?organisation=1684&team=296', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        D4wedstrijden = body;
    }
});
request.get('https://mijnbeheer.sportafederatie.be/competities/publiek/schema/4/json?organisation=1684&team=306', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        D5wedstrijden = body;
    }
});
request.get('https://mijnbeheer.sportafederatie.be/competities/publiek/schema/4/json?organisation=1684&team=351', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        H2wedstrijden = body;
//        TODO: feedgenerator afwerken
//        var icalFeed = maakIcalFeed('15/09/2018', '20:30', 'Heren 2', 'Vojaka');
//        console.log(icalFeed);
    }
});
request.get('https://mijnbeheer.sportafederatie.be/competities/publiek/schema/4/json?organisation=1684&team=362', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        H3wedstrijden = body;
    }
});

request.get('http://www.volleyscores.be/calendar/club/11306', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        gewestWedstrijdenVcal = body;     
        var jcalData = ICAL.parse(gewestWedstrijdenVcal);
        var comp = new ICAL.Component(jcalData);
        var vevents = comp.getAllSubcomponents("vevent");
        
        for (i=0; i < vevents.length; i++) {
            var event = new ICAL.Event(vevents[i]);
                var id = event.uid;
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
                var matchObject = new makeMatch(id, datum, competitie, wedstrijd, uitslag, locatie);
                gewestWedstrijdenJson.push(matchObject); 
        }
        JU15wedstrijden = gewestWedstrijdenJson.filter(function (n, i){
            return n.competitie==='JU15';
        });
        MU15wedstrijden = gewestWedstrijdenJson.filter(function (n, i){
            return n.competitie==='MU15';
        });
        MU17wedstrijden = gewestWedstrijdenJson.filter(function (n, i){
            return n.competitie==='MU17';
        });
        D2GAwedstrijden = gewestWedstrijdenJson.filter(function (n, i){
            return n.competitie==='D2GA';
        });
        D3GAwedstrijden = gewestWedstrijdenJson.filter(function (n, i){
            return n.competitie==='D3GA';
        });
        H1GAwedstrijden = gewestWedstrijdenJson.filter(function (n, i){
            return n.competitie==='H1GA';
        });
    }
});


app.get('/api/sportaRankings', function (req, res) {
  res.status(200).json(sportaRankings);
});
app.get('/api/sportaWedstrijden', function (req, res) {
  res.status(200).json(sportaWedstrijden);
});
app.get('/api/D3Wedstrijden', function (req, res) {
  res.status(200).json(D3wedstrijden);
});
app.get('/api/D4Wedstrijden', function (req, res) {
  res.status(200).json(D4wedstrijden);
});
app.get('/api/D5Wedstrijden', function (req, res) {
  res.status(200).json(D5wedstrijden);
});
app.get('/api/H2Wedstrijden', function (req, res) {
  res.status(200).json(H2wedstrijden);
});
app.get('/api/H3Wedstrijden', function (req, res) {
  res.status(200).json(H3wedstrijden);
});
app.get('/api/gewestWedstrijden', function (req, res) {
  res.status(200).json(gewestWedstrijdenJson);
});
app.get('/api/gewestWedstrijdenJU15', function (req, res) {
  res.status(200).json(JU15wedstrijden);
});
app.get('/api/gewestWedstrijdenMU15', function (req, res) {
  res.status(200).json(MU15wedstrijden);
});
app.get('/api/gewestWedstrijdenMU17', function (req, res) {
  res.status(200).json(MU17wedstrijden);
});
app.get('/api/gewestWedstrijdenD2GA', function (req, res) {
  res.status(200).json(D2GAwedstrijden);
});
app.get('/api/gewestWedstrijdenD3GA', function (req, res) {
  res.status(200).json(D3GAwedstrijden);
});
app.get('/api/gewestWedstrijdenH1GA', function (req, res) {
  res.status(200).json(H1GAwedstrijden);
});

app.use(bodyparser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.listen(port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}