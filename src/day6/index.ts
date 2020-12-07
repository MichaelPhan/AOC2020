import { parse } from "querystring";
import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const goA = (input) => {
  const parsedInput = input
    .split("\n\n")
    .map((group) =>
      group
        .split("\n")
        .map((answer) => answer.split(""))
        .flat()
        .reduce((arr, val) => {
          // yes answers exist
          if (arr.indexOf(val) === -1) arr.push(val);
          return arr;
        }, [])
    )
    .reduce((acc, val) => (acc += val.length), 0);

  return parsedInput;
};

const goB = (input) => {
  const parsedInput = input
    .split("\n\n")
    .map(
      (group) => group.split("\n").map((answer) => answer.split(""))
      // .flat()
      // .reduce((arr, val) => {
      // yes answers exist
      // if (arr.indexOf(val) === -1) arr.push(val);
      //   return arr;
      // }, [])
    )
    .reduce((acc, group) => {
      let totalAnswers = {};
      group.forEach((form) => {
        form.forEach(
          (answer) => (totalAnswers[answer] = (totalAnswers[answer] || 0) + 1)
        );
      });

      totalAnswers = Object.values(totalAnswers).reduce(
        (val: number, answer) =>
          answer === group.length ? (val = val + 1) : val,
        0
      );
      return acc += totalAnswers;
    }, 0);

  return parsedInput;
};

/* Tests */

test(
  goB(`abc

a
b
c

ab
ac

a
a
a
a

b`),
  6
);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input));
console.log("Solution to part 2:", goB(input));
console.timeEnd("Time");
