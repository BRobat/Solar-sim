import { Camera } from "../../camera";
import { Vector } from "../../vector";

export class Cube {
    static drawCube(centerPosition: Vector, diameter: number, camera: Camera): number[] {
        const positions = [];
        const cube = [
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,

            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,

            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,

            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,

            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,

            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,];

        cube.forEach((i: number, j: number) => {
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