import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, map } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Match } from './match.model';
import { Ranking, SportaRankingResponse } from './ranking.model';

const CACHE_KEY_DATA = 'teamData';
const CACHE_KEY_TIMESTAMP = 'teamDataTimestamp';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

const webserverpad = '../ploegdata/';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private http: HttpClient) {}

  public getAllData(): Observable<{ matches: Match[], rankings: any }> {
    const cachedTimestamp = localStorage.getItem(CACHE_KEY_TIMESTAMP);
    const cachedData = localStorage.getItem(CACHE_KEY_DATA);

    if (cachedData && cachedTimestamp && (Date.now() - parseInt(cachedTimestamp, 10)) < CACHE_DURATION_MS) {
      // Return cached data if it's fresh
      return of(JSON.parse(cachedData));
    }

    // Fetch new data
    return forkJoin({
      matches: this.fetchAndProcessMatches(),
      rankings: this.fetchAndProcessRankings()
    }).pipe(
      tap(data => {
        // Cache the new data and timestamp
        localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(data));
        localStorage.setItem(CACHE_KEY_TIMESTAMP, Date.now().toString());
      })
    );
  }

  private fetchAndProcessMatches(): Observable<Match[]> {
  const gewestFiles = ['heren1.json', 'dames_beker_gew.json', 'dames_beker_prov.json', 'dames1.json', 'dames2.json', 'dames5.json'];
  const gewestRequests = gewestFiles.map(file => this.http.get<any[]>(webserverpad + file));
  const sportaRequest = this.http.get<any>(webserverpad + "SportaAlleTeamkalendersProxy.php");

  return forkJoin({
    gewestData: forkJoin(gewestRequests),
    sportaData: sportaRequest
  }).pipe(
    map(({ gewestData, sportaData }) => {
      // 1. Combine all raw data into a single array
      const allRawMatches = [
        ...gewestData.flat(),
        ...Object.values(sportaData)
      ];

      // 2. Process the combined array with a single, intelligent .map()
      const allProcessedMatches = allRawMatches.map((rawMatch: any) => {
        let match: Match;

        // 3. Check for a unique property to distinguish the object type
        if (rawMatch.hasOwnProperty('Wedstrijdnr')) {
          // --- THIS IS GEWEST DATA ---
          const dateParts = rawMatch.Datum.split("/");
          const timeParts = (rawMatch.Uur || "00:00").split(":");
          const dateObj = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0], +timeParts[0], +timeParts[1]);
          
          match = {
            uid: rawMatch.Wedstrijdnr,
            datetime: dateObj.toISOString(),
            dateString: `${rawMatch.Datum} - ${rawMatch.Uur}`,
            division: rawMatch.Reeks,
            team_home: rawMatch.Thuis,
            team_away: rawMatch.Bezoekers,
            result: rawMatch.Uitslag || null,
            location: rawMatch.Sporthall,
            resultStatus: 'normal'
          };
          match = this.hernoemGewestPloegen(match);

        } else {
          // --- THIS IS SPORTA DATA ---
          if (!rawMatch.date || typeof rawMatch.date !== 'string' || rawMatch.date.trim() === '') {
            match = { 
              uid: rawMatch.number, 
              datetime: 'Datum onbekend',  
              dateString: 'Datum onbekend', 
              division: rawMatch.division, 
              team_home: rawMatch.team_home.replace(/<\/?[^>]+(>|$)/g, ""), 
              team_away: rawMatch.team_away.replace(/<\/?[^>]+(>|$)/g, ""), 
              result: null, 
              location: this.hernoemSporthal(rawMatch.location.code), 
              resultStatus: 'normal' 
            }
          } 
            else {
            const dateParts = rawMatch.date.split("/");
            const timeParts = (rawMatch.time || "00:00").split(":");
            const dateObj = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0], +timeParts[0], +timeParts[1]);
            
            match = {
              uid: rawMatch.number,
              datetime: dateObj.toISOString(),
              dateString: `${rawMatch.date} - ${rawMatch.time}`,
              division: rawMatch.division,
              team_home: rawMatch.team_home.replace(/<\/?[^>]+(>|$)/g, ""),
              team_away: rawMatch.team_away.replace(/<\/?[^>]+(>|$)/g, ""),
              result: rawMatch.result.replace(/<\/?[^>]+(>|$)/g, "") || null,
              location: this.hernoemSporthal(rawMatch.location.code),
              resultStatus: 'normal'
            };
            match = this.hernoemSportaPloegen(match);
          }
        }
        // Common processing for all matches
        return this.styleUitslagen(match);
      });
      return allProcessedMatches;
    })
  );
}
  

  private fetchAndProcessRankings(): Observable<any> {
    const gewestRankingFiles = ["AHP3A.json", "ADP3B.json", "ADP4A.json", "ADP5AA.json"];
    const gewestRankingRequests = gewestRankingFiles.map(file => 
        this.http.get<any[]>(webserverpad + file).pipe(map(data => data.slice(1))) // remove header row
    );

    const sportaRankingRequest = this.http.get<SportaRankingResponse>(webserverpad + "SportaCompetitiestandenProxy.php");

    return forkJoin({
        AHP3Astand: gewestRankingRequests[0],
        ADP3Bstand: gewestRankingRequests[1],
        ADP4Astand: gewestRankingRequests[2],
        ADP5AAstand: gewestRankingRequests[3], 
        sporta: sportaRankingRequest,
    }).pipe(
        map(rankings => {
           const sportaRankingsArray = Object.values(rankings.sporta);
           const finalRankings =
          {
            AHP3Astand: rankings.AHP3Astand,
            ADP3Bstand: rankings.ADP3Bstand,
            ADP4Astand: rankings.ADP4Astand,
            ADP5AAstand: rankings.ADP5AAstand,
            SportaH2:   Object.values(sportaRankingsArray[2]?.standing || {}),
            SportaH3A:  Object.values(sportaRankingsArray[3]?.standing || {}),
            SportaD3B:  Object.values(sportaRankingsArray[0]?.standing || {}),
            SportaD5:   Object.values(sportaRankingsArray[1]?.standing || {}),
        };
        return finalRankings;
        })
      );
  }

    private hernoemGewestPloegen(match: Match): Match {
      if (match.division.includes('Heren')) {
            match.division = 'AHP3A';
            if (match.team_home === 'Osta Berchem A') { match.team_home = 'Osta Heren 1'; }
            if (match.team_away === 'Osta Berchem A') { match.team_away = 'Osta Heren 1'; }
        }
      if (match.division.includes('Dames promo 3')) {
          match.division = 'ADP3B';
          if (match.team_home === 'Osta Berchem A') {match.team_home = 'Osta Dames 1'}
          if (match.team_away === 'Osta Berchem A') {match.team_away = 'Osta Dames 1'}
          }
      if (match.division.includes('Dames promo 4')) {
          match.division = 'ADP4A';
          if (match.team_home === 'OSTA BERCHEM B') {match.team_home = 'Osta Dames 2'}
          if (match.team_away === 'OSTA BERCHEM B') {match.team_away = 'Osta Dames 2'}
          }
      if (match.division.includes('Dames promo 5')) {
            match.division = 'ADP5AA';
            if (match.team_home === 'OSTA BERCHEM C') {match.team_home = 'Osta Dames 5'}
            if (match.team_away === 'OSTA BERCHEM C') {match.team_away = 'Osta Dames 5'}
            }
      if (match.division === 'Beker van het gewest Antwerpen Dames Provinciaal') {
          match.division = 'Beker Dames Prov.';
          if (match.team_home.includes('OSTA BERCHEM')) {match.team_home = 'Osta Dames 1'}
          if (match.team_away.includes('OSTA BERCHEM')) {match.team_away = 'Osta Dames 1'}
          }
      if (match.division === 'Beker van het gewest Antwerpen Dames Gewestelijk') {
          match.division = 'Beker Dames Gew.';
          if (match.team_home.includes('OSTA BERCHEM')) {match.team_home = 'Osta Dames 2'}
          if (match.team_away.includes('OSTA BERCHEM')) {match.team_away = 'Osta Dames 2'}
          }
        return match;
    }
    
    private hernoemSportaPloegen(match: Match): Match {
        if (match.division == 'H2' && match.team_home.includes('Osta Berchem 1')) { match.team_home = 'Osta Heren 2'; }
        if (match.division == 'H2' && match.team_away.includes('Osta Berchem 1')) { match.team_away = 'Osta Heren 2'; }
        if (match.division == 'H3B' && match.team_home.includes('Osta Berchem 2')) { match.team_home = 'Osta Heren 3'; }
        if (match.division == 'H3B' && match.team_away.includes('Osta Berchem 2')) { match.team_away = 'Osta Heren 3'; }
        if (match.team_home.includes('Osta Berchem 2 (H3B)')) { match.team_home = 'Osta Heren 3'; }
        if (match.team_away.includes('Osta Berchem 2 (H3B)')) { match.team_away = 'Osta Heren 3'; }
        if (match.division == 'D3B' && match.team_home.includes('Osta Berchem 1')) { match.team_home = 'Osta Dames 3'; }
        if (match.division == 'D3B' && match.team_away.includes('Osta Berchem 1')) { match.team_away = 'Osta Dames 3'; }
        if (match.division == 'D5' && match.team_home.includes('Osta Berchem 2')) { match.team_home = 'Osta Dames 4'; }
        if (match.division == 'D5' && match.team_away.includes('Osta Berchem 2')) { match.team_away = 'Osta Dames 4'; }
        if (match.division == 'D5' && match.team_home.includes('Osta Berchem 3')) { match.team_home = 'Osta Dames 6'; }
        if (match.division == 'D5' && match.team_away.includes('Osta Berchem 3')) { match.team_away = 'Osta Dames 6'; }
        if (match.team_home.includes('Osta Berchem 3 (D5)')) { match.team_home = 'Osta Dames 6'; }
        if (match.team_away.includes('Osta Berchem 3 (D5)')) { match.team_away = 'Osta Dames 6'; }
        if (match.division == 'D5' && match.team_home.includes('Osta Berchem 4')) { match.team_home = 'Osta Dames 7'; }
        if (match.division == 'D5' && match.team_away.includes('Osta Berchem 4')) { match.team_away = 'Osta Dames 7'; }
        
        return match;
    }

    private styleUitslagen(match: Match): Match {
        if (!match.result) return match;

        const uitslagParts = match.result.split(" - ");
        const thuisScore = parseInt(uitslagParts[0], 10);
        const uitScore = parseInt(uitslagParts[1], 10);

        const isThuisPloegOsta = match.team_home.includes('Osta');
        const isUitPloegOsta = match.team_away.includes('Osta');

        if (isThuisPloegOsta && !isUitPloegOsta && thuisScore > uitScore) {
            match.resultStatus = 'win';
        } else if (isUitPloegOsta && !isThuisPloegOsta && uitScore > thuisScore) {
            match.resultStatus = 'win';
        } else if (isThuisPloegOsta && !isUitPloegOsta && thuisScore < uitScore) {
            match.resultStatus = 'loss';
        } else if (isUitPloegOsta && !isThuisPloegOsta && uitScore < thuisScore) {
            match.resultStatus = 'loss';
        }
        return match;
    }

    private hernoemSporthal(code: string): string {
        const sporthalMap: { [key: string]: string } = {
            'BER2': 'Sporthal Rooi 2 - Berchem',
            'CAP': 'Capenberg, Borsbeeksesteenweg 45, Boechout',
            'DRAB': 'Den Drab, Drabstraat 47, Mortsel',
            'KAT': 'Kattenbroek, Kattenbroek 14, Edegem',
            'KON': 'De Nachtegaal, Duffelsesteenweg, Kontich',
            'VOL': 'Atheneum Ekeren, Pastoor de Vosstraat 19, Ekeren',
            'WIJN': 'Sporthal Wijnegem, Kasteellei 67, Wijnegem',
            'ZEUR': 'De Zeurt, Eksterdreef, Schoten',
            'WIL': 'Den Willecom, Terelststraat 2, Edegem',
            'OCL2': 'De Witte Merel, Liersesteenweg 25, Lint',
            'EHR': 'Hemelrijk, Moerkantsebaan 32-34, Essen',
            'WOM': 'Sportcomplex Brieleke, Brieleke, Wommelgem',
            'DBH': 'Don Bosco, Schoonselhoflei, Hoboken',
            'SL': 'Sporthal Luchtbal, Santiagostraat 2, Antwerpen',
            'BOR': 'Sporthal Borgerhout, Plantin & Moretuslei, Borgerhout',
            'BB': 'Ter Smisse, L. Van Regenmortellei 6, Borsbeek',
            'LOEN': 'Sporthal Loenhout, Kerkblokstraat 16, Loenhout',
            'MINI': 'Minisporthal Mortsel, Osylei 86, Mortsel',
            'NIEL': 'Gem. Sporthal Niel, J. Wauterslaan, Niel',
            'KAB': 'Sporthal KAB, Brasschaatsesteenweg 35, Kalmthout',
            'LOO': 'Het Loo, Antwerpsesteenweg 59, Broechem',
            'SIN': 'Ter Beken, Hoek van de Dries en de Vleeshouwerstraat, Sinaai-Waas',
            'PLA': 'De Plaon, Eksterstraat 100, Mechelen',
            'PUU': 'De Kollebloem, Kloosterhof 1, Puurs',
            'VEN': 'Sporthal Vennebos, Hoevedreef, Schilde',
            'GLSB': 'Gem. Lagere School, Lostraat 51, Broechem',
            'OCL1': 'De Witte Merel, Liersesteenweg 25, Lint',
            'SBR': 'Domein Breeven, Barelstraat 111, Bornem',
            'HEM': 'Gem. sporthal Hemiksem, Nieuwe Dreef 80, Hemiksem',
            'MEL': 'Sporthal Melsele, A. Rodenbachlaan 23, Melsele',
            'OCL': 'De Witte Merel, Liersesteenweg 25, Lint',
            'TAS': 'Sporthal Tassijns, Ropstraat, Haasdonk',
            'LIER': 'Sporthal De Komeet, Eeuwfeestlaan 183, Lier',
            'ZAND': 'Sporthal t Zand, Zandlaan 44, Nijlen',
            'GAB': 'Sint-Gabriel College, Lange Kroonstraat 72, Boechout',
            'GSZA': 'Gem. turnzaal, Schriekweg, 2240 Zandhoven',
            'MAR': 'Sportcentrum Mariënborgh, Doornstraat 65B, Edegem',
            'IHAM': 'Sporthal IHAM, Bautersemstraat 57, Mechelen',
            'VELD': 'Sportcomplex Het Veld, Schildebaan 22b, Zandhoven',
            'SGZL': 'Turnzaal lagere school, Zandstraat 16, Sint-Gillis-Waas',
            'MIS': 'Sportzaal "De Mispelaer", Gyselstraat 41, Nieuwkerken-Waas',
            'KRIE':  'Kriekeputte, Tuinwijkstraat, Kieldrecht',
            'DRO': 'Sporthal Rooienberg, Rooienberg 58, Duffel',
            'KEER': 'Gem. sporthal Keerbergen, Putsebaan 103, Keerbergen',
            'PEREL': 'Sporthal De Perel, Kallodam, Kallo',
            'ES': 'Sporthal Heuvelhal, Kapelstraat, Essen',
            'UA': 'Sporthal 3 Eiken, Universiteitsplein 1 (geb. P - Parking P3), Wilrijk',
            'KAP': 'Sporthal Kapellen, Christiaan Pallemansstraat 84, Kapellen'
        };
        return sporthalMap[code] || code;
    }
}