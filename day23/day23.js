let test = "389125467";
let testArr = test.split("");
testArr = testArr.map(str => Number(str));
let input = "418976235";
let inputArr = input.split("");
inputArr = inputArr.map(str => Number(str));

let ellInput = "476138259";
let ellInputArr = ellInput.split("");
ellInputArr = ellInputArr.map(str => Number(str));
// console.log("ellInputArr", ellInputArr);


// not used..
let currentCupIndex = 0;
let currentCup = 0;
const getCurrentCupIndex = (currentCupIndex = 0, arr) => {
  currentCupIndex + 1 < arr.length
    ? (currentCup = currentCup++)
    : (currentCup = currentCup++ % arr.length);
  console.log("\ncurrentCupIndex + currentCup:", currentCupIndex, currentCup);
  return currentCup;
};
// currentCupIndex = getCurrentCupIndex(0, testArr);
// currentCup = testArr[currentCupIndex];

// removes next three elements from arr + returns these
const getNextThree = (currentCupIndex, getNum = 3, arr) => {
  console.log("gettingNextThree")
  if (currentCupIndex + 3 < arr.length) {
    let grab = arr.splice(currentCupIndex + 1, getNum);
    console.log("grab 3:", grab);
    return grab;
  } else {
    const remaining = arr.length - currentCupIndex;
    
    let grabXFromStart = (getNum - remaining) + 1;
    getNum = remaining;
    let grab = arr.splice(currentCupIndex + 1, getNum);
    let startGrab = arr.splice(0, grabXFromStart);
    let fullGrab = grab.concat(startGrab);
    console.log("fullGrab 3:", fullGrab);
    return fullGrab;
  }
};
// const nextThree = getNextThree(currentCupIndex, 3, testArr);

// finds destinationCup (where to insert grabbed cups)
const getDestinationCup = (currentCup, arr, grabThree) => {
  // console.log("at start grab3", grabThree)
  let arrayMin = Math.min(...arr);
  let destinationCup = currentCup - 1;
  if (destinationCup == currentCup) {
    destinationCup--;
  }
  // console.log("in get destination, destination cup:", destinationCup);
  if (testArr.includes(destinationCup)) {
    console.log("in get destination, found + returning:", destinationCup);
    return destinationCup;
  } else {
    if (destinationCup > arrayMin) {
      destinationCup--;
      if (testArr.includes(destinationCup)) {
        console.log("in get destination, lowered + returned:", destinationCup);
        return destinationCup;
      } else if (destinationCup > arrayMin) {
        destinationCup--;
        if (testArr.includes(destinationCup)) {
          console.log(
            "in get destination, DOUBLE-lowered + returned:",
            destinationCup
          );

          return destinationCup;
        }
      }
    } else {
      destinationCup = Math.max(...arr);
      // console.log("grabThree", grabThree)
      while (grabThree.includes(destinationCup)) {
        destinationCup--;
      }
      console.log("in get destination, grabbed max:", destinationCup);
      return destinationCup;
    }
  }
};
// let destinationCup = getDestinationCup(currentCup, testArr);
// console.log("returned destination cup:", destinationCup)

const insertCups = (destinationCup, nextThree, arr) => {
  const destinationIndex = arr.indexOf(destinationCup) + 1;
  // console.log(`destinationIndex: ${destinationIndex} for arr ${testArr}`)
  arr.splice(destinationIndex, 0, ...nextThree);
  console.log("array after inserts...", arr);
};
// insertCups(destinationCup, nextThree, testArr);

// let startCupIndex = 0
// let startCup = testArr[startCupIndex]

let runTimes = 100;
let runNum = 0;

const setUpMove = arr => {
  let startIndex = 0;
  while (runNum < runTimes) {
    console.log("\nRun Num:", runNum + 1);

    startIndex = startIndex % arr.length;
    let grabCup = arr[startIndex];
    console.log("current cup:", grabCup)

    let grab = getNextThree(startIndex, 3, arr);
    // console.log("grab...", grab)
    let destinCup = getDestinationCup(grabCup, arr, grab);
    insertCups(destinCup, grab, arr);
    // startIndex++;
    startIndex = arr.indexOf(grabCup) + 1
    console.log("new startIndex", startIndex)
    // startCupIndex = getCurrentCupIndex(startCupIndex, arr)

    runNum++;
  }
};
setUpMove(ellInputArr);
// console.log("original inputArr", inputArr);

// from Ell ... 
// array after inserts... [
//   4, 6, 2, 1, 7,
//   3, 9, 8, 5
// ]
// 73985462