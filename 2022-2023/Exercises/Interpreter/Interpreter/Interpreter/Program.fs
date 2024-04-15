open System
open Common
open Interpreter

[<EntryPoint>]
let main argv =
  let v = (Add(!!(Int 3),Mul(!!(Int 4),!!(Int 7)))).Eval()
  printfn "%s" (string v) 
  0
