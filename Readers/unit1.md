# Introduction to functional programming

Functional programming is a programming paradigm that is profoundly different from the imperative paradigm. This programming paradigm grants additional properties on the code that help the programmer to write code that is maintainable and correct. For this reason also imperative languages widely used in the industry have been including functional programming construct during the last decades: C\#, C++, Java, Javascript, Typescript all provide means of writing programs in terms  of functional programming abstractions, and some of them even integrated type systems that are as expressive as those of Haskell or CamL. It is evident that functional programming trascendended the role of a tool used only by researchers and pioneers of programming and is becoming more and more a reality in the industry.

The goal of this unit is to show the reader a comparison between the model of imperative programming, which was explained during the Development courses of the first year, and the functional paradigm. We then proceed to define the semantics of a functional programming language in terms of the lambda\-calculus model and we finish by introducing F\#, the functional language of choice.

## Imperative programming vs functional programming

An imperative program is made of a sequence of instructions or commands that alter the memory, which is in general refered to also as _State_. In the introductory programming courses of the first year we said that a program is evaluated through its _semantics_, that is a set of rules defining the behaviour of each construct in the language. In general, in an imperative programming language, each of these rules processes a program and in general returns a new program and a new state.

$eval(\langle P \rangle ,S) \rightarrow \langle P '\rangle,S'$


The new program is generally returned because the evaluation of a single instruction might, in general, require multiple steps. The new state is due to the fact that some of the instructions might perform operations in memory and thus change the state.

In the following more advanced courses we further extended the model of state by allowing _scoping_ and differentiate between _stack_ and _heap_, but the underlying logic does not change in its substance. Indeed the evaluation of a program with stack and heap is given by the following rule\:

$eval (\langle I;J\rangle,S,H) \rightarrow \langle I';J\rangle,S',H' \text{ where } eval(\langle I\rangle,S,H) \rightarrow \langle I'\rangle,S',H'$

In this context the program uses a shared memory that is read and written by each instruction. This means that the order that we use to execute the instructions change the behaviour of the program. So two different programs with the same instructions in different order might produce two different results. For example consider the following two code snippets in Python\:

```python
x = 5
y = 2
x = x + 1
y = x - y
```

```python
x = 5
y = 2
y = x - y
x = x + 1
```

In the first case, at the end of the execution, the state is $\lbrace x := 6, y := 4 \rbrace$ while in the second case the state is $\lbrace x := 6, y := 3 \rbrace$. The different results are determined by the different order of execution of line 3 and 4 in the two programs, wich is inverted in the second version. This creates undesirable side effect not only in single\-thread programs but also in multi\-thread ones. Getting rid of the problems related to shared memory often grants additional correctness properties and benefits, for example, parallelization and code maintainability. One very straightforward solution is getting rid of the mutable state itself, and this is where functional programming comes into play.

The computation in functional programming does not rely on the notion of state, and for this reason it is always defined as _stateless_ or _immutable_. The computation in a functional programming language consists of expression evaluations. Recalling the development courses of last year, we defined in the semantics a special semantics, called `eval_expr`, to process expression\: its evaluation did not change the state of the program (even though we were in the context of imperative programming) because the result was simply a value resulting from a computation.

$eval\text{\textunderscore}expr(\langle E\rangle, S) \rightarrow \langle E'\rangle$

The stateless model of computation grants an important property called _referential transparency_. Referential transparency grants that, at any point of a program, we can replace an expression with its value without changing the final result of the computation. In the following program

```python
x = 5
x = x - 2
y = x + 3
```

we cannot replace, for instance, `x` with 5, which is the value we assign to it in the first line. For example, if we replace `x` with 5 in the last line of code, `y` would get the value 8. But this is clearly wrong, because if we execute all the statements in the program, at line 2 the value of  `x` becomse 3, and thus `y` gets 6 after executing line 3. In a referential transparent program this does not happen\: we are sure that if, at any moment, we know already the value of an expression and we replace it with its value we do not alter the result of the program execution. A consequence of this is also that, for instance, calling two different functions in a different order does not change the final result of a program, while in general this is not true in imperative programming.

Being intrinsecally different from imperative programming, functional programming will require a completely different computational model which is not based on instructions and state transitions. This underlying computational model is called _Lambda Calculus_.

## Untyped lambda calculus

Lambda calculus is a computational model that is at the foundation of the semantics of all functional programming languages. Lambda calculus is radically different from the model above, but it has the same expressive power. This means that everything that we can compute in an imperative language can be computed also in a functional language. In this section we focus on its untyped version but later on we will extend it with a type system. Since the focus of this course is functional programming and not a theoretical course on lambda calculus we will skip some details. For example we will assume that the encoding of numbers and boolean values is already available in lambda calculus, and that arithmetic and boolean operations are possible, without formally showing their implementation in lambda calculus itself. We will just compute the result of arithmetic and boolean experssion as we would normally do.

Lambda calculus is made of three syntactic elements:

* _Variables_ as $x$, $y$, $A$, ...
* _Abstractions_, that are function declarations with **one** parameter, in the form $\lambda x \rightarrow t$ where $x$ is a variable and $t$ is the body of the function.
* _Applications_ (calling a function with one argument) in the form $t \; u$ where $t$ is a function being called and $u$ is its argument. Both $t$ and $u$ can be themselves complex expressions in lambda calculus.

Note that in lambda calculus abstractions can be passed as values, thus functions can be passed as arguments of other functions.

Now that we have defined the syntax of the language, we have to define its _semantics_, that is how its elements behave. This will be done through evaluation rules, in the same fashion as we did in previous development courses.

**Variables**

$eval \; x \rightarrow x$

This rule states that variables cannot be further evaluated.

**Abstractions**

$eval \; (\lambda x \rightarrow t) \rightarrow (\lambda x \rightarrow t)$

This rule states that abstractions **alone** cannot be further evaluated.

**Substitution rule**

$eval \; (\lambda x \rightarrow t) \; u \rightarrow t[x \mapsto u]$

This rule states that whenever we call an abstraction with a parameter $u$, the result is the body of the abstraction where its argument variable is replaced by $u$

**Example**

$eval \; (\lambda x \rightarrow x) \; A \rightarrow x[x \mapsto A] \rightarrow A$

$eval \; (\lambda x \rightarrow \lambda y \rightarrow x) \; (\lambda x \rightarrow x) \rightarrow$

$(\lambda y \rightarrow x)[x \mapsto (\lambda x \rightarrow x)] \rightarrow$

$\lambda y \rightarrow (\lambda x \rightarrow x)$

**Function application**

$eval \; (t \; u) \rightarrow v \text{ where } eval \; t \rightarrow t', eval \; u \rightarrow u', eval \; t' \; u' \rightarrow v$

This rule states that, whenever we have a function application where the left term is not immediately an abstraction, we have to evaluate the terms left\-to\-right and then use their evaluation to compute the final result.

**Example**

$eval \; ((\lambda x \rightarrow \lambda y \rightarrow x) \; A) \; ((\lambda f g \rightarrow g) (\lambda x \rightarrow z))$

$eval \; ((\lambda x \rightarrow \lambda y \rightarrow x) \; A) \rightarrow (\lambda y \rightarrow A)$

$eval \; (\lambda f g \rightarrow g) \; (\lambda x \rightarrow z) \rightarrow (\lambda g \rightarrow g)$

$eval \; (\lambda y \rightarrow A) \; (\lambda g \rightarrow g) \rightarrow A$

For compactness, from now on, the following verbose notation

$\lambda x_1 \rightarrow \lambda x_2 \rightarrow ... \rightarrow \lambda x_n \rightarrow t$

will be shortened into

$\lambda x_1 \; x_2\;  ...\; x_n \rightarrow t$

so we will not write the internal arrows and $\lambda$ symbols.

**Bindings**

Let us consider the following lambda calculus expression\:

$((\lambda f \; g \rightarrow f (\lambda y \rightarrow A) \; (\lambda g \rightarrow g) \rightarrow A) \; (\lambda y \rightarrow A) \; (\lambda g \rightarrow g) \rightarrow A)$


The expression $(\lambda y \rightarrow A) \; (\lambda g \rightarrow g) \rightarrow A$ appears twice. Since it is inconvenient to write such a complex expression every time we need it, we would like to be able to write someting like\:

$\text{let E} = (\lambda y \rightarrow A) \; (\lambda g \rightarrow g) \rightarrow A \text{ in } ((\lambda f \; g \rightarrow f \; E) \; E)$

This construct is called _binding_. Note that this does *not* (notice the emphasis on this word) have the same semantics as variable assignment in imperative programming\: a variable assignment changes the state of a program, whilst here there is no change of state (we do not have a state at all) and it is merely a renaming of expressions.

We now show that bindings can be expressed in the current semantics of lambda calculus without adding something new. When we have a binding in the form

```
let x = y in t
```

we replace every occurrence of `x` in `t` with `y`. This allows us to use a shorter "version" `x` in `t` that will be replaced by its full form `y` when we need to evaluate the lambda calculus program. This is not much different than how we normally substitute variables in the substitution rule of lambda calculus. Actually, it is just the same! Thus, the semantics of `let` can be just expressed in terms of the substitution rule\:

$eval \text{ let } x = y \text{ in } t \rightarrow eval \; (\lambda x \rightarrow t) \; y$

**A final note on lambda calculus**

Bindings are one of the many examples of language extensions that can be implemented directly in lambda calculus as it is. They are just syntax to make the language more usable but lambda calculus in its current form has the same expressive power as any regular programming language. Since this is not a theoretical course on formal computational models, we will not show here how to map every construct that we explain to lambda calculus, but we will merely acknowledge that this is possible. For instance, it is possible to build numbers, boolean, arithmetic operations, boolean operators, and conditional expressions (if\-then\-else) only in terms of abstractions, but we will just accept that this is possible without proving it and use them in functional languages and use them right away with their usual semantics. The only thing that we will add is a type system to lambda calculus.

## F\# vs Lambda Calculus

In this section we proceed to introduce F\#, the language of choice for this course, by showing how the language abstractions of lambda calculus are mapped to it. F\# is a hybrid functional-imperative language. This means that in F\# we can combine abstractions from functional programming with imperative statement. In this course we use its imperative part only to display something in the standard output. We choose this language over pure functional languages like Haskell because I/O operations (and not only) in such languages require the knowledge of advanced functional design patterns called _Monads_ that go beyond the scope of this course.

Moreover, since we have not introduced typed lambda calculus yet, we will rely on the F\# ability to _infer_ types in the program that we write\: in many functional languages type annotation is not mandatory (like, for instance, in Java or C) because the type checker of the compiler is powerful enough to understand the type of an expression most of the times (but not always, this is why it is important to manually determine the type of an expression).

**Bindings**

Bindings follow the same syntax we have defined in lambda calculus, for example\:

```fsharp
let x = 5 in x + 1
```

It is possible to omit the `in` keyword by breaking the line, so that the binding above becomes\:

```fsharp
let x = 5
x + 1
```

Note that F\# is indentation\-sensitive, which means that indentation is not just a way of making your code more readable but a syntax rule itself. In the case of a binding, indentation is necessary when the expression that is bound appears in a new line. For instance, if we wanted to put 5 on a new line we would need to indent the code\:

```fsharp
let x = 
  5
x + 1
```

In this case this looks quite useless, but when we have longer expressions this could be quite convenient\:

```fsharp
let x = 
  3 + 5 * 2 - % 4
x + 1
```

**Abstractions**

Abstractions can be defined by using the keyword `fun` in place of $lambda$. For example, the lambda calculus abstraction $\lambda x \rightarrow x + 1$ would become in F\#\:

```fsharp
fun x -> x + 1
```

Of course for convenience it is possible to bind an abstraction to a specific name for later re\-use, such as\:

```fsharp
let inc = fun x -> x + 1
inc 2
```

which in lambda-calculus would become $(\lambda inc \rightarrow inc \; 2) \; (\lambda x \rightarrow x + 1)$.

**Function application**

Function application follows the very same syntax of lambda\-calculus\:

```fsharp
(fun x -> x + 1) 3
```

Naturally, if we bind an abstraction we can then apply it by using the name of the binding, such as\:

```fsharp
let inc = fun x -> x + 1
in
  inc 3
```

or in the more compact notation

```fsharp
let inc = fun x -> x + 1
inc 3
```