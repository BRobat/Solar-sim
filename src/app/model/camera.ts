import { Vector } from "./vector";

export class Camera {

    position: Vector;
    direction: Vector;
    angleOfView: number;
    
    constructor(position: Vector) {
        this.position = position;
        this.direction = {x: 0, y: 0, z: 0} as Vector;
        this.angleOfView = Math.PI/3;
    }
}