import { Vector } from "../model/vector";

export class Calculus {
    static cartesianDistance(vector1: Vector, vector2: Vector): number {
        return Math.sqrt(
            Math.pow(this.module(vector1.x) + this.module(vector2.x), 2) +
            Math.pow(this.module(vector1.y) + this.module(vector2.y), 2))
    }

    static module(x: number): number {
        return x > 0 ? x : -x;
    }
}