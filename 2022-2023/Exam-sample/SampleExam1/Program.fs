open System
open Exam1_1920
open Checker

let rec private rectangle (width : int) (height : int) : string = ""

let rec private suffixes (l : List<'a>) : List<List<'a>> = []

let nearBy (mapObject : MapObject) (objects : List<MapObject>) (radius : float) : List<MapObject> = []

let rec private maxBy (projection : 'a -> 'b) (l : List<'a>) : Option<'b> = None

let private allPaths (tree : Tree<'a>) : List<List<'a>> = []

[<EntryPoint>]
let main argv =
  try
    let testedExercises =
      {
        Exercise1 = rectangle
        Exercise2 = suffixes
        Exercise3 = nearBy
        Exercise4 = maxBy
        Exercise5 = allPaths
      }
    printfn "%s" (validate testedExercises)
    0
  with
  | CheckerException msg -> 
      printfn "%s" msg
      1
  | :? Exception as e ->
      printfn "%s" e.Message
      1