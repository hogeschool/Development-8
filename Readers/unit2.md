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
float x = 5;
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
