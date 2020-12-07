import { parse } from "querystring";
import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const parseInput = (input) => {
  const rules = input.split("\n");
  const map = {};

  rules.forEach((rule) => {
    const targetBag = rule.split(" bags contain ")[0].trim();
    map[targetBag] = {};

    rule
      .split("bags contain")[1]
      .split(",")
      .forEach((bagInfo) => {
        const trimmed = bagInfo.trim();
        const bagInfoNumber = trimmed.substr(0, trimmed.indexOf(" "));
        const bagTarget =
          bagInfo.indexOf("no other bags") > -1
            ? "no other bags"
            : trimmed.substr(
                trimmed.indexOf(" ") + 1,
                trimmed.indexOf(" bag") - 1
              );

        map[targetBag][bagTarget.trim()] = Number(bagInfoNumber) || 0;
      });
  });
  return map;
};

const findGoldBags = (rules: { [key: string]: { [key: string]: number } }) => {
  let validBagColors = 0;

  Object.keys(rules).forEach((key) => {
    if (isBagValid(rules[key], rules)) {
      validBagColors++;
    }
  });

  return validBagColors;
};

const findBagsInGoldBags = (
  bagTarget: string,
  rules: { [key: string]: { [key: string]: number } },
  bagsTotaled = {}
) => {
  const bag = rules[bagTarget] || {};
  bagsTotaled[bagTarget] = 0;

  Object.keys(bag).forEach((key) => {
    if (bagsTotaled[key] == undefined) {
      bagsTotaled[key] = findBagsInGoldBags(key, rules, bagsTotaled);
    }

    if (!!bag[key]) {
      bagsTotaled[bagTarget] += bag[key] + bag[key] * bagsTotaled[key];
    }
  });

  return bagsTotaled[bagTarget];
};

const isBagValid = (
  bag: { [key: string]: number },
  rules: { [key: string]: { [key: string]: number } },
  bagsTotal: number = 0
): number => {
  Object.keys(bag).forEach((key) => {
    if (
      key === "shiny gold" ||
      (!!rules[key] && isBagValid(rules[key], rules, bagsTotal))
    ) {
      bagsTotal += bag[key];
    }
  });
  return bagsTotal;
};

const goA = (input) => {
  return findGoldBags(parseInput(input));
};

const goB = (input) => {
  const parsedInput = parseInput(input);

  return findBagsInGoldBags("shiny gold", parsedInput);
};

/* Tests */

test(
  goB(`light red bags contain 1 bright white bag, 2 muted yellow bags.
  dark orange bags contain 3 bright white bags, 4 muted yellow bags.
  bright white bags contain 1 shiny gold bag.
  muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
  shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
  dark olive bags contain 3 faded blue bags, 4 dotted black bags.
  vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
  faded blue bags contain no other bags.
  dotted black bags contain no other bags.`),
  32
);
test(
  goB(`shiny gold bags contain 2 dark red bags.
  dark red bags contain 2 dark orange bags.
  dark orange bags contain 2 dark yellow bags.
  dark yellow bags contain 2 dark green bags.
  dark green bags contain 2 dark blue bags.
  dark blue bags contain 2 dark violet bags.
  dark violet bags contain no other bags.`),
  126
);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input));
console.log("Solution to part 2:", goB(input));
console.timeEnd("Time");
