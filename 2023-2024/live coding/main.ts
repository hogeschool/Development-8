type BasicFun<input,output> = (_:input) => output
type Updater<state> = BasicFun<state, state>

type Readonlify<T> = { readonly [k in keyof T]:T[k] }

type PersonData = { name:string, surname:string, age:number }
type Person = Readonly<{ name:string, surname:string, age:number, aged:BasicFun<number, Person> }>
type PersonRepository = {
  Default:BasicFun<PersonData, Person>,
  Updaters:{ aged:BasicFun<number, Updater<Person>> }
}
const Person : PersonRepository = {
  Default:(data) => ({
    ...data, // "with" syntax for quick record copy == "spread" operator
    aged:function(this:Person, extraYears:number) {
      return Person.Updaters.aged(extraYears)(this)
    }  
  }),
  Updaters:{
    aged:(extraYears) => (person) => 
      Person.Default({ ...person, age:person.age + extraYears })
  },
}

const jimmy:Person = Person.Default({ 
  surname:"Malcolm", name:"Lionel", age:21, 
})

const jimmyOlder = jimmy.aged(18)
console.log(jimmy)
console.log(jimmyOlder)

// curried
const add_c : BasicFun<number, BasicFun<number, number>> = 
  x => y => x + y

// uncurried
const add_uc : BasicFun<[number, number], number> =
  ([x,y]) => x + y

// const threeThings:[number, [string, bigint], boolean] = [1, ["a string", 1000n], true]


// // [t1, t2, ..., tN] where t_i is a type
// // tuples are known as product types because they contain the Cartesian product of the composed types

// function f(_:[boolean | undefined, boolean | undefined]) {
//   console.log(_)
// }

/*
[boolean, boolean]
  [false, false]
  [false, true]
  [true, false
  [true, true]

|boolean| = 2
|[boolean, boolean]| = |boolean| x |boolean| = 2 x 2 = 4

|boolean | undefined| = 2+1 = 3

|[boolean, boolean | undefined]| = |boolean| x |boolean | undefined| = 2 x 3 = 6

|[boolean | undefined, boolean | undefined]| = 3 x 3 = 9

|[number, number, string]| = infinite x infinite x 2^infinite
*/

// const allDivisors = (n:number) => {
//   const allDivisors = (n:number) => (i:number) : string =>
//     i > n ? ""
//     : n % i == 0 ?
//       `${i} ${allDivisors(n)(i+1)}`
//     : allDivisors(n)(i+1)
//     return allDivisors(n)(1)
//   }
//
// console.log(allDivisors(30))

/*
while (...a...b...c...) {
  ...
  if (...)
    a = ...
  else
    b = ...
  ...
  c = ...
  ...
  if (...)
    a = ...
}
*/

/*
Lambda calculus: 1930 Church

parameters (variables): x, y, ..., T, U, V, ...
abstractions (anonymous functions - lambda functions): fun (x:t) -> ret
applications (calling a lambda): f arg

eval x => x
eval (fun x -> ret) => (fun x -> ret)
eval f g where eval (g => g') => f g'
eval (fun x -> ret) arg => ret[x |-> arg]

eval (fun x -> x) a => x[x |-> a] => a
eval (fun x -> fun y -> x) (fun z -> z) => (fun y -> x)[x |-> (fun z -> z)] => (fun y -> fun z -> z)


(fun x -> x + 1) (1 + 1) => (fun x -> x + 1) 2 => (x + 1)[x |-> 2] => 2 + 1 => 3

A function that takes as input a parameter and returns a function with the next parameter(s) known as a "curryied" function

fun x -> fun t -> x + y
fun x t -> x + y


let bindings:

let c = v in rest
(fun c -> rest) v


check(v,T) => (T[v], T)
check(fun (x:t_1) => ret, T) => (t_1 -> t_2, T)
  when check(ret, T[x := t_1]) => (t2, _)
check(f x, T) => (t_2, T)
  when check(f, T) => (t_1 -> t_2, T)  
  when check(x, T) => (t_1, T)


source := fun (x:number) => x > 0
check (fun (x:number) => x > 0, {}) => number -> boolean
  check (x > 0, { x: number }) => (boolean, { x: number})
*/

