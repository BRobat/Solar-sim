import { Calculus } from "../utils/calculus";
import { CollisionDetection } from "../utils/collisionDetection";
import { HashUtils } from "../utils/hashUtils";
import { Physics } from "../utils/physics";
import { DiscConfig } from "./configs/discConfig";
import { Entity } from "./entity";
import { Vector } from "./vector";

export class Data {
    entities: Entity[];
    hashList: Map<string, number[]>;

    time: number;
    dt: number;

    hashThreshold: number

    constructor() {
        this.time = 0;
        this.dt = 0.1;
        this.hashThreshold = 50;
    }

    calculateNextFrame(dt: number): void {
        this.dt = dt;
        this.calculateForces();
        this.moveEntities();
        this.hashEntities();
        this.collideEntities();
        this.postCollisionEffects();
    }

    addEntity(newEntity: Entity): void {
        if (!this.entities || this.entities.length === 0) {
            this.entities = [newEntity];
        } else {
            this.entities.push(newEntity);
        }
    }

    generateProtoDisk(discConfig: DiscConfig): void {

        this.clearEntities();
        this.time = 0;


        for (let i = 0; i < discConfig.noEntities; i++) {
            let theta = Math.PI / 2;
            if (!discConfig.isSphere) {
                theta = Math.random() * Math.PI;
            }
            const phi = Math.random() * Math.PI * 2;
            const r = Calculus.randomize(discConfig.radius / 5, discConfig.radius);

            const pos = {
                x: r * Math.cos(phi) * Math.sin(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(theta)
            } as Vector;

            const vel = {
                x: Math.cos(phi + Math.PI / 2) * discConfig.internalEnergy / Math.pow(r,2),
                y: Math.sin(phi + Math.PI / 2) * discConfig.internalEnergy / Math.pow(r,2),
                z: Math.cos(theta) * discConfig.internalEnergy / Math.pow(r,2)
            } as Vector;

            const mass = Calculus.randomize(discConfig.minMaxMass.lower, discConfig.minMaxMass.upper)

            this.addEntity(new Entity(mass, pos, vel, ''));

        }
        if (discConfig.centralEntity) {
            const mass = Calculus.randomize(discConfig.centralMinMaxMass.lower, discConfig.centralMinMaxMass.upper);
            this.addEntity(new Entity(mass, { x: 0, y: 0, z: 0 } as Vector, { x: 0, y: 0, z: 0 } as Vector, 'Star'));
        }
    }

    clearEntities(): void {
        this.entities = [];
    }

    hashEntities(): void {
        if (this.hashList) {
            this.hashList.clear();
        }
        HashUtils.hashEntities(this, this.hashThreshold);
    }

    calculateForces(): void {
        // distinguish smaller objects later
        if (!this.entities || this.entities.length === 0) {
            return;
        }
        this.entities.forEach((e1: Entity) => {
            let forceSuperposition = { x: 0, y: 0, z: 0 } as Vector;
            this.entities.forEach((e2: Entity) => {
                if (e1 != e2) {
                    forceSuperposition = Calculus.superposition(forceSuperposition, Physics.calculateAttractiveForce(e1, e2));
                }
            })
            e1.force = forceSuperposition;
            e1.updateSpeed(this.dt);
        })
    }

    moveEntities(): void {
        if (!this.entities || this.entities.length === 0) {
            return;
        }
        this.entities.forEach((entity: Entity) => {
            entity.move(this.dt);
        })
    }

    collideEntities(): void {
        // checks collisions and applies merges
        if (!this.entities || this.entities.length === 0) {
            return;
        }
        this.entities.forEach((e1: Entity, j) => {
            const eHash = HashUtils.getEntityHash(e1, this.hashThreshold)
            const allHashes = HashUtils.getNearHashes(eHash).concat([eHash]);
            let indexes = [];
            let toDestroyIndexes = []
            allHashes.forEach((hashKey: string) => {
                const hash = this.hashList.get(hashKey);
                if (hash && hash.length !== 0) {
                    indexes = indexes.concat(hash);
                }
            })
            indexes = [...new Set(indexes)]
            indexes.forEach((i: number) => {
                const newEntity = CollisionDetection.checkCollision(e1, this.entities[i])
                if (newEntity) {
                    e1.mass = newEntity.mass;
                    e1.position = newEntity.position;
                    e1.speed = newEntity.speed;
                    e1.diameter = newEntity.diameter;
                    this.entities.splice(i, 1);
                }
            })
        })

    }

    postCollisionEffects(): void {

    }

    // later to add some functions


}