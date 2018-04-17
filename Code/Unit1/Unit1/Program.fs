module Unit1

open System

let rec allNumbers = 
  fun max ->
    if (max = 0) then
      "0"
    else
      allNumbers (max - 1) + " " + (string max)

let rec allNumbersRev = 
  fun max ->
    if (max = 0) then
      "0"
    else
      (string max) + " " + (allNumbersRev (max - 1))

let rec allNumbersRange =
  fun min max ->
    if max = min then
      (string max)
    else
      allNumbersRange min (max - 1) + " " + (string max)

let rec allEvenRange =
  fun min max ->
    if max <= min then
      if max % 2 = 0 then
        (string max)
      else
        ""
    elif max % 2 = 0 then
      allEvenRange min (max - 1) + " " + (string max)
    else
      allEvenRange min (max - 1)

let rec asteriskLine =
  fun length ->
    if length = 0 then
      ""
    else
      "*" + (asteriskLine (length - 1))

let rec asteriskSymbol =
  fun length symbol ->
    if length = 0 then
      symbol
    else
      symbol + (asteriskSymbol (length - 1) symbol)

let rec binaryString =
  fun n ->
    if n = 0 then
      ""
    else
      let digit = n % 2
      binaryString (n / 2) + (string digit)

let rec baseString =
  fun n _base ->
    if n = 0 then
      ""
    else
      let digit = n % _base
      baseString (n / _base) _base + (string digit)

[<EntryPoint>]
let main argv =
  printfn "Exercise 1: %A" (allNumbers 100)
  printfn "Exercise 2: %A" (allNumbersRev 100)
  printfn "Exercise 3: %A" (allNumbersRange 30 100)
  printfn "Exercise 4: %A" (allEvenRange 25 100)
  printfn "Exercise 5: %A" (asteriskLine 25)
  printfn "Exercise 6: %A" (asteriskSymbol 25 "$")
  printfn "Exercise 7: %A" (binaryString  150)
  printfn "Exercise 8: %A" (baseString 150 6)
  0
