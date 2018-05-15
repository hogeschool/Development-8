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

let rec merge (l1 : List<'a>) (l2 : List<'a>) =
  match l1,l2 with
  | [],[] -> []
  | l, [] -> l
  | [], l -> l
  | x1 :: xs1, x2 :: xs2 ->
      if (x1 <= x2) then
        x1 :: (merge xs1 l2)
      else
        x2 :: (merge l1 xs2)



let rec mergeSort : List<'a> -> List<'a> =
  fun (l : List<'a>) ->
    match l with
    | [] -> []
    | [x] -> [x]
    | _ ->
      let left,right = l |> List.splitAt(l.Length / 2)
      let sortedLeft = mergeSort left
      let sortedRight = mergeSort right
      merge sortedLeft sortedRight
        
  
        

[<EntryPoint>]
let main argv =
  printfn "%A" (mergeSort [15;0;2;-4;3;1])
  0
