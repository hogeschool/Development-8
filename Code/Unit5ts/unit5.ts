import { Option, Some, None, fold, map, map2, fold2, flatten } from "../Unit4ts/unit4"
import { List } from "../Unit2ts/unit2"

type BinaryTreeData<a> = {
  kind: "empty"
} | {
  kind: "node",
  value: a
  left: BinaryTreeData<a>,
  right: BinaryTreeData<a>
}  

interface BinaryTreeMethods<a> {
  tryFind: (this: BinaryTree<a>, value: a) => Option<BinaryTree<a>>
  insert: (this: BinaryTree<a>, value: a) => BinaryTree<a>,
  toString: (this: BinaryTree<a>) => string
}

export type BinaryTree<a> = BinaryTreeData<a> & BinaryTreeMethods<a>

let BinaryTree = <a>(tree: BinaryTreeData<a>): BinaryTree<a> => {
  return {...tree,
    tryFind: function(this: BinaryTree<a>, value: a): Option<BinaryTree<a>> {
        return tryFind(value)(this)
    },
    insert: function(this: BinaryTree<a>, value: a): BinaryTree<a> {
      return insert(value)(this)
    },
    toString: function(this: BinaryTree<a>): string {
      return treeToString(this)
    }
  }
}

export let EmptyTree = <a>(): BinaryTree<a> => { 
  let t: BinaryTreeData<a> = { kind: "empty" }
  return BinaryTree(t)
}
export let Tree = <a>(x: a, left: BinaryTree<a>, right: BinaryTree<a>): BinaryTree<a> => {
  let t: BinaryTreeData<a> = {
    kind: "node",
    value: x,
    left: left,
    right: right
  }
  return BinaryTree<a>(t)
}

//find
export let tryFind = <a>(value: a) => (tree: BinaryTree<a>): Option<BinaryTree<a>> => {
  if (tree.kind == "empty") {
    return None<BinaryTree<a>>()
  }
  else {
    if (value == tree.value) {
      return Some<BinaryTree<a>>(tree)
    }
    else if (value <= tree.value) {
      return tryFind(value)(BinaryTree(tree.left))
    }
    else {
      return tryFind(value)(BinaryTree(tree.right))
    }
  }
}

//insert
export let insert = <a>(value: a) => (tree: BinaryTree<a>): BinaryTree<a> => {
  if (tree.kind == "empty") {
    return Tree<a>(value, EmptyTree<a>(), EmptyTree<a>())
  }
  else {
    if (value <= tree.value) {
      return Tree<a>(tree.value, insert(value)(BinaryTree(tree.left)), BinaryTree(tree.right))
    }
    else {
      return Tree<a>(tree.value, BinaryTree(tree.left), insert(value)(BinaryTree(tree.right)))
    }
  }
}

//in-order map
export let treeMap = <a, b>(f: (x: a) => b) => (tree: BinaryTree<a>): BinaryTree<b> => {
  return inorderFold<a, BinaryTree<b>>((tree: BinaryTree<b>) => (x: a) => tree.insert(f(x)))(EmptyTree<b>())(tree)
}

//in-order fold
export let inorderFold = <a, state>(f: (s: state) => (x: a) => state) => (init: state) => (tree: BinaryTree<a>): state => {
  if (tree.kind == "empty") {
    return init
  }
  else {
    let leftState = inorderFold<a, state>(f)(init)(BinaryTree(tree.left))
    let currentState = f(leftState)(tree.value)
    let rightState = inorderFold<a, state>(f)(currentState)(BinaryTree(tree.right))
    return rightState
  }
}

export let treeToString = <a>(tree: BinaryTree<a>): string => {
  let ts = inorderFold((s: string) => (x: a) => `${s} ${x}` )("")(tree)
  return `[${ts} ]`
}

interface Functor<F, G, a, b> {
  map: (this: F, f: (x: a) => b) => G
}

export type Optional<a, b> = Option<a> & Functor<Option<a>, Option<b>, a, b>

export let NoneOptional = <a, b>(): Optional<a, b> => {
  return {
    kind: "none",
    map: OptionFunctor<a, b>().map
  }
}

export let SomeOptional = <a, b>(x: a): Optional<a, b> => {
  return {
    kind: "some",
    value: x,
    map: OptionFunctor<a, b>().map
  }
}

let OptionFunctor = <a, b>(): Functor<Option<a>, Option<b>, a, b> => {
  return {
      map: function(this: Option<a>, f: (x: a) => b): Option<b> {
        if (this.kind == "none") {
          return None<b>()
        }
        else {
          return Some<b>(f(this.value))
        }
    }
  }
}

export type ListType<a, b> = List<a> & Functor<List<a>, List<b>, a, b>

let ListFunctor = <a, b>(): Functor<List<a>, List<b>, a, b> => {
  return {
    map: function(this: List<a>, f: (x: a) => b): List<b> {
      return map(f)(this)
    }
  }
}

export let ListTypeClass = <a, b>(l: List<a>): ListType<a, b> => {
  return {...l,
    map: ListFunctor<a, b>().map
  }
}

let TreeFunctor = <a, b>(): Functor<BinaryTree<a>, BinaryTree<b>, a, b> => {
  return {
    map: function(this: BinaryTree<a>, f: (x: a) => b): BinaryTree<b> {
      return treeMap(f)(this)
    }
  }
}

export type TreeType<a, b> = BinaryTree<a> & Functor<BinaryTree<a>, BinaryTree<b>, a, b>
export let TreeTypeClass = <a, b>(t: BinaryTree<a>): TreeType<a, b> => {
  return {...t,
    map: TreeFunctor<a, b>().map
  }
}
