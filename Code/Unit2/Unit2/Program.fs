module Program

open System

let rec last = 
  fun (l : List<'a>) ->
    if l.Length = 0 then
      failwith "The list is empty"
    elif l.Length = 1 then 
      l.Head
    else
      last l.Tail

let rec rev : List<'a> -> List<'a> =
  fun (l : List<'a>) ->
    if l.Length = 0 then
      []
    else
      (rev l.Tail) @ [l.Head]

[<EntryPoint>]
let main argv =
  printfn "%A" (last [5;3;0;1;6])
  0
