import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const parseParenths = (input, reduceInput) => {
  let extracted = input;
  if (input.lastIndexOf("(") > -1) {
    // getting the last range
    let tar = extracted.substr(extracted.lastIndexOf("(") + 1);
    tar = tar.substr(0, tar.indexOf(")"));

    extracted = input.replace(`(${tar})`, reduceInput(tar));
  }
  return extracted.indexOf("(") > -1 ? parseParenths(extracted, reduceInput) : extracted;
};

const reduceInput = (input, preInput = null) => {
  // calc
  const parsedInput = preInput || input.split(" ");
  while (parsedInput.length > 1) {
    const val1 = Number(parsedInput[0]);
    const val2 = Number(parsedInput[2]);
    const op = parsedInput[1];
    const result = performOperation(op, val1, val2);
    parsedInput.splice(0, 3, result);
  }
  return parsedInput[0];
};

const reduceInputAdvanced = (input) => {
  // calc
  const parsedInput = input.split(" ");
  // do + first
  let additionIndex = parsedInput.findIndex((item) => item === "+");
  while (additionIndex > -1) {
    const val1 = Number(parsedInput[additionIndex - 1]);
    const val2 = Number(parsedInput[additionIndex + 1]);
    const op = parsedInput[additionIndex];
    const result = performOperation(op, val1, val2);
    parsedInput.splice(additionIndex - 1, 3, result);
    additionIndex = parsedInput.findIndex((item) => item === "+");
  }
  return reduceInput(input, parsedInput);
};

const performOperation = (op, val1, val2) => {
  switch (op) {
    case "+":
      return Number(val1) + Number(val2);
    case "*":
      return Number(val1) * Number(val2);
  }
};

const goA = (input) => {
  const parsedInput = input
    .split("\n")
    .map((line) => reduceInput(parseParenths(line, reduceInput)));
  return parsedInput.reduce((acc, val) => (acc += val), 0);
};

const goB = (input) => {
  const parsedInput = input
    .split("\n")
    .map((line) => reduceInputAdvanced(parseParenths(line, reduceInputAdvanced)));
  return parsedInput.reduce((acc, val) => (acc += val), 0);
};

/* Tests */

// test(goA(`2 * 3 + (4 * 5)`), 26);
// test(goA(`5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`), 12240);
// test(goA(`((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`), 13632);

test(goB(`1 + (2 * 3) + (4 * (5 + 6))`), 51);
test(goB(`2 * 3 + (4 * 5)`), 46);
test(
  goB(`5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`),
  669060
);
test(goB(`((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`), 23340);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input));
console.log("Solution to part 2:", goB(input))
console.timeEnd("Time");
