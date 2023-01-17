import * as PIXI from 'pixi.js';
import { appConstants } from 'src/app/constants/app-constants';
import { Coord } from './coord';

export class Tile {
    coord: Coord;
    graphic: PIXI.Graphics;

    private color: number;
    constructor(coord: Coord, color: number = 0x22ff22) {
        this.coord = coord;
        this.color = color;
        this.graphic = new PIXI.Graphics();

        var width = appConstants.cubeWidth;
        // this.graphic.zIndex = 1;
        this.graphic.beginFill(this.color);
        this.graphic.drawRect(0, 0, width, width);
        this.graphic.endFill();
        this.graphic.position.set(coord.x * width, coord.y * width);
    }
}