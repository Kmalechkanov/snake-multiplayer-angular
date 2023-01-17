import * as PIXI from 'pixi.js';
import { appConstants } from 'src/app/constants/app-constants';

export class Apple {
    x: number;
    y: number;
    graphic: PIXI.Graphics;

    private color: number;
    constructor(x: number, y: number, color: number = 0x8b0000) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.graphic = new PIXI.Graphics();

        var width = appConstants.cubeWidth;
        this.graphic.beginFill(this.color);
        this.graphic.drawRect(0, 0, width, width);
        this.graphic.endFill();
        this.graphic.position.set(x * width, y * width);
    }
}