import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from './getData.service';
import { Match } from './match.model';
import { RecentMatchesPipe } from './recent_matches_pipe';

@Component({
  selector: 'recent-matches-widget',
  standalone: true,
  imports: [CommonModule, RecentMatchesPipe],
  templateUrl: './recent-matches.component.html',
})
export class RecentMatchesComponent implements OnInit {
  matches$!: Observable<Match[]>;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.matches$ = this.dataService.getAllData().pipe(
      map(data => data.matches.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()))
    );
  }
}