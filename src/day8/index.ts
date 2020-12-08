import { parse } from "querystring";
import { start } from "repl";
import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const parseInput = (input) =>
  input.split("\n").map((item) => ({
    op: item.trim().split(" ")[0],
    value: Number(item.trim().split(" ")[1]),
  }));

const getAcc = (input) => {
  let acc = 0;
  const opsLib = [];

  for (let i = 0; i < input.length; i++) {
    const { op, value } = input[i];
    if (opsLib.includes(i)) return acc;
    else opsLib.push(i);
    switch (op) {
      case "nop":
        break;
      case "acc":
        acc += value;
        break;
      case "jmp":
        i += value - 1;
        break;
    }
  }
};

const getAccB = (input) => {
  let acc = 0;
  let opsLib = [];

  let loopFound;
  let changedOp;
  const checkedOps = [];

  for (let i = 0; i < input.length; i++) {
    const { op, value } = input[i];
    let checkOp = op;

    if (opsLib.includes(i)) {
      //  resetting with looped flag
      loopFound = true;
      changedOp = false;
      acc = 0;
      i = -1;
      opsLib = [];
      continue;
    } else opsLib.push(i);

    if (
      loopFound &&
      op != "acc" &&
      changedOp == false &&
      !checkedOps.includes(i)
    ) {
      checkOp = op === "nop" ? "jmp" : "nop";
      changedOp = true;
      checkedOps.push(i);
    }

    switch (checkOp) {
      case "nop":
        break;
      case "acc":
        acc += value;
        break;
      case "jmp":
        i += value - 1;
        break;
    }
  }
  return acc;
};

const goA = (input) => {
  return getAcc(parseInput(input));
};

const goB = (input) => {
  return getAccB(parseInput(input));
};

/* Tests */

test(
  goB(`nop +0
  acc +1
  jmp +4
  acc +3
  jmp -3
  acc -99
  acc +1
  jmp -4
  acc +6`),
  8
);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input));
console.log("Solution to part 2:", goB(input));
console.timeEnd("Time");
