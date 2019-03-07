module Lesson3

let r = System.Random()

type Server =
  {
    Address   : byte * byte * byte * byte
    ReplyProbability : float
    Reply     : string
  }
  with
    static member Create(address : byte * byte * byte * byte, replyProbability : float, reply : string) =
      {
        Address = address
        ReplyProbability = replyProbability
        Reply = reply
      }

type Connection =
  {
    Address   : byte * byte * byte * byte
    Data      : Option<string>
  }
  with
    static member Create(address : byte * byte * byte * byte) =
      {
        Address = address
        Data = None
      }
    member this.Connect (server : Server) =
      if this.Address <> server.Address ||
         r.NextDouble() > server.ReplyProbability then
         this
      else
        { this with Data = Some server.Reply }


let helloServer = Server.Create((169uy, 180uy, 0uy, 1uy),0.35,"Hello!")
let connection = Connection.Create((169uy, 180uy, 0uy, 1uy))
match connection.Connect(helloServer).Data with
| Some data -> printfn "The server replied: %s" data
| None -> printfn "404 server not found"

