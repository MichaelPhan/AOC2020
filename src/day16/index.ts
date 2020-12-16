import { test, readInput } from "../utils/index";
import { uniq } from "lodash";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const parseData = (
  input
): {
  rules: {
    ruleName: string;
    ruleRanges: number[][];
    possibilities: { [key: number]: number };
    uniquePossibilities: number[];
    possibilitiesSum: number;
  }[];
  ticket: number[];
  otherTickets: number[][];
} => {
  const [rulesInfo, yourTicket, nearbyTickets] = input.split("\n\n");
  // const rules = {};
  // console.log("ah",input);
  const rules = String(rulesInfo)
    .split("\n")
    .map((rule) => {
      const [ruleName, ruleRangeInfo] = rule.split(":");

      const ruleRanges = ruleRangeInfo.split(" or ").map((range) => {
        const [lowerRange, upperRange] = range.split("-").map(Number);
        const rangeArray = [];
        for (let i = lowerRange; i <= upperRange; i++) {
          rangeArray.push(i);
        }
        return rangeArray;
      });
      return {
        ruleName,
        ruleRanges,
        possibilities: {},
        uniquePossibilities: [],
        possibilitiesSum: 0,
      };
    });

  const [_, ticketInfo] = yourTicket.split("\n");
  const ticket = ticketInfo.split(",").map(Number);

  const [__, ...otherTicketsInfo] = nearbyTickets.split("\n");
  const otherTickets = otherTicketsInfo.map((ticket) =>
    ticket.split(",").map(Number)
  );

  return {
    rules,
    ticket,
    otherTickets,
  };
};

const goA = (input) => {
  const { rules, otherTickets } = parseData(input);

  const invalidNumbers = [];
  otherTickets.forEach((ticket) => {
    ticket.forEach((ticketProp) => {
      if (
        !rules.some(({ ruleRanges }) =>
          ruleRanges.find((range) => range.includes(ticketProp))
        )
      ) {
        invalidNumbers.push(ticketProp);
      }
    });
  });
  return invalidNumbers.reduce((acc, val) => (acc += val), 0);
};

const goB = (input) => {
  const { rules, ticket, otherTickets } = parseData(input);

  const validTickets = otherTickets.filter((ticket) =>
    ticket.every((ticketProp, fieldIndex) => {
      let matched = false;
      rules.forEach(({ ruleName, ruleRanges, ...rule }) => {
        ruleRanges.forEach((range) => {
          if (range.includes(ticketProp)) {
            matched = true;
            rule.possibilities[fieldIndex] =
              (rule.possibilities[fieldIndex] || 0) + 1;
          }
        });
      });
      return matched;
    })
  );

  rules.forEach((rule) => {
    rule.uniquePossibilities = uniq(Object.values(rule.possibilities));
    rule.possibilitiesSum = Object.values(rule.possibilities).reduce(
      (acc, val) => (acc += val),
      0
    );
  });

  // mapping fields
  const groupsPossibilities = {};

  // grouping all indexes by possible rules that apply to it
  for (var i = 0; i < ticket.length; i++) {
    let highest = 0;
    const target = i.toString();
    groupsPossibilities[target] = [];
    rules.forEach(
      ({ possibilities }) =>
        (highest =
          possibilities[target] > highest ? possibilities[target] : highest)
    );
    rules.forEach(
      (rule) =>
        rule.possibilities[target] === highest &&
        groupsPossibilities[target].push(rule)
    );
    
    // sort group by each item's sum of possibilities, from high to low
    groupsPossibilities[target].sort(
      (a, b) => b.possibilitiesSum - a.possibilitiesSum
    );
  }

  const sortedRules = [];
  // assign the lowest probable candidate to the slot
  Object.keys(groupsPossibilities).forEach((key) => {
    sortedRules[Number(key)] = groupsPossibilities[key].pop();
  });

  // applying rules to ticket
  const parsedTicket = ticket.map((val, index) => ({
    name: sortedRules[index].ruleName,
    val,
  }));

  // check if all are valid with their sortedRules
  const invalidRules = [];

  [ticket, ...validTickets].every((validTicket) =>
    validTicket.every((ticketPropVal, index) => {
      const { ruleName, ruleRanges } = sortedRules[index];
      const matched = ruleRanges.some((range) => range.includes(ticketPropVal));
      if (!matched) {
        invalidRules.push({
          ticket: validTicket,
          badRule: {
            val: ticketPropVal,
            rule: { ruleName, ruleRanges },
          },
        });
      }
      return matched;
    })
  );

  if (!invalidRules.length) {
    // 593022029393 is too low
    // 649851004259 is too high
    
    return (
      parsedTicket
        .filter(({ name }) => name.toLowerCase().indexOf("departure") > -1)
        .reduce((acc, { val }) => (acc *= val), 1) || 1
    );
  } else {
    console.error("not all items meat");
    return 0;
  }
};

/* Tests */

test(
  goB(`class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`),
  1
);

// test(
//   goB(`class: 1-3 or 5-7
// row: 6-11 or 33-44
// seat: 13-40 or 45-50

// your ticket:
// 7,1,14

// nearby tickets:
// 7,3,47
// 40,4,50
// 55,2,20
// 38,6,12`),
//   71
// );
/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input));
console.log("Solution to part 2:", goB(input));
console.timeEnd("Time");
