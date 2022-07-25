import { Injectable } from '@angular/core';
import { DiscConfig } from '../model/configs/discConfig';

@Injectable({
  providedIn: 'root'
})
export class DiscService {

  discConfig: DiscConfig;

  constructor() {
    this.discConfig = {
      noEntities: 150,
      minMaxMass: { lower: 1, upper: 10 },
      centralEntity: true,
      centralMinMaxMass: { lower: 20000, upper: 20000 },
      internalEnergy: 2000000,
      isSphere: false,
      radius: 2000
    }
  }
}
