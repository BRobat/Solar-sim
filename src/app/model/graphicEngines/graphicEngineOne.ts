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

            let rx = camera.position.x - e.position.x;
            let ry = camera.position.y - e.position.y;
            let rz = camera.position.z - e.position.z;


            const px = ((Math.tan(camera.angleOfView) * ((rx) / (rz))) * ctx.canvas.width / 4) + ctx.canvas.width / 4;
            const py = ((Math.tan(camera.angleOfView) * ((ry) / (rz))) * ctx.canvas.height / 4) + ctx.canvas.height / 4;
            // taht needs to be changed
            const pd = e.diameter * (50 / Math.sqrt(rz));
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