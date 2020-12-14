import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const parseGroups = (input, instructionType) => {
  const parsedInput = input.split("\n");
  const groups = [];
  let currentGroup = [];
  parsedInput.forEach((item) => {
    if (item.indexOf("mask") > -1) {
      currentGroup = [item.trim()];
      groups.push(currentGroup);
    } else {
      currentGroup.push(item.trim());
    }
  });

  return groups.map((group) => instructionType(group));
};

const parseOverwriteInstructions = (
  parsedGroup
): {
  mask: string;
  instructions: {
    address: number;
    val: number;
    transformedVal: number;
    valArray: number[];
    transformedValArray: number[];
  }[];
} => {
  const mask = parsedGroup[0].split(" = ")[1].split("");

  return {
    mask,
    instructions: parsedGroup.slice(1).map((item) => {
      const op = item.split("] = ");
      const val = Number(op[1]);
      const address = Number(op[0].split("mem[")[1]);
      const valArray = new Array(36).fill(0);
      const bitArray = (val >> 0).toString(2).split("").map(Number).reverse();

      bitArray.forEach(
        (item, index) => (valArray[valArray.length - 1 - index] = item)
      );
      const transformedValArray = valArray.concat().map((item, index) => {
        if (mask[index] !== "X") {
          return mask[index];
        }
        return item;
      });

      return {
        address,
        val,
        valArray,
        transformedValArray,
        transformedVal: parseInt(transformedValArray.join(""), 2),
      };
    }),
  };
};

const getArrayVals = (targetArray, remainderArray, resultArray = []) => {
  const transformIndex = remainderArray.pop();
  const array0 = targetArray.concat();
  const array1 = targetArray.concat();
  array0[transformIndex] = 0;
  array1[transformIndex] = 1;

  if (remainderArray.length) {
    return resultArray
      .concat([
        getArrayVals(array0, remainderArray.concat()),
        getArrayVals(array1, remainderArray.concat()),
      ])
      .flat();
  } else {
    return resultArray.concat([array0, array1]);
  }
};

const parseAddressInstructions = (
  parsedGroup
): {
  mask: string;
  instructions: {
    addresses: number[];
    val: number;
    valArray: number[];
    transformedValArray: number[];
  }[];
} => {
  const mask = parsedGroup[0].split(" = ")[1].split("");

  return {
    mask,
    instructions: parsedGroup.slice(1).map((item) => {
      const op = item.split("] = ");
      const address = Number(op[0].split("mem[")[1]);
      const val = Number(op[1]);
      const addressArray = new Array(36).fill(0);

      //  conveting  number to binary  arrray
      (address >> 0)
        .toString(2)
        .split("")
        .map(Number)
        .reverse()
        .forEach(
          (item, index) =>
            (addressArray[addressArray.length - 1 - index] = item)
        );

      const transformedAddressArray = addressArray
        .concat()
        .map((item, index) => (mask[index] !== "0" ? mask[index] : item));

      const floatingNumberIndex: number[] = transformedAddressArray
        .map((entry, index) => ({
          entry,
          index,
        }))
        .filter(({ entry }) => entry === "X")
        .map(({ index }) => index);
        
      const addresses = getArrayVals(
        transformedAddressArray,
        floatingNumberIndex.concat()
      ).map((address) => parseInt(address.join(""), 2));
      
      return {
        addresses,
        val,
      };
    }),
  };
};

const goA = (input) => {
  const parsedInput = parseGroups(input, parseOverwriteInstructions);

  const mem = [];
  parsedInput.forEach(({ instructions }) =>
    instructions.forEach(
      ({ address, transformedVal }) => (mem[address] = transformedVal)
    )
  );

  // return 0;
  return mem.filter(Boolean).reduce((acc, val) => (acc += val), 0);
};

const goB = (input) => {
  const parsedInput = parseGroups(input, parseAddressInstructions);

  const mem: { [key: string]: number } = {};
  parsedInput.forEach(({ instructions }) =>
    instructions.forEach(({ addresses, val }) =>
      addresses.forEach((address) => (mem[address] = val))
    )
  );

  return Object.values(mem).reduce((acc, val) => (acc += val), 0);
};

/* Tests */

// test(
//   goA(`mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
//   mem[8] = 11
//   mem[7] = 101
//   mem[8] = 0`),
//   165
// );
// test(
//   goB(`mask = 000000000000000000000000000000X1001X
//   mem[42] = 100`),
//   208
// );
// test(
//   goB(`mask = 000000000000000000000000000000X1001X
//   mem[42] = 100
//   mask = 00000000000000000000000000000000X0XX
//   mem[26] = 1`),
//   208
// );

/* Results */

console.time("Time");
// console.log("Solution to part 1:", goA(input));
console.log("Solution to part 2:", goB(input));
console.timeEnd("Time");
