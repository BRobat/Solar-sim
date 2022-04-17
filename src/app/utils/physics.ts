import { PhscsCnst } from "../consts/physicConsts";
import { Data } from "../model/data";
import { Entity } from "../model/entity";
import { Vector } from "../model/vector";
import { Calculus } from "./calculus";

export class Physics {
    static calculateAttractiveForce(e1: Entity, e2: Entity): Vector {
        const v = Calculus.vectorDistance(e1.position, e2.position);
        const d = v.length();
        const f = e1.mass * e2.mass * PhscsCnst.R / Math.pow(d, 2)
        return {
            x: -v.x * f,
            y: -v.y * f,
            z: -v.z * f
        } as Vector
    }

    static calculateInternalAttractiveForce(e1: Entity, e2: Entity): Vector {
        return;
    }

    static getMeanMass(en: Entity[]): number {
        let massSum = 0;
        en.forEach((e: Entity) => {
            massSum += e.mass;
        })
        return massSum / en.length;
    }

    static getMassCenter(en: Entity[]): Vector {
        let massSum = 0;
        let Ax = 0;
        let Ay = 0;
        let Az = 0;
        en.forEach((e: Entity) => {
            Ax += e.position.x * e.mass;
            Ay += e.position.x * e.mass;
            Az += e.position.x * e.mass;
            massSum += e.mass;
        })
        return { x: Ax / massSum, y: Ay / massSum, z: Az / massSum } as Vector;
    }

    static getMeanVelocity(en: Entity[]): Vector {
        let massSum = 0;
        let Ax = 0;
        let Ay = 0;
        let Az = 0;
        en.forEach((e: Entity) => {
            Ax += e.speed.x * e.mass;
            Ay += e.speed.x * e.mass;
            Az += e.speed.x * e.mass;
            massSum += e.mass;
        })
        return { x: Ax / massSum, y: Ay / massSum, z: Az / massSum } as Vector;
    }


}