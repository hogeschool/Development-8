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

### Element Lookup

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

### Adding an Element

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

### Deleting an Element

Deleting an element is more complex and requires to consider three different cases:
1. We delete from an empty tree. This is a base case that has no effect whatsoever. This case may happen when the tree is really empty or when the recursive delete fails to find the entry that we want to delete. In that case the delete has no effect.
2. We delete a node with two empty sub\-trees as children.
3. We delete a node where only one of the two sub\-trees is non\-empty.
4. We delete a node where both sub\-trees are non\-empty.

Again, keep in mind that this is an immutable representation, so we never modify the current tree but we rather return a copy of it without the element that we are deleting. The function is recurisive and looks at the key stored in the current root. If the key is not matched we use the binary search property to recursively call `Remove` on one of the sub\-trees. We than use the result of `Remove` to build a new binary tree that contains a modified version of one of the children without the element that we want to delete. If the key matches the one stored in the root the we proceed with the deletion.

Case 2 requires simply to return an empty tree, since the current level has no sub\-trees. 
Case 3 requires simply to return the non\-empty child sub\-tree.
Case 4 requires first finds the leftmost node in the right sub\-tree, which we call `rightmostNode`. Equivalently it would also be possible to give an implementation where we find the rightmost node in the left sub\-tree. We then recursively call remove on this node, obtaining a new binary tree called `newLeft`. Note that, with such node, we surely fall in one of the previous two cases. We then create a new node at the current having as root `rightmostNode`, as left child `newLeft`, and as right child the same right sub\-tree of the current level.

```fsharp
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
```

## Decision trees

A hierarchical structure often used in artificial intelligent is decision trees. Let us consider a set of data points made of different features. Each feature has a label (name) and a value that can be either discrete or continuous. Each data point can belong to a different class that describes it. A decision tree is a data structure that, given a data point as input, is able to classify it, i.e. to decide to what class it belongs. In this section we only learn, for simplicity, how to implement the data structure representing a decision tree and how to implement the classification function, but in artificial intelligence decision trees can be generated, so that their structure is not hard\-coded but rather learnt from a training set of data points. In the picture below you find a deicision tree that is able to decide for you if you should bring your umbrella depending on the weather condition\:

![](Images/decision_tree.png)

A decision tree containts two kinds of nodes\: a node containing a decision to make, and a node containing an outcome, which basically decides to what class assigning a data point. Each decision node contains a series of predicates that are tested in order to decide what path we need to follow to reach a su-tree, that can be itself another decision or a simple outcome. Outcome nodes only specify a belonging class and do not have children.

Let us start by defining a data structure for a data point. This is simply a record containing its label and value\:

```fsharp
type Feature<'a, 'label> =
  {
    Label : 'label
    Value : 'a
  }
  with
    static member Create(lable, value) =
      {
        Label = lable
        Value = value
      }
```
Note that we use a generic type `'label` for the label itself to ensure type safety when building a decision tree, so that it is not possible to provide an invalid label.
A decision node has two components\: one is the lable of the feature that we are going to evaluate with that decision, and the other is a list of pairs, which we call paths, made of a predicate and a decision sub\-tree.

```fsharp
type Decision<'a, 'label, '_class> when 'label : comparison =
  {
    Label : 'label
    Paths : List<('a -> bool) * DecisionTree<'a, 'label, '_class>> 
  }
  with
    static member Create(label : 'label, paths : List<('a -> bool) * DecisionTree<'a, 'label, '_class>>) =
      {
        Label = label
        Paths = paths
      }
```
Note that we use the type constraint `'label : comparison` because later we need to perform a comparison on the type `'label`.
Every time we reach a decision node, we find the feature in the data point matching the label, and then we test its value against the predicate of each path. As soon as the predicate is satisfied, we recursively call the classification algorithm on the corresponding sub\-tree. We can now define a node in the decision tree as a polymorphic type that is either an `Outcome` or a `Decision`\:

```fsharp
and DecisionTree<'a, 'label, '_class> when 'label : comparison =
| Outcome of '_class
| Decision of Decision<'a, 'label, '_class>
``` 
We can now start implementing the classification method. This method takes as input a data point, which we can model as a `Map` where the key is the name of a feature and the value its corresponding value. The method checks the current root node and behaves according to the following cases\:

1. If the node is an `Outcome`, then we simply return the class contained in it.
2. If the node is a `Decision`, then we try to find in the data point a feature with the same label of the decision. If this process fails, then the data point is malformed and we return `None`. If we succeed then we test the predicate contained in each path. If all predicates fail to match then it is not possible to classify the data point according to the decision rules. If one of the predicate evaluates to `true`, then we recursively call `Classify` on the corresponding sub\-tree.

```fsharp
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
```
Now it should appear clear why the type constraint on `'label` has been enforced\: using the function `tryFind` for `Map` (not for `List`) requires that the generic type `'T` of the list is comparable, because `Map` is implemented as a search tree. 

In order to test this, let us use the weather decision tree shown in the picture above. We need to define an extra auxiliary type to describe the possible values that a weather feature can have\:

```fsharp
type WeatherFeature =
| Sunny 
| Rainy 
| Cloudy
| Bool of bool
| Float of float
```

The class can be simply represented by a `boolean` value, since it can only be `yes` or `no`. We can then hard\-code the structure of the represented tree, which will have type `DecisionTree<WeatherFeature,bool>`\:

```fsharp
let weatherTree =
  Decision(
    Decision.Create(
      Weather,
      [
        (fun v -> v = Rainy),Decision(
          Decision.Create(
            Wind,
            [
              (fun v -> v = (Bool true)),Outcome false
              (fun v -> v = (Bool false)),
                Decision(
                  Decision.Create(
                    Car,
                    [
                      (fun v -> v = (Bool true)),Outcome false
                      (fun v -> v = (Bool false)),Decision(
                        Decision.Create(
                          Distance,
                          [
                            (fun v -> 
                              match v with 
                              | Float x when x >= 500.0 -> true
                              | _ -> false),Outcome true
                            (fun _ -> true),Decision(
                              Decision.Create(
                                Hood,
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
            Hood,
            [
              (fun v -> v = (Bool true)),Outcome false
              (fun v -> v = (Bool false)),Outcome true
            ]
          )
        )
      ])
    )
```

and test it with the following data point\:

```fsharp
let weatherData =
  [
    Weather,Rainy
    Wind,Bool false
    Car,Bool false
    Distance,Float 350.5
    Hood, Bool false
  ] |> Map.ofList
```

which will lead to `yes` as outcome.

# Exercises

## Exercise 1
Represent a graph `Graph<'a>` as a set of nodes containing a value of type `'a`, and a sequence of adjacent nodes. 

```fsharp
type Node<'a> =
  {
    Value of 'a
    Neighbours of List<Node<'a>>
  }

type Graph<'a> = List<Node<'a>>
```


Implement a function `dfsMap`

```fsharp
let dfsMap (f : 'a -> 'b) (graph : Graph<'a>) : Graph<'b>
```

that applies the function `f` to the content of each node in the graph by visiting them in the depth\-first order. Given a node `N`, the depth\-first traversal of a graph first recursively visit all the unvisited nodes adjent to `N` and then it visits `N` itself.

## Exericse 2
With the same graph definition given above, implement a function

```fsharp
let dfsFold (f : 's -> 'a -> 's) (accumulator : 's) (graph : Graph<'a>) : 's 
```

that visits each node of the graph using the depth\-first traversal. When visting a node, the function `f` is run by passing the current value of `accumulator` and the content of the node, and it returns the updated value of the accumulator. After that the accumulator is returned. Remember that the DFT will try to recursively fold on the unvisited neighbours before running `f` on the current node.

## Exercise 3
A finite\-state automaton is defined as a graph, where each node contains a function `f` to execute. This function takes as input a generic state of type `'state` and runs the function `f` of the node that changes the state. The neighbourse of a node are a series of pairs, made by a transition condition on the state, and a neighbour that will be visited if the predicate returns to true. Moreover, there are two special nodes, the starting state, which contains only one transition to a single node, and the empty node, which contains no transitions but multiple nodes are allowed to transition to it. The starting state is unique, while there can be multiple end states. Given the type definition for a FSA\:

```fsharp
type State<'state> =
  {
    Action          : 'state -> 'state
    Transitions     : List<('state -> bool) * FSANode<'state>>
  }

and FSANode<'state> =
| End
| Node of Node<'state>
```

implement a function that, given an initial state, runs the finite-state automaton and returns a final state when it reaches an `End` node.

```fsharp
let run (fsa : Node<'state>) : 'state
```