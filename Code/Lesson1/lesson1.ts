let add = (x : number) => (y : number) => { 
  let five = 5 // x > 0 ? 5 : x + 1
  if (x + y > 3) {
    return x + y - five
  } else{
  return x + y + five}}

  /* int x = 0;
  while (x < 5) {
    x += 1;
  }


console.log((add(3))(5)) //add(3) := ((y : number) => 3 + y)(5) := 3 + 5 := 8