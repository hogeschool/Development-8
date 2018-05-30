import * as Immutable from'immutable'

export let an_immutable_collection = Immutable.List<number>([ 5, 7, 4, 1, 8, 4, 2, 8])


export let immutable_length = <T>(l:Immutable.List<T>) : number => 
    {
        if(l.size == 0) return 0
        else return 1 + immutable_length (l.skip(1).toList())
    }


let immutable_length_AUX = <T>(l:Immutable.List<T>) => (acc:number) : number => 
{
    if(l.size == 0) return acc
    else return immutable_length_AUX (l.skip(1).toList())(acc+1)
}

export let immutable_length_alt = <T>(l:Immutable.List<T>) : number => 
    immutable_length_AUX(l)(0)

export let sum_elems = (l:Immutable.List<number>) : number => {
    if(l.size == 0) return 0
    else return l.first() + sum_elems (l.skip(1).toList())
}

export let sum_evens = (l:Immutable.List<number>) : number => {
    if(l.size == 0) return 0
    else {
        // let current = l.first()
        // if(current % 2 == 0) return current + sum_evens (l.skip(1).toList())
        // return sum_evens (l.skip(1).toList())
        let current = l.first()
        return ((current % 2 == 0) ? current : 0) + sum_evens (l.skip(1).toList())
    }
}

export let quick_sort = (l:Immutable.List<number>) : Immutable.List<number> => {
    if(l.size <= 1) return l
    let pivot = l.first()
    return quick_sort(l.filter(elem => elem < pivot).toList())
           .concat(l.filter(elem => elem == pivot).toList()).concat(
           quick_sort(l.filter(elem => elem > pivot).toList())).toList()
    //[ 5 7 4 1 8 4 2 8]
    // pivot = 5
    // [1 2 4 4] @
    // [5]
    // [7 8 8]
}

export let last = <T>(l:Immutable.List<T>) : T | "nothing" => {
    if(l.size == 0) return "nothing"
    else if(l.size == 1) return l.first()
    else return last(l.skip(1).toList())
}

export let reverse = <T>(l:Immutable.List<T>) : Immutable.List<T> => {
    if(l.size == 0) return l
    else return reverse(l.skip(1).toList()).push(l.first()) 
}

// let skip = <T>(l:Immutable.List<T>)=>(n:number) : Immutable.List<T> | "not possible" => {
//         HOME
// }

//append a list to an another list
//find the nth element of a list
//check if a list is palindrome: anna Y, pippo X, etc.
export type char = string
export let palindrome = (input:Immutable.List<char>) : boolean => {
  if(input.size == 0) {
      return false
    }
  else if(input.size == 1)
  {
    return true
  }
  else{
     return input.first() == input.last() && palindrome(input.slice(1, input.size - 1).toList())
  }
}
//define a compress function that removes all consecutive equal elements from a list
//         compress [a, a, a, b, c , c] => [a, b, c]
//define a compress_count function that removes all consecutive equal elements from a list
//         compress_count [a, a, a, b, c , c] => [(a, 3), (b, 1), (c, 2)]
