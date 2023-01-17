import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit } from '@angular/core';
import { appConstants } from 'src/app/constants/app-constants';
import * as PIXI from 'pixi.js';
import { Playground as Playground } from './classes/playground';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Background } from './classes/background';
import { Snake } from './classes/snake';
import { Apple } from './classes/apple';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private app: PIXI.Application | any;
  private playgrounds: Playground[] = [];

  constructor(
    private elementRef: ElementRef, 
    private ngZone: NgZone,
    private changeDetectionRef: ChangeDetectorRef
  ) { }

  private canvasSize = 500;
  private size = 15;

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.app = new PIXI.Application({
        width: this.canvasSize,
        height: this.canvasSize
      });

      this.playgrounds.push(new Background(this.canvasSize,this.size));
      this.playgrounds.push(new Apple(this.canvasSize,this.size));
      this.playgrounds.push(new Snake());
      this.initControls();
    });

    this.elementRef.nativeElement.appendChild(this.app.view);
  }

  initControls() {
    for (let i = 0; i < this.playgrounds.length; i++) {
      const playground = this.playgrounds[i];
      debugger;
      this.app.stage.addChild(playground);
      this.app.ticker.add((e:any) => {
        playground.update(e);
      });
    }

    fromEvent(document, 'keydown')
      .pipe(tap((e: any) => {
        for (let i = 0; i < this.playgrounds.length; i++) {
          const playground = this.playgrounds[i];
          playground.onKeydown(e);
        }
      })).subscribe();

    fromEvent(document, 'keyup')
      .pipe(tap((e: any) => {
        for (let i = 0; i < this.playgrounds.length; i++) {
          const playground = this.playgrounds[i];
          playground.onKeyup(e);
        }
      })).subscribe();
  }
}
