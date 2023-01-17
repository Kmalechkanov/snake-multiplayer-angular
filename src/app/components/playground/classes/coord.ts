import * as PIXI from 'pixi.js';
import { appConstants } from 'src/app/constants/app-constants';

export class Coord {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}