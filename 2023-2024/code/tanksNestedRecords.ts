import { Gun } from "./gun";
import { Tank } from "./tanks";

export interface Tank2Weapons {
  secondaryWeapon       : Gun
  base                  : Tank
}

export const createTank2Weapons = (secondaryWeapon : Gun) => (tank : Tank) : Tank2Weapons => ({
  secondaryWeapon       : secondaryWeapon,
  base                  : tank
})