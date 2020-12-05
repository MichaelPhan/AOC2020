import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const parseSeatInfo = (seat: string[]) => {
  let row = new Array(128).fill(0).map((_, ind) => ind); // 0 included
  let col = new Array(8).fill(0).map((_, ind) => ind); // 0 included
  seat.forEach((letter) => {
    switch (letter) {
      case "F":
      case "L":
        let tarLower = letter === "F" ? row : col;
        tarLower.splice(tarLower.length / 2);
        // console.log(letter, ":", tarLower);
        break;
      case "B":
      case "R":
        let tarUpper = letter === "B" ? row : col;
        tarUpper.splice(0, tarUpper.length / 2);
        // console.log(letter, ":", tarUpper);
        break;
    }
  });

  if (row.length > 1) {
    console.error("invalid row:", row);
  }
  if (col.length > 1) {
    console.error("invalid col:", col);
  }

  const results: { row: number; col: number; id: number } = {
    row: row[0],
    col: col[0],
    id: row[0] * 8 + col[0],
  };
  return results;
};

const goA = (input) => {
  const instructions = input
    .split("\n")
    .map((seat) => parseSeatInfo(seat.split("")))
    .reduce((acc, item) => (acc < item.id ? item.id : acc), 0);

  return instructions;
};

const goB = (input) => {
  let arr: any[][] = new Array(128)
    .fill(0)
    .map((_, row) => new Array(8).fill(0).map((_, col) => row * 8 + col));

  const seats: any[] = input
    .split("\n")
    .map((seat) => parseSeatInfo(seat.split("")));

  seats.forEach(({ row, col }) => {
    arr[row] = arr[row] || [];
    arr[row][col] = `*`;
  });

  return arr
    .splice(arr.findIndex((cols) => cols.find((col) => col === "*")) + 1)
    .find((cols) => cols.find((col) => col !== "*"))
    .filter((seat) => seat !== "*").pop();
};

/* Tests */

test(parseSeatInfo(`BFFFBBFRRR`.split("")).id, 567);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input));
console.log("Solution to part 2:", goB(input));
console.timeEnd("Time");
