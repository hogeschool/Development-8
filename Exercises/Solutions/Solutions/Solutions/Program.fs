open Unit1
open Unit2
open Unit4

let testUnit1() =
  printf "==== Testing Unit 1... ====\n\n"
  printfn "Exercise 1:\n%A" (allNumbers 100)
  printfn "Exercise 2:\n%A" (allNumbersRev 100)
  printfn "Exercise 3:\n%A" (allNumbersRange 10 97)
  printfn "Exercise 4:\n%A" (allNumbersRangeRev 10 97)
  printfn "Exercise 5:\n%A" (allEvenRange 10 97)
  printfn "Exercise 6:\n%A" (drawLine 50)
  printfn "Exercise 7:\n%A" (drawSymbol '#' 50)
  printfn "Exercise 8:\n%A" (toBinary 10)
  printfn "Exercise 9:\n%A" (toBase 40 7)

let testUnit2() =
  printf "==== Testing Unit 2... ====\n\n"
  Unit2.test()

let testUnit3() =
  printf "==== Testing Unit 3... ====\n\n"
  Unit3.test()
  

let testUnit4() =
  printf "==== Testing Unit 4... ====\n\n"
  printfn "Exercise 1:\n%A" (last ["What";"r";"you";"doing?!";"Stahp!"])
  printfn "Exercise 2:\n%A" (rev ["What";"r";"you";"doing?!";"Stahp!"])
  printfn "Exercise 3:\n%A" (append [3;0;5;-1] [0;5;1;2])
  printfn "Exercise 4:\n%A" (nth 4 [0;5;1;2;-3;-5;2;5])
  printfn "Exercise 5:\n%A" (palindrome [0;3;5;3;0])
  printfn "Exercise 6:\n%A" (compress ['a';'a';'a';'a';'b';'b';'c';'c';'b'])
  let aeneid = 
    "Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora".ToLower().ToCharArray() |>
    Array.toList
  printfn "Exercise 7:\n%A" (caesarCypher aeneid 5 |> Array.ofList |> Array.map string |> Array.fold (+) "")

let testUnit5() =
  printf "==== Testing Unit 5... ====\n\n"
  Unit5.test()

[<EntryPoint>]
let main argv =
    //unit 1
    //testUnit1()
    testUnit5()
    0
