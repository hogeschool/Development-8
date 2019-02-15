# Polymorphism in Functional Programming

In Unit2 we introduced the typed lambda\-calculus and show its application in the type system of F\#. We then proceeded to study built\-in advanced types such as tuples and records. We concluded the unit by showing how to implement inheritance in functional programming through the use of immutable records and presented a complex case study. In this unit we show how to implement polymorphism in a functional programming language.

## Discriminate Unions

In F\# it is possible to specify a type as a discriminate union, which is essentially a type that can be constructed in multiple ways. In F\# this can be achieved by using the following syntax

```fsharp
type T =
| Constructor_1 of T_1
| Constructor_2 of T_2
...
| Constructor_n of T_n
```
where `T` is the name of the type that we declare as usual, each `Constructor_i` is the name of each possible constructor that we can use to build our polymorphic type, and each `T_i` is the type of the input argument of the constructor. Note, if we need to pass multiple arguments to construct a specific case of the polymorhpic type we can provide a tuple. Note that the type argument is optional, so if we do not require arguments to construct that particular case, we can simply provide the constructor name only.

This would be equivalent to the following C\# code\:

```csharp
interface T { }

class Constructor_1 : T
{
  public T_1 Data;
}

class Constructor_2 : T
{
  public T_2 Data;
}

...

class Constructor_n : T
{
  public T_n Data;
}
```

For instance, let us assume that we want to model a vehicle and each vehicle is characterized by a list of components. A car as four wheels, and an engine, a tank has two tracks, an engine,and a gun, a plane has an engine and two wings. This can be modelled by the following discriminate untion (assuming that we already have type definitions ofr `Wheel`, `Engine`, `Track`, and `Gun`)\:

```fsharp
type Vehicle =
| Car of Wheel * Wheel * Wheel * Wheel * Engine
| Tank of Track * Track * Engine * Gun
| Plane of Wing * Wing * Engine
```
Of course we can combine records and unions for better readability. For example we can refactor the code above as\:

```fsharp
type Car =
  {
    Wheel1 : Wheel
    Wheel2 : Wheel
    Wheel3 : Wheel
    Wheel4 : Wheel
    Engine : Engine
  }

type Tank =
  {
    Track1 : Track
    Track2 : Track
    Engine : Engine
    Gun : Gun
  }
type Plane =
  {
    Wing1 : Wing
    Wing2 : Wing
    Engine : Engine
  }
type Vehicle =
| Car of Car
| Tank of Tank
| Plane of Plane
```
Note that we can add members to discriminate unions in the same way we do for records, for instance

```fsharp
type Vehicle =
| Car of Car
| Tank of Tank
| Plane of Plane
with
  member this.Run() = ...
```

## Pattern Matching

Let us suppose that we want to give the implementation of the method `Run` described in the snippet above, so that each kind of `Vehicle` outputs a different sound. In order to do that, we must check which specific case of the vehicle polymorhpic type we are considering. In pure object\-oriented programming this is usually achieved through a visitor or strategy design pattern. Several functional programming languages offer instead built\-in abstractions to achieve the same behaviour. In F\# this abstraction is called `match`\:

```fsharp
match expression with
| Pattern_1 -> expr_1
| Pattern_2 -> expr_2
...
| Pattern_n -> expr_n
```
The `expression` argument can be any expression, including tuples, discriminate unions, or even function calls. The `match` control structure takes the expression argument and matches its pattern with one of those provided in its body. When the pattern is matched the corresponding right\-hand side expression is computed. Assuming to have two patterns $P_1$ and $P_2$, we say that $P_1$ matches $P_2$ in the following cases\:

- If $P_2$ is the wildcard symbol `_` then the $P_1$ always matches $P_2$.
- If $P_1$ is a variable then it always matches $P_2$. In this case we bind the value of $P_1$ to $P_2$.
- If $P_1$ is a literal (so an atomic value like `5`,`true`,`"Hi!"`,...) then it matches $P_2$ only if $P_1 = P_2$.
- If $P_1$ is a tuple or a record than it matches $P_2$ only if they are structurally equal.
- If $P_1$ is a discriminate union whose case is $C_1(x_1,x_2,...,x_n)$ and $P_2$ is $C_2(y_1,y_2,...,y_n)$ than $P_1$ matches $P_2$ if\:
  - $C_1 = C_2$, i.e. $P_1$ and $P_2$ are the same case of the union (i.e. the name of the constructor in the discriminate union is the same).
  - $x_i$ matches $y_i$ for each $i = 1,2,..,n$, i.e. each argument of $C_1$ matches each argument of $C_2$.

The type checking of the `match` works as follows\:


$\text{check}(\text{match } e \text{ with } \vert P_1 \rightarrow e_1 \vert P_2 \rightarrow e_2 \vert ... \vert P_n \rightarrow e_n) \Rightarrow T \text{ when: }$ 

- $\text{check}(P_i) \Rightarrow T_1 \; \forall i = 1,2,...,n$
- $\text{check}(e) \Rightarrow T_1$ 
- $\text{check}(e_i) \Rightarrow T \; \forall i = 1,2,...,n$.

This means that the argument expression of `match` must have the same type of each pattern, and that the expression in the right\-hand side of each case must have the same type.


