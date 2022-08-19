import { Vector } from "./vector";

export class Camera {

    position: Vector;
    direction: Vector;
    angleOfView: number;
    phi: number;
    theta: number;
    dist: number;

    constructor(position: Vector) {
        this.position = position;
        this.direction = { x: 0, y: 0, z: 0 } as Vector;
        this.angleOfView = Math.PI / 3;
        this.phi = Math.PI / 2;
        this.theta = 0;
        this.dist = 1000;
    }

    rotatePhi(x: number): void {
        if (x > 0) {
            this.phi += x / 1000;
            if (this.phi >= Math.PI) {
                this.phi = Math.PI - 0.01;
            }
        } else if (x < 0) {
            this.phi += x / 1000;
            if (this.phi <= 0) {
                this.phi = 0.01;
            }
        }
    }

    rotateTheta(x: number): void {
        if (x > 0) {
            this.theta += x / 1000;
            if (this.theta >= Math.PI * 2) {
                this.theta = 0;
            }
        } else if (x < 0) {
            this.theta += x / 1000;
            if (this.theta <= 0) {
                this.theta = Math.PI * 2;
            }
        }
    }

    zoom(x): void {
        this.dist += x;
        if (this.dist > 10000) {
            this.dist = 10000;
        }
        if (this.dist < 100) {
            this.dist = 100;
        }
    }
}