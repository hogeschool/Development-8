module Unit4

//This is the O(n^2) version, because for each element of the list
//you append its mapped counterpart at the end, thus it is n * O(n) = O(n^2)
let mapFold (f : 'a -> 'b) (l : List<'a>) : List<'b> =
  l |> List.fold (fun mappedList x -> mappedList @ [f x]) []

//This is the O(n) version, because for each element of the list
//you add its mapped counterpart in front, which costs O(1), thus you
//need n * O(1) = O(n) to map the list, and then O(n) again to reverse it
//and get the elements in the correct order, so O(n) + O(n) = O(n)
let mapFoldFast (f : 'a -> 'b) (l : List<'a>) : List<'b> =
  l |> List.fold (fun mappedList x -> (f x) :: mappedList) [] |> List.rev

//For the same reason as above, this is the O(n) version.
let filterFold (f : 'a -> bool) (l : List<'a>) : List<'a> =
  l |> List.fold 
          (fun filteredList x -> 
            if f x then 
              x :: filteredList 
            else
              filteredList) [] |> List.rev

let flatten (l : List<List<'a>>) : List<'a> =
  l |> List.fold (fun flattenedList l -> flattenedList @ l) []

let rec map2 (f : 'a -> 'b -> 'c) (l1 : List<'a>) (l2 : List<'b>) : Option<List<'c>> =
    match l1,l2 with
    | [],[] -> Some []
    | [],_
    | _,[] -> None
    | x :: xs,y :: ys ->
      let lopt = map2 f xs ys
      match lopt with
      | None -> None
      | Some l -> Some((f x y) :: l)

let rec fold2 (f : 'state -> 'a -> 'b -> 'state) (init : 'state) 
  (l1 : List<'a>) (l2 : List<'b>) : Option<'state> =

  match l1,l2 with
  | [],[] -> Some init
  | [],_
  | _,[] -> None
  | x :: xs,y :: ys ->
      fold2 f (f init x y) xs ys

//recursive version      
let rec zip (l1 : List<'a>) (l2 : List<'b>) : Option<List<'a * 'b>> =
  match l1,l2 with
  | [],[] -> Some []
  | [],_
  | _,[] -> None
  | x :: xs,y :: ys ->
      let lopt = zip xs ys
      match lopt with
      | None -> None
      | Some l -> Some((x,y) :: l)

//fold version
let zipFold (l1 : List<'a>) (l2 : List<'b>) : Option<List<'a * 'b>> =
  let folded =
    fold2 (fun pairs x y -> (x,y) :: pairs) [] l1 l2
  match folded with
  | None -> None
  | Some l -> Some (l |> List.rev)

let rec map2Safe (f : 'a -> 'b -> 'c) (l1 : List<'a>) (l2 : List<'b>) : 
  List<Option<'c>> =

  match l1,l2 with
  | [],[] -> []
  | l1,[] -> l1 |> List.map (fun _ -> None)
  | [],l2 -> l2 |> List.map (fun _ -> None)
  | x :: xs,y :: ys ->
      (Some (f x y)) :: (map2Safe f xs ys)

let testUnit4() =
  let l = [4;5;1;2;3;25;256]
  let l1 = "axsdsdy".ToCharArray() |> Array.toList |> List.map(fun x -> string x)
  let cl = [[3;1;4];[5;0;1];[2];[4;5];[1;3;2]]
  printfn "%A" (mapFoldFast (fun x -> x + 1) l)
  printfn "%A" (filterFold (fun x -> x % 2 = 0) l)
  printfn "%A" (flatten cl)
  printfn "%A" (map2 (fun x y -> (string x) + y) l l1)
  printfn "%A" (fold2 (fun s x y -> s + (string x) + y) "" l l1)
  printfn "%A" (zip l l1)
  printfn "%A" (zipFold l l1)
  printfn "%A" (map2Safe (fun x y -> x :: y) l cl)
