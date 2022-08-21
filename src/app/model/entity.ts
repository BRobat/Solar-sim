import { Vector } from "./vector"

export class Entity {
    mass: number;
    position: Vector;
    speed: Vector;
    diameter: number;
    density: number;
    triangles: number;
    name: string;
    force: Vector;
    uuid: string;


    isSmall: boolean;

    constructor(
        mass: number,
        position: Vector,
        speed: Vector,
        name: string,
    ) {
        this.mass = mass;
        this.position = position;
        this.speed = speed;
        this.name = name;
        this.triangles = 0;

        this.updateDiameter();
    }

    // later some things like composition

    move(dt: number): void {
        this.position.x += this.speed.x * dt;
        this.position.y += this.speed.y * dt;
        this.position.z += this.speed.z * dt;
    }
    
    updateSpeed(dt: number): void {
        this.speed.x += this.force.x / this.mass * dt;
        this.speed.y += this.force.y / this.mass * dt;
        this.speed.z += this.force.z / this.mass * dt;
        this.force = { x: 0, y: 0, z: 0 } as Vector;
    }

    updateDiameter(): void {
        // diameter depends on mass and density
        this.diameter = Math.cbrt(this.mass / Math.PI * 4 / 3)
    }

    // do you need constructors in data-driven development?
}