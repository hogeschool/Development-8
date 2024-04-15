module Lesson2

type Gun =
  {
    Name : string
    Penetration : float
    Damage : float
  }
  with
    static member Create(name: string, penetration : float, damage : float) =
      { Name = name; Penetration = penetration; Damage = damage }
    member this.Shoot(tank : TankKind) =
      if this.Penetration > tank.Armor then
        let t = tank.Damage this.Damage
        printfn "%s shoots %s causing %f damage --> HEALTH: %f"
          this.Name
          tank.Name
          this.Damage
          t.Health
        t
      else
        let t = tank.Scratch this.Penetration
        printfn "%s shoots %s causing %f penetration --> ARMOUR: %f"
          this.Name
          tank.Name
          this.Penetration
          t.Armor
        t
          

and Tank =
  {
    Name : string
    Weapon : Gun
    Armor : float
    Health : float
  }
  with
    static member Create(name :string, weapon : Gun, armor : float, health : float) =
      {
        Name = name
        Weapon = weapon
        Armor = armor
        Health = health
      }
    member this.IsDead = this.Health <= 0.0

and Tank2Weapons =
  {
    SecondaryWeapon       : Gun
    Base                  : Tank
  }
  with
    static member Create (weapon : Gun,tank : Tank) =
      {
        SecondaryWeapon = weapon
        Base = tank
      }
    member this.IsDead = this.Base.Health <= 0.0

and TankKind =
| Tank of Tank
| Tank2Weapons of Tank2Weapons
with
  member this.Name =
    match this with
    | Tank t -> t.Name
    | Tank2Weapons t -> t.Base.Name
  member this.Health =
      match this with
      | Tank t -> t.Health
      | Tank2Weapons t -> t.Base.Health
  member this.Armor =
    match this with
    | Tank t -> t.Armor
    | Tank2Weapons t -> t.Base.Armor
  member this.Damage(damage : float) : TankKind =
    match this with
    | Tank t ->
        Tank { t with Health = t.Health - damage }
    | Tank2Weapons t ->
        Tank2Weapons { t with Base = { t.Base with Health = t.Base.Health - damage } }
  member this.Scratch(damage : float) : TankKind =
    match this with
    | Tank t ->
        Tank { t with Armor = t.Armor - damage }
    | Tank2Weapons t ->
        Tank2Weapons { t with Base = { t.Base with Armor = t.Base.Armor - damage } }
  member this.Fight(tank : TankKind) : TankKind * TankKind =
    let outcome (loser : TankKind) (winner : TankKind) =
      printfn "%s: KABOOOM!!! %s wins" loser.Name winner.Name
      if this = loser then
        this,tank
      else
        tank,this
    match this,tank with
    | Tank t1,Tank t2 ->
        if t1.IsDead then
          outcome this tank
        elif t2.IsDead then
          outcome tank this
        else
          let tank1 = t1.Weapon.Shoot(tank)
          let tank2 = t2.Weapon.Shoot(this)
          tank1.Fight tank2
    | Tank t1,Tank2Weapons t2
    | Tank2Weapons t2, Tank t1 ->
        if t1.IsDead then
          outcome this tank
        elif t2.IsDead then
          outcome tank this
        else
          let tank2 = t1.Weapon.Shoot(tank)
          let tank1 = t2.Base.Weapon.Shoot(this)
          let tank1 = t2.SecondaryWeapon.Shoot(tank1)
          tank1.Fight tank2
    | Tank2Weapons t1, Tank2Weapons t2 ->
        if t1.IsDead then
          outcome this tank
        elif t2.IsDead then
          outcome tank this
        else
          let tank2 = t1.Base.Weapon.Shoot(tank)
          let tank2 = t1.SecondaryWeapon.Shoot(tank2)
          let tank1 = t2.Base.Weapon.Shoot(this)
          let tank1 = t2.SecondaryWeapon.Shoot(tank1)
          tank1.Fight tank2
          

          
        
       
        
        


let mg42 = Gun.Create("MG-42", 5.0, 5.0)
let browning = Gun.Create("M2 Browning", 15.0, 10.0)
let kwk36 = Gun.Create("88mm KwK 36", 150.0, 90.0)
let f32 = Gun.Create("76mm F-32", 70.0, 60.0)
let kwk40short = Gun.Create("75mm kwk 37", 35.5, 55.5)
let kwk40Long = Gun.Create("75mm KwK 40", 99.5, 55.5)
let m1a1 = Gun.Create("76mm M1A1", 99.0, 60.0)
let tiger = Tank.Create("Pz.Kpfw. VI Tiger Ausf. E", kwk36, 340.0, 800.0)
let t34 = Tank.Create("T-34/76", f32, 200.0, 400.0)
let p4f = Tank.Create("Pz.Kpfw. IV", kwk40short, 130.0, 350.0)
let p4g = Tank.Create("Pz.Kpfw. IV", kwk40Long, 130.0, 350.0)
let shermanE8 = Tank.Create("M4A3 Sherman E8", m1a1, 220.0, 450.0)
let tiger_mg42 = Tank2Weapons (Tank2Weapons.Create(mg42,tiger))
let sherman_browning = Tank2Weapons (Tank2Weapons.Create(browning,shermanE8))

let testFight() =
  tiger_mg42.Fight (Tank shermanE8) |> ignore


