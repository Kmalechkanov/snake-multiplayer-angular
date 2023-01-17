import { Apple } from "./apple";
import { Playground } from "./playground";

export class FoodManager extends Playground {
    private apples: Apple[];
    
    // will move it ot const
    private color = 0x22ff22;
    constructor(size: number, cubesPerLine: number) {
        super();
        this.apples = [];
    }

    addApple(){
        // this.apples.push(new Apple(,))
    }
}