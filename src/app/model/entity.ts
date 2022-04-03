import { Vector } from "./vector"

export class Entity {
    mass: number;
    position: Vector;
    speed: Vector;
    diameter: number;
    name: string;
    uuid: string;
    // later some things like composition

    // do you need constructors in data-driven development?
}