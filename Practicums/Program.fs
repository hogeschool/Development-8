open System


let rec WHILE currentState condition step = if condition currentState = true then WHILE (step currentState) condition step else currentState

let allNumberRev (n: int) : string =
  let (i,result) = WHILE (n,"") (fun (i,result) -> i >= 0) (fun (i,result) -> (i - 1,result + (string i) + " "))
  result 

let allNumber (n: int) : string =
  // let rec iteration i result = 
  //   if i > n then result
  //   else iteration (i+1) (result + (string i) + " ")
  // iteration 0 ""
  let (i,result) = 
    WHILE 
      (0,"")
      (fun (i,result) -> i <= n)
      (fun (i,result) -> (i+1, result + (string i) + " "))
  result

System.Console.WriteLine(allNumberRev 10)

// System.Console.WriteLine(
//     WHILE 
//       0 
//       (fun n -> n < 10) 
//       (fun n -> (n + 1)))
(*
n = 0
while n < 10
  n = n + 1
*)
