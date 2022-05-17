export class Matrix3 {

    aa: number;
    ab: number;
    ac: number;
    ba: number;
    bb: number;
    bc: number;
    ca: number;
    cb: number;
    cc: number;

    det(): number {
        return this.aa * this.bb * this.cc +
            this.ab * this.bc * this.ca +
            this.ac * this.ba * this.cb -
            this.aa * this.bc * this.cb -
            this.ab * this.ba * this.cc -
            this.ac * this.bb * this.ca
    }
}
