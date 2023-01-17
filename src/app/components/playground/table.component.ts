import { Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import * as PIXI from 'pixi.js';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Direction } from './classes/directions-constants';
import { SocketService } from 'src/app/services/socket.service';
import { Apple } from './classes/apple';
import { appConstants } from 'src/app/constants/app-constants';
import { Snake } from './classes/snake';
import { Coord } from './classes/coord';
import { HashTable } from './classes/IHashTable';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  private app!: PIXI.Application;
  private directionMap: HashTable<Direction> = {};
  private direction: Direction = Direction.Right;

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private socket: SocketService,
    private renderer: Renderer2
  ) { }

  private apples: Apple[] = [];
  private snakes: Snake[] = [];

  joined: boolean = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.app = new PIXI.Application({
        width: appConstants.canvasSize,
        height: appConstants.canvasSize
      });

      this.initBackground();
      this.initDirections();
      this.initControls();

      this.initButtonHandlers();

      this.loadGame();
    });

    this.renderer.appendChild(document.getElementById('canvasDiv'), this.app.view);
  }

  ngOnDestroy(): void {
    if (this.joined) {
      this.disconnectGame();
    }

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  joinGame(): void {
    this.joined = true;
    //todo check that destoy behavior
    this.destroy$.next(false);

    this.socket.emitJoinGame();
    let bufferedDirection = Direction.Right;

    this.socket.onTick().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (bufferedDirection !== this.direction) {
        this.socket.emitControl(this.direction);
        bufferedDirection = this.direction;
      }
    });
  }

  disconnectGame(): void {
    this.saveToSession();
    this.socket.emitDisconnectGame();

    this.direction = Direction.Right;
    this.joined = false;
    this.destroy$.next(true);

    let gamesPlayed = localStorage.getItem('gamesPlayed') || 0;
    localStorage.setItem('gamesPlayed', (Number(gamesPlayed) + 1).toString());
  }

  saveToSession(): void {
    let maxLength = localStorage.getItem('maxLength') || 0;
    let totalLength = localStorage.getItem('totalLength') || 0;
    let totalApples = localStorage.getItem('totalApples') || 0;

    //this is not the right snake
    if (maxLength > 0) {
      maxLength = 0;
      localStorage.setItem('maxLength', maxLength.toString());
    }
    localStorage.setItem('totalLength', totalLength.toString());
    localStorage.setItem('totalApples', totalApples.toString());
  }

  resetGame(): void {
    this.socket.emitResetGame();
  }

  loadGame(): void {
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

    this.initAppleHandlers();
    this.initSnakeHandlers();
  }

  initBackground(): void {
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

  initSnakeHandlers(): void {
    this.socket.emitGetSnakes();
    this.socket.onGetSnakes().subscribe((data: any) => {
      this.drawSnakes(data);
    });
  }

  initButtonHandlers(): void {
    this.socket.onJoinGame().subscribe((data: any) => {
      this.drawSnakes(data);
    });

    this.socket.onDisconnectGame().subscribe((id: string) => {
      this.removeSnake(id);
    });

    this.socket.onResetGame().subscribe(() => {
      this.apples.forEach(apple => {
        this.removeApple({ x: apple.x, y: apple.y });
      });
      this.snakes.forEach(snake => {
        this.removeSnake(snake.id);
      });

      this.direction = Direction.Right;
      this.joined = false;
      this.destroy$.next(true);

      let resetedGames = localStorage.getItem('resetedGames') || 0;
      localStorage.setItem('resetedGames', (Number(resetedGames) + 1).toString());
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
  }): void {
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
      let snake = new Snake(this.app.stage, playerId, coords, data.controls[playerId].processed, this.randomColor());
      this.snakes.push(snake);
    }
  }

  removeSnake(playerId: string): void {
    let snakeIndex = this.snakes.findIndex(s => s.id === playerId);
    this.snakes[snakeIndex].tail.forEach(tile => {
      this.app.stage.removeChild(tile.graphic);
    });
    this.snakes.splice(snakeIndex, 1);
  }

  initAppleHandlers(): void {
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
      this.removeApple(removeApple);
    });
  }

  removeApple(coord: Coord): void {
    let appleIndex = this.apples.findIndex(apple => apple.x === coord.x && apple.y === coord.y);
    if (appleIndex !== -1) {
      this.app.stage.removeChild(this.apples[appleIndex].graphic);
      this.apples.splice(appleIndex, 1);
    }
  }

  initDirections(): void {
    this.directionMap[Direction.Left] = Direction.Left;
    this.directionMap[Direction.Right] = Direction.Right;
    this.directionMap[Direction.Top] = Direction.Top;
    this.directionMap[Direction.Bottom] = Direction.Bottom;
  }

  randomColor(): number {
    return parseInt(Math.floor(Math.random() * 16777215).toString(16), 16);
  }

  initControls(): void {
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

  triggerControl(direction: Direction): void {
    this.direction = direction;
  }
}
