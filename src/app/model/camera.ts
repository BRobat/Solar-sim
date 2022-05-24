import { Vector } from "./vector";

export class Camera {

    position: Vector;
    direction: Vector;
    angleOfView: number;
    yaw: number;
    pitch: number;
    roll: number;
    
    constructor(position: Vector) {
        this.position = position;
        this.direction = {x: 0, y: 0, z: 0} as Vector;
        this.angleOfView = Math.PI/3;
        this.yaw = 0
        this.pitch = 0
        this.roll = 0
    }
}