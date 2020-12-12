import { Dir } from "fs";
import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

enum DIR {
  NORTH = "N",
  EAST = "E",
  SOUTH = "S",
  WEST = "W",
  FORWARD = "F",
  LEFT = "L",
  RIGHT = "R",
}
type ShipInfo = {
  dir: DIR;
  totalHeading: number;
  x: number;
  y: number;
};

const compass = {
  0: DIR.NORTH,
  90: DIR.EAST,
  180: DIR.SOUTH,
  270: DIR.WEST,
  [DIR.NORTH]: 0,
  [DIR.EAST]: 90,
  [DIR.SOUTH]: 180,
  [DIR.WEST]: 270,
};

const execInstruct = (
  ship: ShipInfo,
  { dir, value }: { dir: DIR; value: number },
  log = true
) => {
  let currentHeading = compass[ship.dir]; // Number based on DIR
  switch (dir) {
    case DIR.NORTH:
      ship.y -= value;
      break;
    case DIR.SOUTH:
      ship.y += value;
      break;
    case DIR.EAST:
      ship.x += value;
      break;
    case DIR.WEST:
      ship.x -= value;
      break;
    case DIR.FORWARD:
      execInstruct(ship, { dir: ship.dir, value }, false);
      break;
    case DIR.LEFT:
      ship.totalHeading -= value;
      currentHeading -= value;
      break;
    case DIR.RIGHT:
      ship.totalHeading += value;
      currentHeading += value;
      break;
  }

  if(log) { 
    console.log("set", dir, value, " - ship:", ship);
  }

  if (currentHeading === -90) currentHeading = 270;
  if (currentHeading === -180) currentHeading = 180;
  if (currentHeading === -270) currentHeading = 90;
  if (currentHeading === 360) currentHeading = 0;
  if (currentHeading === 450) currentHeading = 90;
  if (currentHeading === 540) currentHeading = 180;
  if (currentHeading === 630) currentHeading = 270;

  ship.dir = compass[currentHeading];
};

const parseInstructions = (input) =>
  input.split("\n").map((inst) => {
    let item = inst.trim();
    return {
      dir: item.charAt(0),
      value: Number(item.substr(1)),
    };
  });

const goA = (input) => {
  const ship = {
    dir: DIR.EAST,
    totalHeading: compass[DIR.EAST] as number,
    x: 0,
    y: 0,
  };
  parseInstructions(input).forEach((instruction) =>
    execInstruct(ship, instruction, false)
  );
  return Math.abs(ship.x) + Math.abs(ship.y);
};

const goB = (input) => {
  return 0;
};

/* Tests */

test(
  goA(`F10
  N3
  F7
  R90
  F11`),
  25
);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input));
// console.log("Solution to part 2:", goB(input))
console.timeEnd("Time");
