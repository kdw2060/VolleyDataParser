export interface Ranking {
    Ploeg: string;
    '# Wed': number;
    "Gew. 3-0/3-1": number;
    "Gew. 3-2":  number          
    "Verl. 3-0": number;
    "Verl. 3-2": number;
    "Gew. sets": number;
    "Verl. set": number;
    Forfaits: number;
    Ptn: number;
    [key: string]: any;
}

export interface SportaRanking {
    place: number;
    name: string;
    wins: number;
    loss: number;
    matches: number;
    points: number;
    forfait: number;
    score: number;  
    counterscore: number;
    custom_results: {
      '3/0': number;
      '3/1': number;
      '3/2': number;
      '2/3': number;
      '1/3': number;
      '0/3': number;
    };
}

export interface SportaRankingResponse {
    [key: string]: {
        division: string;
        standing: {[key: string]: SportaRanking};
    };
}