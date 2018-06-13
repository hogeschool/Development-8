import { Option, mk_nothing, mk_something, List, custom_lst } from "./lesson3";
import { map } from "./lesson4";

type Functor<F, G, a, b> = {
    map: (this:F, f:(_:a) => b) => G
}


type Optional<a, b> = Option<a> & Functor<Option<a>, Option<b>, a, b>

let OptionalFunctor = <a, b>():Functor<Option<a>, Option<b>, a, b> => {
    return {
        map: function(this:Option<a>, f:(_:a) => b) {
            if(this.kind == "nothing") return mk_nothing("nothing")
            else return mk_something(f(this.value))
        }
    }
}

let NoneOptional = <a, b>() : Optional<a, b> => {
    return {
        kind: "nothing",
        message: "Nothing to say",
        map: OptionalFunctor<a, b>().map
    }
}

let SomeOptional = <a, b>(a:a) : Optional<a, b> => {
    return {
        kind: "something",
        value: a,
        map: OptionalFunctor<a, b>().map
    }
}

// let example = SomeOptional<number, string>(5).map(e => (e + 1).toString())

type ListFunctorType<a,b> = List<a> & Functor<List<a>, List<b>, a, b>

let ListFunctor = <a, b> ():Functor<List<a>, List<b>, a, b> => {
    return {
        map:function(this:List<a>, f:(_:a)=>b) {
            return map(this, f)
        }
    }
}

let ListTypeClass = <a, b> (list:List<a>) : ListFunctorType<a, b>=> {
    return {
        ...list,
        map:ListFunctor<a, b>().map
    }
} 

let example = ListTypeClass<number, string>(custom_lst).map(e => "<" + e + ">")