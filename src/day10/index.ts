import { parse } from "querystring";
import { start } from "repl";
import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const parseInput = (input) =>
  input
    .split("\n")
    .sort((a, b) => a - b)
    .map(Number);

const goA = (input) => {
  return [0, ...parseInput(input), parseInput(input).slice(-1)[0] + 3]
    .reduce(
      (acc, item, index, inp) =>
        index !== 0 ? (acc[inp[index] - inp[index - 1] - 1] += 1) && acc : acc,
      [0, 0, 0]
    )
    .reduce((acc, val, indx, inp) => (indx !== 2 ? acc : inp[0] * inp[2]));
};

const getMultiplier = (groupLength)=>{
  let multiplier = 1;
  let incr = 1;
  for (let i = 0; i < groupLength; i++) {
    if (i >= 2) {
      multiplier += incr;
      incr++;
    }
  }

  return multiplier;
}
const goB = (input) => {
  const parsedInput = [
    0,
    ...parseInput(input),
    parseInput(input).slice(-1)[0] + 3,
  ];
  let groupedTotal = [];
  let runningTotal = [parsedInput[0]];
  for (let i = 0; i < parsedInput.length; i++) {
    const currentNum = parsedInput[i];
    const nextNum = parsedInput[i + 1];

    if (nextNum - currentNum <= 2) {
      runningTotal.push(nextNum);
    } else if (!!runningTotal.length) {
      groupedTotal.push(runningTotal);
      runningTotal = [nextNum];
    }
  }

  return groupedTotal.reduce((acc, group, indx, inp) => {
    return acc *= getMultiplier(group.length);
  }, 1);
  // groupedTotal.filter((group) => group.length > 2)
};

/* Tests */

test(
  goB(`16
  10
  15
  5
  1
  11
  7
  19
  6
  12
  4`),
  8
);
test(
  goB(`28
  33
  18
  42
  31
  14
  46
  20
  48
  47
  24
  23
  49
  45
  19
  38
  39
  11
  1
  32
  25
  35
  8
  17
  7
  9
  4
  2
  34
  10
  3`),
  19208
);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input));
console.log("Solution to part 2:", goB(input));
console.timeEnd("Time");
