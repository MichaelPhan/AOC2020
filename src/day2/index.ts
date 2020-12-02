import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const goA = (input) => {
  const parsedInput = input
    .split("\n")
    .filter(Boolean)
    .map((item) => {
      const parsedItem = item.split(" ");
      return {
        policy: parsedItem[0].split("-"),
        letter: parsedItem[1].split(":")[0],
        value: parsedItem[2],
      };
    });

  const result = parsedInput.reduce((acc, { policy, letter, value }) => {
    let amount = 0;
    value.split("").forEach((valueLetter) => {
      if (valueLetter === letter) amount++;
    });

    if (amount >= policy[0] && amount <= policy[1]) acc++;
    return acc;
  }, 0);

  return result;
};

const goB = (input) => {
  const parsedInput = input
    .split("\n")
    .filter(Boolean)
    .map((item) => {
      const parsedItem = item.split(" ");
      return {
        policy: parsedItem[0].split("-"),
        letter: parsedItem[1].split(":")[0],
        value: parsedItem[2],
      };
    });


  const result = parsedInput.reduce((acc, { policy, letter, value }) => {
    const amount = policy.reduce(
      (acc, pos) => (value.split("")[pos - 1] === letter ? (acc += 1) : acc),
      0
    );

    return amount === 1 ? (acc += 1) : acc;
  }, 0);

  return result;
};

/* Tests */
test(
  goA(
    `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`
  ),
  2
);
test(
  goB(
    `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`
  ),
  1
);

/* Results */

console.time("Time");
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd("Time");

console.log("Solution to part 1:", resultA);
console.log("Solution to part 2:", resultB);
