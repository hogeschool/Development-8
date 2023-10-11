# Delivery
- **Students deliver the answer digitally in a copy of this file via MS Teams**
- **Students deliver no other file than this one, renamed to StudentName.StudentSurname.StudentNumber.md**


# Theory
## Question 1
Given the following expression, what does it evaluate to according to the rules of the lambda calculus?

```fs
((fun x y -> x y) (fun z -> z + 1))
```

Answer:
```fs

```

## Question 2
Given the following expression, what does it evaluate to according to the rules of the lambda calculus?

```fs
((fun x y -> x y) ((fun k f -> f(f(k))) 3))
```

Answer:
```fs

```


# Question 3
Complete the missing types (marked with `???`) in the following expression:

```fs
let foo(x: int -> string) (y: int) : string = xy let (f : ???) = foo(fun (x : int) -> string x)
```


# Question 4
Complete the missing types (denoted with `???`) in the following code. The dots denote missing code implementation that is omitted for brevity and you do not have to complete:

```fs
let map (f : ’a -> ’b) -> (l : List<’a>) : List<’b> = ...
let (x : ???) = map (fun (x : int) -> (string x) + "1")
```

# Question 5
Complete the missing types (denoted with `???`) in the following code. The dots denote missing code implementation that is omitted for brevity and you do not have to complete:

```fs
let curry(f: 'a*'b->'c): 'a->'b->'c=...
let add(x: int,y: int): int=...
let (t : ???) = curry add 5
```

# Practice
## Question 1
Define a recursive function `addN : int -> int -> int` which calculates:

```fs
addN 3 4 = 3 + 3 + 3 + 3
```

Answer:
```fs

```

## Question 2
Define a recursive function `fN : ('a -> 'a) -> 'a -> int` which calculates:

```fs
fN f k 4 = f(f(f(f(k))))
```

Answer:
```fs

```

# Question 3
Define a function `repeat : 'a -> int -> List<'a>` which creates a list where the input values is repeated N times:

```fs
repeat "a" 3 = ["a", "b", "c"]
```

Answer:
```fs

```

# Question 4
Define a function `countErrors : List<Result> -> int` which calculates how many results from the list are `Error`, given the following type definition:

```fs
type Result = Error of string | Success
```

Answer:
```fs

```

# Question 5
Define a function `eval : Expr -> int` which evaluates an expression defined as:

```fs
type Expr = Const of int | Sum of Expr * Expr | Prod of Expr * Expr | Diff of Expr * Expr
```

Answer:
```fs

```
