import { Calculus } from "../utils/calculus";
import { CollisionDetection } from "../utils/collisionDetection";
import { HashUtils } from "../utils/hashUtils";
import { Physics } from "../utils/physics";
import { Entity } from "./entity";
import { Vector } from "./vector";

export class Data {
    entities: Entity[];
    hashList: Map<Vector, number[]>;

    time: number;

    constructor() {
        this.time = 0;
    }

    calculateNextFrame(): void {
        this.calculateForces();
        this.moveEntities();
        this.hashEntities();
        this.collideEntities();
        this.postCollisionEffects();
    }

    addEntity(newEntity: Entity): void {
        this.entities.push(newEntity);
    }

    hashEntities(): void {
        this.hashList.clear();
        HashUtils.hashEntities(this, 1e10);
    }

    calculateForces(): void {
        // distinguish smaller objects later
        this.entities.forEach((e1: Entity) => {
            let forceSuperposition = { x: 0, y: 0, z: 0 } as Vector;
            this.entities.forEach((e2: Entity) => {
                forceSuperposition = Calculus.superposition(forceSuperposition, Physics.calculateAttractiveForce(e1, e2));
            })
            e1.force = forceSuperposition;
            e1.updateSpeed();
        })
    }

    moveEntities(): void {
        this.entities.forEach((entity: Entity) => {
            entity.move();
        })
    }

    collideEntities(): void {
        // checks collisions and applies merges
        this.entities.forEach((e1: Entity) => {
            const eHash = HashUtils.getEntityHash(e1,1e10)
            const allHashes = HashUtils.getNearHashes(eHash).concat([eHash]);
            const indexes = [];
            const toDestroyIndexes = []
            allHashes.forEach((hashKey: Vector) => {
                const hash = this.hashList.get(hashKey);
                indexes.concat(hash);
            })
            indexes.forEach((i: number) => {
                const newEntity = CollisionDetection.checkCollision(e1, this.entities[i])
                if (newEntity) {
                    e1 = {...newEntity} as Entity;
                    toDestroyIndexes.push(i);
                }
            })
            toDestroyIndexes.forEach((i: number) => {
                this.entities.splice(i,1);
            })
        })

    }

    postCollisionEffects(): void {

    }

    // later to add some functions


}