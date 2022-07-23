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
            const pd = e.diameter * (10 / Math.sqrt(rz));
            ctx.arc(
                px,
                py,
                pd,
                0,
                2 * Math.PI);
            ctx.fill();
        })
    }

    static throwEntity(mass: number, event: Vector, throwVector: Vector, data: Data, camera: Camera, ctx: any): void {
        const x = -((-ctx.canvas.width + 2 * event.x) / (Math.tan(camera.angleOfView) * ctx.canvas.width) * camera.position.z - camera.position.x)
        const y = -((-ctx.canvas.height + 2 * event.y) / (Math.tan(camera.angleOfView) * ctx.canvas.height) * camera.position.z - camera.position.y)
        const entity = new Entity(mass,
            { x: x, y: y, z: 0.01 } as Vector,
            Calculus.MultiplyVectorXScalar(throwVector,0.01),
            '')
        data.addEntity(entity)
    }

}