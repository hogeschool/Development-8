"use strict";
// type BasicFun<input,output> = (_:input) => output
// type Updater<state> = BasicFun<state, state>
const Fun = (f) => Object.assign(f, {
    then: function (g) {
        return Fun(a => g(this(a)));
    }
});
const id = (v) => v;
const Updater = (f) => Object.assign(f, {
    fun: Fun(f),
    then: function (g) {
        return Updater(s => g(this(s)));
    }
});
const Parent = {
    Default: () => ({
        x: 0,
        child1: Child.Default(),
        child2: Child.Default(),
    }),
    Updaters: {
        x: (fieldUpdater) => Updater(entity => ({ ...entity, x: fieldUpdater(entity.x) })),
        child1: (fieldUpdater) => Updater(entity => ({ ...entity, child1: fieldUpdater(entity.child1) })),
        child2: (fieldUpdater) => Updater(entity => ({ ...entity, child2: fieldUpdater(entity.child2) })),
    }
};
const Child = {
    Default: () => ({
        s: ""
    }),
    Updaters: {
        s: (fieldUpdater) => Updater(entity => ({ ...entity, s: fieldUpdater(entity.s) })),
    }
};
const incr = Updater(_ => _ + 1);
const decr = Updater(_ => _ - 1);
const dobl = Updater(_ => _ * 2);
const geqz = Fun(_ => _ >= 0);
const todr = Updater(_ => "Dr " + _);
const tomr = Updater(_ => "Mr " + _);
const toms = Updater(_ => "Ms " + _);
const excl = Updater(_ => _ + "!");
const replaceWith = (s) => Updater(_ => s);
const initialisation = Parent.Updaters.child1(Child.Updaters.s(replaceWith("John Doe"))).then(Parent.Updaters.child2(Child.Updaters.s(replaceWith("Jane Doe"))));
const child1Graduation = Child.Updaters.s(todr).then(Child.Updaters.s(excl));
const child2Graduation = Child.Updaters.s(todr.then(toms));
const pipeline = initialisation.then(Parent.Updaters.x(incr.then(dobl)).then(Parent.Updaters.child1(child1Graduation).then(Parent.Updaters.child2(child2Graduation))));
console.log(pipeline(Parent.Default()));
const Pair = () => ({
    Default: (a, b) => ([a, b]),
    Map: {
        left: (f) => Fun(([a, b]) => ([f(a), b])),
        right: (f) => Fun(([a, b]) => ([a, f(b)])),
        both: (f, g) => Pair().Map.left(f).then(Pair().Map.right(g))
    }
});
const Either = () => ({
    Default: {
        left: (a) => ({ kind: "left", value: a }),
        right: (b) => ({ kind: "right", value: b }),
    },
    Map: {
        left: (f) => Either().Map.both(f, (id)),
        right: (g) => Either().Map.both((id), g),
        both: (f, g) => Fun(e => e.kind == "left" ? Either().Default.left(f(e.value)) : Either().Default.right(g(e.value)))
    }
});
const NumStr = Pair();
const pipeline2 = NumStr.Map.left(incr.then(dobl)).then(NumStr.Map.right(excl));
// const o:Option<Parent> = Either<Parent,void>().Default.left(Parent.Default())
// if (o.kind == "left") {
//   o.value.x
// }
const Parents = Pair();
const pipeline3 = Parents.Map.both(initialisation, pipeline);
console.log(pipeline3(Parents.Default(Parent.Default(), Parent.Default())));
const List = () => ({
    Default: {
        empty: () => ({ kind: "empty" }),
        full: (head, tail) => ({ kind: "full", head, tail }),
    },
    Map: (f) => Fun(list_a => list_a.kind == "empty" ? List().Default.empty() :
        List().Default.full(f(list_a.head), List().Map(f)(list_a.tail))),
    Filter: (p) => Fun(list_a => list_a.kind == "empty" ? List().Default.empty() :
        p(list_a.head) ?
            List().Default.full(list_a.head, List().Filter(p)(list_a.tail))
            : List().Filter(p)(list_a.tail)),
});
const Nums = List();
const pipeline4 = Nums.Map(incr.fun.then(geqz));
console.log(JSON.stringify(pipeline4(Nums.Default.full(10, Nums.Default.full(9, Nums.Default.full(8, Nums.Default.empty()))))));
const pipeline5 = Nums.Filter(incr.fun.then(_ => _ % 2 == 0));
console.log(JSON.stringify(pipeline5(Nums.Default.full(10, Nums.Default.full(9, Nums.Default.full(8, Nums.Default.empty()))))));
// continue with (unit4) list.fold, curry, uncurry
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
