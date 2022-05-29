import { Vector } from "../model/vector";

export class Calculus {

    static vectorLength(v1: Vector): number {
        return Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2) + Math.pow(v1.z, 2));
    }

    static cartesianDistance(vector1: Vector, vector2: Vector): number {
        return Math.sqrt(
            Math.pow(vector1.x - vector2.x, 2) +
            Math.pow(vector1.y - vector2.y, 2) +
            Math.pow(vector1.z - vector2.z, 2))
    }

    static vectorDistance(v1: Vector, v2: Vector): Vector {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y,
            z: v1.z - v2.z
        } as Vector
    }

    static superposition(v1: Vector, v2: Vector): Vector {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y,
            z: v1.z + v2.z
        } as Vector
    }

    static antySuperposition(v1: Vector, v2: Vector): Vector {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y,
            z: v1.z - v2.z
        } as Vector
    }

    static MultiplyVectorXScalar(v: Vector, s: number): Vector {
        return {
            x: v.x * s,
            y: v.y * s,
            z: v.z * s
        } as Vector
    }

    static module(x: number): number {
        return x > 0 ? x : -x;
    }
}