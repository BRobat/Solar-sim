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
    theta: number;
    phi: number;

    constructor(position: Vector) {
        this.position = position;
        this.distanceFromPivot = 1500;
        this.pivot = { x: 0, y: 0, z: 0 } as Vector;
        this.angleOfView = Math.PI / 3;
        this.yaw = 0;
        this.pitch = 0;
        this.roll = 0;
        this.theta = Math.PI / 2;
        this.phi = Math.PI / 2;
    }

    updatePosition(): void {
        // const vec = Calculus.matrix3XVector(
        //     { x: 0, y: 0, z: 1 } as Vector,
        //     (Calculus.rotationMatrix(-this.yaw, -this.pitch, -this.roll))
        // )

        if (this.theta > Math.PI) {
            this.theta = Math.PI
        }
        if (this.theta < 0) {
            this.theta = 0;
        }

        if (this.phi > Math.PI * 2) {
            this.phi = 0
        }
        if (this.phi < 0) {
            this.phi += Math.PI * 2
        }
        this.position.x = this.distanceFromPivot * Math.cos(this.phi) * Math.sin(this.theta) + this.pivot.x
        this.position.y = this.distanceFromPivot * Math.sin(this.phi) * Math.sin(this.theta) + this.pivot.y
        this.position.z = this.distanceFromPivot * Math.cos(this.theta) + this.pivot.z

        // this.yaw = -this.theta
        this.pitch = this.theta
        // this.yaw = -this.phi

    }
}