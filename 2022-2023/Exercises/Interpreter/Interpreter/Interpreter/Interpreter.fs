module Interpreter

open Common

type Function =
  {
    Name   : string
    Args   : List<string>
    Code   : Statement
  }

and Expression =
| Atomic of Value
| Add of Expression * Expression
| Sub of Expression * Expression
| Mul of Expression * Expression
| Div of Expression * Expression
| Mod of Expression * Expression
| Not of Expression
| And of Expression * Expression
| Or of Expression * Expression
| Gt of Expression * Expression
| Eq of Expression * Expression
| Geq of Expression * Expression
| Lt of Expression * Expression
| Leq of Expression * Expression
| Call of Function * List<Expression>
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
    | Call(f,exprs) -> 
        let paramList =
          exprs |>
          List.map (fun e -> string e) |>
          List.reduce (fun x y -> x + "," + y)
        sprintf "%s(%s)" f.Name paramList
    | Not expr -> sprintf "!%s" (string expr)
    | And(left,right) -> Expression.PrettyPrint left "&&" right
    | Or(left,right) -> Expression.PrettyPrint left "||" right 
    | Gt(left,right) -> Expression.PrettyPrint left ">" right
    | Geq(left,right) -> Expression.PrettyPrint left ">=" right
    | Leq(left,right) -> Expression.PrettyPrint left "<=" right
    | Lt(left,right) -> Expression.PrettyPrint left "<" right
    | Eq(left,right) -> Expression.PrettyPrint left "==" right
    | Atomic a -> string a

  member this.Eval(m : Memory) : Value * Memory =
    let runBooleanOp left right op =
      match left,right with
      | Boolean b1,Boolean b2 -> Boolean (op b1 b2)
      | _ -> Value.RuntimeError (sprintf "Expected booleans but found %A and %A" left right)
    match this with
    | Add(left, right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Int(x + y),m2
        | Double x,Double y -> Double(x + y),m2
        | String x,String y -> String(x + y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m
    | Sub(left, right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Int(x - y),m2
        | Double x,Double y -> Double(x - y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m2
    | Mul(left, right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Int(x * y),m2
        | Double x,Double y -> Double(x * y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m2
    | Div(left, right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Int(x / y),m2
        | Double x,Double y -> Double(x / y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m2
    | Mod(left, right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Int(x % y),m2
        | Double x,Double y -> Double(x % y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m2
    | And(left,right) -> 
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        runBooleanOp l r (&&),m2
    | Or(left,right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        runBooleanOp l r (||),m2
    | Not expr ->
        let e,m1 = expr.Eval(m)
        match e with
        | Boolean b -> Boolean(not b),m
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m1
    | Gt(left,right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Boolean(x > y),m2
        | Double x,Double y -> Boolean(x > y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m2
    | Geq(left,right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Boolean(x >= y),m2
        | Double x,Double y -> Boolean(x >= y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m2
    | Lt(left,right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Boolean(x < y),m2
        | Double x,Double y -> Boolean(x < y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m2
    | Leq(left,right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Boolean(x <= y),m2
        | Double x,Double y -> Boolean(x <= y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m2
    | Eq(left,right) ->
        let l,m1 = left.Eval(m)
        let r,m2 = right.Eval(m1)
        match l,r with
        | Int x,Int y -> Boolean(x = y),m2
        | Double x,Double y -> Boolean(x = y),m2
        | _ -> Value.RuntimeError (sprintf "Invalid operands for %s" (string this)),m2
    | Call(f,_params) ->
        if _params.Length <> f.Args.Length then
          Value.RuntimeError 
            (sprintf "Given %d parameters but %d are required for %s" _params.Length f.Args.Length f.Name),m
          else
            let vars,m =
              List.fold2
                (fun (vars,m1) (param : Expression) (arg : string) ->
                    let paramVal,newM = param.Eval(m1)
                    Var.Create(arg,paramVal) :: vars,newM
                    ) ([],m) _params f.Args
            let (newContext : Map<string,Var> )=
              vars |> 
              List.fold (fun m v -> m.Add(v.Name,v)) Map.empty
            let newStack = { m with Stack = newContext :: m.Stack }
            let _,memAfterCall = f.Code.Run(newStack)
            newStack.Return,m
    | Atomic v ->
        match v with
        | Var(var) ->
            match m.Get(var) with
            | None -> Value.RuntimeError(sprintf "The variable %s is undefined" var.Name),m
            | Some _val -> _val,m           
        | _ -> v,m

and Statement =
| Declare of Var * Option<Expression>
| Assign of Var * Expression
| If of Expression * Statement
| While of Expression * Statement
| Then of Statement * Statement
| Call of Function * List<Expression>
| Return of Expression
| RuntimeError of string
| Nop
  with
    member this.Run(m : Memory) : Statement * Memory =
      match this with
      | Declare(var,exprOpt) ->
          match exprOpt with
          | None -> Nop,(m.Set var Undefined SetOption.Declare).Value
          | Some expr ->
              let v,m = expr.Eval(m)
              match v,m.Set var v SetOption.Declare with
              | Value.RuntimeError e,_ -> RuntimeError e,m
              | _,Some m -> Nop,m
      | Assign(var,expr) ->
          let v,m = expr.Eval(m)
          match v,m.Set var v Use with
          | Value.RuntimeError e,_ -> RuntimeError e,m
          | _,Some m -> Nop,m
          | _,None -> RuntimeError (sprintf "Variable %s is undefined" var.Name),m
      | If (expr,body) ->
          let v,m = expr.Eval(m)
          match v with
          | Boolean b ->
              if b then
                body.Run(m)
              else
                Nop,m
          | _ -> RuntimeError (sprintf "Expected Boolean but given %A" v),m
      | While (expr,body) ->
          let v,m = expr.Eval(m)
          match v with
          | Boolean b ->
              if b then
                let _,m = body.Run(m)
                While(expr,body).Run(m)
              else
                Nop,m
          | _ -> RuntimeError (sprintf "Expected Boolean but given %A" v),m
      | _ -> failwith "Not implemented yet"
           

type ProgramResult =
| State of Memory
| Error of string
with
  override this.ToString() =
    match this with
    | State m -> (string m)
    | Error e -> sprintf "ERROR: %s" e

and Program = 
  { 
    Code : Function list
  }
  with
    member this.Run() =
      let m = Memory.Empty
      match this.Code |> List.tryFind(fun f -> f.Name = "Main") with
      | Some f -> 
          match f.Code.Run(m)with
          | RuntimeError s,_ -> Error s
          | _,m -> State m
      | None ->
          Error "The program cannot be executed because a Main function could not be found"

let (!!) v = Atomic v

