import { Component } from '@angular/core';
import { appConstants } from 'src/app/constants/app-constants';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent {
    title = appConstants.title;
}
