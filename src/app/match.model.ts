export interface Match {
  uid: string;
  datetime: string; // Storing as ISO string for easier sorting and date manipulation
  dateString: string;
  division: string;
  team_home: string;
  team_away: string;
  result: string | null;
  location: string;
  resultStatus: 'win' | 'loss' | 'normal'; // Used for styling
}

/** Chronological order. Matches with an unparseable datetime sort last. */
export function compareMatchesByDate(a: Match, b: Match): number {
  const aTime = Date.parse(a.datetime);
  const bTime = Date.parse(b.datetime);
  const aInvalid = Number.isNaN(aTime);
  const bInvalid = Number.isNaN(bTime);
  if (aInvalid && bInvalid) return 0;
  if (aInvalid) return 1;
  if (bInvalid) return -1;
  return aTime - bTime;
}