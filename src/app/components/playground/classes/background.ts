import { Playground } from "./playground";

export class Background extends Playground {
	constructor(size: number, cubesPerLine: number) {
		super();

		this.beginFill(0x22ffff);
		var width = size / cubesPerLine;
		for (let i = 0; i < cubesPerLine; i++) {
			this.drawRect(0, i * width, size, 1);
			this.drawRect(i * width, 0, 1, size);
		}
		this.endFill();
	}
}