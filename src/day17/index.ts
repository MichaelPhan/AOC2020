import { test, readInput } from "../utils/index";

type Coordinate = { z: number; x: number; y: number; w: number };
type CoordinateInfo = Coordinate & { val: string; neighbours: Coordinate[] };
type EntryType = {
  //  w
  [key: number]: {
    // z
    [key: number]: {
      // y
      [key: number]: {
        // x
        [key: number]: CoordinateInfo;
      };
    };
  };
};

const prepareInput = (rawInput: string) => rawInput;
const parseInput = (rawInput: string, useW: boolean = false) =>
  rawInput
    .split("\n")
    .map((row) => row.trim().split(""))
    .reduce(
      (acc: EntryType, row, y) => {
        // building out the cube
        const entry = {
          x: undefined,
          y: undefined,
          z: undefined,
          w: undefined,
          val: undefined,
          neighbours: undefined,
        };
        const tarY = y - 1;
        entry.y = tarY;
        row.forEach((val, x) => {
          const tarX = x - 1;
          entry.x = tarX;
          entry.val = val;
          Object.keys(acc).forEach((w) => {
            Object.keys(acc[w]).forEach((z) => {
              acc[w][z] = acc[w][z] || {};
              acc[w][z][tarY] = acc[w][z][tarY] || {};
              acc[w][z][tarY] = acc[w][z][tarY] || {};
              acc[w][z][tarY][tarX] = acc[w][z][tarY][tarX] || {};

              entry.z = Number(z);
              entry.w = Number(w);
              acc[w][z][tarY][tarX] = {
                ...entry,
                neighbours: getNeighbours({ ...entry }, useW),
              };
            });
          });
        });

        return acc;
      },
      { [0]: { [0]: {} } }
    );

const input = prepareInput(readInput());

const printSlices = (input: EntryType) => {
  Object.keys(input).forEach((w) => {
    Object.keys(input[w]).forEach((z) => {
      printSliceZ(`w - ${w}, z - ${z}`, input?.[w]?.[z], input);
    });
  });
};

const printSliceZ = (
  address: string,
  slice: { [key: number]: CoordinateInfo }[],
  input?: EntryType
) => {
  console.log("\n", address);
  console.log(
    Object.keys(slice)
      .sort((a, b) => Number(a) - Number(b))
      .map((y) =>
        Object.keys(slice[y])
          .sort((a, b) => Number(a) - Number(b))
          // .map((x) => getActiveNeighbours(input, slice[y][x].neighbours).length)
          .map((x) => slice[y][x].val)
          // .map((x) => `(${slice[y][x].z},${slice[y][x].y},${slice[y][x].x},)`)
          .join("")
      )
      .join("\n")
  );
};

const getNeighbours = (
  coordinates: Coordinate,
  useW?: boolean
): Coordinate[] => {
  const { x, y, z, w } = coordinates;
  // get all neighbours
  // left, right, up, down, top-left, top-right
  const neighbours: Coordinate[] = [
    { z, y, x: x - 1, w }, // left
    { z, y, x: x + 1, w }, // right
    { z, y: y + 1, x, w }, // top
    { z, y: y - 1, x, w }, // bottom
    { z, y: y + 1, x: x - 1, w }, // top-left
    { z, y: y + 1, x: x + 1, w }, // top-right
    { z, y: y - 1, x: x - 1, w }, // bottom-left
    { z, y: y - 1, x: x + 1, w }, // bottom-right
  ];

  neighbours.concat().forEach((neighbour) => {
    // duplicating on the 3rd dimension
    neighbours.push({ ...neighbour, z: z + 1 });
    neighbours.push({ ...neighbour, z: z - 1 });
  });
  neighbours.push({ z: z + 1, y, x, w });
  neighbours.push({ z: z - 1, y, x, w });

  if (useW) {
    neighbours.concat().forEach((neighbour) => {
      // duplicating on the 4th dimension
      neighbours.push({ ...neighbour, w: w + 1 });
      neighbours.push({ ...neighbour, w: w - 1 });
    });

    neighbours.push({ x, y, z, w: w + 1 });
    neighbours.push({ x, y, z, w: w - 1 });
  }

  return neighbours;
};

const getActiveNeighbours = (
  input: EntryType,
  neighbours: Coordinate[]
): Coordinate[] => {
  return neighbours.filter(({ w, z, y, x }) => {
    return input[w]?.[z]?.[y]?.[x]?.val === "#";
  });
};

const getTargetFromCoordinate = (
  input: EntryType,
  { w, x, y, z }: Coordinate
): CoordinateInfo => input?.[w]?.[z]?.[y]?.[x];

const getAllActiveCoordinates = (input: EntryType): CoordinateInfo[] => {
  return Object.values(input).reduce((acc: CoordinateInfo[], z) => {
    Object.values(z).forEach((y) => {
      Object.values(y).forEach((x) => {
        Object.values(x).forEach(
          (coordinateInfo) =>
            coordinateInfo.val === "#" && acc.push(coordinateInfo)
        );
      });
    });
    return acc;
  }, []) as CoordinateInfo[];
};

const simulate = (input: EntryType, iterations, useW?: boolean) => {
  // here we go
  for (let i = 0; i < iterations; i++) {
    // const previousMap = deepCopy
    const changeLog: { coordinate: Coordinate; val: string }[] = [];
    const activeCoordinates: CoordinateInfo[] = getAllActiveCoordinates(input);

    // potential actives
    const potentialActives = activeCoordinates.reduce(
      (
        acc: { [key: string]: Coordinate & { count: number } },
        { neighbours }
      ) => {
        neighbours.forEach(({ w, x, y, z }) => {
          const hash = w + "" + z + "" + y + "" + x;
          // create a hash
          acc[hash] = acc[hash] || { w, z, y, x, count: 0 };
          acc[hash].count++;
        });
        return acc;
      },
      {}
    );

    Object.values(potentialActives).forEach(({ count, ...coordinate }) => {
      const target = getTargetFromCoordinate(input, coordinate);
      if (count === 3 && target?.val !== "#") {
        changeLog.push({ coordinate, val: "#" });
      }
    });

    // applying inactive rules
    Object.values(input).forEach((wSection) => {
      Object.values(wSection).forEach((zSection) => {
        Object.values(zSection).forEach((row) => {
          Object.values(row).forEach((coordinate) => {
            // if active
            if (coordinate.val === "#") {
              const activeNeighbours = getActiveNeighbours(
                input,
                coordinate.neighbours
              ).length;

              if (activeNeighbours !== 2 && activeNeighbours !== 3) {
                changeLog.push({ coordinate, val: "." });
              }
            }
            // determine whether or not something will become active
          });
        });
      });
    });

    // apply changlog
    changeLog.forEach((change) => {
      const {
        coordinate: { w, x, y, z },
        val,
      } = change;
      const target = getTargetFromCoordinate(input, { w, x, y, z });
      if (!!target) {
        target.val = val;
      } else {
        input[w] = input[w] || {};
        input[w][z] = input[w][z] || {};
        input[w][z][y] = input[w][z][y] || {};
        input[w][z][y][x] = {
          w,
          x,
          y,
          z,
          val,
          neighbours: getNeighbours({ w, x, y, z }, useW),
        };
      }
    });
  }
  return input;
};

const goA = (rawInput: string, iterations = 1) => {
  const input = parseInput(rawInput);
  // getting all active items
  return getAllActiveCoordinates(simulate(input, iterations)).length;
};

const goB = (rawInput: string, iterations = 1) => {
  const input = parseInput(rawInput, true);
  // 3216 is too high
  console.log(input[0][0][0][0].neighbours.length);
  // getting all active items
  return getAllActiveCoordinates(simulate(input, iterations, true)).length;
};

/* Tests */

// test(
//   // starting Z index = 0
//   goA(
//     prepareInput(`.#.
//   ..#
//   ###`),
//     1
//   ),
//   11
// );

// test(
//   // starting Z index = 0
//   goA(
//     prepareInput(`.#.
//   ..#
//   ###`),
//     2
//   ),
//   21
// );
test(
  // starting Z index = 0
  goA(
    prepareInput(`.#.
  ..#
  ###`),
    6
  ),
  112
);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input, 6));
console.log("Solution to part 2:", goB(input, 6));
console.timeEnd("Time");
