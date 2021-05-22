const inputString = require("./input");
const splitString = inputString.split(";\n");
const numArray = splitString.map(str => Number(str));

testArr = [100, 200, 2000, 20, 4, 17];
tripleTestArr = [2000, 80, 200, 36, 91, 15, 1117, 5];

function addTo2020(testArr) {
  for (let num of testArr) {
    const pairTotalNum = 2020 - num;
    console.log(pairTotalNum);
    if (testArr.includes(pairTotalNum)) {
      console.log("2020 made with: ", num, " + ", pairTotalNum);
      return pairTotalNum;
    }
  }
}
// const halfOfPair = addTo2020(numArray)
// const otherHalf = 2020 - halfOfPair
// const ans = halfOfPair*otherHalf
// console.log("Answer from multiplying ", halfOfPair, " x ", otherHalf, ": ", ans)

const sumArray = [];
function tripleAddTo2020(testArr) {
  for (let num of testArr) {
    for (let num2 of testArr) {
      if (num !== num2) {
        const thirdNum = 2020 - (num + num2);
        if (testArr.includes(thirdNum)) {
          console.log("2020 made with: ", num, " + ", num2, " + ", thirdNum);
          sumArray.push(thirdNum, num2, num);
          return sumArray;
        }
      }
    }
  }
}
const numsToMultiply = tripleAddTo2020(numArray)
const tripleMult = numsToMultiply[0] * numsToMultiply[1] * numsToMultiply[2]

console.log(numsToMultiply);
console.log(tripleMult)
