import { Vector } from "./vector"

export class Entity {
    mass: number;
    position: Vector;
    speed: Vector;
    diameter: number;
    density: number;
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

            this.updateDiameter();
    }
    
    // later some things like composition

    move(): void {
        this.position.x += this.force.x / this.mass;
        this.position.y += this.force.y / this.mass;
        this.position.z += this.force.z / this.mass;
        this.force = {x: 0, y: 0, z: 0} as Vector;
    }

    updateSpeed(): void {
        this.speed.x += this.force.x / this.mass;
        this.speed.y += this.force.y / this.mass;
        this.speed.z += this.force.z / this.mass;
    }

    updateDiameter(): void {
        // diameter depends on mass and density

    }

    // do you need constructors in data-driven development?
}