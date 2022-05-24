import { Matrix3 } from "./matrix3";

export class Vector {
    x: number;
    y: number;
    z: number;

    length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    addValue(x: number): void {
        this.x += x;
        this.y += x;
        this.z += x;
    }

    multiplyByMatrix3(m: Matrix3) {
        this.x = (m.aa + m.ba + m.ca) * this.x
        this.y = (m.ab + m.bb + m.cb) * this.y
        this.z = (m.ac + m.bc + m.cc) * this.z
    }

}