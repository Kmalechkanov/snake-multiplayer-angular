import { Direction } from "./directions-constants";
import { Playground } from "./playground";
import { SnakeTile } from "./snakeTile";
import { HashTable } from "./IHashTable";

export class Snake extends Playground {
	private lastUnix: number = 0;
  private threshold: number = 100;

	private directionMap: HashTable<Direction> = {};

	constructor() {
		super();
		this.directionMap[Direction.Left] = Direction.Left;
    this.directionMap[Direction.Right] = Direction.Right;
    this.directionMap[Direction.Top] = Direction.Top;
    this.directionMap[Direction.Bottom] = Direction.Bottom;

		for (let i = 0; i < 5; i++) {
      this.addChild(new SnakeTile(i, 0, this.children[Math.max(0, i - 1)] as SnakeTile)); 
    }
	}

	override update(delta: number) {
		var currentUnix = performance.now();
    var canResetUnix = false;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i] as SnakeTile;
      canResetUnix = currentUnix - this.lastUnix >= this.threshold;
      if (canResetUnix) {
        child.update();
      }
    }
    if (canResetUnix) {
      this.lastUnix = performance.now();
    }
	}

	override onKeydown(e: KeyboardEvent) {
		var direction = this.directionMap[e.keyCode];
    if (direction === undefined) {
      return;
    }

    var head = this.children[this.children.length - 1] as SnakeTile;
    head.changeDirection(direction);
	}
}