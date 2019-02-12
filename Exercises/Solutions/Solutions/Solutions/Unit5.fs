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
      tree.Add(element)
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
  printfn "%s" (string bst)




  



