import { start } from "repl";
import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const goA = (input) => {
  const { arrival, buses } = {
    arrival: input.split("\n")[0].trim(),
    buses: input
      .split("\n")[1]
      .split(",")
      .filter((item) => item != "x")
      .map(Number),
  };

  const closestSchedule: { bus: number; closest: number; diff: number }[] = [];
  buses.forEach((bus) => {
    let departure = 0;
    while (departure < arrival) {
      departure += bus;
    }

    closestSchedule.push({
      bus,
      closest: departure,
      diff: departure - arrival,
    });
  });

  const closestBus = closestSchedule.sort((a, b) => a.closest - b.closest)[0];

  return closestBus.bus * closestBus.diff;
};

const getMatchingRange = (arr, baseStart) => {
  if (!arr.length) return true;
  const firstMatch = baseStart % arr[0].bus === 0;
  const thirdMatch =
    (baseStart - arr[arr.length - 1].index) % arr[arr.length - 1].bus === 0;

  const matched = firstMatch && thirdMatch;
  const mid = Math.floor(arr.length / 2);

  return matched && arr.length > 2
    ? getMatchingRange(arr.slice(0, mid - 1), baseStart) &&
        getMatchingRange(arr.slice(mid), baseStart)
    : matched;
};

const goB = (input, seed) => {
  const busesAll = input.split("\n")[1].split(",");
  const buses = busesAll
    .map((bus, index) => ({ bus: Number(bus) || "x", index }))
    .filter((item) => item.bus !== "x");
  const highestBus = [...buses].sort((a, b) => b.bus - a.bus)[0];
  const commonDenominator = buses.reduce((acc, bus) => (acc *= bus.bus), 1);
  let matched = false;
  const target = buses;

  let startNumber = seed + highestBus.bus;

  const tar1 = [...buses]
    .sort((a, b) => b.bus - a.bus)
    .slice(0, Math.floor(buses.length / 2));

  let firstMatch = startNumber;

  while (!matched) {
    // get descending differences
    firstMatch += highestBus.bus;
    const baseStart = firstMatch + highestBus.index;
    matched = tar1.every(({ bus, index }) => {
      return (baseStart - index) % bus === 0;
    });
  }
  const tar1common = tar1.reduce((acc, bus) => (acc *= bus.bus), 1);

  matched = false;

  startNumber = firstMatch;
  while (!matched && startNumber < commonDenominator) {
    startNumber += tar1common;
    const baseStart = startNumber + highestBus.index;

    matched = target.every(({ bus, index }) => (baseStart - index) % bus === 0);
  }

  const busWithStartNumber = [];
  buses.forEach(
    ({ bus, index }) =>
      startNumber % bus === 0 && busWithStartNumber.push({ bus, index })
  );
  return commonDenominator - startNumber - highestBus.index;
};

console.time("Time");
/* Tests */

// test(
//   goB(
//     `939
//   7,13,x,x,59,x,31,19`,
//     0
//   ),
//   1068781
// );
// test(
//   goB(
//     `939
//   17,x,13,19`,
//     0
//   ),
//   3417
//   // 4199  - common denominator
//   // 3417-4199 = 782 : divisible  by first number = 46
//   // 4199 - [782](???(46x) / 17) = 3417
//   // 4199 - [780](???(60x) / 13) = 3419
//   // 4199 - [779](???(41x) / 19) = 3420
// );
// test(
//   goB(
//     `939
//   67,7,59,61`,
//     0
//   ),
//   754018
//   // 1,687,931  - common denominator
//   // 1,687,931 - [933,913](???(13,939) / 67) = 754018
//   // 1,687,931 - [933,912](???(133,416) / 7) = 754019
//   // 1,687,931 - [933,911](???(15,829) / 59) = 754020
//   // 1,687,931 - [933,910](???(15,310) / 61) = 754021

//   /// 1,867,824 - 67 - 179,889
//   /// 1,867,826 - 7
//   /// 1,867,822 - 59
//   /// 1,867,820 - 61

//   // 20770
// );
// test(
//   // 25,192 ^
//   goB(
//     `939
//   67,x,7,59,61`,
//     0
//   ),
//   779210
//   // 1,687,931
// );
// test(
//   // 482,266 ^
//   goB(
//     `939
//   67,7,x,59,61`,
//     0
//   ),
//   1261476

//   //  1,687,931
// );
// test(
//   goB(
//     `939
//   1789,37,47,1889`,
//     0
//   ),
//   1202161486
// );

/* Results */
console.log("Solution to part 1:", goA(input))
console.log("Solution to part 2:", goB(input, 0));
console.timeEnd("Time");
