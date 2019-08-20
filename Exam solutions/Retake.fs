module Retake

let rec allNumbersModRange (n : int) (div : int) : string = 
  if n = 0 then
    "0"
  elif n % div = 0 then
    (allNumbersModRange (n - 1) div) + " " + (string n)
  else
    allNumbersModRange (n - 1) div

let evenOdd (l : List<int>) : List<string> =
  l |> List.map (fun x -> if x % 2 = 0 then "even" else "odd")

type Person =
  {
    Name : string
    LastName : string
    Age : int
  }

let rec overage (l : List<Person>) : List<Person> =
  l |> List.filter (fun p -> p.Age >= 18)

type Either<'a,'b> =
| Left of 'a
| Right of 'b

type FunctionWithConversion<'a,'b,'c> =
  {
    Function : 'a -> Either<'b,'c>
    Conversion1 : 'b -> 'a
    Conversion2 : 'c -> 'a
  }

let rec functionChain 
  (functions : List<FunctionWithConversion<'a,'b,'c>>) (input : 'a) : 'a =

  functions |>
  List.fold (fun value f ->
                let next = f.Function value
                match next with
                | Left l -> f.Conversion1 l
                | Right r -> f.Conversion2 r
                ) input

type Tree<'a> =
| Empty
| Tree of 'a * List<Tree<'a>>

let rec treeFoldDepth (f :  'state -> 'a -> 'state) (state : 'state) (t : Tree<'a>): 'state =
  match t with
  | Empty -> state
  | Tree (root,trees) ->
      let newState =
        trees |>
        List.fold (fun s tree -> treeFoldDepth f s tree) state
      f newState root


let testAll() =
  printfn "1: %A" (allNumbersModRange 10 3)
  printfn "2: %A" (evenOdd [3;2;4;4;4;5;5;1;5;2;2;2;4;5])
  printfn "3: %A" (overage 
    [
      {Name = "John" ; LastName = "Doe"; Age = 18}
      {Name = "John" ; LastName = "Doe"; Age = 124}
      {Name = "John" ; LastName = "Doe"; Age = 3}
      {Name = "John" ; LastName = "Doe"; Age = 15}
      {Name = "John" ; LastName = "Doe"; Age = 22}
      {Name = "John" ; LastName = "Doe"; Age = 1}
    ])
  let tree =
    Tree(3,
      [
        Tree(1,[Empty])
        Tree(2,
          [
            Tree(1,[Empty])
            Tree(2,[Empty])
            Tree(3,[Empty])
          ])
        Tree(5,
          [
            Tree(4,[Empty])
            Tree(6,[Empty])
          ])
      ]
    )
  printfn "5: %A" (treeFoldDepth (fun s x -> s + (string x)) "" tree)

    
