let { test, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  return processed;
};
test = processInput(test);
input = processInput(input);
// console.log("test", test)

// 1) process tiles into individual obj + grids
// 2) identify borders for each tile

// make arr of tiles for processing
const makeTilesArr = input => {
  let tilesArray = [];
  let tile = [];

  for (let line of input) {
    let copyTile = [];
    line != ""
      ? tile.push(line)
      : ((copyTile = [...tile]), tilesArray.push(copyTile), (tile = []));
  }
  return tilesArray;
};

// process tiles into tileObjs
const makeTileObjs = tilesArr => {
  const tileObjsArr = [];
  for (let tile of tilesArr) {
    const tileObj = {};
    const tileGrid = [];
    tileObj["tile"] = Number(tile[0].slice(5, -1));
    for (let lineNum in tile) {
      const tileLine = tile[lineNum];
      if (lineNum > 0) {
        tileGrid.push(tileLine);
      }
      tileObj["grid"] = tileGrid;
    }
    tileObjsArr.push(tileObj);
  }
  return tileObjsArr;
};

const tileSeparator = input => {
  const tilesArray = makeTilesArr(input);
  const tileObjsArr = makeTileObjs(tilesArray);

  // console.log("tileObjs", tileObjsArr);
  return tileObjsArr;
};
const tileObjsArr = tileSeparator(test);

const borderMaker = tileObjsArr => {
  for (let tile of tileObjsArr) {
    let left = "";
    let right = "";
    // console.log(tile["grid"])
    tile["top"] = tile["grid"][0];
    tile["bottom"] = tile["grid"][tile["grid"].length - 1];
    for (let line of tile["grid"]) {
      left = left + line[0];
      right = right + line[line.length - 1];
    }
    tile["left"] = left;
    tile["right"] = right;
    tile["borders"] = [
      tile["top"],
      tile["right"],
      tile["bottom"],
      tile["left"]
    ];
  }
  // console.log("bordered tile objs", tileObjsArr);
  return tileObjsArr;
};
const borderedTiles = borderMaker(tileObjsArr);

const getFlippedBorders = borderedTiles => {
  for (let tile of borderedTiles) {
    let borderFlips = [];

    for (let border of tile["borders"]) {
      let flipArr = [];
      for (let char of border) {
        flipArr.unshift(char);
      }
      let flipStr = flipArr.join("");
      borderFlips.push(flipStr);
    }
    tile["borderFlips"] = borderFlips;
    tile["topFlip"] = borderFlips[0];
    tile["rightFlip"] = borderFlips[1];
    tile["bottomFlip"] = borderFlips[2];
    tile["leftFlip"] = borderFlips[3];
    tile["allBorders"] = tile["borders"].concat(borderFlips);

    // make lookup by border
    let keys = Object.keys(tile);
    let borderLookup = {};
    for (let key of keys) {
      newKey = tile[key];
      borderLookup[newKey] = key;
    }
    tile["borderLookup"] = borderLookup;
  }
  return borderedTiles;
};
const allBorderedTilesArr = getFlippedBorders(borderedTiles);

const makeTileWithAllBordersObj = allBorderedTilesArr => {
  // console.log("allBorderedTilesArr", allBorderedTilesArr)
  const tileWithBordersObj = {};
  for (let tile of allBorderedTilesArr) {
    tileWithBordersObj[tile["tile"]] = tile["allBorders"];
    // tile["borderLookup"] = allBorderedTilesArr[Object.keys(tile)]["borderLookup"]
    // tileWithBordersObj[tile["tile"]]["borderLookUp"] = tile["borderLookUp"];
  }

  // tileWithBordersObj[tile["borderLookup"]] = tile["borderLookup"];
  // console.log("tileWithBordersObj", tileWithBordersObj);
  return tileWithBordersObj;
};

const findBordersWith = allBorderedTilesArr => {
  const tilesWithAllBordersObj = makeTileWithAllBordersObj(allBorderedTilesArr);
  const tileNums = Object.keys(tilesWithAllBordersObj);

  // check which borders match for different grids
  for (let tileId of tileNums) {
    let gridToCheck = tilesWithAllBordersObj[tileId];
    gridToCheck["touches"] = [];
    gridToCheck["touchNums"] = [];
    // gridToCheck["borderLookup"] =
    for (let border of gridToCheck) {
      for (let tileLookUp of tileNums) {
        if (tileLookUp != tileId) {
          let otherGrid = tilesWithAllBordersObj[tileLookUp];
          for (let otherBorder of otherGrid) {
            let allMatch = true;
            for (let i = 0; i < gridToCheck.length; i++) {
              if (border[i] != otherBorder[i]) {
                allMatch = false;
              }
            }
            // add numbers & borders where matches found
            if (allMatch && border.length == otherBorder.length) {
              if (!gridToCheck["touches"].includes(tileLookUp)) {
                const borderLookUpObj = {};
                borderLookUpObj[tileLookUp] = otherBorder;
                gridToCheck["touches"].push(borderLookUpObj);
                if (!gridToCheck["touchNums"].includes(tileLookUp)) {
                  gridToCheck["touchNums"].push(tileLookUp);
                }
              }
            }
          }
        }
      }
    }
  }
  // console.log("bordered tiles with touching:", tilesWithAllBordersObj);
  return [tilesWithAllBordersObj, tileNums];
};
const touchingBordersObj = findBordersWith(allBorderedTilesArr)[0];
const tileNums = findBordersWith(allBorderedTilesArr)[1];

// console.log("allBorderedTilesArr", allBorderedTilesArr, "touchingBordersObj", touchingBordersObj)

const makeFindJoinsObjs = (touchingBordersObj, tileNums) => {
  const allJoiningTiles = [];
  for (let tileNum of tileNums) {
    const originalTile = tileNum;
    const gridAndInfo = touchingBordersObj[tileNum];
    const touchNumsArr = gridAndInfo["touchNums"];
    const touchesBorderLookups = gridAndInfo["touches"];

    // make borderLookUpsObj
    let allBorderLookUpsObj = { tile: originalTile };
    for (let tileNum of touchNumsArr) {
      allBorderLookUpsObj[tileNum] = [];

      for (let borderLookup of touchesBorderLookups) {
        if (borderLookup[tileNum]) {
          allBorderLookUpsObj[tileNum].push(borderLookup[tileNum]);
        }
      }
    }
    allJoiningTiles.push(allBorderLookUpsObj);
    // console.log("allBorderLookUpsObj", allBorderLookUpsObj);
  }
  // console.log(allJoiningTiles);
  return allJoiningTiles;
};

// Make lookupByBorder obj...
const findWhereTouching = (
  touchingBordersObj,
  allBorderedTilesArr,
  tileNums
) => {
  // touchingBordersObj[touches]
  // console.log("tileNums", tileNums);

  let joinLookupsArr = makeFindJoinsObjs(touchingBordersObj, tileNums);
  // console.log("joinLookupsArr",joinLookupsArr)

  // console.log(allBorderedTilesArr);
  
  let allJoined = []
  for (let tileJoinsObj of joinLookupsArr) {
    let joinNumLookups = Object.keys(tileJoinsObj);
    joinNumLookups.pop();
    let originalTile = tileJoinsObj["tile"];
    tileJoinsObj["joins"] = [];

    for (let numLookup of joinNumLookups) {
      for (let tileObj of allBorderedTilesArr) {
        if (tileObj["tile"] == numLookup) {
          let bordersToMatch = tileJoinsObj[numLookup];
          // console.log("\n","tileJoinsObj",tileJoinsObj)
          // console.log("numLookup",numLookup)
          // console.log("bordersToMatch",bordersToMatch)
          for (let borderMatch of bordersToMatch) {
            let join = tileObj["borderLookup"][borderMatch] + " " + numLookup;
            // console.log(join)
            tileJoinsObj["joins"].push(join);
          }
        }
      }
    }
    // console.log("identified joins", tileJoinsObj);
    allJoined.push(tileJoinsObj);
    console.log(allJoined)
  }
  return allJoined
};

// console.log(tileNum, touchNumsArr, touchesBorderLookupObjs);
// console.log("touchingBordersObj", touchingBordersObj)
// console.log("allBorderedTilesArr", allBorderedTilesArr)
// console.log("borderLookup", borderLookup)
// console.log(touchesBorderLookupObjs)

// }

// };
findWhereTouching(touchingBordersObj, allBorderedTilesArr, tileNums);
