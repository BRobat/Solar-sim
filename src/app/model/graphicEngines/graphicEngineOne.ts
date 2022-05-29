import { Calculus } from "src/app/utils/calculus";
import { Camera } from "../camera";
import { Data } from "../data";
import { Entity } from "../entity";
import { Vector } from "../vector";

export class GraphicEngineOne {

    static drawBackground(camera: Camera): void {

    }

    static drawScene(data: Data, camera: Camera, ctx: any): void {
        // console.log(ctx)
        data.entities.forEach((e: Entity) => {
            ctx.beginPath();
            ctx.fillStyle = 'rgb(' + (e.mass) / 30 + ',' + 0 + ',' + (100) + ')';
            ctx.lineWidth = 3

            let vec = {
                x: camera.position.x - e.position.x,
                y: camera.position.y - e.position.y,
                z: camera.position.z - e.position.z
            } as Vector;

            vec = Calculus.matrix3XVector(vec,Calculus.rotationMatrix(camera.pitch,camera.yaw,camera.roll));


            const px = ((Math.tan(camera.angleOfView) * ((vec.x) / (vec.z))) * ctx.canvas.width / 4) + ctx.canvas.width / 4;
            const py = ((Math.tan(camera.angleOfView) * ((vec.y) / (vec.z))) * ctx.canvas.height / 4) + ctx.canvas.height / 4;
            // taht needs to be changed
            const pd = e.diameter * (50 / Math.sqrt(vec.z));
            ctx.arc(
                px,
                py,
                pd,
                0,
                2 * Math.PI);
            ctx.fill();
        })
    }
}