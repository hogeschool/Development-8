import { char } from "./lesson2";

//type with a finite domain
type Gender = "female" | "male" // union type

export type Option<a> = { kind:"something", value:a } |
                 { kind:"nothing", message:string }

export let mk_nothing = <a>(message:string) : Option<a> => ({ kind:"nothing", message:message })
export let mk_something = <a>(value:a) : Option<a> => ({ kind:"something", value:value })


//type with infinite domain
export type List<a> =  
    { kind:"node", value:a, next:List<a> } |
    { kind:"empty" }

export let mk_node = <a>(value:a, next:List<a>) : List<a> => ({kind:"node", value: value, next:next})
export let mk_empty = <a>() : List<a> => ({kind:"empty"})

//(1 ->) (5 ->) (90 ->) (2 ->) (/)
export let custom_lst = mk_node(1, mk_node(5, mk_node(90, mk_node(2, mk_empty()))))
export let custom_string_lst = mk_node("a", mk_node("n", mk_node("n", mk_node("a", mk_empty()))))


export let first = <a>(l:List<a>) : Option<a> =>
    l.kind == "empty" ? mk_nothing("found empty list")
    : mk_something(l.value)

export let last = <a>(l:List<a>) : Option<a> => 
    l.kind == "empty" ? mk_nothing("found empty list") 
    : l.next.kind == "empty" ? mk_something(l.value)
    : last(l.next)

export let skip = <a>(l:List<a>, n:number) : Option<List<a>> => 
    n < 0 ? mk_nothing("found negative number to skip")
    : n == 0 ? mk_something(l)
    : l.kind == "empty" ? mk_nothing("cannot skip. found empty list")
    : skip(l.next, n - 1)

export let pretty_print_list = <a>(l:List<a>) : string =>
    l.kind == "empty" ? "[]"
    : `${l.value} :: ${pretty_print_list(l.next)}`

// 1 2 3 4 -> take(2) -> 1 2 
export let take = <a>(l:List<a>, n:number) : Option<List<a>> => {
    if(n < 0) return mk_nothing("found negative number to skip")
    else if (n == 0) return mk_something(mk_empty())
    else if (l.kind == "empty") return mk_nothing(`Cannot take. Found empty list. n is ${n}`)
    else{
        let take_tail = take(l.next, n - 1)
        if(take_tail.kind == "nothing") return take_tail
        else return mk_something({...l, next: take_tail.value}) 
    }
}
export let length = <a>(l:List<a>) : number =>
    l.kind == "empty" ? 0
    : 1 + length(l.next)

export let reverse = <a>(l:List<a>) : List<a> => {
    if(l.kind == "empty") return l
    // 1 2 3 4     
    else{
        // 1 2 3
        let taken_elems = take(l, length(l) - 1)
        //4
        let last_elem = last(l)
        if(taken_elems.kind == "something" &&
           last_elem.kind == "something"){
            // 4 :: reverse(1 2 3)
            return mk_node(last_elem.value, reverse(taken_elems.value))
        }
        else{
            //this will never occure
        }
    }
}

export let palindrome = (l:List<char>) : boolean => {
    if(l.kind == "empty") return true
    else if(l.next.kind == "empty") return true
    else{
        let first_l = first(l)
        let last_l = last(l)
        if(first_l.kind != "nothing" &&
           last_l.kind != "nothing"){
            if(first_l.value != last_l.value) return false
            else{
                let skip_l = skip(l, 1)
                if(skip_l.kind == "nothing") return false
                let take_l = take(skip_l.value, length(skip_l.value) - 1)
                if(take_l.kind == "nothing") return false
                return palindrome(take_l.value)
            }
        }
        else{
            //this will never happen
            return false
        }
    }
}

let equals = <a>(ls1:List<a>, ls2:List<a>) : boolean => {
    if(ls1.kind=="empty" && 
       ls2.kind=="empty") return true
    else if(ls1.kind=="node"&&
       ls2.kind=="node") ls1.value == ls2.value && equals(ls1.next, ls2.next)
    else return false
}

let palindrome_improved = <a>(ls:List<a>) : boolean => {
    return equals(reverse(ls), ls)
}

type Pair<a, b> = {fst:a, snd:b}
// let slice = <a>(l:List<a>, n:number) : Option<Pair<List<a>, List<a>>> {
  
// }

//slice: (l,n) => Pair(l[0,n],l[n+1, l.length])