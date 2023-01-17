import { Direction } from "./directions-constants";
import { Playground } from "./playground";

export class SnakeTile extends Playground {
	public tileX: number;
	public tileY: number;
	public radius: number;

	private directionX: number = 1;
	private directionY: number = 0;

	private next: SnakeTile | undefined = void 0;

	constructor(x: number, y: number, prev: SnakeTile) {
		super();

		//temporary radius
		this.radius = 500/15/2;
		this.tileX = x;
		this.tileY = y;

		if (prev) {
			prev.next = this;
		}

		this.beginFill(0xccefef);
		this.drawCircle(0, 0, this.radius);
		this.endFill();

		var worldPosition = this.getWorldPosition();
		this.position.x = worldPosition.x;
		this.position.y = worldPosition.y;
	}

	override update() {
    if (!this.next) {
			//head
			this.tileX += this.directionX;
      this.tileY += this.directionY;
    } else {
			this.tileX = this.next.tileX;
      this.tileY = this.next.tileY;
    }

		var position = this.getWorldPosition();
    this.position.x = position.x;
    this.position.y = position.y;
  }

	getWorldPosition() {
		//should change that to be dynamic
		var tileSize = 500/15;
		return { x: (this.tileX * tileSize) + this.radius, y: (this.tileY * tileSize) + this.radius };
	}

	changeDirection(direction: Direction) {
		this.directionY = 0;
		this.directionX = 0;
		switch (direction) {
			case Direction.Top:
				this.directionY = -1;
				return;
			case Direction.Bottom:
				this.directionY = 1;
				return;
			case Direction.Left:
				this.directionX = -1;
				return;
			case Direction.Right:
				this.directionX = 1;
				return;
		}
	}
}