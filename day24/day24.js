let { test, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  return processed;
};
test = processInput(test);
input = processInput(input);
// console.log(test);

const getDirections = input => {
  let allDirections = [];
  for (let directionString of input) {
    let directions = [];
    let singleDirection = "";
    for (let char of directionString) {
      if (char == "e" || char == "w") {
        singleDirection = singleDirection + char;
        directions.push(singleDirection);
        singleDirection = "";
      } else {
        singleDirection = singleDirection + char;
      }
    }
    allDirections.push(directions);
  }
  return allDirections;
};
const directionSets = getDirections(input);
// console.log("directionSets", directionSets);

const cancelDirections = directionObj => {
  let { eCount, wCount, seCount, swCount, neCount, nwCount } = directionObj;

  // cancel w/ e
  if (wCount > eCount) {
    let weDiff = wCount - eCount;
    directionObj.wCount = weDiff;
    directionObj.eCount = 0;
  } else {
    let weDiff = eCount - wCount;
    directionObj.eCount = weDiff;
    directionObj.wCount = 0;
  }

  // cancel sw/ ne
  if (swCount > neCount) {
    let swneDiff = swCount - neCount;
    directionObj.swCount = swneDiff;
    directionObj.neCount = 0;
  } else {
    let swneDiff = neCount - swCount;
    directionObj.neCount = swneDiff;
    directionObj.swCount = 0;
  }

  // cancel se/ nw
  if (seCount > nwCount) {
    let senwDiff = seCount - nwCount;
    directionObj.seCount = senwDiff;
    directionObj.nwCount = 0;
  } else {
    let senwDiff = nwCount - seCount;
    directionObj.nwCount = senwDiff;
    directionObj.seCount = 0;
  }
  // console.log("cancelled directions:", directionObj)
};

const determineGridPosition = directionObj => {
  const { eCount, wCount, seCount, swCount, neCount, nwCount } = directionObj;
  const nPosition = nwCount / 2 + neCount / 2 - swCount / 2 - seCount / 2;
  const ePosition =
    eCount + seCount / 2 + neCount / 2 - wCount - swCount / 2 - nwCount / 2;
  directionObj["nPosition"] = nPosition;
  directionObj["ePosition"] = ePosition;
};

const detailDirections = directionSets => {
  // let eCount, wCount, seCount, swCount, neCount, nwCount;
  const directionInfo = [];

  for (let directionSet of directionSets) {
    let directionObj = {
      eCount: 0,
      wCount: 0,
      seCount: 0,
      swCount: 0,
      neCount: 0,
      nwCount: 0
    };
    for (let direction of directionSet) {
      switch (direction) {
        case "e":
          directionObj.eCount++;
          break;
        case "w":
          directionObj.wCount++;
          break;
        case "se":
          directionObj.seCount++;
          break;
        case "sw":
          directionObj.swCount++;
          break;
        case "ne":
          directionObj.neCount++;
          break;
        case "nw":
          directionObj.nwCount++;
          break;
        default:
          console.log("error with switch statement direction");
      }
    }
    // console.log("original directionObj", directionObj)
    cancelDirections(directionObj);
    determineGridPosition(directionObj);
    directionInfo.push(directionObj);
  }
  // console.log("directionInfo", directionInfo);
  return directionInfo;
};
const directionInfo = detailDirections(directionSets);

// identifies all hexes to flip from instruction string...
// returns arr of [{nPosition: 0, ePosition: 0}, ...] objs
const gatherPositions = directionInfo => {
  let hexArray = [];
  for (let hexObj of directionInfo) {
    hex = { nPosition: hexObj.nPosition, ePosition: hexObj.ePosition };
    hexArray.push(hex);
  }
  return hexArray;
};
const hexArray = gatherPositions(directionInfo);
// console.log("hexArray", hexArray);

// makes grid large enough to contain all flipped tiles + border (for later flips)
const makeFullGrid = hexArray => {
  const nPositions = [];
  const ePositions = [];

  hexArray.forEach(hex => {
    nPositions.push(hex.nPosition), ePositions.push(hex.ePosition);
  });

  let nLimit = Math.max(...nPositions);
  let sLimit = Math.min(...nPositions);
  let eLimit = Math.max(...ePositions);
  let wLimit = Math.min(...ePositions);

  let nBorderLimit = nLimit + 0.5;
  let sBorderLimit = sLimit - 0.5;
  let eBorderLimit = eLimit + 1;
  let wBorderLimit = wLimit - 1;

  // console.log(ePositions)
  // console.log("n/s furthest", nLimit, sLimit);
  // console.log("n/s borders", nBorderLimit, sBorderLimit);
  // console.log("e/w furthest", eLimit, wLimit);
  // console.log("e/w borders", eBorderLimit, wBorderLimit);

  const fullHexGrid = [];

  for (let i = sBorderLimit; i <= nBorderLimit; i += 0.5) {
    // tweak to make grid of only existing hexes...
    let j;
    for (
      // CHANGED + 0.5 on j... !!! (works on test, changed for real input...)
      Math.abs(i) % 1 == 0.5 ? (j = wBorderLimit) : (j = wBorderLimit + 0.5);
      j <= eBorderLimit;
      j += 1
    ) {
      // console.log("i", i, "j", j);
      let hexObj = {
        ePosition: j,
        nPosition: i,
        tileColour: "white"
      };
      fullHexGrid.push(hexObj);
    }
  }
  // console.log("n/s borders", nBorderLimit, sBorderLimit)
  // console.log("e/w borders", eBorderLimit, wBorderLimit);
  return fullHexGrid;
};
let fullHexGrid = makeFullGrid(hexArray);
// console.log("fullHexGrid", fullHexGrid);
console.log("fullHexGrid size:", fullHexGrid.length);

const flipHexesInGrid = (hexArray, fullGrid) => {
  // check tileToFlip (from hexArray) against fullArray + flip
  for (let hex of hexArray) {
    const { ePosition, nPosition } = hex;

    for (let gridHex of fullGrid) {
      if (gridHex.ePosition == ePosition && gridHex.nPosition == nPosition) {
        gridHex["flipCount"] ? gridHex.flipCount++ : (gridHex["flipCount"] = 1);
      }
    }
  }

  // assign "black" colour to odd flipCounts, count total black tiles
  let blackTiles = 0;
  fullGrid.forEach(hex => {
    if (hex.flipCount) {
      hex["tileColour"] = hex.flipCount % 2 == 0 ? "white" : "black";
      hex.tileColour == "black" ? blackTiles++ : null;
    }
  });

  console.log("number of black tiles:", blackTiles);
  return fullGrid;
};
let gridArray = flipHexesInGrid(hexArray, fullHexGrid);
// console.log("gridArray", gridArray);

// for testing
const sampler = (arr, sampleSize = 50) => {
  let sampleArr = [];
  let i = 0;
  for (let hex of arr) {
    if (i < sampleSize) {
      sampleArr.push(hex);
    }
    i++;
  }
  return sampleArr;
};
// const sampleArr = sampler(gridArray, 20);
// console.log("sampleArr", sampleArr, sampleArr.length);

const countBlackAdjacents = adjHexObj => {
  let keys = Object.keys(adjHexObj.adjacents);
  let blackCount = 0;

  for (let key of keys) {
    if (adjHexObj.adjacents[key] == "black") {
      blackCount = blackCount + 1;
    }
  }
  adjHexObj["adjBlack"] = blackCount;
};

const findAdjacents = arr => {
  for (let hex of arr) {
    hex["adjacents"] = {
      neAdj: "NULL",
      eAdj: "NULL",
      seAdj: "NULL",
      swAdj: "NULL",
      wAdj: "NULL",
      nwAdj: "NULL"
    };

    for (let adjHex of arr) {
      if (hex != adjHex) {
        // if ((+/- 1 for e/w)  &&  (+/- 0.5 for n/s))
        if (
          (adjHex.ePosition <= hex.ePosition + 1 ||
            adjHex.ePosition >= hex.ePosition - 1) &&
          (adjHex.nPosition <= hex.nPosition + 0.5 ||
            adjHex.nPosition >= hex.nPosition - 0.5)
        ) {
          // ne
          if (
            adjHex.ePosition == hex.ePosition + 0.5 &&
            adjHex.nPosition == hex.nPosition + 0.5
          ) {
            hex.adjacents.neAdj = adjHex.tileColour;
          }
          // e
          // ** second && condition prevents +/- 0.5 n/s error overwrites!
          else if (
            adjHex.ePosition == hex.ePosition + 1 &&
            adjHex.nPosition == hex.nPosition
          ) {
            hex.adjacents.eAdj = adjHex.tileColour;
          }
          // se
          else if (
            adjHex.ePosition == hex.ePosition + 0.5 &&
            adjHex.nPosition == hex.nPosition - 0.5
          ) {
            hex.adjacents.seAdj = adjHex.tileColour;
          }
          // sw
          else if (
            adjHex.ePosition == hex.ePosition - 0.5 &&
            adjHex.nPosition == hex.nPosition - 0.5
          ) {
            hex.adjacents.swAdj = adjHex.tileColour;
          }
          // w
          // ** second && condition prevents +/- 0.5 n/s error overwrites!
          else if (
            adjHex.ePosition == hex.ePosition - 1 &&
            adjHex.nPosition == hex.nPosition
          ) {
            hex.adjacents.wAdj = adjHex.tileColour;
          }
          // nw
          else if (
            adjHex.ePosition == hex.ePosition - 0.5 &&
            adjHex.nPosition == hex.nPosition + 0.5
          ) {
            hex.adjacents.nwAdj = adjHex.tileColour;
          }
        }
      }
    }
  }
};

const processAdjacents = arr => {
  findAdjacents(arr);
  arr.forEach(hex => countBlackAdjacents(hex));
};
processAdjacents(gridArray);
// console.log("adjusted Array...", gridArray);


// filter to return black tiles to re-flip after making newArr...?
const flipTiles = arr => {
  let numBlackToWhiteFlips = 0;
  let numWhiteToBlackFlips = 0;

  for (let hex of arr) {
    if (hex.tileColour == "black") {
      if (hex.adjBlack == 0 || hex.adjBlack > 2) {
        hex.tileColour = "white";
        numBlackToWhiteFlips++;
      }
    } else if (hex.tileColour == "white") {
      if (hex.adjBlack == 2) {
        hex.tileColour = "black";
        numWhiteToBlackFlips++;
        // console.log("white to black:", hex)
      }
    }
  }

  // console.log("\nnumBlackToWhiteFlips", numBlackToWhiteFlips);
  // console.log("numWhiteToBlackFlips", numWhiteToBlackFlips);

  let numBlackTiles = 0;
  arr.forEach(hex => {
        hex.tileColour == "black" ? numBlackTiles++ : null;
    });
    // console.log("black tiles after ruleFlip:", numBlackTiles)
    
    const blackTilesArrAfterFlip = arr.filter(hex => hex.tileColour == "black")
    const purgedBlackTilesArr = blackTilesArrAfterFlip.map(
      hex => (hex = { ePosition: hex.ePosition, nPosition: hex.nPosition })
    );
    // console.log("blackTilesArrAfterFlip", blackTilesArrAfterFlip.length);
    // console.log("purgedBlackTilesArr", purgedBlackTilesArr.length)
    return purgedBlackTilesArr;
};
let newBlackTilesArr = flipTiles(gridArray);
// console.log("newBlackTilesArr", newBlackTilesArr.length);
// console.log("newBlackTilesArr", newBlackTilesArr, newBlackTilesArr.length)
// console.log(gridArray)

// expand arr size if necessary...
let i = 0
const repeatFlip = (gridArr, newBlackTilesArr, num = 100) => {


  while (i< num){
  i++
  console.log("\nday", i)
  let expandedGrid = makeFullGrid(gridArr)
  gridArr = flipHexesInGrid(newBlackTilesArr, expandedGrid)
  processAdjacents(gridArr)
  let newBlackTiles = flipTiles(gridArr);
  repeatFlip(gridArr, newBlackTiles)

  }
  return gridArr

}
let arrAfterRuleFlips = repeatFlip(gridArray, newBlackTilesArr)


// let [arrAfterFlips, newBlacks] = repeatFlip(arrAfterRuleFlips, newBlackTiles);
// repeatFlip(arrAfterFlips, newBlacks);