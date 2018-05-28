import { Tuple, List, Empty, Cons } from "../Unit2ts/unit2"
import * as Unit2 from "../Unit2ts/unit2"

export let splitAt = <a>(i: number) => (l: List<a>): Tuple<List<a>, List<a>> => {
  if (l.kind == "empty") {
    throw "Out of bound"
  }
  else if (i == 0) {
    return Tuple(Cons<a>(l.head, Empty<a>()), l.tail)
  }
  else {
    let x = l.head
    let xs = l.tail
    let t = splitAt<a>(i - 1)(xs)
    return Tuple(Cons<a>(x, t.fst), t.snd)
  }
}

export let merge = <a>(l1: List<a>) => (l2: List<a>): List<a> => {
  if (l1.kind == "empty") {
    return l2
  }
  else if (l2.kind == "empty") {
    return l1
  }
  else {
    if (l1.head <= l2.head) {
      return Cons<a>(l1.head, merge(l1.tail)(l2))
    }
    else {
      return Cons<a>(l2.head, merge(l1)(l2.tail))
    }
  }
}

export let mergeSort = <a>(l: List<a>): List<a> => {
  if (l.length() == 1) {
    return l
  }
  else {
    let middle = Math.floor(l.length() / 2 - 1)
    let { fst: t1, snd: t2 } = splitAt<a>(middle)(l)
    let sortedLeft = mergeSort(t1)
    let sortedRight = mergeSort(t2)
    return merge(sortedLeft)(sortedRight)
  }
}

type ExpressionData = {
  kind: "val",
  value: number
} | {
  kind: "var",
  name: string
} | {
  kind: "add",
  left: ExpressionData,
  right: ExpressionData
} | {
  kind: "sub",
  left: ExpressionData,
  right: ExpressionData
} | {
  kind: "mul",
  left: ExpressionData,
  right: ExpressionData
} | {
  kind: "div",
  left: ExpressionData,
  right: ExpressionData
}

export type Expression = ExpressionData & {
  toString: (expr: ExpressionData) => string
}

let exprToString = (expr: ExpressionData): string => {
  if (expr.kind == "val") {
    return expr.value.toString()
  }
  else if (expr.kind == "var") {
    return expr.name
  }
  else if (expr.kind == "add") {
    return `${exprToString(expr.left)} + ${expr.right}`
  }
  else if (expr.kind == "sub") {
    return `${exprToString(expr.left)} - ${expr.right}`
  } 
  else if (expr.kind == "mul") {
    return `${exprToString(expr.left)} * ${expr.right}`
  }
  else {
    return `${exprToString(expr.left)} / ${expr.right}`
  }
}

export let Val = (n: number): Expression => { 
  return {kind: "val", value: n, toString: exprToString }
}
export let Var = (id: string): Expression => { 
  return { kind: "var", name: id, toString: exprToString } } 
export let Add = (left: Expression, right: Expression): Expression => { 
  return { kind: "add", left: left, right: right, toString: exprToString } }
export let Sub = (left: Expression, right: Expression): Expression => { return { kind: "sub", left: left, right: right, toString: exprToString } }
export let Mul = (left: Expression, right: Expression): Expression => { return { kind: "mul", left: left, right: right, toString: exprToString } }
export let Div = (left: Expression, right: Expression): Expression => { return { kind: "div", left: left, right: right, toString: exprToString } }

let lookup = (id: string) => (stack: List<Tuple<string, number>>): number => {
  if (stack.kind == "empty") {
    throw "Undeclared variable"
  }
  else if (stack.head.fst == id) {
    return stack.head.snd
  }
  else {
    return lookup(id)(stack.tail)
  }
}

let exists = (id: string) => (stack: Memory): boolean => {
  if (stack.kind == "empty") {
    return false
  }
  else if (stack.head.fst == id) {
    return true
  }
  else {
    return exists(id)(stack.tail)
  }
}

let setMemory = (id: string) => (n: number) => (stack: Memory): Memory => {
  if (stack.kind == "empty") {
    return Cons<Tuple<string, number>>(Tuple(id, n), Empty())
  }
  else if (stack.head.fst == id) {
    return Cons<Tuple<string, number>>(Tuple<string, number>(id, n), stack.tail)
  }
  else {
    return Cons(stack.head, setMemory(id)(n)(stack.tail))
  }
}

export let _eval = (expr: Expression) => (stack: List<Tuple<string, number>>): number => {
  if (expr.kind == "val") {
    return expr.value
  } else if (expr.kind == "var") {
    return lookup(expr.name)(stack)
  }
  else if (expr.kind == "add") {
    return _eval(expr.left)(stack) + _eval(expr.right)(stack) 
  }
  else if (expr.kind == "sub") {
    return _eval(expr.left)(stack) - _eval(expr.right)(stack) 
  }
  else if (expr.kind == "mul") {
    return _eval(expr.left)(stack) * _eval(expr.right)(stack) 
  }
  else {
    return _eval(expr.left)(stack) / _eval(expr.right)(stack) 
  }
} 

type StatementData = {
  kind: "assignment",
  var: string,
  expr: Expression
} | {
  kind: "print",
  expr: Expression
}

export type Statement = StatementData & {
  toString: (stmt: StatementData) => string
}

let stmtToString = (stmt: StatementData): string => {
  if (stmt.kind == "assignment") {
    return `${stmt.var} = ${stmt.expr.toString()}`
  } else {
    return `print(${stmt.expr})`
  }
}

export let Assignment = (id: string, expr: Expression): Statement => {
  return {
    kind: "assignment",
    var: id,
    expr: expr,
    toString: stmtToString
  }
}

export let Print = (expr: Expression): Statement => {
  return {
    kind: "print",
    expr: expr,
    toString: stmtToString
  }
}

export type Memory = List<Tuple<string, number>>

let runStmt = (stmt: Statement) => (stack: Memory): Memory => {
  if (stmt.kind == "assignment") {
    let v = _eval(stmt.expr)(stack)
    return setMemory(stmt.var)(v)(stack)
  } 
  else {
    let v = _eval(stmt.expr)(stack)
    console.log(v)
    return stack
  }
}

export let run = (program: List<Statement>) => (stack: Memory): Memory => {
  if (program.kind == "empty") {
    return stack
  }
  else {
    let memory = runStmt (program.head)(stack)
    return run(program.tail)(memory)
  }
}