open System
open Lesson3
open Lesson5

let nestedList = [
    Element 3 
    Element 4
    NestedList([
      Element 4 
      NestedList ([
        Element 2
        Element 4
        Element 5
        ])
      Element -8
    ])]


[<EntryPoint>]
let main argv =
  printfn "%A" (unzip [(3,5);(2,6);(4,-1);(3,-5)])
  printfn "%A" (flatten nestedList)
  printfn "%A" (tree.Fold (fun s x -> sprintf "%s | %d" s x) "")
  printfn "%s" (binaryTree.Fold (fun s x -> sprintf "%s | %d" s x.Entry.Key) "" )
  let binaryTree1 = binaryTree.Remove(3)
  printfn "%s" (binaryTree1.Fold (fun s x -> sprintf "%s | %d" s x.Entry.Key) "" )
  let shouldTakeUmbrella = weatherTree.Classify weatherData2
  printfn "%A" shouldTakeUmbrella
  0
