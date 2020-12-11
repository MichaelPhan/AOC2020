import { test, readInput } from "../utils/index";
import { cloneDeep } from "lodash";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

type SeatInfo = { x: number; y: number; val: string };

const parseSeats = (input): SeatInfo[][] =>
  input.split("\n").map((row, rowIndex) =>
    row
      .trim()
      .split("")
      .map((item, colIndex) => ({
        x: colIndex,
        y: rowIndex,
        val: item,
      }))
  );
const printSeats = (input: SeatInfo[][]) =>
  input.map((row) => row.map(({ val }) => val).join("")).join("\n");

const determineSeat = (seat: SeatInfo, floorPlan: SeatInfo[][]): Boolean => {
  const adjacentSeats = [
    // left
    floorPlan[seat.y]?.[seat.x - 1]?.val,
    // right
    floorPlan[seat.y]?.[seat.x + 1]?.val,
    // up
    floorPlan[seat.y - 1]?.[seat.x]?.val,
    // up-left
    floorPlan[seat.y - 1]?.[seat.x - 1]?.val,
    // up-right
    floorPlan[seat.y - 1]?.[seat.x + 1]?.val,
    // down
    floorPlan[seat.y + 1]?.[seat.x]?.val,
    // down-left
    floorPlan[seat.y + 1]?.[seat.x - 1]?.val,
    // down-right
    floorPlan[seat.y + 1]?.[seat.x + 1]?.val,
  ];

  switch (seat.val) {
    // empty seat
    case "L":
      // left
      if (adjacentSeats.every((status) => status !== "#"))
        return (seat.val = "#") && true;
      break;
    // occupied
    case "#":
      // unoccupied if 4 or  more adjacent  is occupied
      const occupiedSeats = adjacentSeats.reduce(
        (acc, status) => (status === "#" ? (acc += 1) : acc),
        0
      );
      if (occupiedSeats >= 4) return (seat.val = "L") && true;
      break;
  }

  return false;
};

enum Dir {
  left,
  right,
  top,
  bottom,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}

const getFirstVisibleSeat = (
  seat: SeatInfo,
  dir: Dir,
  floorPlan: SeatInfo[][]
) => {
  let nextSeatInfo = { ...seat, val: undefined };

  switch (dir) {
    case Dir.top:
      nextSeatInfo.y--;
      break;
    case Dir.left:
      nextSeatInfo.x--;
      break;
    case Dir.right:
      nextSeatInfo.x++;
      break;
    case Dir.bottom:
      nextSeatInfo.y++;
      break;
    case Dir.topLeft:
      nextSeatInfo.y--;
      nextSeatInfo.x--;
      break;
    case Dir.topRight:
      nextSeatInfo.y--;
      nextSeatInfo.x++;
      break;
    case Dir.bottomLeft:
      nextSeatInfo.y++;
      nextSeatInfo.x--;
      break;
    case Dir.bottomRight:
      nextSeatInfo.y++;
      nextSeatInfo.x++;
      break;
  }
  nextSeatInfo.val = floorPlan[nextSeatInfo.y]?.[nextSeatInfo.x]?.val;

  return nextSeatInfo.val === "." ? getFirstVisibleSeat(nextSeatInfo, dir, floorPlan) : nextSeatInfo.val;
};

const determineSeatsB = (seat: SeatInfo, floorPlan: SeatInfo[][]): Boolean => {
  const adjacentSeats = [
    getFirstVisibleSeat(seat, Dir.left, floorPlan),
    getFirstVisibleSeat(seat, Dir.right, floorPlan),
    getFirstVisibleSeat(seat, Dir.top, floorPlan),
    getFirstVisibleSeat(seat, Dir.bottom, floorPlan),
    getFirstVisibleSeat(seat, Dir.topLeft, floorPlan),
    getFirstVisibleSeat(seat, Dir.topRight, floorPlan),
    getFirstVisibleSeat(seat, Dir.bottomLeft, floorPlan),
    getFirstVisibleSeat(seat, Dir.bottomRight, floorPlan),
  ];
  // get first seen seat

  switch (seat.val) {
    // empty seat
    case "L":
      // left
      if (adjacentSeats.every((status) => status !== "#"))
        return (seat.val = "#") && true;
      break;
    // occupied
    case "#":
      // unoccupied if 4 or  more adjacent  is occupied
      const occupiedSeats = adjacentSeats.reduce(
        (acc, status) => (status === "#" ? (acc += 1) : acc),
        0
      );
      if (occupiedSeats >= 5) return (seat.val = "L") && true;
      break;
  }

  return false;
};

const goA = (input) => {
  const floorPlan = parseSeats(input);
  let oldFloorPlan = cloneDeep(floorPlan);

  let seatsChanged = true;
  while (seatsChanged) {
    seatsChanged = false;
    oldFloorPlan = cloneDeep(floorPlan);
    floorPlan.forEach((row) =>
      row.forEach((seat) => {
        if (determineSeat(seat, oldFloorPlan)) seatsChanged = true;
      })
    );
  }

  // console.log(printSeats(floorPlan));
  return floorPlan.reduce(
    (acc, row) =>
      (acc = row.reduce(
        (acc2, seat) => (seat.val === "#" ? (acc2 += 1) : acc2),
        acc
      )) && acc,
    0
  );
};

const goB = (input) => {
  const floorPlan = parseSeats(input);
  let oldFloorPlan = cloneDeep(floorPlan);

  let seatsChanged = true;
  while (seatsChanged) {
    seatsChanged = false;
    oldFloorPlan = cloneDeep(floorPlan);
    floorPlan.forEach((row) =>
      row.forEach((seat) => {
        if (determineSeatsB(seat, oldFloorPlan)) seatsChanged = true;
      })
    );
  }

  // console.log(printSeats(floorPlan));
  return floorPlan.reduce(
    (acc, row) =>
      (acc = row.reduce(
        (acc2, seat) => (seat.val === "#" ? (acc2 += 1) : acc2),
        acc
      )) && acc,
    0
  );
};

/* Tests */

// test(
//   goA(`L.LL.LL.LL
//   LLLLLLL.LL
//   L.L.L..L..
//   LLLL.LL.LL
//   L.LL.LL.LL
//   L.LLLLL.LL
//   ..L.L.....
//   LLLLLLLLLL
//   L.LLLLLL.L
//   L.LLLLL.LL`),
//   37
// );

test(
  goB(`L.LL.LL.LL
  LLLLLLL.LL
  L.L.L..L..
  LLLL.LL.LL
  L.LL.LL.LL
  L.LLLLL.LL
  ..L.L.....
  LLLLLLLLLL
  L.LLLLLL.L
  L.LLLLL.LL`),
  26
);
/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input))
console.log("Solution to part 2:", goB(input))
console.timeEnd("Time");
