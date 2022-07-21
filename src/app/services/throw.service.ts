import { Injectable } from '@angular/core';
import { ThrowConfig } from '../model/configs/throwConfig';
import { Vector } from '../model/vector';

@Injectable({
  providedIn: 'root'
})
export class ThrowService {

  throwConfig: ThrowConfig;

  constructor() {
    this.throwConfig = {
      mass: 100,
      massRange: false,
      minMaxMass: { lower: 10, upper: 100 },
      countRange: false,
      minMaxCount: { lower: 10, upper: 20 }
    }
  }
}
