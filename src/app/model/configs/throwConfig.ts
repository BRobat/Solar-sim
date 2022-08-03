import { Vector } from "../vector";

export class ThrowConfig {
    mass: number;
    massRange: boolean;
    minMaxMass: {lower: number, upper: number};
    countRange: boolean;
    minMaxCount: {lower: number, upper: number};
    dispersion: number;
    
}