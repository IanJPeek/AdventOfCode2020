let { testStart, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  processed.shift();
  return processed;
};

testStart = processInput(testStart);
input = processInput(input);
console.log(testStart)

const make2dGrid = gridArr => {
  const rowsArr = [];
  for (let row of gridArr) {
    const rowArr = row.split("");
    rowsArr.push(rowArr);
  }
  return rowsArr;
};
const ddTestStart = make2dGrid(testStart);
// console.log("2d testStart:", ddTestStart);

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

const findLOSAdjacent = (ynum, xnum, ddArr) => {
  const losAdjacentsArr = [];
  const rowLength = ddArr[0].length;
  const colHeight = ddArr.length;

  if (xnum > 0) {
    // const wst = ddArr[ynum][xnum - 1];
    let foundWst = false;
    let yCheckNum = ynum;
    let xCheckNum = xnum - 1;
    let frstWest = "";

    let checkWest = (yNo, xNo, ddArr) => {
      let checkPos = ddArr[yNo][xNo];
      // console.log(`y: ${yNo}, x: ${xNo}, checkPos = ${checkPos}`)
      if (!foundWst && checkPos === ".") {
        // console.log('xNo before:', xNo)
        xNo--;
        // checkPos = ddArr[yCheckNum][xCheckNum];
        //  console.log("xNo after:", xNo);
        checkWest(yNo, xNo, ddArr);
      } else if (checkPos === undefined) {
        // console.log("found nuttin' west")
      } else {
        frstWest = checkPos;
        foundWst = true;
        // console.log("found west:", frstWest)
        return frstWest;
      }
    };
    frstWest = checkWest(yCheckNum, xCheckNum, ddArr);
    losAdjacentsArr.push({ frstWest });
  }

  if (xnum > 0 && ynum > 0) {
    // const nw = ddArr[ynum - 1][xnum - 1];
    let foundNWst = false;
    let yCheckNum = ynum - 1;
    let xCheckNum = xnum - 1;
    let frstNWest = "";

    let checkNWest = (yNo, xNo, ddArr) => {
      // console.log("x/y",xNo, yNo)
      let checkPos = ddArr[yNo][xNo];
      // console.log(`y: ${yNo}, x: ${xNo}, checkPos = ${checkPos}`)
      if (!foundNWst && checkPos === ".") {
        // console.log('xNo before:', xNo, 'yNo before:', yNo)
        xNo--;
        if (yNo > 0) {
          yNo--;
        }
        checkPos = ddArr[yCheckNum][xCheckNum];
        //  console.log("xNo after:", xNo, "yNo after:", yNo);
        checkNWest(yNo, xNo, ddArr);
      } else if (checkPos === undefined) {
        // console.log("found nuttin' Nwest")
      } else {
        frstNWest = checkPos;
        foundNWst = true;
        // console.log("found NWest:", frstNWest)
        return frstNWest;
      }
    };
    frstNWest = checkNWest(yCheckNum, xCheckNum, ddArr);
    losAdjacentsArr.push({ frstNWest });
  }

  if (ynum > 0) {
    // const nth = ddArr[ynum - 1][xnum];
    let foundNth = false;
    let yCheckNum = ynum - 1;
    let xCheckNum = xnum;
    let frstNth = "";

    let checkNorth = (yNo, xNo, ddArr) => {
      let checkPos = ddArr[yNo][xNo];
      // console.log(`y: ${yNo}, x: ${xNo}, checkPos = ${checkPos}`)
      if (!foundNth && checkPos === ".") {
        // console.log('yNo before:', yNo)
        if (yNo > 0) {
          yNo--;
          // console.log("yNo after:", yNo);
          checkPos = ddArr[yCheckNum][xCheckNum];
          checkNorth(yNo, xNo, ddArr);
        } //CAUSES INFINITE LOOP!!!
        // checkPos = ddArr[yCheckNum][xCheckNum];
      } else if (checkPos === undefined) {
        // console.log("found nuttin' north")
      } else {
        frstNth = checkPos;
        foundNth = true;
        // console.log("found north:", frstNth)
        return frstNth;
      }
    };
    frstNth = checkNorth(yCheckNum, xCheckNum, ddArr);
    losAdjacentsArr.push({ frstNth });
  }

  if (ynum > 0 && xnum + 1 < rowLength) {
    // if (xnum > 0 && ynum > 0)
    // const ne = ddArr[ynum - 1][xnum + 1];

    let foundNEst = false;
    let yCheckNum = ynum - 1;
    let xCheckNum = xnum + 1;
    let frstNEast = "";

    let checkNEast = (yNo, xNo, ddArr) => {
      // console.log("x/y",xNo, yNo)
      let checkPos = ddArr[yNo][xNo];
      // console.log(`y: ${yNo}, x: ${xNo}, checkPos = ${checkPos}`)
      if (!foundNEst && checkPos === ".") {
        // console.log('xNo before:', xNo, 'yNo before:', yNo)
        xNo++;
        if (yNo > 0) {
          yNo--;
        }
        checkPos = ddArr[yCheckNum][xCheckNum];
        //  console.log("xNo after:", xNo, "yNo after:", yNo);
        checkNEast(yNo, xNo, ddArr);
      } else if (checkPos === undefined) {
        // console.log("found nuttin' NEast")
      } else {
        frstNEast = checkPos;
        foundNEst = true;
        // console.log("found NEast:", frstNEast)
        return frstNEast;
      }
    };
    frstNEast = checkNEast(yCheckNum, xCheckNum, ddArr);
    losAdjacentsArr.push({ frstNEast });
  }

  if (xnum + 1 < rowLength) {
    // const est = ddArr[ynum][xnum + 1];
    let foundEast = false;
    let yCheckNum = ynum;
    let xCheckNum = xnum + 1;
    let frstEast = "";

    let checkEast = (yNo, xNo, ddArr) => {
      let checkPos = ddArr[yNo][xNo];
      // console.log(`y: ${yNo}, x: ${xNo}, checkPos = ${checkPos}`)
      if (!foundEast && checkPos === ".") {
        // console.log('xNo before:', xNo)
        xNo++;
        // checkPos = ddArr[yCheckNum][xCheckNum];
        //  console.log("xNo after:", xNo);
        checkEast(yNo, xNo, ddArr);
      } else if (checkPos === undefined) {
        // console.log("found nuttin' East")
      } else {
        frstEast = checkPos;
        foundEast = true;
        // console.log("found East:", frstEast)
        return frstEast;
      }
    };
    frstEast = checkEast(yCheckNum, xCheckNum, ddArr);
    losAdjacentsArr.push({ frstEast });
  }

  if (ynum + 1 < colHeight && xnum + 1 < rowLength) {
    // const se = ddArr[ynum + 1][xnum + 1];
    let foundSEast = false;
    let yCheckNum = ynum + 1;
    let xCheckNum = xnum + 1;
    let frstSEast = "";

    let checkSEast = (yNo, xNo, ddArr) => {
      // console.log("x/y",xNo, yNo)
      let checkPos = ddArr[yNo][xNo];
      // console.log(`y: ${yNo}, x: ${xNo}, checkPos = ${checkPos}`)
      if (!foundSEast && checkPos === ".") {
        // console.log('xNo before:', xNo, 'yNo before:', yNo)
        xNo++;
        if (yNo>=colHeight) {yNo++};
        checkPos = ddArr[yCheckNum][xCheckNum];
        //  console.log("xNo after:", xNo, "yNo after:", yNo);
        checkSEast(yNo, xNo, ddArr);
      } else if (checkPos === undefined) {
        // console.log("found nuttin' SEast")
      } else {
        frstSEast = checkPos;
        foundSEast = true;
        // console.log("found SEast:", frstSEast)
        return frstSEast;
      }
    };
    frstSEast = checkSEast(yCheckNum, xCheckNum, ddArr);
    losAdjacentsArr.push({ frstSEast });
  }

  if (ynum + 1 < colHeight) 
  {
    let foundSth = false;
    let yCheckNum = ynum + 1;
    let xCheckNum = xnum;
    let frstSth = "";

    let checkSouth = (yNo, xNo, ddArr) => {
      let checkPos = ddArr[yNo][xNo];
      // console.log(`y: ${yNo}, x: ${xNo}, checkPos = ${checkPos}`)
      if (!foundSth && checkPos === ".") {
        // console.log('yNo before:', yNo)
        if (yNo >= colHeight) {
          yNo++;
          // console.log("yNo after:", yNo);
          checkPos = ddArr[yCheckNum][xCheckNum];
          checkSouth(yNo, xNo, ddArr);
        } //CAUSES INFINITE LOOP!!!
        // checkPos = ddArr[yCheckNum][xCheckNum];
      } else if (checkPos === undefined) {
        // console.log("found nuttin' south")
      } else {
        frstSth = checkPos;
        foundSth = true;
        // console.log("found south:", frstSth)
        return frstSth;
      }
    };
    frstSth = checkSouth(yCheckNum, xCheckNum, ddArr);
    // console.log("frstSth", frstSth)
    losAdjacentsArr.push({ frstSth });
    // console.log("sth", losAdjacentsArr)
  }

  if (ynum + 1 < colHeight && xnum > 0) 
  {
    
    let foundSWest = false;
    let yCheckNum = ynum + 1;
    let xCheckNum = xnum - 1;
    let frstSWest = "";

    let checkSWest = (yNo, xNo, ddArr) => {
      // console.log("x/y",xNo, yNo)
      let checkPos = ddArr[yNo][xNo];
      // console.log(`y: ${yNo}, x: ${xNo}, checkPos = ${checkPos}`)
      if (!foundSWest && checkPos === ".") {
        // console.log('xNo before:', xNo, 'yNo before:', yNo)
        xNo--;
        if (yNo >= colHeight) {
          yNo++;
        }
        checkPos = ddArr[yCheckNum][xCheckNum];
        //  console.log("xNo after:", xNo, "yNo after:", yNo);
        checkSWest(yNo, xNo, ddArr);
      } else if (checkPos === undefined) {
        // console.log("found nuttin' SWest")
      } else {
        frstSWest = checkPos;
        foundSWest = true;
        // console.log("found SWest:", frstSWest)
        return frstSWest;
      }
    };
    frstSWest = checkSWest(yCheckNum, xCheckNum, ddArr);
    losAdjacentsArr.push({ frstSWest });
  }
  
  
  
  // console.log(`for (${ynum}, ${xnum}) - ${spaceChar}, adjacentsArr is:`, adjacentsArr)
  // console.log("losAdjacentsArr:",losAdjacentsArr)
  return losAdjacentsArr;
};

const fetchImmediateAdjacents = ddArr => {
  const processedGridArr = [];

  for (let row in ddArr) {
    rowStr = ddArr[row];
    ynum = Number(row);
    rowArr = [];

    for (let col in rowStr) {
      xnum = Number(col);
      const char = ddArr[ynum][xnum];
      const adjacents = findAdjacent(ynum, xnum, ddArr);
      const spaceObj = {
        x: xnum,
        y: ynum,
        char: char,
        adjacents: adjacents
      };
      rowArr.push(spaceObj);
    }
    processedGridArr.push(rowArr);
  }
  return processedGridArr;
};

const viewLOSAdjacents = processedLOSArr => {
  console.log("in viewLOSAdjacents")
  // console.log(processedLOSArr)
  for (let rowArr of processedLOSArr){
    for (let cell of rowArr){
      console.log(`\nx: ${cell["x"]}, y: ${cell["y"]}, char: ${cell["char"]}`)
      for (let losAdjObj of cell["adjacents"]){
        console.log(losAdjObj)
      }
      // console.log(`adjacents: ${cell['adjacents']}`)
      
      // , adjacents: 
      
    }
  }
};

const fetchLOSAdjacents = ddArr => {
  const processedLOSArr = [];

  for (let row in ddArr) {
    rowStr = ddArr[row];
    ynum = Number(row);
    losRowArr = [];

    for (let col in rowStr) {
      xnum = Number(col);
      const char = ddArr[ynum][xnum];
      const adjacents = findLOSAdjacent(ynum, xnum, ddArr);
      const spaceObj = {
        x: xnum,
        y: ynum,
        char: char,
        adjacents: adjacents
      };
      losRowArr.push(spaceObj);
    }
    processedLOSArr.push(losRowArr);
  }
  // console.log(processedLOSArr)
  viewLOSAdjacents(processedLOSArr)
  return processedLOSArr;
};

// The following rules are applied to every seat simultaneously:

// If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
// If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
// Otherwise, the seat's state does not change.
// Floor (.) never changes; seats don't move, and nobody sits on the floor.

const identifyChanges = processedGrid => {
  for (let rowObjArr of processedGrid) {
    for (let cellObj of rowObjArr) {
      let numAdjacentOccupied = 0;
      let adjacentSeatOccupied = false;

      // loop through adjacents to determine if any/ no. of adjacents
      for (let compAdjacent of cellObj["adjacents"]) {
        let key = Object.keys(compAdjacent)[0];

        if (compAdjacent[key] === "#") {
          numAdjacentOccupied++;
          adjacentSeatOccupied = true;
        }
        cellObj["adjacentSeatOccupied"] = adjacentSeatOccupied;
        cellObj["numAdjacentOccupied"] = numAdjacentOccupied;
      }

      // update cellObjs which will become occupied/ vacated
      if (cellObj["char"] === "L" && !cellObj["adjacentSeatOccupied"]) {
        cellObj["becomeOccupied"] = true;
      }
      if (cellObj["char"] === "#" && cellObj["numAdjacentOccupied"] >= 5) {
        cellObj["becomeVacated"] = true;
      }
    }
  }
  return processedGrid;
};

const fullyProcessGrid = gridRowsArr => {
  const new2dArr = make2dGrid(gridRowsArr);
  // const processed2dArr = fetchImmediateAdjacents(new2dArr);
  const processed2dArr = fetchLOSAdjacents(new2dArr);
  const adjacentsIDdArr = identifyChanges(processed2dArr);
  const newUpdatedGrid = updateGrid(adjacentsIDdArr);
  console.log("\n")
  console.log(newUpdatedGrid.join("\n"))

  return newUpdatedGrid;
};

const buildUpdatedGrid = updatedGridArr => {
  let newRowsArr = [];
  for (let rowOfObjs of updatedGridArr) {
    let newRowStr = "";
    for (let cellObj of rowOfObjs) {
      newRowStr = newRowStr + cellObj["char"];
    }
    newRowsArr.push(newRowStr);
  }
  // console.log("newGrid rowsArr:", newRowsArr);
  return newRowsArr;
};

const updateGrid = ddCheckedGridArr => {
  let cellsChangedNum = 0;
  let newlyOccupiedNum = 0;
  let newlyVacatedNum = 0;
  let totalOccupied = 0;

  for (let row of ddCheckedGridArr) {
    for (let cellObj of row) {
      if (cellObj["becomeOccupied"] == true) {
        cellObj["char"] = "#";
        cellsChangedNum++;
        newlyOccupiedNum++;
        cellObj["becomeOccupied"] = false;
      }
      if (cellObj["becomeVacated"] == true) {
        cellObj["char"] = "L";
        cellsChangedNum++;
        newlyVacatedNum++;
        cellObj["becomeVacated"] = false;
      }
      if (cellObj["char"] === "#") {
        totalOccupied++;
      }
    }
  }

  console.log(
    `newlyOccupied: ${newlyOccupiedNum}, newlyVacated: ${newlyVacatedNum}, totalChange: ${cellsChangedNum}, "TOTALOCC:", ${totalOccupied}`
  );
  const returnedGridArr = buildUpdatedGrid(ddCheckedGridArr);

  // repeat until equilibrium reached...
  // if (cellsChangedNum > 0) {
  //   fullyProcessGrid(returnedGridArr);
  // }

  if(cellsChangedNum == 71){
  fullyProcessGrid(returnedGridArr);
  }

  return returnedGridArr;
};

// console.log("testStart\n", testStart.join("\n"))
// const ansGrid1 = fullyProcessGrid(testStart);
