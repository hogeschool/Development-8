module Unit2

open System

let r = Random()

type Gun =
  {
    Name              : string
    Penetration       : float
    Damage            : float
  }
  with
    static member Create(name: string, penetration : float, damage : float) =
      { Name = name; Penetration = penetration; Damage = damage }
    member this.Shoot(tank : Tank) =
      if this.Penetration > tank.Armor then
        printfn "%s shoots %s with %s causing %f damage --> HEALTH: %f" 
          this.Name 
          tank.Name 
          this.Name 
          this.Damage 
          tank.Health 
        { tank with Health = tank.Health - this.Damage }
      else
        printfn "%s shoots %s with %s reducing armour by %f --> ARMOUR: %f" 
          this.Name 
          tank.Name 
          this.Name 
          this.Penetration
          tank.Armor
        { tank with Armor = tank.Armor - this.Penetration }  

and Tank =
  {
    Name        : string
    Weapon      : Gun
    Armor       : float
    Health      : float
    Position    : float * float
    Speed       : float
  }
  with
    static member Create
      (
        name :string, 
        weapon : Gun, 
        armor : float,
        health : float, 
        position : float * float, 
        speed : float
      ) =
      {
        Name = name
        Weapon = weapon
        Armor = armor
        Health = health
        Position = position
        Speed = speed
      }
    member this.Retrofit (gun : Gun, tank : Tank) =
      if this = tank then
        {this with
            Weapon = gun}
      else
        this
    member this.CanSee(tank : Tank) =
      (fst this.Position) = (fst tank.Position) ||
      (snd this.Position) = (snd tank.Position)
    member this.Move() : Tank =
      let choice = r.Next(1,5)
      if choice = 0 then
        this.Up
      elif choice = 1 then
        this.Down
      elif choice = 2 then
        this.Left
      else
        this.Right

    member this.Fight(tank : Tank) =
      let outcome loser winner =
        printfn "%s: KABOOOM!!! %s wins" loser.Name winner.Name
        if this = loser then
          this,tank
        else
          tank,this
      if this.Health <= 0.0 then
        outcome this tank
      elif tank.Health <= 0.0 then 
        outcome tank this
      elif this.CanSee tank then
        let (t2 : Tank) = this.Weapon.Shoot tank
        let (t1 : Tank) = tank.Weapon.Shoot this
        t1.Move().Fight(t2.Move())       
      else
        this.Fight tank
    member this.Up =
      { this with Position = fst this.Position,(snd this.Position) + this.Speed }
    member this.Down =
      { this with Position = fst this.Position,(snd this.Position) - this.Speed }
    member this.Right =
      { this with Position = (fst this.Position + this.Speed), snd this.Position }
    member this.Left =
      { this with Position = (fst this.Position - this.Speed), snd this.Position }


let test() =
  let kwk36 = Gun.Create("88mm KwK 36", 150.0, 90.0)
  let f32 = Gun.Create("76mm F-32", 70.0, 60.0)
  let kwk40short = Gun.Create("75mm kwk 37", 35.5, 55.5)
  let kwk40Long = Gun.Create("75mm KwK 40", 99.5, 55.5)
  let mg42 = Gun.Create("MG-42",5.0,5.0)
  let browning = Gun.Create("M2 Browning",10.0,10.0)
  let m1a1 = Gun.Create("76mm M1A1", 99.0, 60.0)
  let tiger = Tank.Create("Pz.Kpfw. VI Tiger Ausf. E", kwk36, 340.0, 800.0,(0.0,0.0),23.0)
  let t34 = Tank.Create("T-34/76", f32, 200.0, 400.0,(0.0,300.0),45.0)
  let p4f = Tank.Create("Pz.Kpfw. IV", kwk40short, 130.0,350.0,(0.0,0.0),30.0)
  let p4g = Tank.Create("Pz.Kpfw. IV", kwk40Long, 130.0,350.0,(0.0,0.0),30.0)
  let shermanE8 = Tank.Create("M4A3 Sherman E8", m1a1, 220.0,450.0,(0.0,300.0),45.0)
  let tanks = tiger.Fight shermanE8
  printfn "LOSER: %A\n\nWINNER: %A" (fst tanks) (snd tanks)

