---
header-includes: |
 \usepackage{amsmath}
 \usepackage{mathtools}  
 \usepackage{tikz}
 \usetikzlibrary{arrows,automata,quotes}
geometry: margin=1.5cm 
...

# Unit 4 – Advanced Functions
In this unit, we study the various function operators available in Typescript. We will start with basic function manipulation operators, and then move on to important design patterns that make use of these operators.

## Function composition, pipe operator
Functions in TS are not more special than, say, integers or strings. Just like these simple data types can be defined, manipulated in expressions, transformed, taken as parameters from functions, and be returned as parameters, so can functions. This means that _functions may accept as parameters, and return as result, other functions_. A function that accepts another function as parameter is called a _higher order function_ (HOF), and a function that returns a function is known as _curried_.

> This characteristic of supporting higher order and curried functions, which was originally typical of cutting\-edge functional languages, has been widely recognized to be a fundamental aspect of high quality software engineering, and is now found in most modern programming languages. In this, F\# has played an important historical role\: the adoption of functional constructs in the mainstream began many years ago in C\#, directly integrating F\# innovations and know\-how. From C\#, "lambda functions" spread to other languages, from C++ to Java and more, finally becoming an absolute requirement. Of course other languages helped popularize these concepts, among others JavaScript played a very large role next to C\#, in shaping software engineering as we understand it nowadays. And now, we get it all in TypeScript.

A simple higher order curried function is `compose`, the function that takes two functions as parameters and invokes them in sequence, turning them into a pipeline\:

```ts
  //here a, b and c are three different types: 
  //notice that b is the return type of f, 
  //this type has to be the same as the input type of g
  //the function compose takes two functions as input (f and g) 
  //and returns a function from type a to type c
  //resulting from merging f: (_:a) => b with g: (_: b) => c

  const compose_v1 = <a,b,c>(f: (_:a) => b, g: (_: b) => c) => { 
    const merge = (input: a): c => {
                                    const output_f: b = f(input)
                                    const output_g: c = g(output_f)
                                    return output_g
                                   }
    return merge
  }

  const compose_v2 = <a,b,c>(f: (_:a) => b, g: (_: b) => c) => { 
    const merge = (input: a): c => g(f(input))
    return merge
  }

  const compose_v3 = <a,b,c>(f: (_:a) => b, g: (_: b) => c) => 
                                   (input: a): c => g(f(input))

  const compose_ = <a,b,c>(f: (_:a) => b) : (g: (_: b) => c) => ((_: a) => c) => g =>
    input => g(f(input))

  const compose = <a,b,c>(f: (_:a) => b) => (g: (_: b) => c) =>
    (input: a): c => g(f(input))

  console.log(compose_v1<number,number,number>(_ => _ + 2, _ => _ * 3)(3))
  console.log(compose_v2<number,number,number>(_ => _ + 2, _ => _ * 3)(3))
  console.log(compose_v3<number,number,number>(_ => _ + 2, _ => _ * 3)(3))
  console.log(compose_<number,number,number>(_ => _ + 2)(_ => _ * 3)(3))
  console.log(compose<number,number,number>(_ => _ + 2)(_ => _ * 3)(3))
```

`compose` is a HOF because `f` and `g`, its parameters, are both functions. Given that `compose` returns a function, we also say that it is curried.

The `compose` function is actually so central to functional programming, that we can build it as a custom operator in our custom type:

```ts

type BasicFunc<T1, T2> = (_:T1) => T2

type Fun<input, output> = 
  BasicFunc<input, output> &
  {
    then: <nextOutput>(other:BasicFunc<output, nextOutput>) => Fun<input, nextOutput>
  }

const Fun = <input, output>(actual: BasicFunc<input, output>) : Fun<input, output> => {
  const f = actual as Fun<input, output>
  f.then = function<nextOutput>(this: Fun<input, output>, other: BasicFunc<output, nextOutput>) : 
           Fun<input, nextOutput>        
           {
              return Fun((input: input) => other(this(input)))
           }       
  return f
}

const id = <T>() => Fun<T, T> ((x: T) => x)
```

We could play around with function composition as follows\:

```ts
const incr = Fun((x: number) => x + 1)
const double = Fun((x: number) => x * 2)
const halve = Fun((x: number) => x / 2)

const incrDouble= incr.then(double)
```

Or we could go for an even longer pipeline\:

```ts
const calculations = double.then(incr).then(incr).then(halve)

const process =  id<number>()
                .then((x: number) => x + 1)
                .then(id())
                .then(((x: number) => x + 10))
                .then((x: number) => x + "")
                .then((x: string) => x + "!?")
                .then((x: string) => x + "!!!")
                .then(x => x.length)
                .then((x => x + "!!!"))
                .then(id())

console.log(calculations(200))
console.log(`\n EXAMPLE: ${process(51238)}`)
```

Notice that `f` does not invoke `double` or `incr`. Rather, `f` is simply a newly created, dynamic function, which will invoke `double`, `incr`, etc. whenever it itself is invoked.


An interesting pattern that we can build with function composition is function repetition, which basically implements the logic of a `for` loop by composing the body of the loop (a function `f`) `n` times with itself\:

```ts
const repeat = <T> (f: Fun<T, T>) : (n: bigint) => Fun<T, T> => n => 
  n == 0n ? id<T>() : f.then(repeat(f)(n - 1n))
```

Thanks to `repeat`, we can perform an operation many times, easily building regular patterns\:

```ts
const star = Fun((s:string) => s + "*")
const space = Fun((s:string) => s + " ")
const newline = Fun((s:string) => s + "\n")

const row = Fun((n: bigint) => repeat(star)(n))
const square = Fun((n: bigint) => repeat(row(n).then((newline)))(n))

console.log(row(10n).then(newline)(""))
console.log(square(10n)(""))
```

Notice that neither `row(3n)`, nor `square(5n)` would be pictures. They are both functions, waiting to be either composed with other rendering functions, or invoked with an initial string to render from (`square(5n)("")`).

> We can also use `curry` and `uncurry` to remove the ugly `n` parameter from `row` and `square` for fun and profit. We will see it later.

<div style="visibility: hidden"> 
  <span> \pagebreak </span>
</div>

## HOF design patterns
Higher order functions can be assembled along standard design patterns which arise very commonly in most data structures.


### `map`
A very powerful, and the most common design pattern when it comes to higher order and curried functions is `map` over a data structure. `map` performs a transformation of the _content_ of a data structure, without altering the structure itself. We often refer to `map` as a _structure\-preserving transformation_.

For example, consider transforming the first element of a pair `(x,y)` according to a function `f`\:

```ts
type Pair<a,b> = [a,b]
const mapTupleLeft = <a, b>(f: BasicFunc<a, a>) : ([x, y]: Pair<a, b>) => 
                                                   Pair<a, b> => ([x, y]: Pair<a, b>) => [f(x), y]
```

Notice that the resulting pair will still be a pair (moreover: the second element is precisely the same!). This is what we mean by _preserving structure_. Had the pair become a triple, then the structure would now be different. The first element is changed, by feeding the original value to function `f`. This leads to a new first element, which not only could be of a different value, but could actually even have a fully different type. We do not consider this change of _internal type_ to be a change in structure, because the only structure we wish to preserve is the outer structure of the pair, and not the inner structure of the content to be transformed.

We could call the function as follows\:

```ts
const p1 = mapTupleLeft(incr)([1,"a"]) // => ([2,"a"])
const p2 = mapTupleLeft(double)([2,"a"]) // => ([4,"a"])
const p3 = mapTupleLeft(incr.then(double))([2,["a","b"]]) // => ([6,["a","b"]])
console.log(`p1: [${p1[0]}, ${p1[1]}]\np2: [${p2[0]}, ${p2[1]}] \np3: [${p3[0]}, ${p3[1]}]`)
```


> There is a reason why the `map` design pattern is so common\: `map` is the homomorphism associated with a functor. Functors are an incredibly common structure both in mathematics and in programming, and as such they are found everywhere. Many developers, unaware of the existance of functors, rediscover the concept accidentally by noticing that their data structures could indeed implement `map`.

A tuple supports two different `map` functions\: one for the left element, the other for the right element. The preserved structure is clearly the same, but the preserved element is not\:

```ts
const mapTupleRight = <a, b>(f: BasicFunc<b, b>) : ([x, y]: Pair<a, b>) => Pair<a, b> => 
                                                       ([x, y]: Pair<a, b>) => [x, f(y)]
```

We can define a structure\-preserving transformation for basically anything, but when it comes to containers, the transformation becomes even more interesting, as it allows us to _perform operations on all the content_ of the container at once.

For example, consider the `Option` datatype. `Option` is a container, that may contain at most one element. In this sense, its `map` function performs some operation on the content, thus either once or not at all, depending on the structure (`Some` or `None`) of the original input\:

```ts
type None = {kind: "None"}
type Something<T> = {kind:"Some", Value: T}
type Option<T> = None | Something<T>

const none = () : None => ({kind: "None"})
const some = <T>(param: T) : Something<T> => ({kind: "Some", Value: param}) 

const mapOption = <U, V> (f: BasicFunc<U, V>) : ((input: Option<U>) => Option<V>) =>
  input => input.kind == "None" ? none() : some(f(input.Value))

```

Notice that the structure\-preservation guarantees that `mapOption` will always return `None` if the input was `None`, and `Some` if the input was `Some` (albeit with different content in the second case).

```ts
const optRes1 = mapOption(incr)(none()) // => None
const optRes2 = mapOption(incr)(some(3)) // => Some 4
const optRes3 = mapOption(double)(some(3)) // => Some 6
```


Similarly, we can extend the `map` concept to `List`. This means that we will transform all elements of the list, in a recursive fashion, according to the given function\:

```ts
//-------List--------
type EmptyList = {kind: "empty"}
type FullList<T> = {kind: "full", head: T, tail:List<T>}
type List<T> = EmptyList | FullList<T>

const empty = () : EmptyList => ({kind: "empty"})
const full = <T>(_: T) : (__: List<T>) => FullList<T> => 
             __ => ({kind: "full", head:_, tail: __})

const List = <T>(array : T[]) : List<T> => (array.length == 0) ? 
                                           empty() :
                                           (array.length == 1) ?
                                           full(array[0])(empty()) :
                                           full(array[0])(List(array.slice(1)))                
//--------------------

const mapList = <U, V> (f: BasicFunc<U, V>) : (l: List<U>) => List<V> => l => 
                 l.kind == "empty" ? empty() : full(f(l.head))(mapList(f)(l.tail))
```

The structure preservation can here be seen in the fact that the result of `mapList` always has the same number of list elements as the input list, meaning that `mapList` will never alter the length of the original list\:

```ts 
const emptyList = mapList(incr)(empty()) // => []
const numberList1 = mapList(incr)(full(1)(full(2)(full(5)(empty())))) // => [2,3,6]))
const numberList = mapList(incr)(List([1, 2, 5])) // => [2,3,6]))
```

<div style="visibility: hidden"> 
  <span> \pagebreak </span>
</div>

## Composing multiple `map`'s

It is possible to combine different `map` functions together. We can combine them by simply invoking them in a nested fashion, by explicitly specifying the content transformation\:

```ts
const mapListOption = <U, V> (f: BasicFunc<U, V>) => mapList(mapOption(f))
```

Of course declaring a parameter `f` just to pass it along is not very pretty, as it clutters code without really adding anything interesting or particularly informative. Fortunately, function composition comes to the rescue, because we can simply compose (look out for the inverted order!) the two mapping functions as follows\:

```ts
const mapListOption = <U, V> (f: BasicFunc<U, V>) => 
             Fun< BasicFunc<U, V>, BasicFunc<Option<U>, Option<V>> >(mapOption).then(mapList)(f)
```

## Non\-structure\-preserving transformations\: `filter`

`map` is not the only common design pattern in functional programming. Another transformation that frequently arises, but only when dealing with a dynamic collection, is `filter`, which removes elements from a collection based on some predicate.

`filter` on an `Option` would check whether or not there is an element, and it respects the predicate. In all other cases, the element is discarded from the collection\:

```ts
const filterOption = <T> (p: BasicFunc<T, boolean>) : (_: Option<T>) => Option<T> => 
  l => l.kind == "Some" && p(l.Value) ? some(l.Value) : none()

console.log(filterOption((_: number) => _ % 3 == 0)(some(9)))
console.log(filterOption((_: number) => _ % 3 == 0)(none()))
```

Filtering a list requires checking all elements in turn, recursively\:

```ts
const filterList_ = <U> (p: (_: U) => boolean) : (l: List<U>) => List<U> => 
              l =>
                 l.kind == "empty" ? empty() : 
                 p(l.head)? full(l.head)(filterList(p)(l.tail)) : 
                 filterList(p)(l.tail)

const filterList = <U> (p: BasicFunc<U, boolean>) : BasicFunc<List<U>, List<U>> => 
              l =>
                  l.kind == "empty" ? empty() : 
                  p(l.head)? full(l.head)(filterList(p)(l.tail)) : 
                  filterList(p)(l.tail) 
```

Notice that, while `map` preserves structure (that is, the number of elements in a list), `filter` does not. Whereas `map` gives a result that might have a different content type (`List<int> => List<string>`), `filter` will always preserve the type.

`filter` decides which elements to keep, and which elements to discard from a collection, so for example\:

```ts
console.log(filterList((_: number) => _ % 2 == 0)(List([1, 4, 6, 7, 21, 64, 78, 11, 20]))) 
// => [4, 6, 64, 78, 20]  
console.log(filterList((_: string) => _.startsWith("a"))(List(["a", "aa", "baa", "bb"]))) 
// => ["a", "aa"]
```
<div style="visibility: hidden"> 
  <span> \pagebreak </span>
</div>

## `fold`
The most general design pattern, which only applies to data structures with variable length (just like `filter`), is `fold`. `fold` will apply a function to all elements in a sort of cascade, in order to aggregate them all together into a single result. A typical example of folding a sequence is adding all elements together, computing the minimum, computing the maximum, finding a specific element, etc.

`fold` is implemented on lists in two different ways, depending on the order in which we want to visit the elements (left\-to\-right or right\-to\-left)\:

```ts
const foldList = <U, V>(z: V) : (f: ((_: U) => (__: V) => V)) => (l: List<U>) => V => f => l =>
  l.kind == "empty" ? z : f(l.head)(foldList<U,V>(z)(f)(l.tail))

const foldList2 = <U, V>(z: V) : (f: ((_: U) => (__: V) => V)) => (l: List<U>) => V => f => l =>
  l.kind == "empty" ? z : foldList<U, V>(f(l.head)(z))(f)(l.tail)  
```

We could, for example, use `fold` to add all elements as follows\:

```ts
foldList<number, number>(0)(x => y => x + y)(List([1, 2, 3])) 
// => (1 + (2 + (3 + 0))) => 6

```

or

```ts
foldList2<number, number>(0)(x => y => x + y)(List([1, 2, 3])) 
// => (((0 + 1) + 2) + 3) => 6

console.log(foldList<number, number>(0)(x => y => x + y)(List([20, 34, 56, 12])))
console.log(foldList<string, string>("")(x => y => x + y)(List(["h", "e", "l", "l", "o"])))
console.log(foldList<number, string>("")(x => y => x + ", " + y)(List([20, 34, 56, 12])))
```

> While for many operations it does not matter which version of `fold` we use (and thus, in those cases we should use `foldList2`, as it does not use the stack as much as `foldList` and can thus be compiled into a loop via _tail recursion optimisation_), sometimes the order in which the operations are executed really matters. Be on the lookout for these cases!

`fold` is very powerful. When a datastructure supports the  `fold` pattern, then we can build most (if not all!) of the functions we need on it via `fold` itself. For example, given that `List` supports `fold`, then we can define both `map` and `filter` on `List` via `fold`, instead of building both functions manually\: Assignments 1 and 2.

<div style="visibility: hidden"> 
  <span> \pagebreak </span>
</div>

## Partial application, curry, and uncurry
Currying is the technique which lets functions return other functions. It is very commonly encountered in functional programming languages such as Typescript, whenever a function takes its parameters one at a time. For example, consider a function that adds two numbers together\:

```ts
const add : BasicFunc<number, BasicFunc<number, number>> = x => y => x + y
console.log(add(1)(3))
```

The `add` function does not really take as input two numbers and returns their sum. Rather, it takes as input a single number, and returns the function that takes as input the second number and adds it to the first. This means that we could call `add` with only one input\:

```ts
const incr = add(1)
```

thereby obtaining the function that adds for example `1` to its input. Add is a _curried_ function, and passing some of its parameters like we have just done to produce `incr` is called _partial application_ ("partial" because we have provided _only a part_ of its input, and not all of it).

We can also perform computations between the arguments. For example, we could define a function that determines what to do based on the value of one of the first parameters\:

```ts
const conditionalPipeline = <T, U>(p: BasicFunc<T, boolean>) : 
                                 (f: BasicFunc<T, U>) => (g: BasicFunc<T, U>) => (x: T) => U =>
                                 f => g => x => p(x) ? f(x) : g(x)
console.log(conditionalPipeline<number, string>(_ => _ > 0)(_ => _ + "!!!")(_ => _ + "???")(2))
```

We would call this function as follows\:

```ts
const isPositive_incrOrDouble = conditionalPipeline<number, number>(_ => _ > 0)(_ => _ + 1)(_ => _ * 2)

```

and then, depending on what we would give to `f`, see either `incr` or `double` happen\:

```ts
console.log(isPositive_incrOrDouble(-4))  // => -8
console.log(isPositive_incrOrDouble(3))   // => 4
```

A simple practical example could be drawn from the `draw` functions we built when presenting `repeat`. Instead of defining `star`, `space`, etc. manually, we could simply define them as the partial application of a curried `draw` function in which the symbol to draw is the first parameter\:

```ts
const draw : BasicFunc<string, BasicFunc<string, string>> = s => sym => s + sym
const star = draw("*")
const space = draw(" ")
const newline = draw("\n")
```

Interestingly, we can automatically move between curried and uncurried functions, by defining the `curry` and `uncurry` higher order functions that transform an uncurried function that takes a tuple as input into a curried function that takes the inputs one at a time, and vice\-versa\:

```ts

const curry = <U> (f: (_: U, __: U) => U ) : BasicFunc<U, BasicFunc<U, U>> => 
                                          x => y => f(x, y)

const uncurry = <U> (f: BasicFunc<U, BasicFunc<U, U>> ) : (x: U, y: U) => U =>
                                          (x, y) => f(x)(y)
```

Suppose now that we were provided with a small\-minded draw function which, for reasons unknown to us (incompetence? malice? who knows!) is not built with currying and thus cannot be partially applied\:

```ts
const drawWrong = (sym: string, s: string) => s + sym
```

Fortunately, we can use `curry` to turn this function into its proper curried equivalent, and use it to define our utilities without ugly code repetition or the introduction of useless arguments that we only pass along or use just once in uninteresting fashions\:

```ts
const drawWrong = (sym: string, s: string) => s + sym
const draw = curry(drawWrong)
const star = draw("*")
const space = draw(" ")
const newline = draw("\n")
```

As a final example, consider the case of a `Person` record, plus a curried `rename` function\:

```ts
type Person = { name:string, surname:string }
const rename = (newName: string) : (p: Person) => Person => p => ({...p, name: newName })
```

We can now define some (admittedly not very useful) utility functions that change the name of a `Person` to the desired name. These functions all expect a `Person`, thanks to the partial application of `rename` to its first parameter only\:

```ts
const georgeify = rename("George")
const janeify = rename("Jane")
const jackify = rename("Jack")
```

We can then use these functions to rename some instances of `Person` as follows\:

```ts
const p1 = georgeify({ name: "Giorgio", surname: "Ruffa" })
const p2 = janeify({ name: "Alex", surname: "Pomaré" })
```

<div style="visibility: hidden"> 
  <span> \pagebreak </span>
</div>

## Function records
We can combine all we have seen so far in a powerful design pattern, known as type\-classes, where we define a record of functions over some generic datatype in order to implement something that somewhat resembles an interface in object\-oriented languages.

> Be careful! While it is true that type\-classes can be used in order to simulate interfaces, they also support quite a lot more than object\-oriented languages interfaces. For example, type\-classes allow us to define static methods, constructors, and operators, which interfaces do not support because of their requirement of at least one instance of the implementing class (the instance that will become `this` in the concrete implementation).

Consider two conceptually similar datatypes, built separately and not necessarily overlapping in attribute names (but indeed overlapping in attribute _meaning_)\:

```ts
type Manager = {
  name: string,
  surname: string,
  birthday: Date,
  company: string,
  salary: number
}

type Student = {
  Name: string,
  Surname: string,
  Birthday: Date,
  StudyPoints: number
}
```

We would now like to encode the fact that both of these data structures really represent some interface `Person`, which allows getting and setting `Name`, `Surname`, and `Birthday`. Other attributes cannot really be defined for `Person`, as they are not present in both `Manager` and `Student`. We encode this by defining a record of functions over a generic datatype `p`, which is the actual (and at this point unknown) type of a `Person`\:

```ts
type IPerson<p> = {
  getName: (_: p) => string,
  getSurname: (_: p) => string,
  getBirthday: (_: p) => Date,
  setName: (_: string) => (__: p) => p,
  setSurname: (_: string) => (__: p) => p,
  setBirthday: (_: Date) => (__: p) => p
}
```

We then define the implementation of `IPerson` for a `Manager`, and for a `Student`\:

```ts
const managerPerson: IPerson<Manager> =
{
  getName : (x: Manager) => x.name,
  getSurname : (x: Manager) => x.surname,
  getBirthday : (x: Manager) => x.birthday,
  setName : (v: string) : (x: Manager) => Manager => x => ({...x, name: v}),
  setSurname : (v: string) : (x: Manager) => Manager => x => ({...x, surname: v}),
  setBirthday : (v: Date) : (x: Manager) => Manager => x => ({...x, birthday: v}),
}
```

<div style="visibility: hidden"> 
  <span> \pagebreak </span>
</div>

```ts
const studentPerson: IPerson<Student> =
{
  getName : (x:Student) => x.Name,
  getSurname : (x:Student) => x.Surname,
  getBirthday : (x:Student) => x.Birthday,
  setName :  (v: string) : (x: Student) => Student => x => ({...x, Name: v}),
  setSurname : (v: string) : (x: Student) => Student => x => ({...x, Surname: v}),
  setBirthday : (v: Date) : (x: Student) => Student => x => ({...x, Birthday: v}),
}
```

At this point, we could define a simple, but highly generic program that takes as input both a person and its interface implementation (we call `i` the _witness_ of `p` being a `Person`, which sounds kind of awesome) and does stuff with the input `Person`\:

```ts
const genericProgram = <p>(i: IPerson<p>) : (person :p) => p => person => {
  const p1 = i.setSurname ("o' " + i.getSurname(person))(person) 
  const oldBirthday = i.getBirthday(p1)
  const newBirthday = new Date(oldBirthday.getFullYear() + 1, 
                               oldBirthday.getMonth(),
                               oldBirthday.getDay())
  return i.setBirthday(newBirthday)(p1) 
}
```

We can then call this generic program on both a `Student` and a `Manager`, by providing the actual witnesses `studentPerson` and `managerPerson` respectively\:

```ts
console.log(
            genericProgram(studentPerson)( 
                                            { 
                                              Name: "Jack",
                                              Surname: "Lantern",
                                              Birthday: new Date(1985, 2, 3),
                                              StudyPoints: 120,
                                            }
                                          )
           )

console.log(
          genericProgram(managerPerson)( 
                                        { 
                                          name: "John",
                                          surname: "Connor",
                                          birthday: new Date(1965, 2, 3),
                                          company: "Microsoft",
                                          salary: 150000,
                                        } 
                                       )
           )
```
<div style="visibility: hidden"> 
  <span> \pagebreak </span>
</div>

## Composition of functions and types
Functions have a type. The function from `a` to `b` is called `BasicFun<a,b>` or `Fun<a,b>`. Types built with the function `BasicFun` constructor can be mixed with all other type constructions.

For example, we could define a function that takes as input a list of curried functions, and invokes them all with the same arguments (thus multiple times). A first implementation to do this could be\:

```ts
const applyMany = <a,b,c>(l: List<Fun<a, Fun<b,c>>>) : (x: a) => (y: b) => List<c> => 
  x => y => mapList((f: Fun<b,c>) => f(y))(mapList((f: Fun<a, Fun<b,c>>) => f(x))(l))

console.log(applyMany<number, number, number>(List([Fun(_ => Fun(__ => _ + __)), 
                                                    Fun(_ => Fun(__ => _ - __))]))(4)(3))
```

Of course, there is no need to go through the list twice, so we can use `List.map` only once, to invoke the function with both parameters\:

```ts
const applyMany = <a,b,c>(l: List<Fun<a, Fun<b,c>>>) : (x: a) => (y: b) => List<c> => 
  x => y => (mapList((f: Fun<a, Fun<b,c>>) => f(x)(y))(l))

console.log(applyMany<number, number, number>(List([Fun(_ => Fun(__ => _ + __)), 
                                                    Fun(_ => Fun(__ => _ - __))]))(4)(3))
```

> The ability to compose constructs according to our will, without artificial limitations imposed by the language, is crucial, and more often than not underestimated in its impact when building high quality software.
> Composition makes it possible to build complex abstractions and large programs by leveraging the power of all the tried\-and\-tested functions and other components that we have already built and tested. Few tools offer the ability that (pure, referentially transparent) functional languages have to build components in isolation, test them, compose them, and obtain flawlessly working programs as a direct result, leading beginning practitioners of functional programming to believe that "programming in Typescript simply _works_, without bugs!".

<div style="visibility: hidden"> 
  <span> \pagebreak </span>
</div>

# Exercises

## Exercise 1

Implement `map` for lists using only `fold`.

## Exercise 2
Implement `filter` for lists using only `fold`.

## Exercise 3
Implement a function that flattens a list of lists into a single list using `fold`.

## Exercise 4
Implement a function that applies `f : a => b => c` to two lists of equal length `l1:List<a>` and `l2:List<b>`. If the two lists have different length, the shortest is leading.

## Exercise 5
Implement a function that folds two lists of different content and equal length. If the length is different then `None` is returned.
```ts
const fold2 : <U, a, b> (f : BasicFunc<U, BasicFunc<a, BasicFunc<b, U>>>) => (init: U) =>
  (l1 : List<a>) => (l2 : List<b>) => Option<U> =
```

## Exercise 6
Implement a function
```ts
const zip : <a,b> (l1 : List<a>) => (l2 : List<b>) => Option<List<Pair<a,b>>> = ...
```
that take two lists with the same length and creates a list of pairs containing the elements that are in the same position from both lists. 
Implement this function by using normal recursion and then by using the implementation of exercise 5.
