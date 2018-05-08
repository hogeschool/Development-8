let x = 5
//(lambda x -> console.log("Hello world " + x)) 5
let id = (x : number): number => x
let add = (x : number) => (x : number) => x + x

console.log(id(5))
console.log(add(3)(5))
//add(3,5)