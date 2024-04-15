open System

type BinaryTree<'a> = Empty | Node of BinaryTree<'a> * 'a * BinaryTree<'a>

let rec tryFind (value:'a) (tree:  BinaryTree<'a>):  Option<BinaryTree<'a>> =
  match tree with
  | Node(l, v, r) when value = v -> Some(tree)
  | Node(l, v, r) when value < v -> tryFind value l
  | Node(l, v, r) when value > v -> tryFind value r
  | _ -> None

let rec insert (value:'a) (tree:  BinaryTree<'a>):  BinaryTree<'a> =
  match tree with
  | Node(l, v, r) when value = v -> tree
  | Node(l, v, r) when value < v -> Node(insert value l, v, r)
  | Node(l, v, r) when value > v -> Node(l, v, insert value r)
  | _ -> Node(Empty, value, Empty)


let r = System.Random()
let rec randomTree n l u = 
  if n <= 0 || l+1 >= u-1 then Empty
  else 
    let value = r.Next(l+1, u-1)
    let l = randomTree (n/2) l value
    let r = randomTree (n/2) value u
    Node(l, value, r)

let t = randomTree 10 0 100

let rec treeMap (f:'a -> 'b) : BinaryTree<'a> -> BinaryTree<'b> =
  function
  | Empty -> Empty
  | Node(l,v,r) -> Node(treeMap f l, f v, treeMap f r)


let t1 = treeMap (sprintf "%04i") t
printfn $"t=\n{t}\nt+1\n{t1}\n"

// let map<'a,'b>(f:'a->'b) (l:List<'a>) : List<'b> =
//   fold (fun h t -> (f h)::t) Empty l
