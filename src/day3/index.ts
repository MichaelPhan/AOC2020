import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  const originalMap = input.split("\n").filter(Boolean);
  let currentMap = originalMap.concat();

  const increaseMap = (map) => {
    const newMap = [];
    for(var  i = 0; i < map.length; i++) {
      newMap.push(map[i]+originalMap[i]);
    }
    return newMap;
  }
  
  let currentPos = {x:0, y:0};
  let treesHit = 0;
  while(currentPos.y < currentMap.length) {
    if(currentMap[currentPos.y][currentPos.x]  === "#")  {
      treesHit++;
    }

    currentPos.x += 3;
    currentPos.y += 1;

    if(currentMap[currentPos.y]  && currentPos.x >= currentMap[currentPos.y].length) {
      currentMap = increaseMap(currentMap);
    }
  }
  return treesHit;
}

const goB = (input) => {
  const originalMap = input.split("\n").filter(Boolean);
  let currentMap = originalMap.concat();

  const increaseMap = (map) => {
    const newMap = [];
    for(var  i = 0; i < map.length; i++) {
      newMap.push(map[i]+originalMap[i]);
    }
    return newMap;
  }
  
  let patterns = [
    {x: 1, y:1},
    {x: 3, y:1},
    {x: 5, y:1},
    {x: 7, y:1},
    {x: 1, y:2},
  ]
  let treesHitResults = [];

  patterns.forEach(pattern=>{

    let currentPos = {x:0, y:0};
    let treesHit = 0;
    while(currentPos.y < currentMap.length) {
      if(currentMap[currentPos.y][currentPos.x]  === "#")  {
        treesHit++;
      }

      currentPos.x += pattern.x;
      currentPos.y += pattern.y;

      if(currentMap[currentPos.y]  && currentPos.x >= currentMap[currentPos.y].length) {
        currentMap = increaseMap(currentMap);
      }
    }

    treesHitResults.push(treesHit);
  })
  return treesHitResults.reduce((acc, val)=> acc *= val, 1);
}

/* Tests */

test(goB(`..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#
`), 336);

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
