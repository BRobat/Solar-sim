import { Camera } from "../../camera";
import { Entity } from "../../entity";
import { Vector } from "../../vector";

export class Disc {
    static drawDisc(e: Entity, camera: Camera): number[] {

        const pos = [];
        let noTriangles = e.mass / camera.dist;
        if (noTriangles < 4) {
            noTriangles = 4;
        } else if (noTriangles > 12) {
            noTriangles = 12;
        } else {
            noTriangles = Math.floor(noTriangles);
        }

        let points = []

        // create set of points from which [0] is a center
        for (let ii = 0; ii < noTriangles; ii++) {
            if (ii === 0) {
                points.push({ x: 0, y: 0, z: 0 } as Vector);
            } else {
                points.push(
                    {
                        x: e.diameter / 2 * Math.cos(Math.PI * 2 * ii / noTriangles),
                        y: -e.diameter / 2 * Math.sin(Math.PI * 2 * ii / noTriangles),
                        z: 0,
                    } as Vector);
            }
        }

        e.triangles = noTriangles;

        for (let ii = 0; ii < noTriangles; ii++) {

            if (ii < noTriangles - 2) {

                pos.push(
                    0,
                    0,
                    0,
                    0 + points[ii + 1].x,
                    0 + points[ii + 1].y,
                    0 + points[ii + 1].z,
                    0 + points[ii + 2].x,
                    0 + points[ii + 2].y,
                    0 + points[ii + 2].z
                );
            } else if (ii === noTriangles - 2) {
                pos.push(
                    0,
                    0,
                    0,
                    0 + points[ii + 1].x,
                    0 + points[ii + 1].y,
                    0 + points[ii + 1].z,
                    0 + points[1].x,
                    0 + points[1].y,
                    0 + points[1].z
                )
            } else {
                pos.push(
                    0,
                    0,
                    0,
                    0 + points[ii].x,
                    0 + points[ii].y,
                    0 + points[ii].z,
                    0 + points[1].x,
                    0 + points[1].y,
                    0 + points[1].z ,
                );
            }
        }

        return pos;

    }
}