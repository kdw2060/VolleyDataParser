import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './getData.service';
import { Ranking, SportaRanking } from './ranking.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ranking-table-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking-table.component.html',
})
export class RankingTableComponent implements OnInit {
  // keys om arrays later op te filteren
  @Input('ranking-key') rankingKey!: string;
  @Input('highlight-team') highlightTeam?: string;

    gewestRanking = signal<Ranking[] | undefined>(undefined);
    sportaRanking = signal<SportaRanking[] | undefined>(undefined);
  
    // Loading state signal for better UX
    isLoading = signal<boolean>(true);

    // Determine the type once
    private isSportaTable: boolean = false;

  constructor(private dataService: DataService) {}

ngOnInit() {
  if (!this.rankingKey) {
      console.error("RankingTableComponent: 'ranking-key' attribute is missing!");
      this.isLoading.set(false);
      return;
    }
    this.isSportaTable = this.rankingKey.startsWith('Sporta');

    this.dataService.getAllData().pipe(
      map(data => {
        return data.rankings[this.rankingKey as keyof typeof data.rankings];
      })
    ).subscribe(specificRankingData => {
      setTimeout(() => {
      if (this.isSportaTable) {
        // Sort the data and set the sportaRanking signal
        const sortedData = (specificRankingData as SportaRanking[]).sort(
          (a, b) => a.place - b.place
        );
        this.sportaRanking.set(sortedData);
      } else {
        // Set the gewestRanking signal
        this.gewestRanking.set(specificRankingData as Ranking[]);
      }
      this.isLoading.set(false);
    }, 0);
  } );
  }

  isOstaTeam(ploeg: Ranking | SportaRanking): boolean {
    const teamName = ('name' in ploeg ? ploeg.name : ploeg.Ploeg) || '';
    // Check if the specific 'highlightTeam' input was provided.
    if (this.highlightTeam) {
      // If yes, check for an exact, case-insensitive match.
      return teamName.toLowerCase() === this.highlightTeam.toLowerCase();
    } else {
      // If no, fall back to the original general, case-insensitive check.
      return teamName.toLowerCase().includes('berchem');
    }
  }
}