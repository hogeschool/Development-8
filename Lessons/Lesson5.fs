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


