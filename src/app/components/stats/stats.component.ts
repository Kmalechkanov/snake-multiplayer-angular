import { Component } from '@angular/core';
import { appConstants } from 'src/app/constants/app-constants';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
    title = appConstants.title;
}
