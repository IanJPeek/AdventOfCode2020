const map = require("./input");
const mapSplit = map.split("\n");

const rows = mapSplit.length;
const rowLength = mapSplit[0].length;

// Pt.2 SLOPES  (slope1 from Pt.1)
const slope0 = { Horizontal: 1, Vertical: 1 };
const slope1 = { Horizontal: 3, Vertical: 1 };
const slope2 = { Horizontal: 5, Vertical: 1 };
const slope3 = { Horizontal: 7, Vertical: 1 };
const slope4 = { Horizontal: 1, Vertical: 2 };
const slopes = [slope0, slope1, slope2, slope3, slope4];

const rowResults = [];
const rowsWithTrees = [];
const slopeResults = [];
let treesTotal = 0;

// const mapSample = [];
// for (let row in mapSplit) {
//   if (row <= 20) {
//     mapSample.push(mapSplit[row]);
//   }
// }

const checkRowsForTrees = (mapSample, slope, rowLength) => {
  const { Horizontal, Vertical } = slope;
  for (let row in mapSample) {
    const rowString = mapSample[row];
    const indexGrab = ((Horizontal * row) / Vertical) % rowLength;
    const result = rowString[indexGrab];
    const rowGrab = Vertical;

    if (row == 0) {
      rowResults.push("X");
    } else if (row > 0 && row % rowGrab == 0) {
      rowResults.push(result);
      if (result === "#") {
        rowsWithTrees.push(row);
        treesTotal++;
      }
    }
  }
};
// checkRowsForTrees(mapSplit, slope1, rowLength);

const checkTreesForSlopes = (mapSplit, slopes, rowLength) => {
  for (let slope of slopes) {
    treesTotal = 0;
    checkRowsForTrees(mapSplit, slope, rowLength);
    slopeResults.push(treesTotal);
  }
};
checkTreesForSlopes(mapSplit, slopes, rowLength);
console.log("Trees for slopes:", slopeResults);

let treesMultiplied = 1;
slopeResults.forEach(trees => (treesMultiplied = trees * treesMultiplied));
console.log("treesMuliplied: ", treesMultiplied);
