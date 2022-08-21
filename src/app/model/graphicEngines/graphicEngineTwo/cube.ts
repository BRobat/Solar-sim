import { Calculus } from "src/app/utils/calculus";
import { Camera } from "../../camera";
import { Vector } from "../../vector";
import { ShapeCube } from "./shapes/shape_cube";

export class Cube {
    static drawCube(centerPosition: Vector, diameter: number, camera: Camera): number[] {
        const positions = [];

        ShapeCube.cube.forEach((i: number, j: number) => {
            if (j % 3 === 0) {
                positions.push(
                    centerPosition.x + (i * diameter / 2 * 10) - camera.direction.x
                )
            }
            if (j % 3 === 1) {
                positions.push(
                    centerPosition.y + (i * diameter / 2 * 10) - camera.direction.y
                )
            }
            if (j % 3 === 2) {
                positions.push(
                    centerPosition.z + (i * diameter / 2 * 10) - camera.direction.z
                )
            }
        })

        return positions;
    }
}