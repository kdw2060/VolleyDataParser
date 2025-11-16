import { Pipe, PipeTransform } from '@angular/core';
import { Match } from './match.model';

@Pipe({
  name: 'teamMatches',
  standalone: true
})
export class TeamMatchesPipe implements PipeTransform {
  transform(items: Match[] | null, teamName: string): Match[] {
    if (!items || !teamName) {
        return [];
    }

    return items.filter(item => {
      // Return true if the team name is found in either the home or away team properties.
      // We use '|| '' to prevent errors if team_home or team_away is ever null.
      const homeTeam = item.team_home || '';
      const awayTeam = item.team_away || '';
      
      return homeTeam.includes(teamName) || awayTeam.includes(teamName);
    });
  }
}
