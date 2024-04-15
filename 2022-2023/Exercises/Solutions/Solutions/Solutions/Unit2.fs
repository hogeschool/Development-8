module Unit2

open System

let r = Random()

let clamp min max value =
  if value < min then
    min
  elif value > max then
    max
  else
    value

let minCoord = -50.0
let maxCoord = 50.0

let randomCoord min max =
  min + (r.NextDouble() * (max - min))

type Point2D =
  {
    Position : (float * float)
  }
  with
    static member Create(x : float,y : float) = { Position = (x,y) }
    static member CreateRandom(min : float,max : float) = Point2D.Create(randomCoord min max,randomCoord min max)
    member this.X = fst this.Position
    member this.Y = snd this.Position
    member this.Distance(point : Point2D) =
      Math.Sqrt((this.X - this.X) * (this.X - this.X) + (this.Y - this.Y) * (this.Y - this.Y))
      


type Blob =
  {
    Position : Point2D
    Size     : int
  }
  with
    static member Create() = { Position = Point2D.CreateRandom(minCoord,maxCoord); Size = r.Next(1,6)}
    member this.Speed = (float this.Size) / 10.0
    member this.Up = { this with Position = Point2D.Create(this.Position.X, clamp minCoord maxCoord (this.Position.Y + this.Speed)) }
    member this.Down = { this with Position = Point2D.Create(this.Position.X, clamp minCoord maxCoord (this.Position.Y - this.Speed)) }
    member this.Left = { this with Position = Point2D.Create(clamp minCoord maxCoord (this.Position.X - this.Speed), this.Position.Y) }
    member this.Right = { this with Position = Point2D.Create(clamp minCoord maxCoord (this.Position.X + this.Speed), this.Position.Y) }
    member this.Move() =
      let choice = r.Next(0,4)
      if choice = 0 then
        this.Up
      elif choice = 1 then
        this.Down
      elif choice = 2 then
        this.Left
      elif choice = 3 then
        this.Right
      else
        this

type World =
  {
    Blob1     : Blob
    Blob2     : Blob
    Ticks     : int
  }
  with
    static member Create(ticks : int) =
      {
        Blob1 = Blob.Create()
        Blob2 = Blob.Create()
        Ticks = ticks
      }
    member this.Run() =
      if this.Ticks <= 0 then
        printfn "%A" this
        this
      else
        printfn "%A" this
        {
          Blob1 = this.Blob1.Move()
          Blob2 = this.Blob2.Move()
          Ticks = this.Ticks - 1
        }.Run()

let test() =
  let w = World.Create(1000)
  w.Run()

        

      