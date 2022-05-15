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

            


            const px = ((Math.tan(camera.angleOfView) * ((camera.position.x - e.position.x) / (camera.position.z - e.position.z))) * ctx.canvas.width / 4) + ctx.canvas.width / 4;
            const py = ((Math.tan(camera.angleOfView) * ((camera.position.y - e.position.y) / (camera.position.z - e.position.z))) * ctx.canvas.height / 4) + ctx.canvas.height / 4;
            // taht needs to be changed
            const pd = e.diameter * (50 / Math.sqrt(camera.position.z - e.position.z));
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