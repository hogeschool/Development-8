export interface Gun {
  name          : string
  penetration   : number
  damage        : number
}

export const createGun = (name : string, penetration : number, damage : number) : Gun => ({
  name:             name,
  penetration:      penetration,
  damage:           damage
})
