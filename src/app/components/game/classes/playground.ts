import * as PIXI from 'pixi.js';
import { SnakeTile } from './snakeTile';

export abstract class Playground extends PIXI.Graphics {
  update(delta: number) {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i] as SnakeTile;
      child.update();
    }
  }

  onKeydown(e: KeyboardEvent) {

  }

  onKeyup(e: KeyboardEvent) {

  }

  lerp(start: number, end: number, amt: number) {
    return (1 - amt) * start + amt * end
  }
}