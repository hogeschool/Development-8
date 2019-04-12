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

let tree = 
  Node(3,[
    Node(5, [Empty])
    Node(1, [
      Node(1, [Empty])
      Node(3, [
        Node(8, [Empty])
      ])
    ])
    Node(4, [
      Node(6, [Empty])
    ])
    Node(2, [Empty])
  ])

[<EntryPoint>]
let main argv =
  
  printfn "%A" (unzip [(3,5);(2,6);(4,-1);(3,-5)])
  printfn "%A" (flatten nestedList)
  printfn "%A" (tree.Fold (fun s x -> sprintf "%s | %d" s x) "")
  0
