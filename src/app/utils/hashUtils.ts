import { Data } from "../model/data";
import { Entity } from "../model/entity";
import { Vector } from "../model/vector";

export class HashUtils {
    static hashEntities(data: Data, t: number): void {

        data.hashList = new Map()

        data.entities.forEach((entity: Entity, i: number) => {
            const hashName = this.getEntityHash(entity, t);
            const hash = data.hashList.get(hashName);

            if (hash) {
                data.hashList.set(hashName, hash.concat(i))
            } else {
                data.hashList.set(hashName, [i])
            }
        })
    }

    static getEntityHash(entity: Entity, t: number): Vector {
        const xp = Math.floor(entity.position.x / t);
        const yp = Math.floor(entity.position.y / t);
        const zp = Math.floor(entity.position.z / t);

        return { x: xp, y: yp, z: zp } as Vector
    }

    static getNearHashes(hash: Vector): Vector[] {
        const nearHashes = []
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                nearHashes.push({ x: hash.x + i, y: hash.y + i, z: hash.z + i } as Vector)
            }
        }
        return nearHashes
    }
}