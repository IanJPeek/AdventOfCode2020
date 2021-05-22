let { test, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  processed.pop();
  return processed;
};

test = processInput(test);
input = processInput(input);

const separateInstructions = instructArr => {
  const instructions = [];
  for (let instruction of instructArr) {
    const instructObj = {
      direction: instruction[0],
      num: Number(instruction.slice(1))
    };
    instructions.push(instructObj);
  }
  return instructions;
};
const instructions = separateInstructions(input);
// console.log("instructions", instructions);
// console.log(input[input.length - 1]);


const sampleInstructions = instructions.slice(0,30)


const followInstructions = instructionsObjArr => {
  let travelDir = "E";
  const dirChangeArr = ["W", "N", "E", "S"];
  let eastWestNum = 0;
  let northSouthNum = 0;

  for (let instructObj of instructionsObjArr) {
    // console.log(instructObj);

    if (instructObj.direction === "E" || instructObj.direction === "W") {
      // console.log(`Moving E/W: ${instructObj.direction} ${instructObj.num} `);
      instructObj.direction == "E"
        ? (eastWestNum = eastWestNum + instructObj.num)
        : (eastWestNum = eastWestNum - instructObj.num);
      // console.log("New eastWestNum:", eastWestNum);
    } else if (instructObj.direction === "N" || instructObj.direction === "S") {
      // console.log(`Moving N/S: ${instructObj.direction} ${instructObj.num} `);
      instructObj.direction == "S"
        ? (northSouthNum = northSouthNum + instructObj.num)
        : (northSouthNum = northSouthNum - instructObj.num);
      // console.log("New northSouthNum:", northSouthNum);
    } else if (instructObj.direction === "L" || instructObj.direction === "R") {
      // console.log(`Current direction: ${travelDir}`);

      let dirIndex = dirChangeArr.indexOf(travelDir) + 4;
      let arrayChangeNum = instructObj.num / 90;
      let newIndex;
      instructObj.direction === "R"
        ? (newIndex = (dirIndex + arrayChangeNum) % 4)
        : (newIndex = (dirIndex - arrayChangeNum) % 4);
      travelDir = dirChangeArr[newIndex];

      // console.log(
      //   `Instruction ${instructObj.direction}${instructObj.num}: new direction - ${travelDir}`
      // );
    } else if (instructObj.direction === "F") {
      // console.log(`Heading ${travelDir} ${instructObj.num}`)
      if (travelDir == "E" || travelDir == "W") {
        travelDir == "E"
          ? (eastWestNum = eastWestNum + instructObj.num)
          : (eastWestNum = eastWestNum - instructObj.num);
        // console.log(`new eastWestNum: ${eastWestNum}`)
      } else if (travelDir == "N" || travelDir == "S") {
        travelDir == "S"
          ? (northSouthNum = northSouthNum + instructObj.num)
          : (northSouthNum = northSouthNum - instructObj.num);
        // console.log(`new northSouthNum: ${northSouthNum}`);
      }
    }

    // console.log(instructObj.direction)
  }

  const manhattanNo = eastWestNum + northSouthNum;
  console.log(
    `east/west: ${eastWestNum}, north/south: ${northSouthNum}, Manhattan: ${manhattanNo}`
  );
  return manhattanNo;
};

const followInstructionsV2 = instructionsObjArr => {
  let waypEastWestNum = 10;
  let waypNorthSouthNum = -1;
  let waypDir = "E";
  const dirChangeArr = ["W", "N", "E", "S"];
  let absEastWestNum = 0;
  let absNorthSouthNum = 0;
  let relativEastWestNum = 0;
  let relativNorthSouthNum = 0;

  for (let instructObj of instructionsObjArr) {
    console.log(instructObj);

    if (instructObj.direction === "E" || instructObj.direction === "W") {
      // console.log(`Moving wp E/W: ${instructObj.direction} ${instructObj.num} `);
      instructObj.direction == "E"
        ? (waypEastWestNum = waypEastWestNum + instructObj.num)
        : (waypEastWestNum = waypEastWestNum - instructObj.num);
      console.log("New waypEastWestNum:", waypEastWestNum);
    } else if (instructObj.direction === "N" || instructObj.direction === "S") {
      // console.log(`Moving wp N/S: ${instructObj.direction} ${instructObj.num} `);
      instructObj.direction == "S"
        ? (waypNorthSouthNum = waypNorthSouthNum + instructObj.num)
        : (waypNorthSouthNum = waypNorthSouthNum - instructObj.num);
      console.log("New waypNorthSouthNum:", waypNorthSouthNum);
    } else if (instructObj.direction === "L" || instructObj.direction === "R") {
      // console.log(`Current direction: ${waypDir}`);

      let waypTempNSNum = waypNorthSouthNum;

      if (instructObj.num == 180) {
        waypEastWestNum = waypEastWestNum * -1;
        waypNorthSouthNum = waypNorthSouthNum * -1;
        // waypDir = (dirChangeArr.indexOf(waypDir) + 6) % 4;
        console.log(
          `WayP position CHANGE - New waypEWNum = ${waypEastWestNum}, waypNSnum = ${waypNorthSouthNum} `
        );
      } else if (
        (instructObj.direction == "L" && instructObj.num == 90) ||
        (instructObj.direction == "R" && instructObj.num == 270)
      ) {
        waypNorthSouthNum = waypEastWestNum * -1;
        waypEastWestNum = waypTempNSNum;
        console.log(
          `WayP position CHANGE - New waypEWNum = ${waypEastWestNum}, waypNSnum = ${waypNorthSouthNum} `
        );
      } else if (
        (instructObj.direction == "R" && instructObj.num == 90) ||
        (instructObj.direction == "L" && instructObj.num == 270)
      ) {
        waypNorthSouthNum = waypEastWestNum;
        waypEastWestNum = waypTempNSNum * -1;
        console.log(
          `WayP position CHANGE - New waypEWNum = ${waypEastWestNum}, waypNSnum = ${waypNorthSouthNum} `
        );
      }
    } else if (instructObj.direction === "F") {
      relativEastWestNum = instructObj.num * waypEastWestNum;
      relativNorthSouthNum = instructObj.num * waypNorthSouthNum;
      absEastWestNum = absEastWestNum + relativEastWestNum;
      absNorthSouthNum = absNorthSouthNum + relativNorthSouthNum;
      console.log("abs N/S, E/W", absNorthSouthNum, absEastWestNum);
    }
  }

  const manhattanNo = absEastWestNum + absNorthSouthNum;
  console.log(
    `east/west: ${absEastWestNum}, north/south: ${absNorthSouthNum}, Manhattan: ${manhattanNo}`
  );
  return manhattanNo;
};

followInstructionsV2(instructions);
// console.log(instructions)

// Action N means to move the waypoint north by the given value.
// Action S means to move the waypoint south by the given value.
// Action E means to move the waypoint east by the given value.
// Action W means to move the waypoint west by the given value.
// Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
// Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
// Action F means to move forward to the waypoint a number of times equal to the given value.
// The waypoint starts 10 units east and 1 unit north relative to the ship. The waypoint is relative to the ship; that is, if the ship moves, the waypoint moves with it.

// For example, using the same instructions as above:

// F10 moves the ship to the waypoint 10 times (a total of 100 units east and 10 units north), leaving the ship at east 100, north 10. The waypoint stays 10 units east and 1 unit north of the ship.
// N3 moves the waypoint 3 units north to 10 units east and 4 units north of the ship. The ship remains at east 100, north 10.
// F7 moves the ship to the waypoint 7 times (a total of 70 units east and 28 units north), leaving the ship at east 170, north 38. The waypoint stays 10 units east and 4 units north of the ship.
// R90 rotates the waypoint around the ship clockwise 90 degrees, moving it to 4 units east and 10 units south of the ship. The ship remains at east 170, north 38.
// F11 moves the ship to the waypoint 11 times (a total of 44 units east and 110 units south), leaving the ship at east 214, south 72. The waypoint stays 4 units east and 10 units south of the ship.
// After these operations, the ship's Manhattan distance from its starting position is 214 + 72 = 286.
