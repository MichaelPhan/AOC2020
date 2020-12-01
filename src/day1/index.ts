import { parse } from "querystring";
import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const goA = (input) => {
  const parsedInput = input.split("\n").map(Number);
  let result;

  parsedInput.forEach((item) => {
    const matchIndex = parsedInput.indexOf(Math.abs(2020 - item));

    if (matchIndex != -1) {
      result = item * parsedInput[matchIndex];
    }
  });
  return result;
};

const goB = (input) => {
  const parsedInput = input.split("\n").map(Number);

  for (var i = 0; i < parsedInput.length; i++) {
    const firstItem = parsedInput[i];
    for (var t = 0; t < parsedInput.length; t++) {
      if (t === i) continue;
      const secondItem = parsedInput[t];
      const matchIndex = parsedInput.indexOf(
        Math.abs(2020 - firstItem - secondItem)
      );

      if (
        matchIndex != -1 &&
        firstItem + secondItem + parsedInput[matchIndex] === 2020
      ) {
        return firstItem * secondItem * parsedInput[matchIndex];
      }
    }
  }
  return;
};

/* Tests */

// Tests for A
test(
  goA(
    `1721
  979
  366
  299
  675
  1456`
  ),
  514579
);

// Tests for B
test(
  goB(
    `1721
  979
  366
  299
  675
  1456`
  ),
  241861950
);
/* Results */

console.time("Time");
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd("Time");

console.log("Solution to part 1:", resultA);
console.log("Solution to part 2:", resultB);
