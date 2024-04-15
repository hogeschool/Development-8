import { Gun } from "./gun"

export interface Tank {
  name                : string
  weapon              : Gun
  armor               : number
  health              : number
  shoot               : (this : Tank, tank : Tank) => Tank
}

export const createTank = (name : string, weapon : Gun, armor : number, health : number) : Tank => ({
  name:         name,
  weapon:       weapon,
  armor:        armor,
  health:       health,
  shoot:
    function (this : Tank, tank : Tank) : Tank {
      if (this.weapon.penetration > tank.armor) {
        const updatedHealth = tank.health - this.weapon.damage
        console.log(`${this.name} shoots ${tank.name} causing ${this.weapon.damage} --> HEALTH: ${updatedHealth}`)
        return {
          ...tank,
          health: updatedHealth
        }
      }
      else {
        const updatedArmor = tank.armor - this.weapon.penetration
        console.log(`${this.name} shoots ${tank.name} with ${this.weapon.name} reducing armour by ${this.weapon.penetration} --> ARMOUR: ${updatedArmor}`)
        return {
          ...tank,
          armor: updatedArmor
        }
      }
    }
})

export const fight = (t1 : Tank) => (t2 : Tank) : [Tank, Tank] => {
  const outcome = (loser : Tank) => (winner : Tank) : [Tank, Tank] => {
    console.log(`${loser.name}: KABOOOM!!! ${winner.name} wins`)
    if (t1 == loser)
      return [t1,t2]
    else
      return [t2,t1]
  }
  if (t1.health < 0) {
    return outcome(t1)(t2)
  }
  else if (t2.health < 0) {
    return outcome(t2)(t1)
  }
  else {
    t2 = t1.shoot(t2)
    t1 = t2.shoot(t1)
    return fight(t1)(t2)
  }
}