import { Entity } from "./entity";

export class Data {
    entities: Entity[];
    time: number;

    constructor() {
        this.time = 0;
    }

    addEntity(newEntity: Entity): void {
        this.entities.push(newEntity);
    }

    // later to add some functions


}