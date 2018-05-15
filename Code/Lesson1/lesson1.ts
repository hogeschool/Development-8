let incr = (x: number): number => x + 1
let add = (x : number) => (y : number): number => x + y
/*

gamma,x: number |- \t : (number -> number)
-----------------------------------------------------------
gamma |- lambda x : number -> (labda (y: number) -> x + y) -> number -> (number -> number)

gamma := { x, number }

gamma := {x, number  }, { y, number }

gamma,y: number |- t: number
-------------------------------------------
gamma |- (y: number) -> x + y : (number -> number)


number -> (number -> number)
*/

add(3)
console.log((add(3))(5)) //(add 3) 5