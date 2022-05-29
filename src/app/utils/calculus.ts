import { Matrix3 } from "../model/matrix3";
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

    static module(x: number): number {
        return x > 0 ? x : -x;
    }

    static rotationMatrix(yaw: number, pitch: number, roll: number): Matrix3 {
        return {
            aa: Math.cos(pitch) * Math.cos(roll),
            ab: Math.sin(yaw) * Math.sin(pitch) * Math.cos(roll - Math.cos(yaw) * Math.sin(roll)),
            ac: Math.cos(yaw) * Math.sin(pitch) * Math.cos(roll) + Math.sin(yaw) * Math.sin(roll),

            ba: Math.cos(pitch) * Math.sin(roll),
            bb: Math.sin(yaw) * Math.sin(pitch) * Math.sin(roll) + Math.cos(yaw) * Math.cos(roll),
            bc: Math.cos(yaw) * Math.sin(pitch) * Math.sin(roll) - Math.sin(yaw) * Math.cos(roll),

            ca: 0 - Math.sin(pitch),
            cb: Math.sin(yaw) * Math.cos(pitch),
            cc: Math.cos(yaw) * Math.cos(pitch)
        } as Matrix3
    }

    static taitBryanRotationMatrix(yaw: number, pitch: number, roll: number): Matrix3 {
        return {
            aa: Math.cos(pitch) * Math.cos(roll),
            ab: -Math.cos(pitch) * Math.sin(roll),
            ac: Math.sin(pitch),

            ba: Math.cos(yaw) * Math.sin(roll) + Math.cos(roll) * Math.sin(yaw) * Math.sin(pitch),
            bb: Math.cos(yaw) * Math.cos(roll) - Math.sin(yaw) * Math.sin(pitch) * Math.sin(roll),
            bc: -Math.cos(pitch) * Math.sin(yaw),

            ca: Math.sin(yaw) * Math.sin(roll) - Math.cos(yaw) * Math.cos(roll) * Math.sin(pitch),
            cb: Math.cos(roll) * Math.sin(yaw) + Math.cos(yaw) * Math.sin(pitch) * Math.sin(roll),
            cc: Math.cos(yaw) * Math.cos(pitch)
        } as Matrix3;
    }

    static matrix3Transpose(m: Matrix3): Matrix3 {
        return {
            aa: m.aa,
            ab: m.ba,
            ac: m.ca,

            ba: m.ab,
            bb: m.bb,
            bc: m.cb,

            ca: m.ac,
            cb: m.bc,
            cc: m.cc,
        } as Matrix3

    }

    static vectorXMatrix3(v: Vector, m: Matrix3): Vector {
        v.x = (m.aa + m.ba + m.ca) * v.x
        v.y = (m.ab + m.bb + m.cb) * v.y
        v.z = (m.ac + m.bc + m.cc) * v.z
        return v as Vector;
    }

    static matrix3XVector(v: Vector, m: Matrix3): Vector {
        v.x = m.aa * v.x + m.ab * v.y + m.ac * v.z
        v.y = m.ba * v.x + m.bb * v.y + m.bc * v.z
        v.z = m.ca * v.x + m.cb * v.y + m.cc * v.z
        return v as Vector;
    }
}