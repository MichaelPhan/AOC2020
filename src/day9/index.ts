import { parse } from "querystring";
import { start } from "repl";
import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const goA = (input, preamble = 5) => {
  return input
    .split("\n")
    .map((item) => Number(item))
    .filter((val, index, input) => {
      if (index >= preamble) {
        let found;
        const availableInput = input.slice(index - preamble, index);
        for (var i = 0; i < availableInput.length; i++) {
          const inverseVal = availableInput.indexOf(
            Math.abs(val - availableInput[i])
          );
          if (inverseVal != -1) {
            found = availableInput[inverseVal];
            break;
          }
        }

        if (!found) {
          return val;
        }
        return false;
      }
    })
    .pop();
};

const getRange = (invalidNumb, input) => {
  for (var i = 0; i < input.length; i++) {
    for (var t = 1; t < input.length; t++) {
      const range = input.slice(i, t);
      const sumOfRange = range.reduce((acc, val) => (acc = acc + val), 0);
      if (invalidNumb === sumOfRange) return range.sort((a, b) => b - a);
    }
  }
};

const goB = (input, preamble = 5) => {
  const parsedInput = input.split("\n").map((item) => Number(item));

  const range = getRange(goA(input, preamble), parsedInput);
  return range[0] + range.pop();
};

/* Tests */

test(
  goB(`35
  20
  15
  25
  47
  40
  62
  55
  65
  95
  102
  117
  150
  182
  127
  219
  299
  277
  309
  576`),
  62
);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input, 25));
console.log("Solution to part 2:", goB(input, 25));
console.timeEnd("Time");
