# Unit 5 - Advanced (hierarchical) data structures
In this unit, we discuss the definition and management of operations around hierarchical data structures.

## Trees
We begin by defining a simple tree which contains content of some arbitrary type `'a`. A `Tree` is either a `Leaf`, in which case it has no content, or a `Node`. A `Node` has a value of type `'a` (its proper content), and a list of sub\-trees which are the children of the current `Node`\:

```fsharp
type Tree<'a> =
  | Node of 'a * List<Tree<'a>>
```

Given that a `Tree` is just a container of nodes, we can define a `map` function for it, which recursively transforms all of its nodes content by function `f`, and then moving on to transforming all children by recursion\:

```fsharp
let rec mapTree f t =
  match t with
  | Node(v,children) -> Node(f v, children |> List.map (mapTree f))
```

> Note that transforming the children requires `List.map` in order to preserve the structure of the list of children. It makes sense that we would use a structure\-preserving transformation (over the list of children) in order to define a portion of the structure\-preserving transformation (over the whole tree).


## Binary search trees
```fsharp
type BinarySearchTree<'a> when 'a : comparison =
  | Leaf
  | Node of 'a * BinarySearchTree<'a> * BinarySearchTree<'a>
```

```fsharp
let rec contains (x:'a) (t:BinarySearchTree<'a>) =
  match t with
  | Leaf -> false
  | Node(v,l,r) when x > v -> contains x r
  | Node(v,l,r) when x < v -> contains x l
  | _ -> true

let rec insert (x:'a) (t:BinarySearchTree<'a>) =
  match t with
  | Leaf -> Node(x,Leaf,Leaf)
  | Node(v,l,r) when x < v -> Node(v,insert x l,r)
  | Node(v,l,r) when x > v -> Node(v,l,insert x r)
  | Node(v,l,r) -> t
```

```fsharp
let rec max (t:BinarySearchTree<'a>) =
  match t with
  | Leaf -> None
  | Node(v,_,Leaf) -> Some v
  | Node(v,_,r) -> max r

let rec min (t:BinarySearchTree<'a>) =
  match t with
  | Leaf -> None
  | Node(v,Leaf,_) -> Some v
  | Node(v,l,_) -> min l
```

```fsharp
let rec convert (t:BinarySearchTree<'a>) : Tree<'a> =
  match t with
  | Leaf -> Tree.Leaf
  | Node(v,l,r) -> Tree.Node(v,[convert l; convert r])
```


## Decision trees

```fsharp
type DecisionTree<'s,'o> =
  | Outcome of 'o
  | Decision of ('s -> bool) * DecisionTree<'s,'o> * DecisionTree<'s,'o>

let rec decide (t:DecisionTree<'s,'o>) (s:'s) : 'o =
  match t with
  | Outcome o -> o
  | Decision(check,l,r) when check s -> decide l s
  | Decision(check,l,r) -> decide r s
```
