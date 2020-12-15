import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const goA = (input, cap = 2020) => {
  const parsedInput = input.split(",");
  const ageDict: {
    [key: string]: {
      number: number;
      current?: number;
      last: number;
      duped: boolean;
    };
  } = {};
  let prevNum;
  let ping = cap / 100;
  for (let age = 1; age <= cap; age++) {
    if (parsedInput[age - 1] != undefined) {
      ageDict[parsedInput[age - 1]] = {
        last: age,
        duped: false,
        number: parsedInput[age - 1],
      };
      prevNum = parsedInput[age - 1];
    } else {
      // turns after starting number here
      // ageDict[i] = 0;
      // const previousAgeNumberSpoken = ageDict[age - 1];
      // const lastSpoken = ageDict[prevNum].last;
      let newNum;
      if (!ageDict[prevNum]?.duped) {
        newNum = 0;
      } else {
        newNum = ageDict[prevNum].current - ageDict[prevNum].last;
        // ageDict[newNum] = age;
      }

      if (ageDict[newNum]) {
        // ageDict[newNum].last = age;
        if (!!ageDict[newNum].current) {
          ageDict[newNum].last = ageDict[newNum].current;
        }

        ageDict[newNum].current = age;
        ageDict[newNum].duped = true;
      } else {
        ageDict[newNum] = { last: age, duped: false, number: newNum };
      }
      prevNum = newNum;
    }
    if (age > ping) {
      ping += cap / 100;
      console.log("cap", age);
    }
  }

  return prevNum;
};

const goB = (input) => {
  return 0;
};

/* Tests */

// test(
//   goA(`0,3,6`, 2020),
//   436
// );
// test(goA(`0,3,6`, 5), 3);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA("1,20,8,12,0,14"))
// console.log("Solution to part 2:", goA("1,20,8,12,0,14", 30000000)); // this takes ~503655ms
console.timeEnd("Time");
