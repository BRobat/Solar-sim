import { Injectable } from '@angular/core';
import { ControlConfig } from '../model/configs/controlConfig';
import { Vector } from '../model/vector';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  controlConfig: ControlConfig;

  constructor() {
    this.controlConfig = {
      enablePan: false,
      pause: false,
      throwMode: false,
      isThrowMenuOpen: false,
      dt: 0.5,
      mouseDown: false,
      tempMousePos: { x: 0, y: 0, z: 0 } as Vector,
      mousePos: { x: 0, y: 0, z: 0 } as Vector,
      virtualCamPos: { x: 0, y: 0, z: 0 } as Vector
    }
  }
}
