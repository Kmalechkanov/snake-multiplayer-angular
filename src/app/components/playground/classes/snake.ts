import * as PIXI from 'pixi.js';
import { appConstants } from 'src/app/constants/app-constants';
import { Direction } from '../../game/classes/directions-constants';
import { Coord } from './coord';
import { Tile } from './tile';

export class Snake {
    id: string;
    tail: Array<Tile>;
    direction: Direction;

    private growTimes: number;
    private stage: PIXI.Container<PIXI.DisplayObject>;
    private color: number;

    constructor(stage: PIXI.Container<PIXI.DisplayObject>, id: string, tail: Coord[], direction: Direction, color: number = 0xffff22) {
        this.stage = stage;
        this.id = id;
        this.growTimes = 0;
        this.color = color;
        this.direction = direction;
        this.tail = [];
        tail.forEach(tile => {
            let tileObj = new Tile(tile, this.color);
            this.tail.push(tileObj);
            this.stage.addChild(tileObj.graphic);
        });
    }

    grow(): void {
        this.growTimes++;
    }

    move(direction?: Direction): void {
        if (direction) {
            this.direction = direction;
        }

        let headCoord = this.tail[this.tail.length - 1].coord;
        let newHeadCoord = new Coord(headCoord.x, headCoord.y);
        switch (this.direction) {
            case Direction.Top:
                newHeadCoord.y = newHeadCoord.y - 1 < 0 ? appConstants.cubesCount - 1 : newHeadCoord.y - 1;
                break;
            case Direction.Bottom:
                newHeadCoord.y = newHeadCoord.y + 1 > appConstants.cubesCount - 1 ? 0 : newHeadCoord.y + 1;
                break;
            case Direction.Left:
                newHeadCoord.x = newHeadCoord.x - 1 < 0 ? appConstants.cubesCount - 1 : newHeadCoord.x - 1;
                break;
            case Direction.Right:
                newHeadCoord.x = newHeadCoord.x + 1 > appConstants.cubesCount - 1 ? 0 : newHeadCoord.x + 1;
                break;
        }

        let newHead = new Tile(newHeadCoord, this.color);
        this.tail.push(newHead);
        this.stage.addChild(newHead.graphic);
        if (this.growTimes) {
            console.log('growing')
            --this.growTimes;
        } else {
            this.stage.removeChild(this.tail.shift()!.graphic);
        }
    }
}