import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit } from '@angular/core';
import * as PIXI from 'pixi.js';
import { fromEvent } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { HashTable } from '../game/classes/IHashTable';
import { Direction } from './classes/directions-constants';
import { SocketService } from 'src/app/services/socket.service';
import { Apple } from './classes/apple';
import { appConstants } from 'src/app/constants/app-constants';
import { Snake } from './classes/snake';
import { Coord } from './classes/coord';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  private app!: PIXI.Application;
  private directionMap: HashTable<Direction> = {};
  private direction: Direction = Direction.Right;

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private changeDetectionRef: ChangeDetectorRef,
    private socket: SocketService
  ) { }

  private apples: Apple[] = [];
  private snakes: Snake[] = [];

  joined: boolean = false;

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.app = new PIXI.Application({
        width: appConstants.canvasSize,
        height: appConstants.canvasSize
      });

      this.initBackground();
      this.initDirections();
      this.initControls();

      this.loadGame();
    });

    this.elementRef.nativeElement.appendChild(this.app.view);
  }

  joinGame() {
    this.joined = true;
    this.socket.emitJoinGame();
    let bufferedDirection = Direction.Right;

    this.socket.onTick().subscribe((data) => {
      if (bufferedDirection !== this.direction) {
        this.socket.emitControl(this.direction);
        bufferedDirection = this.direction;
      }
    });
  }

  loadGame() {
    this.socket.onTick().subscribe(data => {
      if (data.controls) {
        this.handleControls(data.controls);
      }
      if (data.grows) {
        this.handleGrowths(data.grows);
      }

      this.snakes.forEach(snake => {
        snake.move();
      });
    });

    this.socket.onJoinGame().subscribe((data: any) => {
      console.log(data)
      this.drawSnakes(data);
    });

    this.initAppleHandlers();
    this.initSnakeHandlers();
  }

  initBackground() {
    const background = new PIXI.Graphics();
    background.beginFill(0x22ffff);
    var width = appConstants.cubeWidth;
    for (let i = 0; i < appConstants.cubesCount; i++) {
      background.drawRect(0, i * width, appConstants.canvasSize, 1);
      background.drawRect(i * width, 0, 1, appConstants.canvasSize);
    }
    background.endFill();

    this.app.stage.addChild(background);

  }

  initSnakeHandlers() {
    this.socket.emitGetSnakes();
    this.socket.onGetSnakes().subscribe((data: any) => {
      this.drawSnakes(data);
    });
  }

  handleControls(controls: any): void {
    for (const [playerId, control] of Object.entries<{ processed: Direction, buffer: Direction }>(controls)) {
      let snake = this.snakes.find(s => s.id === playerId);
      if (snake && snake.direction !== control.processed) {
        snake.direction = control.processed;
      }
    }
  }

  handleGrowths(growths: any): void {
    if (!growths) {
      return;
    }

    for (const [playerId, times] of Object.entries<number>(growths)) {
      let snake = this.snakes.find(s => s.id === playerId);
      if (snake && times > 0) {
        snake.grow();
      }
    }
  }

  drawSnakes(data: {
    tails: {
      [key: string]: { x: number, y: number }[]
    },
    heads: {
      [key: string]: { x: number, y: number }
    },
    controls: {
      [key: string]: { processed: Direction, buffer: Direction }
    }
  }) {
    let tailsAndHeads: { [key: string]: { x: number, y: number }[] } = {};
    for (const [playerId, tails] of Object.entries<{ x: number, y: number }[]>(data.tails)) {
      if (!tailsAndHeads[playerId]) {
        tailsAndHeads[playerId] = [];
      }
      tails.forEach(tail => {
        tailsAndHeads[playerId].push(tail);
      });

      tailsAndHeads[playerId].push(data.heads[playerId]);
    }

    for (const [playerId, tails] of Object.entries<{ x: number, y: number }[]>(tailsAndHeads)) {
      let coords: Coord[] = [];
      tails.forEach(tile => {
        coords.push(new Coord(tile.x, tile.y));
      });
      let snake = new Snake(this.app.stage, playerId, coords, data.controls[playerId].processed);
      this.snakes.push(snake);
    }
  }

  initAppleHandlers() {
    this.socket.emitGetApples();
    this.socket.onGetApples().subscribe((apples: [{ x: number, y: number }]) => {
      apples.forEach(apple => {
        let newApple = new Apple(apple.x, apple.y);
        this.apples.push(newApple);
        this.app.stage.addChild(newApple.graphic);
      });
    });
    this.socket.onAddApple().subscribe((apple) => {
      let newApple = new Apple(apple.x, apple.y);
      this.apples.push(newApple);
      this.app.stage.addChild(newApple.graphic);
    });
    this.socket.onRemoveApple().subscribe((removeApple) => {
      let appleIndex = this.apples.findIndex(apple => apple.x === removeApple.x && apple.y === removeApple.y);
      if (appleIndex !== -1) {
        this.app.stage.removeChild(this.apples[appleIndex].graphic);
        this.apples.splice(appleIndex, 1);
      }
    });
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
      })).subscribe();

    fromEvent(document, 'keyup')
      .pipe(tap((e: any) => {

      })).subscribe();
  }
}
