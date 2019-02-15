module Unit5

type Entry<'k,'v> =
  {
    Key : 'k
    Value : 'v
  }
  with
    static member Create(key : 'k, value : 'v) =
      { Key = key; Value = value }
    override this.ToString() =
      sprintf "{ %A,%A }" (this.Key) (this.Value) 

type TreeNode<'k,'v> when 'k : comparison  =
  {
    Root    : Entry<'k,'v>
    Left    : BinarySearchTree<'k,'v>
    Right   : BinarySearchTree<'k,'v>
  }
  with
    static member Create(element : Entry<'k,'v>) =
      {
        Root = element
        Left = Empty
        Right = Empty
      }
    static member Create
      (element : Entry<'k,'v>, 
       left : BinarySearchTree<'k,'v>, right : BinarySearchTree<'k,'v>) =
      {
        Root = element
        Left = left
        Right = right
      }
       
and BinarySearchTree<'k,'v> when 'k : comparison =
| Empty
| Tree of TreeNode<'k,'v>
  with
    static member add (element : Entry<'k,'v>) (tree : BinarySearchTree<'k,'v>) =
      tree.Add element
    static member delete (key : 'k) (tree : BinarySearchTree<'k,'v>) =
      tree.Delete key
    member this.Add (element : Entry<'k,'v>) =
      match this with
      | Empty -> Tree(TreeNode.Create(element))
      | Tree t ->
          if t.Root.Key > element.Key then
            let subtree = t.Left.Add(element)
            Tree({ t with Left = subtree })
          else
            let subtree = t.Right.Add(element)
            Tree({ t with Right = subtree })
    member this.TryFind(key : 'k) =
      match this with
      | Empty -> None
      | Tree t ->
          if t.Root.Key = key then
            Some t.Root
          else
            if key < t.Root.Key then
              t.Left.TryFind key
            else
              t.Right.TryFind key
    member this.Delete(key : 'k) =
      let rec rightmostNode (Tree t : BinarySearchTree<'k,'v>) (root : Entry<'k,'v>) =
            match t.Right with
            | Empty -> t,Tree({ t with Root = root })
            | _ -> rightmostNode t.Right root
      match this with
      | Empty -> this
      | Tree t ->
          if t.Root.Key = key then
            match t.Left,t.Right with
            | Empty,Empty -> Empty
            | Tree _,Empty -> t.Left
            | Empty,Tree _ -> t.Right
            | Tree t1, Tree _ ->
                let rmNode,replacedLeft = (rightmostNode t.Left t.Root)
                let newLeft = replacedLeft.Delete(key)
                let newRoot =
                  { t with
                      Root = rmNode.Root
                      Left = newLeft
                  }
                Tree(newRoot)
          elif key < t.Root.Key then
            Tree({ t with Left = t.Left.Delete key })
          else
            Tree({ t with Right = t.Right.Delete key })
    member this.InOrderFold (f : 'state -> Entry<'k,'v> -> 'state) (init : 'state) : 'state =
      match this with
      | Empty -> init
      | Tree t ->
          let leftState = t.Left.InOrderFold f init
          let currentState = f leftState t.Root
          t.Right.InOrderFold f currentState
    override this.ToString() =
      this.InOrderFold (fun s e -> s + (string e)) ""

let test() =
  let bst = 
    BinarySearchTree.Empty |> 
    BinarySearchTree.add(Entry.Create(3,5)) |>
    BinarySearchTree.add(Entry.Create(-1,6)) |>
    BinarySearchTree.add(Entry.Create(-4,6)) |>
    BinarySearchTree.add(Entry.Create(4,2)) |>
    BinarySearchTree.add(Entry.Create(10,1)) |>
    BinarySearchTree.add(Entry.Create(8,-12)) |>
    BinarySearchTree.add(Entry.Create(20,5))
  let bst1 = 
    bst |>
    BinarySearchTree.delete(10) |>
    BinarySearchTree.delete(4)
  printfn "%s\n%s" (string bst) (string bst1)




  



