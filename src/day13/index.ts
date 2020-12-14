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
  // console.log("ah", buses);
  const highestBus = [...buses].sort((a, b) => b.bus - a.bus)[0];
  // const highestNum = highestBus.bus;
  const commonDenominator = buses.reduce((acc, bus) => (acc *= bus.bus), 1);
  let matched = false;
  // splitting apart into groups of 4
  let currentGroup = [];
  const groups = [];
  buses.forEach((bus, index) => {
    if (currentGroup.length < 3) {
      currentGroup.push(bus);
      if (index === buses.length - 1) groups.push([...currentGroup]);
    } else {
      groups.push([...currentGroup]);
      currentGroup = [bus];
    }
  });
  // split  into  range
  // const
  // console.log("commonDenom", buses, commonDenominator);
  const target = buses;
  // const target = buses.slice(0, buses.length / 2);
  // const target = buses.slice(buses.length / 2 + 1);
  // const target2 = buses.slice(0, buses.length);
  // console.log("rango", target);
  // const commonDenominator1 = target.reduce((acc, bus) => (acc *= bus.bus), 1);
  // const commonDenominator2 = target2.reduce((acc, bus) => (acc *= bus.bus), 1);
  // const highestNum =
  //   commonDenominator1 < commonDenominator2
  //     ? commonDenominator1
  //     : commonDenominator2;
  const highCommonDenom = [...buses]
    .sort((a, b) => a.bus - b.bus)
    .reduce((acc, { bus }, index) => {
      if (index > 0) {
        acc *= bus;
      }
      return acc;
    }, 1);
  // console.log("yyoyo", seed/16, highCommonDenom, commonDenominator);
  let startNumber = seed + highestBus.bus;
  let ping = seed / 16;

  const tar1 = [...buses]
    .sort((a, b) => b.bus - a.bus)
    .slice(0, Math.floor(buses.length / 2));
  // const tar1 = [...buses].slice(0, 2);

  const matches = [];

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
  console.log("firstmatch!", tar1, firstMatch, tar1common);
  matched = false;

  startNumber = firstMatch;
  while (!matched && startNumber < commonDenominator) {
    // get descending differences
    // startNumber += highestBus.bus;
    // startNumber += firstMatch;
    startNumber += tar1common;
    const baseStart = startNumber + highestBus.index;
    // if(ping <= 0){
    //   ping = seed/16;
    //   console.log('ping:',seed);
    // }  else {
    //   ping--;
    // }
    // const firstMatch = baseStart % buses[0].bus === 0;
    // const secondMatch =
    //   (baseStart - buses[midBus].index) % buses[midBus].bus === 0;
    // const thirdMatch =
    //   (baseStart - buses[buses.length - 1].index) %
    //     buses[buses.length - 1].bus ===
    //   0;
    // matched = true;
    // for (var i = 0; i < groups.length; i++) {
    //   const group = groups[i];
    //   console.log('checko',group)
    //   for (var t = 0; t < group.length; t++) {
    //     const { bus, index } = group[t];
    //     if ((baseStart - index) % bus !== 0) {
    //       matched = false;
    //       break;
    //     }
    //   }
    //   if(!matched) break;
    // }

    matched = target.every(({ bus, index }) => {
      // console.log("first match", startNumber);
      const remainder = (baseStart - index) % bus;
      // const remainder2 = (baseStart - index) % bus;
      // console.log("ah", baseStart,  startNumber);
      return remainder === 0 || remainder === 0.5;
      // return remainder === 0;
    });
    // if (matched) {
    //   matched = target2.every(({ bus, index }) => {
    //     return (baseStart - index) % bus === 0;
    //   });
    // }
    // if (
    //   tar1.every(({ bus, index }) => {
    //     return (baseStart - index) % bus === 0;
    //   })
    // ) {
    //   matches.push(startNumber);
    // }
    // matched =
    //   getMatchingRange(botRange, baseStart) &&
    //   getMatchingRange(topRange, baseStart);
  }

  const busWithStartNumber = [];
  buses.forEach(
    ({ bus, index }) =>
      startNumber % bus === 0 && busWithStartNumber.push({ bus, index })
  );
  console.log("bus?", busWithStartNumber);
  console.log("commonDenmon!", commonDenominator);
  console.log("startNum", startNumber);
  console.log("busWithStartNumber", busWithStartNumber);
  // console.log("testing", tar1, matches);
  const lineup = matches.find(
    (item) => startNumber % item === 0 || startNumber % item === 0.5
  );
  console.log("lined", lineup, matches);
  // matched = false;
  // while (!matched || rounds > 0) {
  //   timestamp++;
  //   matched = buses.every(({ bus, index }) => {
  //     return (timestamp + index) % bus === 0;
  //   });

  //   if (matched) {
  //     matches.push(timestamp);
  //     rounds--;
  //   }
  // }

  // console.log("heyo\n" + matches.join("\n"));

  // return matches[0];
  console.log(
    "yup",
    commonDenominator - startNumber,
    "\n" +
      busWithStartNumber
        .map((possiblity) => commonDenominator - startNumber - possiblity.index)
        .join("\n"),
    "or" + (commonDenominator - startNumber - highestBus.index),
    buses
  );
  return commonDenominator - startNumber - highestBus.index;
};

console.time("Time");
/* Tests */

test(
  goB(
    `939
  7,13,x,x,59,x,31,19`,
    0
  ),
  1068781
);
test(
  goB(
    `939
  17,x,13,19`,
    0
  ),
  3417
  // 4199  - common denominator
  // 3417-4199 = 782 : divisible  by first number = 46
  // 4199 - [782](???(46x) / 17) = 3417
  // 4199 - [780](???(60x) / 13) = 3419
  // 4199 - [779](???(41x) / 19) = 3420
);
test(
  goB(
    `939
  67,7,59,61`,
    0
  ),
  754018
  // 1,687,931  - common denominator
  // 1,687,931 - [933,913](???(13,939) / 67) = 754018
  // 1,687,931 - [933,912](???(133,416) / 7) = 754019
  // 1,687,931 - [933,911](???(15,829) / 59) = 754020
  // 1,687,931 - [933,910](???(15,310) / 61) = 754021

  /// 1,867,824 - 67 - 179,889
  /// 1,867,826 - 7
  /// 1,867,822 - 59
  /// 1,867,820 - 61

  // 20770
);
test(
  // 25,192 ^
  goB(
    `939
  67,x,7,59,61`,
    0
  ),
  779210
  // 1,687,931
);
test(
  // 482,266 ^
  goB(
    `939
  67,7,x,59,61`,
    0
  ),
  1261476

  //  1,687,931
);
test(
  goB(
    `939
  1789,37,47,1889`,
    0
  ),
  1202161486
);

/* Results */
// console.log("Solution to part 1:", goA(input))
100000000000000;
487905974205161;

console.log("Solution to part 2:", goB(input, 0));
console.timeEnd("Time");
