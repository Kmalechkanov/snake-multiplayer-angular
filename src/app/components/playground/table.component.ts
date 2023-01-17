import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HashTable } from '../game/classes/IHashTable';
import { Direction } from './classes/directions-constants';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  private app: PIXI.Application | any;
  private directionMap: HashTable<Direction> = {};
  private direction: Direction = Direction.Right;
  private data: any;

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private changeDetectionRef: ChangeDetectorRef,
    private socket: SocketService
  ) { }

  private canvasSize = 500;
  private size = 15;

  joined: boolean = false;

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.app = new PIXI.Application({
        width: this.canvasSize,
        height: this.canvasSize
      });

      this.initBackground();
      this.initDirections();
      this.initControls();

      this.connectToGame();
    });

    this.elementRef.nativeElement.appendChild(this.app.view);
  }

  joinGame() {
    console.log('joined')
    this.joined = true;
    this.socket.emitJoinGame();

    this.socket.onTick().subscribe(() => {
      this.socket.emitControl(this.direction);
    });
  }

  connectToGame() {
    this.socket.onTick().subscribe(data => {
      if(!Object.keys(data.positions).length) {
        return;
      }
      for (const [playerId, position] of Object.entries<any>(data.positions)) {
        this.drawHead(position.x, position.y);
        console.log('drawing head')
      }
      this.data = data;
    });
  }

  drawHead(posX: number, posY: number) {
    const head = new PIXI.Graphics();
    var width = this.canvasSize / this.size;
    head.beginFill(0xffffff);
    head.drawRect(posX * width, posY * width, width, width);
    head.endFill();

    this.app.stage.addChild(head);
  }

  initBackground() {
    const background = new PIXI.Graphics();
    background.beginFill(0x22ffff);
    var width = this.canvasSize / this.size;
    for (let i = 0; i < this.size; i++) {
      background.drawRect(0, i * width, this.canvasSize, 1);
      background.drawRect(i * width, 0, 1, this.canvasSize);
    }
    background.endFill();

    this.app.stage.addChild(background);
  }

  initDirections() {
    this.directionMap[Direction.Left] = Direction.Left;
    this.directionMap[Direction.Right] = Direction.Right;
    this.directionMap[Direction.Top] = Direction.Top;
    this.directionMap[Direction.Bottom] = Direction.Bottom;
  }

  initControls() {
    fromEvent(document, 'keydown')
      .pipe(tap((e: any) => {
        var direction = this.directionMap[e.keyCode];
        if (direction === undefined) {
          return;
        }

        this.direction = direction;
        console.log('direction', direction)
      })).subscribe();

    fromEvent(document, 'keyup')
      .pipe(tap((e: any) => {

      })).subscribe();
  }
}
