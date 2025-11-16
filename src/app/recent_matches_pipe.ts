import { Pipe, PipeTransform } from '@angular/core';
import { Match } from './match.model';

@Pipe({
  name: 'recentMatches',
  standalone: true
})
export class RecentMatchesPipe implements PipeTransform {
  transform(items: Match[] | null): Match[] {
    if (!items) {
        return [];
    }

    const now = new Date();
    const threeDaysAgo = new Date().setDate(now.getDate() - 2);
    const fiveDaysHence = new Date().setDate(now.getDate() + 5);

    return items.filter(item => {
      const itemDate = new Date(item.datetime).getTime();
      return itemDate > threeDaysAgo && itemDate < fiveDaysHence;
    });
  }
}
