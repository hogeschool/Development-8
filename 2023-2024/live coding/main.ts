// type BasicFun<input,output> = (_:input) => output
// type Updater<state> = BasicFun<state, state>

// type Readonlify<T> = { readonly [k in keyof T]:T[k] }

// type PersonData = { name:string, surname:string, age:number }
// type Person = { name:string, surname:string, age:number }
// type PersonRepository = {
//   Default:BasicFun<PersonData, Person>,
//   Updaters:{ aged:BasicFun<number, Updater<Person>> }
// }
// const Person : PersonRepository = {
//   Default:(data) => ({
//     ...data, // "with" syntax for quick record copy == "spread" operator
//     // aged:function(this:Person, extraYears:number) {
//     //   return Person.Updaters.aged(extraYears)(this)
//     // }  
//   }),
//   Updaters:{
//     aged:(extraYears) => (person) => 
//       Person.Default({ ...person, age:person.age + extraYears })
//   },
// }

// // curried
// const add_c : BasicFun<number, BasicFun<number, number>> = 
//   x => y => x + y

// // uncurried
// const add_uc : BasicFun<[number, number], number> =
//   ([x,y]) => x + y


// type Job = { description:string, salary:number }
// type Employee = Person & Job

// const Employee = {
//   Default:(person:Person, job:Job) : Employee => ({
//     ...person, ...job
//   }),
//   Updaters:{
//     person:(_:Updater<Person>) : Updater<Employee> => 
//       currentEmployee => 
//         ({...currentEmployee, 
//           ..._(currentEmployee)}),
//     job:(_:Updater<Job>) : Updater<Employee> => 
//       currentEmployee => 
//         ({...currentEmployee, 
//           ..._(currentEmployee)}),
//   },
// }

// const e = Employee.Updaters.person(Person.Updaters.aged(10))(Employee.Default(Person.Default({ name:"Jim", surname:"Pim", age:20 }), { description:"AH cashier", salary:13.5 }))
// function prettyPrintPerson(p:Person, cont:BasicFun<string, void>) {
//   cont(`${p.name}, ${p.surname} is ${p.age} years old`)
// }
// function prettyPrintJob(j:Job) {
//   console.log(`${j.description} pays ${j.salary}euro per hour`)
// }
// prettyPrintPerson(e)
// prettyPrintJob(e)

// type Employee = ({ kind:"manager", reports:number } | { kind:"salesman", target:number }) & Person
// const mgr:Employee = { kind:"manager", reports:50, name:"Jim", surname:"Pim", age:42 }
// const smn:Employee = { kind:"salesman", target:10000, name:"Wim", surname:"Kim", age:26 }

// function prettyPrintEmployee(e:Employee, cont:BasicFun<string, void>) {
//   prettyPrintPerson(e, prefix => {  
//     if (e.kind == "manager") {
//       cont(`${prefix} and is a manager with ${e.reports} reports`)
//     } else {
//       cont(`${prefix} and is a salesman with ${e.target} yearly target`)
//     }
//   })
// }

// prettyPrintEmployee(mgr, console.log)
// prettyPrintEmployee(smn, console.log)

type BasicFun<a, b> = (_: a) => b
type Fun<a, b> = BasicFun<a, b> & {
  then: <c>(g: BasicFun<b, c>) => Fun<a, c>
}
const Fun = <a, b>(f: BasicFun<a, b>): Fun<a, b> =>
  Object.assign(
    f,
    {
      then: function <c>(this: Fun<a, b>, g: BasicFun<b, c>): Fun<a, c> {
        return Fun(a => g(this(a)))
      }
    }
  )
const id = <a>(v:a) => v

type BasicUpdater<s> = BasicFun<s, s>
type Updater<s> = BasicUpdater<s> & {
  fun: Fun<s, s>
  then: (g: BasicUpdater<s>) => Updater<s>
}
const Updater = <s>(f: BasicUpdater<s>): Updater<s> =>
  Object.assign(
    f,
    {
      fun: Fun(f),
      then: function (this: Updater<s>, g: BasicUpdater<s>): Updater<s> {
        return Updater(s => g(this(s)))
      }
    }
  )


type Parent = {
  x: number
  child1: Child
  child2: Child
}
const Parent = {
  Default: (): Parent => ({
    x: 0,
    child1: Child.Default(),
    child2: Child.Default(),
  }),
  Updaters: {
    x: (fieldUpdater: BasicUpdater<Parent["x"]>): Updater<Parent> =>
      Updater(entity => ({ ...entity, x: fieldUpdater(entity.x) })),
    child1: (fieldUpdater: BasicUpdater<Parent["child1"]>): Updater<Parent> =>
      Updater(entity => ({ ...entity, child1: fieldUpdater(entity.child1) })),
    child2: (fieldUpdater: BasicUpdater<Parent["child2"]>): Updater<Parent> =>
      Updater(entity => ({ ...entity, child2: fieldUpdater(entity.child2) })),
  }
}
type Child = {
  s: string
}
const Child = {
  Default: (): Child => ({
    s: ""
  }),
  Updaters: {
    s: (fieldUpdater: BasicUpdater<Child["s"]>): Updater<Child> =>
      Updater(entity => ({ ...entity, s: fieldUpdater(entity.s) })),
  }
}

const incr = Updater<number>(_ => _ + 1)
const decr = Updater<number>(_ => _ - 1)
const dobl = Updater<number>(_ => _ * 2)
const geqz = Fun<number, boolean>(_ => _ >= 0)
const todr = Updater<string>(_ => "Dr " + _)
const tomr = Updater<string>(_ => "Mr " + _)
const toms = Updater<string>(_ => "Ms " + _)
const excl = Updater<string>(_ => _ + "!")

const replaceWith = <s>(s: s): Updater<s> => Updater(_ => s)

const initialisation =
  Parent.Updaters.child1(Child.Updaters.s(replaceWith("John Doe"))).then(
    Parent.Updaters.child2(Child.Updaters.s(replaceWith("Jane Doe")))
  )

const child1Graduation = Child.Updaters.s(
  todr
).then(
  Child.Updaters.s(
    excl
  )
)

const child2Graduation = Child.Updaters.s(
  todr.then(toms)
)


const pipeline =
  initialisation.then(
    Parent.Updaters.x(incr.then(dobl)).then(
      Parent.Updaters.child1(
        child1Graduation
      ).then(
        Parent.Updaters.child2(
          child2Graduation
        )
      )
    )
  )

console.log(pipeline(Parent.Default()))

const curry = <a,b,c>(f:(a:a, b:b) => c) : BasicFun<a, BasicFun<b,c>> => a => b => f(a,b)
const flip = <a,b,c>(f:BasicFun<a, BasicFun<b,c>>) : BasicFun<b, BasicFun<a,c>> => b => a => f(a)(b)
const flip2 = <a,b,c>(f:(a:a, b:b) => c) : ((b:b, a:a) => c) => uncurry(flip(curry(f)))
const uncurry = <a,b,c>(f:BasicFun<a, BasicFun<b,c>>) : ((a:a, b:b) => c) => (a,b) => f(a)(b)

type Pair<a,b> = [a,b]
const Pair = <a,b>() => ({
  Default:(a:a, b:b) : Pair<a,b> => ([a,b]),
  Map:{
    left:<c>(f:BasicFun<a,c>) : Fun<Pair<a,b>, Pair<c,b>> => Pair<a,b>().Map.both(f, id),
    right:<c>(f:BasicFun<b,c>) : Fun<Pair<a,b>, Pair<a,c>> => Pair<a,b>().Map.both(id, f),
    both:<c,d>(f:BasicFun<a,c>, g:BasicFun<b,d>) : Fun<Pair<a,b>, Pair<c,d>> => Pair<a,b>().fold(a => b => Pair<c,d>().Default(f(a), g(b))),
  },
  fold:<c>(f:BasicFun<a,BasicFun<b,c>>) : Fun<Pair<a,b>, c> => Fun(([a,b]) => f(a)(b)),
  Examples:{
    sum:() => Pair<number,number>().fold(a => b => a + b),
    repeat:() : Fun<Pair<string,number>,string> => Pair<string,number>().fold(a => b => b <= 0 ? "" : a + Pair<string,number>().Examples.repeat()([a,b-1])),
    flip:<a,b>() : Fun<Pair<a,b>,Pair<b,a>> => Pair<a,b>().fold(flip(curry(Pair<b,a>().Default))),
  }
})

type Either<a,b> = { kind:"left", value:a } | { kind:"right", value:b }
const Either = <a,b>() => ({
  Default:{
    left:(a:a) : Either<a,b> => ({ kind:"left", value:a }),
    right:(b:b) : Either<a,b> => ({ kind:"right", value:b }),
  },
  Map:{
    left:<c>(f:BasicFun<a,c>) : Fun<Either<a,b>, Either<c,b>> => Either<a,b>().Map.both(f, id<b>),
    right:<d>(g:BasicFun<b,d>) : Fun<Either<a,b>, Either<a,d>> => Either<a,b>().Map.both(id<a>, g),
    both:<c,d>(f:BasicFun<a,c>, g:BasicFun<b,d>) : Fun<Either<a,b>, Either<c,d>> => 
      Fun(Either<a,b>().fold<Either<c,d>>(
        Fun(f).then(Either<c,d>().Default.left), 
        Fun(g).then(Either<c,d>().Default.right)))
      // Fun(e => e.kind == "left" ? Either<c,d>().Default.left(f(e.value)) : Either<c,d>().Default.right(g(e.value)))
  },
  fold:<c>(onLeft:BasicFun<a,c>, onRight:BasicFun<b,c>) : Fun<Either<a,b>, c> => 
    Fun(e => e.kind == "left" ? onLeft(e.value) : onRight(e.value))
})
type Option<a> = Either<a, void>

const NumStr = Pair<number,string>()
const pipeline2 = NumStr.Map.left(incr.then(dobl)).then(NumStr.Map.right(excl))

// const o:Option<Parent> = Either<Parent,void>().Default.left(Parent.Default())
// if (o.kind == "left") {
//   o.value.x
// }

const Parents = Pair<Parent, Parent>()
const pipeline3 = Parents.Map.both(initialisation, pipeline)
console.log(pipeline3(Parents.Default(Parent.Default(), Parent.Default())))

// list
// map
// filter
// fold

type List<a> = { kind:"empty" } | { kind:"full", head:a, tail:List<a> }
const List = <a>() => ({
  Default:{
    empty:() : List<a> => ({ kind:"empty" }),
    full:(head:a, tail:List<a>) : List<a> => ({ kind:"full", head, tail }),
  },
  Map:<b>(f:BasicFun<a,b>) : Fun<List<a>, List<b>> => 
    Fun(list_a => 
      list_a.kind == "empty" ? 
        List<b>().Default.empty() : 
        List<b>().Default.full(
          f(list_a.head), 
          List<a>().Map(f)(list_a.tail))),
  Filter:(p:BasicFun<a,boolean>) : Fun<List<a>, List<a>> => 
    Fun(list_a => list_a.kind == "empty" ? List<a>().Default.empty() : 
      p(list_a.head) ? 
        List<a>().Default.full(
          list_a.head, 
          List<a>().Filter(p)(list_a.tail))
      : List<a>().Filter(p)(list_a.tail)
    ),
  fold:<c>(onEmpty:() => c, onFull:(head:a, tail:c) => c) : Fun<List<a>, c> => Fun(l => 
    l.kind == "empty" ? 
      onEmpty() : 
    onFull(l.head, List<a>().fold(onEmpty, onFull)(l.tail))
  ),
})

const addAll = List<number>().fold(() => 0, (a,b) => a + b)
const mulAll = List<number>().fold(() => 1, (a,b) => a * b)
const addLengths = List<string>().fold(() => 0, (a,b) => a.length + b)
const Nums = List<number>()
const pipeline4 = Nums.Map(incr.fun.then(geqz))

console.log(JSON.stringify(pipeline4(Nums.Default.full(10, Nums.Default.full(9, Nums.Default.full(8, Nums.Default.empty()))))))

const pipeline5 = Nums.Filter(incr.fun.then(_ => _ % 2 == 0))
console.log(JSON.stringify(pipeline5(Nums.Default.full(10, Nums.Default.full(9, Nums.Default.full(8, Nums.Default.empty()))))))

// hierarchical expressions: trees and boolean/arithmetic expressionss

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

