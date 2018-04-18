let allNumbers = (max: number): string => {
  if (max == 0) {
    return "0"
  }
  else {
    return allNumbers(max - 1) + " " + max
  }
}

let allNumbersRev = (max: number): string => {
  if (max == 0) {
    return "0"
  }
  else {
    return max + " " + allNumbersRev(max - 1)
  }
}

let allNumbersRange = (min: number, max: number): string => {
  if (max == min) {
    return String(min)
  }
  else {
    return allNumbersRange(min, max - 1) + " " + max
  }
}

let allEvenRange = (min: number, max: number): string => {
  if (max == min) {
    return max % 2 == 0 ? String(max) : ""
  }
  else if (max % 2 == 0) {
    return allEvenRange (min, max - 1) + " " + max
  }
  else {
    return allEvenRange (min, max - 1)
  }
}

let drawLine = (length: number): string => {
  if (length == 0) {
    return ""
  }
  else {
    return "*" + drawLine(length - 1)
  }
}

let drawLineSymbol = (length: number, symbol: string): string => {
  if (length == 0) {
    return ""
  }
  else {
    return symbol + drawLineSymbol(length - 1, symbol)
  }
}

let binaryString = (n: number): string => {
  if (n == 0) {
    return ""
  }
  else {
    let digit = n % 2
    return binaryString(Math.floor(n / 2)) + digit
  }
}

let baseString = (n: number, base: number): string => {
  if (n == 0) {
    return ""
  }
  else {
    let digit = n % base
    return baseString(Math.floor(n / base), base) + digit
  }
}

console.log("Exercise 1: " + allNumbers(100))
console.log("Exercise 2: " + allNumbersRev(100))
console.log("Exercise 3: " + allNumbersRange(15, 50))
console.log("Exercise 4: " + allEvenRange(15, 50))
console.log("Exercise 5: " + drawLine(50))
console.log("Exercise 6: " + drawLineSymbol(50, "$"))
console.log("Exercise 7: " + binaryString(125))
console.log("Exercise 8: " + baseString(125, 8))