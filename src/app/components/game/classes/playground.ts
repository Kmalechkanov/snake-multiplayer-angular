import * as PIXI from 'pixi.js';
import { Apple } from './apple';
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
}