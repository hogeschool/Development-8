module Unit1

let rec allNumbers (n : int) : string =
  if n < 0 then
    ""
  elif n = 0 then
    string n
  else
    (allNumbers (n - 1)) + " " + (string n)

let rec allNumbersRev (n : int) : string =
  if n < 0 then
    ""
  elif n = 0 then
    string n
  else
    (string n) + " " + (allNumbersRev (n - 1))

let rec allNumbersRange (lower : int) (upper : int) : string =
  if upper < lower then
    ""
  elif lower = upper then
    string lower
  else
    (string lower) + " " + (allNumbersRange (lower + 1) upper)

let rec allNumbersRangeRev (lower : int) (upper : int) : string =
  if upper < lower then
    ""
  elif lower = upper then
    string lower
  else
    (string upper) + " " + (allNumbersRangeRev lower (upper - 1))

let rec allEvenRange (lower : int) (upper : int) : string =
  if upper < lower then
    ""
  elif lower  = upper && lower % 2 = 0 then
    string lower
  else
    if lower % 2 = 0 then 
      (string lower) + " " + (allEvenRange (lower + 1) upper) 
    else 
      allEvenRange (lower + 1) upper

let rec drawLine (length : int) : string =
  if length = 0 then "" else "*" + (drawLine (length - 1))

let rec drawSymbol (symbol : char) (length : int) : string =
  if length = 0 then "" else (string symbol) + (drawSymbol symbol (length - 1))

let rec toBinary (n : int) : string =
  if n = 0 then ""
  else
    let digit = n % 2
    (toBinary (n / 2)) + (string digit)

let rec toBase (n : int) (_base : int) : string =
  if n = 0 then ""
  else
    let digit = n % _base
    (toBase (n / _base) _base) + (string digit)

