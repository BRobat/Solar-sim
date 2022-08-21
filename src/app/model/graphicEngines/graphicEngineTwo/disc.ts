import { Camera } from "../../camera";
import { Entity } from "../../entity";
import { Vector } from "../../vector";

export class Disc {
    static drawDisc(e: Entity, camera: Camera): number[] {

        const pos = [];
        let noTriangles = e.diameter;
        if (noTriangles < 6) {
            noTriangles = 6;
        } else if (noTriangles > 24) {
            noTriangles = 24;
        } else {
            noTriangles = Math.floor(noTriangles);
        }

        let points = []

        // create set of points from which [0] is a center
        for (let ii = 0; ii < noTriangles; ii++) {

            points.push(
                {
                    x: e.diameter * Math.cos(Math.PI * 2 * ii / noTriangles),
                    y: -e.diameter * Math.sin(Math.PI * 2 * ii / noTriangles),
                    z: 0,
                } as Vector);

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
                    0,
                    0 + points[ii + 2].x,
                    0 + points[ii + 2].y,
                    0
                );
            } else if (ii === noTriangles - 2) {
                pos.push(
                    0,
                    0,
                    0,
                    0 + points[ii + 1].x,
                    0 + points[ii + 1].y,
                    0,
                    0 + points[1].x,
                    0 + points[1].y,
                    0
                )
            } else {
                pos.push(
                    0,
                    0,
                    0,
                    0 + points[ii].x,
                    0 + points[ii].y,
                    0,
                    0 + points[1].x,
                    0 + points[1].y,
                    0  ,
                );
            }
        }

        return pos;

    }
}