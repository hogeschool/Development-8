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

let rec quickSort : List<'a> -> List<'a> =
  let rec smaller (x : 'a) (l : List<'a>) =
    if l.Length = 0 then
      []
    else
      if l.Head < x then
        l.Head :: (smaller x l.Tail)
      else
        smaller x l.Tail

  let rec greater (x : 'a) (l : List<'a>) =
    if l.Length = 0 then
      []
    else
      if l.Head > x then
        l.Head :: (greater x l.Tail)
      else
        greater x l.Tail
        
  fun (l : List<'a>) ->
    if l.Length = 0 then
      []
    else
      let smallerValues = smaller l.Head l.Tail
      let greaterValues = greater l.Head l.Tail
      (quickSort smallerValues) @ [l.Head] @ (quickSort greaterValues)

[<EntryPoint>]
let main argv =
  printfn "%A" (quickSort [5;3;0;1;6])
  0
