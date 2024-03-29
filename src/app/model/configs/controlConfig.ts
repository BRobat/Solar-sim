import { Vector } from "../vector";

export class ControlConfig {
    enablePan: boolean;
    pause: boolean;

    dt: number;

    throwMode: boolean;
    isThrowMenuOpen: boolean;
    isDiscMenuOpen: boolean;


    mouseDown: boolean;
    tempMousePos: Vector;
    mousePos: Vector;

    virtualCamPos: Vector;
}