export type List<a> = ({
  kind: "empty"
} | {
  kind: "cons",
  head: a,
  tail: List<a>
}) & {
  length: (this: List<a>) => number
  toString: (this: List<a>) => string
  equals: (this: List<a>, l: List<a>) => boolean
}

export let Cons = <a>(x: a, xs: List<a>): List<a> => {
  return {
    kind: "cons",
    head: x,
    tail: xs,
    length: function(): number {
      return _length(this)
    },
    toString: function(): string {
      return listToString(this)
    },
    equals: function(l: List<a>): boolean {
      return _equals(this)(l)
    }
  }
}

export let Empty = <a>(): List<a> => {
  return { 
    kind: "empty",
    length: function(): number {
      return 0
    },
    toString: function(): string {
      return ""
    },
    equals: function(l: List<a>): boolean {
      return _equals(this)(l)
    }
  }
}

export let _length = <a>(l: List<a>): number => l.kind == "empty" ? 0 : 1 + _length(l.tail)

export interface Tuple<a, b> {
  fst: a,
  snd: b,
  toString: (this: Tuple<a, b>) => string
}

export let Tuple = <a, b>(x: a, y: b): Tuple<a, b> => {
  return {
    fst: x,
    snd: y,
    toString: function(): string {
      return `(${this.fst},${this.snd})`
    }
  }
}

export let last = <a>(l: List<a>): a => {
  if (l.kind == "empty") {
    throw "The list is empty"
  }
  else if (l.length() == 1) {
    return l.head
  }
  else {
    return last(l.tail)
  }
}

export let concat = <a>(l1: List<a>) => (l2: List<a>): List<a> => {
  if (l1.kind == "empty") {
    return l2
  }
  else {
    return Cons<a>(l1.head, concat(l1.tail)(l2))
  }
}

export let listToString = <a>(l: List<a>): string => {
  if (l.kind == "empty") {
    return ""
  }
  else {
    return l.head + " " + listToString(l.tail)
  }
}

export let rev = <a>(l: List<a>): List<a> => {
  if (l.kind == "empty") {
    return l
  }
  else {
    return concat(rev(l.tail))(Cons<a>(l.head, Empty<a>()))
  }
}

export let nth = <a>(n: number) => (l: List<a>): a => {
  if (l.kind == "empty") {
    throw "Out of bound"
  }
  else if (n == 0) {
    return l.head
  }
  else {
    let xs = l.tail
    return nth<a>(n - 1)(l.tail)
  }
}

export let _equals = <a>(l1: List<a>) => (l2: List<a>): boolean => {
  if ((l1.kind == "empty" && l2.kind != "empty") || (l1.kind != "empty" && l2.kind == "empty")) {
    return false
  }
  else if (l1.kind == "empty" && l2.kind == "empty") {
    return true
  }
  else if (l1.kind == "cons" && l2.kind == "cons") {
    return l1.head == l2.head && (_equals(l1.tail)(l2.tail))
  }
  else {
    return false
  }
}

export let palindrome = <a>(l: List<a>): boolean => {
  let lrev = rev(l)
  return l.equals(lrev)
}

export let compress = <a>(l: List<a>): List<a> => {
  if (l.kind == "empty") {
    return l
  }
  else if (l.tail.kind != "empty") {
     if (l.head == l.tail.head) {
       return compress(l.tail)
     }
     else {
       return Cons<a>(l.head, compress(l.tail))
     }
  }
  else {
    return l
  }
}

export let ArrayToList = <a>(elements: a[]): List<a> => {
  if (elements.length == 0) {
    return Empty<a>()
  }
  else {
    return Cons<a>(elements[0], ArrayToList(elements.slice(1, elements.length)))
  }
}

export let shift = (letter: string) => (offset: number): number => {
  let lowerBound = "a".charCodeAt(0)
  let upperBound = "z".charCodeAt(0)
  let o = offset % 27
  let letterCode = letter.charCodeAt(0) + o
  if (letterCode < lowerBound) {
    return upperBound - (lowerBound - letterCode)
  }
  else if (letterCode > upperBound) {
    return lowerBound + (letterCode - upperBound)
  }
  else {
    return letterCode
  }
}

export let StringToCharList = (text: string): List<string> => {
  if (text == "") {
    return Empty<string>()
  }
  else {
    return Cons<string>(text[0], StringToCharList(text.slice(1, text.length)))
  }
}

export let caesarChypher = (text: List<string>) => (offset: number): List<string> => {
  if (text.kind == "empty") {
    return text
  }
  else {
    let c = text.head
    let charCode = c.charCodeAt(0)
    if (charCode >= 97 && charCode <= 122) {
      let encodedChar = String.fromCharCode((shift(c)(offset)))
      return Cons<string>(encodedChar, caesarChypher(text.tail)(offset))
    }
    else {
      return Cons<string>(c, caesarChypher(text.tail)(offset))
    }
  }
}
