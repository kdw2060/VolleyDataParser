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