import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from './getData.service';
import { Match } from './match.model';
import { TeamMatchesPipe } from './team_matches_pipe';

@Component({
  selector: 'all-matches-widget',
  standalone: true,
  imports: [CommonModule, TeamMatchesPipe],
  templateUrl: './all-matches.component.html',
})
export class AllMatchesComponent implements OnInit {
  @Input() filter: string = '';

  matches$!: Observable<Match[]>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.matches$ = this.dataService.getAllData().pipe(
      map(data => data.matches.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()))
    );
  }
}