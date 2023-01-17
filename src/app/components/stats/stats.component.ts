import { Component, OnInit } from '@angular/core';
import { appConstants } from 'src/app/constants/app-constants';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  title = appConstants.title;
  maxLength: number = 0;
  totalLength: number = 0;
  totalApples: number = 0;
  gamesPlayed: number = 0;
  resetedGames: number = 0;

  ngOnInit(): void {
    this.maxLength = Number(localStorage.getItem('maxLength'));
    this.totalLength = Number(localStorage.getItem('totalLength'));
    this.totalApples = Number(localStorage.getItem('totalApples'));
    this.gamesPlayed = Number(localStorage.getItem('gamesPlayed'));
    this.resetedGames = Number(localStorage.getItem('resetedGames'));
  }
}
