module Lesson5

type Tree<'a> =
| Empty
| Node of 'a * List<Tree<'a>>
with
  member this.Fold (f : 'state -> 'a -> 'state) (state : 'state) : 'state =
    match this with
    | Empty -> state
    | Node(x,subtrees) ->
        let state1 = f state x
        subtrees |>
        List.fold (fun s tree -> tree.Fold f s) state1
  member this.Map (f : 'a -> 'b) =
    match this with
    | Empty -> Empty
    | Node(x,subtrees) ->
        Node(f x, subtrees |> List.map(fun t -> t.Map f))

type Entry<'k,'v> =
  {
    Key : 'k
    Value : 'v
  }
  with
    static member Create(key : 'k, value : 'v) =
      {
        Key = key
        Value = value
      }
    override this.ToString() = 
      sprintf "(%s,%s)" (this.Key.ToString()) (this.Value.ToString())

type BinaryNode<'k, 'v> when 'k : comparison =
  {
    Entry : Entry<'k, 'v>
    Left : BinarySearchTree<'k, 'v>
    Right : BinarySearchTree<'k, 'v>
  }
  with
    static member 
      Create(
            entry : Entry<'k, 'v>, 
            left : BinarySearchTree<'k, 'v>,
            right: BinarySearchTree<'k, 'v>) =
      {
        Entry = entry
        Left = left
        Right = right
      }

and BinarySearchTree<'k, 'v> when 'k : comparison =
| Empty
| Node of BinaryNode<'k, 'v>
with
  member this.TryFind(key : 'k) : Option<'v> =
    match this with
    | Empty -> None
    | Node node ->
        if node.Entry.Key = key then
          Some node.Entry.Value
        elif key < node.Entry.Key then
          node.Left.TryFind key
        else
          node.Right.TryFind key
  member this.Add(entry : Entry<'k, 'v>) =
    match this with
    | Empty -> Node(BinaryNode.Create(entry, Empty, Empty))
    | Node node ->
        if node.Entry.Key = entry.Key then
          Node(BinaryNode.Create(entry, node.Left, node.Right))
        elif entry.Key < node.Entry.Key then
          Node (BinaryNode.Create(node.Entry,node.Left.Add(entry),node.Right))
        else
          Node (BinaryNode.Create(node.Entry,node.Left,node.Right.Add(entry)))
  member this.Remove(key : 'k) =
    let rec getRightMostElement (tree : BinarySearchTree<'k, 'v>) =
      match tree with
      | Node ({ Entry = _; Left = _; Right = Empty } as node) -> node
      | Node ({ Entry = _; Left = _; Right = right }) -> getRightMostElement right
          
    match this with
    | Empty -> Empty
    | Node node ->
        if node.Entry.Key = key then
          match node.Left,node.Right with
          | Empty,Empty -> Empty
          | Node tree,Empty
          | Empty, Node tree -> Node tree
          | Node _, Node _ ->
              let rightMostNode = getRightMostElement node.Left
              let newLeft = node.Left.Remove(rightMostNode.Entry.Key)
              Node (BinaryNode.Create(rightMostNode.Entry, newLeft, node.Right))
        elif key < node.Entry.Key then
          Node (BinaryNode.Create(node.Entry,node.Left.Remove key,node.Right))
        else
          Node (BinaryNode.Create(node.Entry,node.Left,node.Right.Remove key))
  member this.Fold (f : 'state -> BinaryNode<'k, 'v> -> 'state ) (state : 'state) : 'state =
    match this with
    | Empty -> state
    | Node node ->
        let stateLeft = node.Left.Fold f state
        let currentState = f stateLeft node
        node.Right.Fold f currentState
  override this.ToString() = this.Fold (fun s node -> s + " " + node.ToString()) ""

type WeatherFeature =
| Sunny 
| Rainy 
| Cloudy
| Bool of bool
| Float of float

type Feature<'a> =
  {
    Label : string
    Value : 'a
  }
  with
    static member Create(lable, value) =
      {
        Label = lable
        Value = value
      }

type Decision<'a, '_class> =
  {
    Label : string
    Paths : List<('a -> bool) * DecisionTree<'a,'_class>> 
  }
  with
    static member Create(label : string, paths : List<('a -> bool) * DecisionTree<'a,'_class>>) =
      {
        Label = label
        Paths = paths
      }

and DecisionTree<'a, '_class> =
| Outcome of '_class
| Decision of Decision<'a,'_class>
with
  member this.Classify (features : Map<string,'a>) =
    match this with
    | Outcome _class -> Some _class
    | Decision decision ->
        match 
          features |>
          Map.tryFind(decision.Label) with
        | Some value ->
            match
              decision.Paths |>
              List.tryFind(fun (condition,_) -> condition value) with
            | Some(_,tree) -> tree.Classify features
            | None -> None
        | None -> None

let tree = 
  Tree.Node(3,[
    Tree.Node(5, [Tree.Empty])
    Tree.Node(1, [
      Tree.Node(1, [Tree.Empty])
      Tree.Node(3, [
        Tree.Node(8, [Tree.Empty])
      ])
    ])
    Tree.Node(4, [
      Tree.Node(6, [Tree.Empty])
    ])
    Tree.Node(2, [Tree.Empty])
  ])

let binaryTree =
  Empty
    .Add(Entry.Create(3, "x"))
    .Add(Entry.Create(6,"y"))
    .Add(Entry.Create(1,"xx"))
    .Add(Entry.Create(5,"x"))
    .Add(Entry.Create(4,"zzz"))
    .Add(Entry.Create(2,"sd"))
    .Add(Entry.Create(-1,"abs"))
    .Add(Entry.Create(10,"win"))

let weatherTree =
  Decision(
    Decision.Create(
      "Weather",
      [
        (fun v -> v = Rainy),Decision(
          Decision.Create(
            "Wind",
            [
              (fun v -> v = (Bool true)),Outcome false
              (fun v -> v = (Bool false)),
                Decision(
                  Decision.Create(
                    "Car",
                    [
                      (fun v -> v = (Bool true)),Outcome false
                      (fun v -> v = (Bool false)),Decision(
                        Decision.Create(
                          "Distance",
                          [
                            (fun v -> 
                              match v with 
                              | Float x when x >= 500.0 -> true
                              | _ -> false),Outcome true
                            (fun _ -> true),Decision(
                              Decision.Create(
                                "Hood",
                                [
                                  (fun v -> v = (Bool true)),Outcome false
                                  (fun v -> v = (Bool false)),Outcome true
                                ]
                              )
                            )
                          ]
                        ))
                    ]
                  )
                )
            ]
          )
        )
        (fun v -> v = Sunny),Outcome false
        (fun v -> v = Cloudy),Decision(
          Decision.Create(
            "Hood",
            [
              (fun v -> v = (Bool true)),Outcome false
              (fun v -> v = (Bool false)),Outcome true
            ]
          )
        )
      ])
    )

let weatherData =
  [
    "Weather",Rainy
    "Wind",Bool false
    "Car",Bool false
    "Distance",Float 350.5
    "Hood", Bool false
  ] |> Map.ofList

let weatherData2 =
  [
    "Weather",Cloudy
    "Wind",Bool false
    "Car",Bool false
    "Distance",Float 350.5
    "Hood", Bool true
  ] |> Map.ofList
            

        

            
            
   

