module Unit3


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
    Eaten    : bool
  }
  with
    static member Create() = 
      { Position = Point2D.CreateRandom(minCoord,maxCoord)
        Size = r.Next(1,6)
        Eaten = false
      }
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
    member this.Eat(blobs : List<Blob>) : Blob * List<Blob> =
      match blobs with
      | [] -> this,blobs
      | blob :: otherBlobs ->
          if this.Position.Distance(blob.Position) < 5.0 && this.Size >= blob.Size then
            let finalBlob,eatenBlobs = { this with Size = this.Size + 1 }.Eat otherBlobs  
            finalBlob,{ blob with Eaten = true } :: eatenBlobs
          else
            let finalBlob,eatenBlobs = this.Eat otherBlobs
            finalBlob,blob :: eatenBlobs

type World =
  {
    Blobs     : List<Blob>
    Ticks     : int
  }
  with
    static member Create(ticks : int) =
      {
        Blobs = []
        Ticks = ticks
      }
    member this.UpdateBlobs() =
      let rec filterBlobs blobs =
        match blobs with
        | [] -> []
        | blob :: otherBlobs ->
          if blob.Eaten then
            filterBlobs otherBlobs
          else
            blob :: (filterBlobs otherBlobs)
      let rec eat (eatingBlobs : List<Blob>) (blobs : List<Blob>) =
        match eatingBlobs with
        | [] -> blobs
        | blob :: otherBlobs ->
            let currentBlob,eatenBlobs = blob.Eat(otherBlobs)
            let aliveBlobs = filterBlobs (currentBlob :: eatenBlobs)
            let eatingBlobs = filterBlobs otherBlobs
            eat eatingBlobs aliveBlobs

      { this with Blobs = eat this.Blobs this.Blobs }
      

    member this.Run() =
      if this.Ticks <= 0 then
        printfn "%A" this
        this
      else
        if this.Ticks % 100 = 0 then
          printfn "=======Tick: %d =======\n\nBLOBS LEFT: %d \n\n%A" 
            this.Ticks 
            this.Blobs.Length 
            this
        let world = this.UpdateBlobs()
        {
          Blobs = 
            if r.NextDouble() < 0.25 && this.Ticks % 20 = 0 then 
              Blob.Create() :: world.Blobs
            else 
              world.Blobs
          Ticks = world.Ticks - 1
        }.Run()

let test() =
  let w = World.Create(1000)
  w.Run()

        

      