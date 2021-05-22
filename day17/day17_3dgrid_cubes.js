let { test, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  return processed;
};
testRows = processInput(test);
// test2 = processInput(test2);
inputRows = processInput(input);
// console.log("testRows", testRows)

const make2dGrid = gridArr => {
  const rowsArr = [];
  for (let row of gridArr) {
    const rowArr = row.split("");
    rowsArr.push(rowArr);
  }
  return rowsArr;
};
let start2dZSlice = make2dGrid(testRows);
// console.log("start2dZSlice", start2dZSlice);

// USED IN FUNC BELOW - finds immediate adjacents in each direction
const findAdjacent = (ynum, xnum, ddArr) => {
  const adjacentsArr = [];
  const rowLength = ddArr[0].length;
  const colHeight = ddArr.length;

  if (xnum > 0) {
    const wst = ddArr[ynum][xnum - 1];
    adjacentsArr.push({ wst });
  }
  if (xnum > 0 && ynum > 0) {
    const nw = ddArr[ynum - 1][xnum - 1];
    adjacentsArr.push({ nw });
  }
  if (ynum > 0) {
    const nth = ddArr[ynum - 1][xnum];
    adjacentsArr.push({ nth });
  }
  if (ynum > 0 && xnum + 1 < rowLength) {
    const ne = ddArr[ynum - 1][xnum + 1];
    adjacentsArr.push({ ne });
  }
  if (xnum + 1 < rowLength) {
    const est = ddArr[ynum][xnum + 1];
    adjacentsArr.push({ est });
  }
  if (ynum + 1 < colHeight && xnum + 1 < rowLength) {
    const se = ddArr[ynum + 1][xnum + 1];
    adjacentsArr.push({ se });
  }
  if (ynum + 1 < colHeight) {
    const sth = ddArr[ynum + 1][xnum];
    adjacentsArr.push({ sth });
  }
  if (ynum + 1 < colHeight && xnum > 0) {
    const sw = ddArr[ynum + 1][xnum - 1];
    adjacentsArr.push({ sw });
  }
  // console.log(`for (${ynum}, ${xnum}) - ${spaceChar}, adjacentsArr is:`, adjacentsArr)
  return adjacentsArr;
};

const countAdjacentsIn2D = adjObjArr => {
  // console.log("counting 2d")
  let numAdj = 0;
  for (let adjObj of adjObjArr) {
    let value = adjObj[Object.keys(adjObj)[0]];
    if (value === "#") {
      numAdj++;
    }
  }
  // console.log()
  return numAdj;
};

// PROCESSES ADJACENTS in 2d ARR
const fetch2dAdjacents = d2Arr => {
  const processedGridArr = [];

  for (let row in d2Arr) {
    rowStr = d2Arr[row];
    ynum = Number(row);
    rowArr = [];

    for (let col in rowStr) {
      xnum = Number(col);
      const char = d2Arr[ynum][xnum];
      const adjacents = findAdjacent(ynum, xnum, d2Arr);
      const num2dAdj = countAdjacentsIn2D(adjacents);
      const spaceObj = {
        x: xnum,
        y: ynum,
        char: char,
        adjacents: adjacents,
        num2dAdj: num2dAdj
      };
      rowArr.push(spaceObj);
    }
    processedGridArr.push(rowArr);
  }
  // console.log(processedGridArr)
  return processedGridArr;
};
// const processedStartZSlice = fetch2dAdjacents(start2dZSlice);
// console.log("processedStartZSlice", processedStartZSlice);

const fetch3dAdjacents = d3Arr => {
  const processedd3Arr = [];

  for (let d2Slice of d3Arr) {
    let processedd2Slice = fetch2dAdjacents(d2Slice);

    processedd3Arr.push(processedd2Slice);
  }

  // console.log("\nd3Arr:");
  // console.log(processedd3Arr);

  // let slice0 = processedd3Arr[0];
  // let slice1 = processedd3Arr[1];
  // let slice2 = processedd3Arr[2];

  // console.log("slice0", slice0)

  // .. need to process/ count adjs 1st...

  return processedd3Arr;
};

// used in func below (builds grid to view from PROCESSED grids,)
const buildViewGrid = gridArr => {
  let newRowsArr = [];
  for (let rowOfObjs of gridArr) {
    let newRowStr = "";
    for (let cellObj of rowOfObjs) {
      newRowStr = newRowStr + cellObj["char"];
    }
    newRowsArr.push(newRowStr);
  }
  return newRowsArr;
};

// SHOWS GRID + CHARS IDENTIFIED AS ADJACENT
const view2dAdjacents = processedArr => {
  // show grid for array
  const gridView = buildViewGrid(processedArr);
  console.log("\ngridView:");
  console.log(gridView.join("\n"));

  // describe adjacents for each cell in arr
  for (let rowArr of processedArr) {
    for (let cell of rowArr) {
      console.log(
        `\nx: ${cell["x"]}, y: ${cell["y"]}, char: ${cell["char"]} num2dAdj: ${cell["num2dAdj"]}`
      );
      for (let losAdjObj of cell["adjacents"]) {
        console.log(losAdjObj);
      }
    }
  }
};
// view2dAdjacents(processedStartZSlice);

// SHOWS 3D GRID slices + CHARS IDENTIFIED AS ADJACENT
const view3dAdjacents = processedd3Arr => {
  console.log("3D ADJACENTS VIEW:");

  // show 2d Slice
  let sliceCounter = -1;
  for (let slice2d of processedd3Arr) {
    const gridView = buildViewGrid(slice2d);
    console.log("\nzSlice:", sliceCounter);
    console.log(gridView.join("\n"));
    sliceCounter++;
  }

  let adjCounter = -1;
  for (let slice2d of processedd3Arr) {
    console.log("\nADJACENTS for Z:", adjCounter);

    // describe adjacents for each cell in arr
    for (let rowArr of slice2d) {
      for (let cell of rowArr) {
        console.log(
          `\nx: ${cell["x"]}, y: ${cell["y"]}, char: ${cell["char"]} num2dAdj: ${cell["num2dAdj"]}`
        );
        for (let adjObj of cell["adjacents"]) {
          console.log(adjObj);
        }
      }
    }
    adjCounter++;
  }
};

const generateBlankSlice = (xWidth, yHeight) => {
  const d2Arr = [];

  // makes each row of '.' to given width
  const makeRow = xWidth => {
    const rowArr = [];
    for (let i = 0; i < xWidth; i++) {
      rowArr.push(".");
    }
    return rowArr;
  };
  // makes rows equal to required height + pushes to 2d arr
  for (let j = 0; j < yHeight; j++) {
    let row = makeRow(xWidth);
    d2Arr.push(row);
  }
  // console.log(d2Arr);
  return d2Arr;
};
// console.log("BLANK 2D:");
// generateBlankSlice(3, 3);

const generateBlank3d = (xWidth, yHeight, zDepth) => {
  const d3Arr = [];
  const d3Obj = {};

  for (let k = 0; k < zDepth; k++) {
    let slice = generateBlankSlice(xWidth, yHeight);
    d3Arr.push(slice);
    d3Obj[k] = slice;
  }
  // console.log("d3Arr", d3Arr)
  // console.log("\nd3 Obj", d3Obj)
  return [d3Obj, d3Arr];
};
let blank3dObj = generateBlank3d(3, 3, 3)[0];
let blank3dArr = generateBlank3d(3, 3, 3)[1];
// console.log("blank3dObj", blank3dObj)

let start3dObj = generateBlank3d(3, 3, 3)[0];
let start3dArr = generateBlank3d(3, 3, 3)[1];
start3dObj[1] = start2dZSlice;
start3dArr[1] = start2dZSlice;
// console.log("\nstart3dObj:");
// console.log(start3dObj);
// console.log(start3dArr)

// const processed3dAdjacents = fetch3dAdjacents(start3dArr);
// view3dAdjacents(processed3dAdjacents);

// used in func below, builds 2D grid from 2d rowsArr
const build2DGrid = rowsArr => {
  let newRowsArr = [];
  for (let row of rowsArr) {
    let newRowStr = "";
    for (let char of row) {
      newRowStr = newRowStr + char;
    }
    newRowsArr.push(newRowStr);
  }
  console.log(newRowsArr.join("\n"));
  return newRowsArr;
};

const show3dSlices = d3obj => {
  for (let sliceNum in d3obj) {
    console.log("\nsliceNum:", sliceNum);
    let d2Slice = d3obj[sliceNum];
    build2DGrid(d2Slice);
  }
};
// show3dSlices(blank3dObj)

const compareRowsInLayer = rowSlice3D => {
  let sliceCount = 0;
  for (let row of rowSlice3D) {
    // console.log("\n COUNTING SLICE", sliceCount);
    for (let cellObjNum in row) {
      // console.log("cellObjNum", cellObjNum)
      // console.log("rowSlice3D[1]", rowSlice3D[1])

      let cellObj = row[cellObjNum];

      let sliceAfter = sliceCount + 1;
      let sliceBefore = sliceCount - 1;
      let sliceRowAfter = rowSlice3D[sliceAfter];
      let sliceRowBefore = rowSlice3D[sliceBefore];

      // console.log(sliceRowAfter)
      // console.log(sliceRowBefore)

      cellObj["num3dAdjs"] = 0;

      // one or both of below conditions met...
      if (sliceRowAfter && !sliceRowBefore) {
        let cellAfter = sliceRowAfter[cellObjNum];
        // console.log("\nchecking slice after");
        cellObj["num3dAdjs"] =
          cellObj["num3dAdjs"] + cellAfter["num2dAdj"] + cellObj["num2dAdj"];
        if (cellAfter["char"] == "#") {
          cellObj["num3dAdjs"] = cellObj["num3dAdjs"] + 1;
        }
      }
      if (sliceRowBefore && !sliceRowAfter) {
        let cellBefore = sliceRowBefore[cellObjNum];
        // console.log("\nchecking slice before");
        cellObj["num3dAdjs"] =
          cellObj["num3dAdjs"] + cellBefore["num2dAdj"] + cellObj["num2dAdj"];
        if (cellBefore["char"] == "#") {
          cellObj["num3dAdjs"] = cellObj["num3dAdjs"] + 1;
        }
      }

      if (sliceRowBefore && sliceRowAfter) {
        // console.log("\nchecking slices before AND after");
        let cellBefore = sliceRowBefore[cellObjNum];
        let cellAfter = sliceRowAfter[cellObjNum];

        cellObj["num3dAdjs"] =
          cellObj["num3dAdjs"] +
          cellBefore["num2dAdj"] +
          cellAfter["num2dAdj"] +
          cellObj["num2dAdj"];

        if (cellBefore["char"] == "#") {
          cellObj["num3dAdjs"] = cellObj["num3dAdjs"] + 1;
        }
        if (cellAfter["char"] == "#") {
          cellObj["num3dAdjs"] = cellObj["num3dAdjs"] + 1;
        }
      }

      // console.log(cellObj);
      // console.log(cellObj["num3dAdjs"])
    }
    sliceCount++;
  }
};

const count3dAdjacents = processed3dArr => {
  // console.log("counting 3d adjacents");

  let topLayer = [
    processed3dArr[0][0],
    processed3dArr[1][0],
    processed3dArr[2][0]
  ];
  let midLayer = [
    processed3dArr[0][1],
    processed3dArr[1][1],
    processed3dArr[2][1]
  ];
  let bottomLayer = [
    processed3dArr[0][2],
    processed3dArr[1][2],
    processed3dArr[2][2]
  ];

  // console.log("\nTOP ROWS")
  compareRowsInLayer(topLayer);
  // console.log("\nMID ROWS");
  compareRowsInLayer(midLayer);
  // console.log("\nBOTTOM ROWS");
  compareRowsInLayer(bottomLayer);

  return processed3dArr;
};

const identifyChanges = processed3dArr => {
  for (let d2SliceArr of processed3dArr) {
    for (let rowArr of d2SliceArr) {
      for (let cellObj of rowArr) {
        // console.log("in identifyChanges, cellObj:", cellObj);
        // let numAdjacentOccupied = 0;
        // let adjacentSeatOccupied = false;

        cellObj["remainActive"] = false;
        cellObj["becomeInactive"] = false;
        cellObj["becomeActive"] = false;

        let num3dAdj = cellObj["num3dAdjs"];

        // if active
        if (cellObj["char"] == "#") {
          // remain active
          if (num3dAdj == 2 || num3dAdj == 3) {
            cellObj["remainActive"] = true;
            cellObj["becomeInactive"] = false;
          }
          // become inactive
          else {
            cellObj["remainActive"] = false;
            cellObj["becomeInactive"] = true;
          }
        }

        // if inactive
        if (cellObj["char"] == ".") {
          //become active
          if (num3dAdj == 3) {
            cellObj["becomeActive"] = true;
          }
        }
      }
    }
  }
  return processed3dArr;
};


const showProcessed3dGrid = processedd3Arr => {
  console.log("3D ADJACENTS VIEW:");

  // show 2d Slice
  let sliceCounter = -1;
  for (let slice2d of processedd3Arr) {
    const gridView = buildViewGrid(slice2d);
    console.log("\nzSlice:", sliceCounter);
    console.log(gridView.join("\n"));
    sliceCounter++;
  }
}

const updateGrid = changeFlagged3dArr => {
  let cellsChangedNum = 0;
  let turnOffs = 0;
  let turnOns = 0;
  // let totalOccupied = 0;

  for (let slice2d of changeFlagged3dArr) {
    for (let row of slice2d) {
      for (let cellObj of row) {
        console.log("in updateGrid, cellObj:", cellObj);
        if (cellObj["becomeInactive"] == true) {
          cellObj["char"] = ".";
          cellsChangedNum++;
          turnOffs++;
          cellObj["becomeInactive"] = false;
        }
        if (cellObj["becomeActive"] == true) {
          cellObj["char"] = "#";
          cellsChangedNum++;
          turnOns++;
          cellObj["becomeActive"] = false;
        }
      }
    }
  }
  
console.log(
  `turnOns: ${turnOns}, turnOffs: ${turnOffs}, totalChange: ${cellsChangedNum}`
);
const returnedGridArr = showProcessed3dGrid(changeFlagged3dArr);
return returnedGridArr
};

const fullyProcess3d = rowsArr => {
  // eg empty cube + make start 2d slice
  let blank3CubeObj = generateBlank3d(3, 3, 3)[0];
  let blank3CubeArr = generateBlank3d(3, 3, 3)[1];

  // starting cube (makes blank cube + updated with start slice)
  let startSlice = make2dGrid(rowsArr);
  let startCubeObj = generateBlank3d(3, 3, 3)[0];
  let startCubeArr = generateBlank3d(3, 3, 3)[1];
  // startCubeObj[0] = startSlice;
  startCubeObj[1] = startSlice;
  // startCubeObj[2] = startSlice;
  // startCubeArr[0] = startSlice;
  startCubeArr[1] = startSlice;
  // startCubeArr[2] = startSlice;
  console.log("\nstartCube:");
  // console.log(start3dObj);
  // console.log(startCubeArr)
  show3dSlices(startCubeObj);

  let processed3dAdjacents = fetch3dAdjacents(startCubeArr);
  processed3dAdjacents = count3dAdjacents(processed3dAdjacents);
  let changeFlagged3dArr = identifyChanges(processed3dAdjacents);
  let charSwitchedGrid = updateGrid(changeFlagged3dArr);

  // count 2dAdj for processed3d
  // count3dAdjacents()

  // view3dAdjacents(processed3dAdjacents);
};

fullyProcess3d(testRows);
