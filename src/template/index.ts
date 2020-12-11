import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  return 0;
}

const goB = (input) => {
  return 0;
}

/* Tests */


// test(
//   goA(`L.LL.LL.LL
//   LLLLLLL.LL
//   L.L.L..L..
//   LLLL.LL.LL
//   L.LL.LL.LL
//   L.LLLLL.LL
//   ..L.L.....
//   LLLLLLLLLL
//   L.LLLLLL.L
//   L.LLLLL.LL`),
//   37
// );

/* Results */

console.time("Time")
// console.log("Solution to part 1:", goA(input))
// console.log("Solution to part 2:", goB(input))
console.timeEnd("Time")
