import { Vector } from "../vector";

export class ControlConfig {
    enablePan: boolean;

    mouseDown: boolean;
    tempMousePos: Vector;
    mousePos: Vector;

    virtualCamPos: Vector;
}