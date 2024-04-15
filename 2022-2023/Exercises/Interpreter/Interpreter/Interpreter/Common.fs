module Common

type Value =
| Int of int
| Double of float
| String of string
| Boolean of bool
| Undefined
| Var of Var
| RuntimeError of string
with
  override this.ToString() =
    match this with
    | Int x -> string x
    | Double x -> sprintf "%A" x
    | String s -> s
    | Boolean b -> string b
    | Var v -> string v
    | Undefined -> "undefined"
    | RuntimeError s -> sprintf "ERROR: %s" s

and Var = 
  {
    Name    : string
    Value   : Value
  }
  with
    static member Create(name : string, value : Value) =
      { Name = name; Value = value }
    static member Create(name : string) =
      { Name = name; Value = Undefined }
    static member (<==) (var : Var, value : Value) =
      { var with Value = value }
    override this.ToString() =
      sprintf "[%s := %s]" this.Name (string this.Value)

let printBindings (m : Map<string,Var>) =
  m |>
  Map.toList |>
  List.map (fun (_,v) -> string v) |>
  List.reduce (fun x y -> sprintf "[\n\t%s,\n\t%s\n]" x y)

type SetOption =
| Declare
| Use

type Memory =
  {
    Stack  : List<Map<string,Var>>
    Return : Value
  }
  with
    override this.ToString() =
      let memPrint (memSet : List<Map<string,Var>>) : string =
        memSet |>
        List.map printBindings |>
        List.reduce (fun x y -> sprintf "{\n%s,\n%s\n}" x y)
      sprintf "{\nStack = %s,\nReturn = %s\n}" 
        (memPrint this.Stack) 
        (string this.Return)
    static member Empty =
      {
        Stack = [Map.empty]
        Return = Undefined
      }
    member this.Get(v : Var) =     
      if this.Stack.Length > 0 && this.Stack.Head.ContainsKey(v.Name) then
        Some this.Stack.Head.[v.Name].Value
      else
        None
    member this.Set(v : Var) (value : Value) (setOption : SetOption) =
      if this.Stack.Length > 0 && (this.Stack.Head.ContainsKey(v.Name) || setOption = Declare) then
        let newStack = this.Stack.Head |> Map.add v.Name (Var.Create(v.Name,v.Value))
        Some { this with Stack = newStack :: this.Stack.Tail }
      else
        None
         


