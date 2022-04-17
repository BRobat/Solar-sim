export class Vector {
    x: number;
    y: number;
    z: number;

    length(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    add(x: number): void {
        this.x += x;
        this.y += x;
        this.z += x;
    }

}