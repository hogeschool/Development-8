module Unit3

let rec last (l : List<'a>) : Option<'a> =
  match l with
  | [] -> None
  | [x] -> Some x
  | _ :: xs -> last xs

let rec append (l1 : List<'a>) (l2 : List<'a>) : List<'a> =
  match l1,l2 with
  | [],l2 -> l2
  | x :: xs,l2 -> x :: (append xs l2)

let rec nth (n : int) (l : List<'a>) : Option<'a> =
  if n < 0 then
    None
  elif n = 0 then
    Some l.Head
  else
    nth (n - 1) l.Tail

let rec rev (l : List<'a>) : List<'a> = 
  match l with
  | [] -> []
  | x :: xs -> (rev xs) @ [x] //alternatively call append (rev xs) [x]

let palindrome (l : List<'a>) : bool =
  (rev l) = l

let rec compress (l : List<'a>) : List<'a> =
  match l with
  | [] -> []
  | [x] -> [x]
  | x :: y :: xs ->
      if x = y then
        compress (y :: xs)
      else
        x :: (compress (y :: xs))

let rec caesarCypher (l : List<char>) (shift : int) : List<char> =
  let shiftChar (c : char) (shift : int) =
    let charCode = int c
    if (charCode >= 97 && charCode <= 122) then
      (((int c) - 97) + shift) % 26 + 97 |> char
    else
      c

  match l with
  | [] -> []
  | x :: xs -> (shiftChar x shift) :: (caesarCypher xs shift)

let rec splitAt (i : int) (l : List<'a>) : List<'a> * List<'a> =
  match l with
  | [] -> [],[]
  | x :: xs ->
      if i = 0 then
        [],x :: xs
      else
        let left,right = splitAt (i - 1) xs
        x :: left,right

let rec merge (l1 : List<'a>) (l2 : List<'a>) : List<'a> =
  match l1,l2 with
  | [],l
  | l,[] -> l
  | x :: xs,y :: ys ->
      if x <= y then
        x :: (merge xs (y :: ys))
      else
        y :: (merge (x :: xs) ys)

let rec mergeSort (l : List<'a>) : List<'a> =
  match l with
  | [] -> []
  | [x] -> [x]
  | _ ->
    let m = l.Length / 2
    let l1,l2 = splitAt m l
    let sortedL1 = mergeSort l1
    let sortedL2 = mergeSort l2
    merge sortedL1 sortedL2


let testUnit3() =
  let l1 = [-1;0;2;3;5;6]
  let l2 = [0;1;2;5;7;23]
  let rl = [0;1;1;2;3;3;3;2;3;4;4;4;5;0;0;0;0;0]
  let ul = [5;0;-1;3;2;3;-25;5]
  let aeneid = "Arma virumque cano, Troiae qui primum ab oris"
  printfn "%A" (last l1)
  printfn "%A" (append l1 l2)
  printfn "%A" (rev l1)
  printfn "%A" (compress rl)
  printfn "%A" (
    caesarCypher (
      aeneid.ToLower().ToCharArray() |> 
      Array.toList) 3 |> 
      List.map string |> 
      List.fold (+) "")
  printfn "%A" (splitAt 6 rl)
  printfn "%A" (merge l1 l2)
  printfn "%A" (mergeSort ul)