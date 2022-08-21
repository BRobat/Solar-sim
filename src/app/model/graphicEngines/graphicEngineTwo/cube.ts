import { Calculus } from "src/app/utils/calculus";
import { Camera } from "../../camera";
import { Vector } from "../../vector";
import { ShapeCube } from "./shapes/shape_cube";

export class Cube {
    static drawCube(diameter: number): number[] {
        const positions = [];

        ShapeCube.cube.forEach((i: number, j: number) => {
            if (j % 3 === 0) {
                positions.push(
                    (i * diameter / 2 * 10)
                )
            }
            if (j % 3 === 1) {
                positions.push(
                    (i * diameter / 2 * 10)
                )
            }
            if (j % 3 === 2) {
                positions.push(
                    (i * diameter / 2 * 10)
                )
            }
        })

        return positions;
    }
}