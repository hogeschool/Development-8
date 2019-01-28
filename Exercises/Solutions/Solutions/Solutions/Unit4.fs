module Unit4

let rec last (l : List<'a>) : Option<'a> =
  if l.IsEmpty then 
    None
  elif l.Tail.IsEmpty then 
    Some  l.Head
  else
    last l.Tail

let rec rev (l : List<'a>) : List<'a> =
  if l.IsEmpty then 
    []
  else
    (rev l.Tail) @ [l.Head]

let rec append (l1 : List<'a>) (l2 : List<'a>) : List<'a> =
  if l1.IsEmpty then
    l2
  else
    l1.Head :: (append l1.Tail l2)

let rec nth (n : int) (l : List<'a>) : Option<'a> =
  if l.IsEmpty then
    None
  elif n = 0 then
    Some l.Head
  else  
    nth (n - 1) l.Tail

let palindrome (l : List<'a>) : bool = l = (rev l)

let rec compress (l : List<'a>) : List<'a> =
  if l.IsEmpty then []
  elif l.Tail.IsEmpty then [l.Head]
  else
    let x = l.Head
    let y = l.Tail.Head
    let xs = l.Tail.Tail
    if x = y then
      compress (y :: xs)
    else
      x :: (compress (y :: xs))


let shift (c : char) (n : int) =
  let lowerBound = int 'a'
  let upperBound = int 'z'
  let offset = (int 'z') - (int 'a')
  let o = n % offset + 1
  let letterCode = (int c) + o
  if letterCode < lowerBound then
    char (upperBound - (lowerBound - letterCode))
  elif letterCode > upperBound then
    char (lowerBound + (letterCode - upperBound))
  else
    char letterCode



let rec caesarCypher (text : List<char>) (offset : int) : List<char> =
  if text.IsEmpty then
    []
  else
    let c = text.Head
    let charCode = (int c)
    if charCode >= (int 'a') && charCode <= (int 'z') then
      let encodedChar = shift c offset
      encodedChar :: (caesarCypher text.Tail offset)
    else
      c :: (caesarCypher text.Tail offset)
  
     

