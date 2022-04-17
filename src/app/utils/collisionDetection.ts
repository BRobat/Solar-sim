import { Entity } from "../model/entity";
import { Calculus } from "./calculus";
import { Physics } from "./physics";

export class CollisionDetection {
    static checkCollision(e1: Entity, e2: Entity): Entity {
        const dist = Calculus.cartesianDistance(e1.position, e2.position);
        if (dist <= e1.diameter + e2.diameter) {
            // return entity that'a a superposition of entities
            return new Entity(
                e1.mass + e2.mass,
                Physics.getMassCenter([e1,e2]),
                Physics.getMeanVelocity([e1,e2]),
                'planet'
            )
        }
        return null
    }
}