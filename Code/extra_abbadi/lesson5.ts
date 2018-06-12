import { Option, mk_nothing, mk_something, List } from "./lesson3";
import { fold } from "./lesson4";

type BinaryTreeData<a> = { kind:"node", value:a, left:BinaryTree<a>, right:BinaryTree<a> } |
                         { kind:"empty" }


type BinaryTreeOperations<a> = {
    insert: (this:BinaryTree<a>, value:a) => BinaryTree<a>
    tryFind: (this:BinaryTree<a>, value:a) => Option<a>
    toString: (this:BinaryTree<a>) => string
}


type BinaryTree<a> = BinaryTreeData<a> & BinaryTreeOperations<a>


export let mk_BTMethods = <a>(tree_data:BinaryTreeData<a>): BinaryTree<a> => {
    return {
        ...tree_data,
            insert: function(this:BinaryTree<a>, value:a):BinaryTree<a> {return insert(this, value)},
            tryFind: function(this:BinaryTree<a>, value:a):Option<a> {return tryFind(this, value)},
            toString: function(this:BinaryTree<a>) {return to_string(this)}
    }
}



let empty_tree = <a>():BinaryTree<a> => mk_BTMethods({kind:"empty"})

let mk_node = <a>(value:a) : BinaryTree<a> => mk_BTMethods({
    kind:"node",
    value:value,
    left:empty_tree(),
    right:empty_tree()
})

let insert = <a>(tree:BinaryTree<a>, value:a) : BinaryTree<a> => {
    if(tree.kind == "empty") return mk_node(value)
    if(tree.value < value){
        return { ...tree, right: insert(tree.right, value) }
    }
    else{
        return { ...tree, left: insert(tree.left, value) }
    }
}

let tryFind = <a>(tree:BinaryTree<a>, value:a) : Option<a> => {
    if(tree.kind == "empty") return mk_nothing("found empty tree")
    else if(tree.value == value) return mk_something(value)
    else if(tree.value > value) return tryFind(tree.left, value)
    else return tryFind(tree.right, value)
}

let to_string = <a>(tree:BinaryTree<a>) : string => {
    if(tree.kind == "empty") return "empty"
    else return `(${to_string(tree.left)}  <-  ${tree.value}  ->  ${to_string(tree.right)})`
}



export let mk_tree = (elems:List<number>) : BinaryTree<number> => {
    return fold(elems, (value:number, tree:BinaryTree<number>) => tree.insert(value), empty_tree())
}