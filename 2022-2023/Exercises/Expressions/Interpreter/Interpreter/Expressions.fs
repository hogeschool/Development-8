module Expressions

type Value =
| Int of int
| Double of float
| String of string
| RuntimeError of string
with
  override this.ToString() =
    match this with
    | Int x -> string x
    | Double x -> sprintf "%A" x
    | String s -> s
    | RuntimeError s -> sprintf "ERROR: %s" s

type Expression =
| Atomic of Value
| Add of Expression * Expression
| Sub of Expression * Expression
| Mul of Expression * Expression
| Div of Expression * Expression
| Mod of Expression * Expression
with
  static member private PrettyPrint (left : Expression) (opSymbol : string) (right : Expression) =
    sprintf "%s %s %s" (string left) opSymbol (string right)
  override this.ToString() =
    match this with
    | Add(left,right) ->
        Expression.PrettyPrint left "+" right
    | Sub(left,right) ->
        Expression.PrettyPrint left "-" right
    | Mul(left,right) ->
        Expression.PrettyPrint left "*" right
    | Div(left,right) ->
        Expression.PrettyPrint left "/" right
    | Mod(left,right) ->
        Expression.PrettyPrint left "%" right
    | Atomic a -> string a

  member this.Eval() : Value =
    match this with
    | Add(left, right) ->
        let l = left.Eval()
        let r = right.Eval()
        match l,r with
        | Int x,Int y -> Int(x + y)
        | Double x,Double y -> Double(x + y)
        | String x,String y -> String(x + y)
        | _ -> RuntimeError (sprintf "Invalid operands for %s" (string this))
    | Sub(left, right) ->
        let l = left.Eval()
        let r = right.Eval()
        match l,r with
        | Int x,Int y -> Int(x - y)
        | Double x,Double y -> Double(x - y)
        | _ -> RuntimeError (sprintf "Invalid operands for %s" (string this))
    | Mul(left, right) ->
        let l = left.Eval()
        let r = right.Eval()
        match l,r with
        | Int x,Int y -> Int(x * y)
        | Double x,Double y -> Double(x * y)
        | _ -> RuntimeError (sprintf "Invalid operands for %s" (string this))
    | Div(left, right) ->
        let l = left.Eval()
        let r = right.Eval()
        match l,r with
        | Int x,Int y -> Int(x / y)
        | Double x,Double y -> Double(x / y)
        | _ -> RuntimeError (sprintf "Invalid operands for %s" (string this))
    | Mod(left, right) ->
        let l = left.Eval()
        let r = right.Eval()
        match l,r with
        | Int x,Int y -> Int(x % y)
        | Double x,Double y -> Double(x % y)
        | _ -> RuntimeError (sprintf "Invalid operands for %s" (string this))
    | Atomic v -> v

let (!!) v = Atomic v


    


