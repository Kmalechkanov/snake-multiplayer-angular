import { Component } from '@angular/core';
import { appConstants } from 'src/app/constants/app-constants';

@Component({
  selector: 'app-header',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    title = appConstants.title;
}
