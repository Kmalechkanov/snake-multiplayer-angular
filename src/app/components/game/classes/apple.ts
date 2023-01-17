import { Playground } from "./playground";

export class Apple extends Playground {
    tileX: number;
    tileY: number;

    // will move it ot const
    private color = 0x22ff22;
    constructor(size: number, cubesPerLine: number) {
        super();
        const canvasCubeSize=size/cubesPerLine;

        this.tileX = this.getRandomInt(0, cubesPerLine);
        this.tileY = this.getRandomInt(0, cubesPerLine);

        this.beginFill(this.color);
        for (let i = 0; i < cubesPerLine; i++) {
            this.drawCircle(this.tileX * canvasCubeSize + canvasCubeSize/2, this.tileY * canvasCubeSize + canvasCubeSize/2, canvasCubeSize/2);
        }
        this.endFill();
    }

    private getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }
}