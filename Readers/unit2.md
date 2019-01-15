# Types in Functional Programming

In Unit 1 we introduced an untyped formulation of lambda calculus, which is the foundational model of functional programming. We then proceeded to translate the constructs of lambda calculus into the functional programming language F\# without focusing on types. In this chapter we introduce a statically typed version of lambda calculus and then we show how this is translated into F\#. We then introduce the first built-in data functional data structures in F\#, optional and lists, and we show how to use them in a series of concrete examples.

## Typed Lambda Calculus

TODO

## Type Annotation in F\#

Type checking in F\# follows the same basics rules defined in the previous section. Type annotation of bindings can be achieved with the following syntax:

```
let (id : type) = expr
```

where `id` is the identifier used for the binding and `type` a valid type indentified. Basic types in F\# are `int`, `float` (double\-precision floating\-point numbers like `double` in C\#), `float32` (single\-precision floating\-point numbers like `float` in C\#), `string`, ...

For example\:

```fsharp
let (x : float) = 5.25
```

Note that F\# does not perform automatic type conversions like C\#, so for example the following code will produce a type error\:

```fsharp
let (x : float) = 5
```

whereas, the same code in C\# would work\:

```csharp
double x = 5;
```

In order to correctly type the expression above, we use the correct floating\-point double\-precision literal:

```fsharp
let (x : float) = 5.0
```

For this reason, every numerical type has its different corresponding literal in F\#. A comprehensive list can be found in [MSDN](https://docs.microsoft.com/en-us/dotnet/fsharp/language-reference/literals).

Arguments of lambda abstractions can be typed analogously\:

```
let (f : t1 -> t2 -> ... -> tn -> tr) = fun (arg1 : t1) (arg2 : t2) ... (argn : tn) -> expr
```

Notice that, if we do not want to rely on type inference, we must provide the type of the binding as the type of an abstraction, as we are binding a lambda. For example\:

```fsharp
let (add: int -> int -> int) = fun (x : int) (y : int) -> x + y
```

As seen in Unit 1, an alternative notation to define functions is possible, which becomes with type annotations\:

```
let f (arg1 : t1) (arg2 : t2) ... (argn : tn) : tr = expr
```

Thus, for example, the function `add` can be redefined as\:

```fsharp
let add (x : int) (y : int) : int = x + y
```
 
 F\# supports generic polymorphism, thus we can provide type parameters to functions. This is done by adding an apostrophe before the type name, such as\:

 ```fsharp
 let (stringify : 'a -> string) = fun (x : 'a) -> string x
 ```

 This means that the function `stringify` is generic with respect to the type parameter `'a`. Note that the language distinguishes between non\-generic and generic types by checking if they are preceeded by an apostrophe, thus `'string` denotes a generic type called `string` and `string` (without the apostrophe) is the built\-in type for strings.

## Basic Data Structures in F\#

F\# natively implements complex data structures such as _tuples_ and _lists_. A tuple is an ordered sequence of non-homogeneous values, such as `(3,"Hello world!",-45.3f)`. The type of a tuple is denoted as

```
t1 * t2 * ... * tn
```

where `t1`, `t2`,..., `tn` are types. Thus a tuple is the n-ary cartesian product of values of type `t1`, `t2`,..., `tn`. For example\:

```fsharp
let (t : int * string * float32) = (3,"Hello world!",-45.3f)
```

Tuples, of course, can be passed as arguments to functions. In this context, there is a particular application of this which is an alternative to currying. In Unit 1 we saw that in lambda calculus (and also in F\#) function admits one argument only. In order to model the behaviour of functions that operate on more than one argument, we relied on the notion of currying\: a function that wants to use two arguments will simply return in its body another lambda that is able to process the second argument and has in its closure the first argument. For instance\:

```fsharp
let add = fun x -> fun y -> x + y
```

When we call such function with `add 3 5` we replace `x` with 3 in its body thus generating `fun y -> 3 + y`, and then we apply `(fun y -> 3 + y) 5` thus obtaining `3 + 5 = 8`. An alternative to this is the _uncurried_ version, where we pass the arguments in a tuple as follows\:

```fsharp
let addUncurried = fun (x,y) -> x + y
```

Note that the curried and uncurried versions are not interchangable because their type is different. For instance, the type of `add` is\:

```fsharp
let (add : int -> int -> int) = fun x y -> x + y
```

while the type of `addUncurried` is\:

```fsharp
let (addUncurried : int * int -> int) = fun (x,y) -> x + y
```

Notice that the uncurried version of a function takes both arguments all together, thus partial application is not possible\: we can call `add 3` and this will generate as result `lambda y -> 3 + y`, but we cannot call `addUncurried 3` because this would mean passing an argument of typ `int` to a function that expects `int * int`. We will see further ahead in this course that it is possible to define a generic function that can convert the curried version of a function to the uncurried version, and the opposite.

## Optional Type

Another buit-in type in F\# is `option`.
