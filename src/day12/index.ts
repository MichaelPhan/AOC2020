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
  x: number;
  y: number;
};

type WaypointInfo = {
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
      ship.y += value;
      break;
    case DIR.SOUTH:
      ship.y -= value;
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
      currentHeading -= value;
      break;
    case DIR.RIGHT:
      currentHeading += value;
      break;
  }

  if (log) {
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

const execInstruct2 = (
  ship: ShipInfo,
  waypoint: WaypointInfo,
  { dir, value }: { dir: DIR; value: number }
) => {
  switch (dir) {
    case DIR.NORTH:
      waypoint.y += value;
      break;
    case DIR.SOUTH:
      waypoint.y -= value;
      break;
    case DIR.EAST:
      waypoint.x += value;
      break;
    case DIR.WEST:
      waypoint.x -= value;
      break;
    case DIR.FORWARD:
      ship.x += value * waypoint.x;
      ship.y += value * waypoint.y;
      break;
    case DIR.LEFT:
    case DIR.RIGHT:
      const oldWaypoint = { ...waypoint };

      if (
        (value === 90 && dir === DIR.LEFT) ||
        (value === 270 && dir === DIR.RIGHT)
      ) {
        // 90 degree left or 270 right around center point = (A,B) -> (-B, A)

        waypoint.x = -oldWaypoint.y;
        waypoint.y = oldWaypoint.x;
      } else if (value === 180) {
        // 180 (A,B) -> (-A, -B)

        waypoint.x = -oldWaypoint.x;
        waypoint.y = -oldWaypoint.y;
      } else if (
        (value === 270 && dir === DIR.LEFT) ||
        (value === 90 && dir === DIR.RIGHT)
      ) {
        // 90 degree right or 270 left around center point = (A,B) -> (B, -A)
        waypoint.x = oldWaypoint.y;
        waypoint.y = -oldWaypoint.x;
      }
      break;
  }
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
  const ship = {
    dir: DIR.EAST,
    x: 0,
    y: 0,
  };
  const waypoint = {
    x: 10,
    y: 1,
  };

  parseInstructions(input).forEach((instruction) =>
    execInstruct2(ship, waypoint, instruction)
  );
  return Math.abs(ship.x) + Math.abs(ship.y);
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
console.log("Solution to part 1:", goA(input)); // 998
console.log("Solution to part 2:", goB(input)); // 71586
console.timeEnd("Time");
