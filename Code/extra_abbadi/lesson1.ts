export let hello_world = "hello world!"
export let sum = (a, b) => a + b
//           \a.\b.a+b

export let sum_10 = (a:number) => (b:number) : number => {
    let c : number = 10
    return a + b / c
}
//           (\a.\b.((\c.a+b+c) 10))

let res = sum_10(5)(6)
//           (((\a.\b.((\c.a+b+c) 10)) 5) 6)
//           ((\a.\b.((\c.a+b+c) 10)) 5) 6
//                (\b.((\c.5+b+c) 10))   6
//                    ((\c.5+6+c) 10)
//                         5+6+10
//                           21


export let sum_20 = a => b => {
    let c = 10
    c = 20
    return a + b + c
}
//           (\a.\b.((\c.(\c.a+b+c)20) 10))

let res1 = (sum_10(5))(6)
//           (((\a.\b.((\c.(\c.a+b+c)20) 10)) 5) 6)
//           ((\a.\b.((\c.(\c.a+b+c)20) 10)) 5) 6
//                (\b.((\c.(\c.5+b+c)20) 10))   6
//                    ((\c.(\c.5+6+c)20) 10)
//rule                    ((\c.5+6+c)20)[c/10]
//                         (\c.5+6+c)20
//                         5+6+20
//                           31

let is_leap = (year:number) : boolean => 
    year % 4 != 0 ? false :
    year % 100 != 0 ? true :
    year % 400 != 0 ? false :
    true

// a,b
// if(a > b) return "a > b"
// else "a <= b"
//
export let compare = (a:number) => (b:number) : string => //a > b ? "a > b" : "a <= b"
    {
      if(a > b) return "a > b"
      else return "a <= b"   
    }

//fact 5 => 5 * 4 * 3 * 2 * 1 
export let factorial = (n:number) => n <= 1 ? 1 : n * factorial(n-1)

// 0 1 2 3 4 5
// 1 1 2 3 5 8
export let fibonacci = (n:number) => n <= 1 ? 1 : fibonacci(n - 1) + fibonacci(n - 2)

// m   n
//10 / 3  = 3
// 2 / 3  = 0
export let int_divsion = (m:number) => (n:number) : number => n > m ? 0 : 1 + int_divsion(m-n)(n)


export let numbers = (n:number) : string => n > 0 ? numbers (n - 1) + `${n}` : "0"
export let line_of_symbols = (length:number) => (symbol:string) : string => {
    if(length == 0) return ""
    else return symbol + line_of_symbols(length-1)(symbol)
} 
//tail recursion
let line_of_symbols_alter_AUX = (length:number) => (symbol:string) => (acc:string): string => {
    if(length == 0) return acc
    else return line_of_symbols_alter_AUX(length-1)(symbol)(symbol + acc)
} 
export let line_of_symbols_alter = (length:number) => (symbol:string) : string => {
    return line_of_symbols_alter_AUX(length)(symbol)("")
}
/* exercises:
return a string containing all numbers from 0 to n (recursive)


return a string containing all numbers from n to 0 (recursive)
return a string containing all numbers within a range n - m (recursive)
return a string containing all even number  within a range n - m (recursive)
draw a line of asterisks of a given length
draw a line of of a symbol taken as input of a given length
generate a binary string from a positive number
*/