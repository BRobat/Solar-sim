import { Vector } from "./vector";
import { Calculus } from "../utils/calculus";

export class Camera {

    position: Vector;
    pivot: Vector;
    distanceFromPivot: number;
    angleOfView: number;
    yaw: number;
    pitch: number;
    roll: number;

    constructor(position: Vector) {
        this.position = position;
        this.distanceFromPivot = 1500;
        this.pivot = { x: 0, y: 0, z: 0 } as Vector;
        this.angleOfView = Math.PI / 3;
        this.yaw = 0
        this.pitch = 0
        this.roll = 0
    }

    updatePosition(): void {
        this.position = Calculus.matrix3XVector(
            { x: 0, y: 0, z: this.distanceFromPivot } as Vector,
            Calculus.taitBryanRotationMatrix(-this.yaw, -this.pitch, -this.roll)
        )

        this.position.x += this.pivot.x
        this.position.y += this.pivot.y
        this.position.z += this.pivot.z
        // this.position.x = (Math.sin(this.roll) + Math.sin(this.yaw) + Math.sin(this.pitch)) * (this.distanceFromPivot + this.pivot.x);
        // this.position.y = (Math.sin(this.roll) + Math.sin(this.yaw) + Math.sin(this.pitch)) * (this.distanceFromPivot + this.pivot.y);
        // this.position.z = (Math.cos(this.roll) + Math.sin(this.yaw) + Math.sin(this.pitch)) * (this.distanceFromPivot + this.pivot.z);
    }
}