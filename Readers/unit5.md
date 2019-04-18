# Unit 5 - Advanced (hierarchical) data structures
In this unit, we discuss the definition and management of operations around hierarchical data structures. In preivous courses, these data structures were discussed in their mutable version. In this course we explore their immutable implementation, in order to prevent side effects that could happen when updating the references or trying to use `null` values in the mutable implementation. We will start by explaining the implementation of generic trees, and then we will implement binary search trees. We conclude this section by showing how to implement decision trees, that are a popular data structure used in machine learning.

## Trees

A tree can be recursively defined as either an empty tree, or a node containing data and a sequence of subtrees (children). This means that its type definition will be both polymorphic and recursive\:

```fsharp
type Tree<'a> =
| Empty
| Node of 'a * List<Tree<'a>>
```

Like for lists, we can define `map` and `fold` higher\-order functions, respectively to mutate the content of each node in a tree, and to accumulate the result of a tree operation into an accumulator.

The `map` function will traverse the tree in some order and apply a function to each node of the tree. We choose to first apply the function to the content of the current node, and then recursively traverse the list of sub\-trees and apply `map` to them. The `map` applied to an empty tree of course results in an empty tree. In the case of a non\-empty tree, we apply `f` to the current element, and then we call the `map` function **for lists** on **the list of subtrees**, by passing a function that calls the **tree map** on each element of the list. We generate a new node by taking the result of `f` applied to the current node and the result of mapping the list of trees with the tree map.

```fsharp
member this.Map (f : 'a -> 'b) =
  match this with
  | Empty -> Empty
  | Node(x,subtrees) ->
      Node(f x,subtrees |> List.map(fun t -> t.Map f))
```

The `fold` works similarly to its counterpart for lists. It takes as input a function that takes as input a state and an element of the tree, and updates the state. Moreover, we pass to `fold` also the initial value of the state. The function updates the state by calling `f` with the current state and element, thus generating a new state that we call `state1`. It then call `fold` **for lists** passing a function that uses the accumulator and each tree. This function will use `fold` **for trees** to update the accumulator with each subtree. As initial value of the accumulator we pass `state1`, the newly generated state at the current level.

```fsharp
member this.Fold (f : 'state -> 'a -> 'state) (state : 'state) : 'state =
  match this with
  | Empty -> state
  | Node(x,subtrees) ->
      let state1 = f state x
      subtrees |>
      List.fold (fun s tree -> tree.Fold f s) state1
```

## Binary Search Trees

A binary search tree is a data structure that can be used to implement a dictionary. This means that each node stores an element identified by a unique key and a value. Each node can also has two sub\-trees as children. The keys stored in the root of the left sub\-tree are all smaller than the key in the current node, and the keys in the right sub\-tree are all greater. We start by defining a type to describe the key\-value pair stored as element in the node\:

```fsharp
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
```

We can now define the data structure to represent the node of a binary search tree\: this data structure will store the actual data, which is an `Entry`, and its left and right sub\-tree.

```fsharp
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
```
Note that we must ensure that the key can be used with a comparison operator to check the binary search property, thus we must enforce a type constraint on the generic type `'k`. Finally a binary search tree is polymorphic and defined as either an `Empty` tree or a `Node` containing a `BinaryNode`.

```fsharp
and BinarySearchTree<'k, 'v> when 'k : comparison =
| Empty
| Node of BinaryNode<'k, 'v>
```
We now proceed to implement the operations on the dictionary, i.e. `find`, `add`, and `remove`.

## Element Lookup

The lookup in a binary search tree searches for a key in the tree and returns the corresponding value in the entry. It also might fail to retrieve the given key, so the return type is `Option<'v>`. The function is defined recursively\: if the tree is empty then the lookup fails returning `None`. Otherwise we check if the key in the current node is the one we are looking for. If it is, then we return it encapsulated inside the case `Some` of `Option`. Otherwise if the key we are looking for is smaller then we recursively look in the left sub\-tree, otherwise we look to the right. This recursive process will stop as soon as we either find the key we are looking for or we reach an empty sub\-tree\:

```fsharp
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
```

## Adding an Element

Adding an element requires finding the proper place to position the new node in the binary search tree in order not to break the binary search property. Note that, being the data structure immutable, `Add` will never modify the existing tree but rather return a new tree that contains also the new entry to be added. The procedure is again recursive\: if we are in an empty tree then we just return a new node with an empty left and right sub\-tree. If the entry that we want to add is already there (i.e. the key already exists), we replace it. Thus we return a new node with the new entry and having the right and left sub\-tree of the old node. Otherwise if the key of the entry to be added is less than the key in the current node, then we recursively call `Add` on the left sub\-tree and we return a new node with the same entity and right sub\-tree as the current one, but having as left sub\-tree the result of the recursive call to `Add`. Otherwise we do the opposite\: we recursively call `Add` on the right sub\-tree and we create a new node containing the entry and the left sub\-tree of the current one, but as right sub\-tree the result of `Add`. This recursive process ends as soon as `Add` will be called with an empty sub\-tree.

```fsharp
match this with
  | Empty -> Node(BinaryNode.Create(entry, Empty, Empty))
  | Node node ->
    if node.Entry.Key = entry.Key then
      Node(BinaryNode.Create(entry, node.Left, node.Right))
    elif entry.Key < node.Entry.Key then
      Node (BinaryNode.Create(node.Entry,node.Left.Add(entry),node.Right))
    else
      Node (BinaryNode.Create(node.Entry,node.Left,node.Right.Add(entry)))
```