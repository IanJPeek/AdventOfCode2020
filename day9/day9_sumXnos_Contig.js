const { input, testInput } = require("./input");
const inputSplit = input.split("\n");
const testInputSplit = testInput.split("\n");
testInputSplit.shift();
inputSplit.pop();

const testInputNum = testInputSplit.map(numStr => Number(numStr));
const inputNum = inputSplit.map(numStr => Number(numStr));

const grabX = (num, arr, index = 0) => {
  const grab = arr.slice(index, index + num);
  return grab;
};

const checkSum = arrX => {
  const sumArray = [];
  for (let num of arrX) {
    let sum = 0;
    for (let num2 of arrX) {
      if (num !== num2) {
        sum = num + num2;
        if (!sumArray.includes(sum)) {
          sumArray.push(sum);
        }
      }
    }
  }
  return sumArray;
};

const checkTotalAgainstPrevX = (numX, arr, grabStartIndex = 0) => {
  let sumNumIndex = grabStartIndex + numX;
  let sumNum = arr[sumNumIndex];
  let grab = grabX(numX, arr, grabStartIndex);
  let sumsArray = checkSum(grab);

  if (sumsArray.includes(sumNum)) {
    // console.log(`found ${sumNum} in totals for ${grab}`)
    grabStartIndex++;
    return checkTotalAgainstPrevX(numX, arr, grabStartIndex);
  } else {
    // console.log(`No matching total found for ${sumNum}`);
    return sumNum;
  }
};

// const badTestNum = checkTotalAgainstPrevX(5, testInputNum);
const badTestNum = checkTotalAgainstPrevX(25, inputNum);
console.log("badTestNum", badTestNum);

// PT 2 Find badTestNum from total of X contiguous numbers (then ans is max + min from these)

let grabArr = [];
const grabAllX = (num, arr, index = 0) => {
  let grab = arr.slice(index, index + num);
  grabArr.push(grab);
  if (index + num < arr.length) {
    index++;
    return grabAllX(num, arr, index);
  } else {
    xNumsToSumArr = grabArr;
    return xNumsToSumArr;
  }
};

const sumContigGrabs = grabArr => {
  let totalsArr = [];
  let totalsObjArr = [];
  for (let arr of grabArr) {
    let total = 0;
    let totalObj = { total: null, sumNums: [] };
    for (let num of arr) {
      totalObj["sumNums"].push(num);
      total = total + num;
    }
    totalObj["total"] = total;
    totalsObjArr.push(totalObj);
    totalsArr.push(total);
  }
  return [totalsArr, totalsObjArr];
};

const checkContigTotalsForNum = (totesArr, objTotesArr, badNum) => {
  if (totesArr.includes(badNum)) {
    console.log(`Found ${badNum}!`);
    for (let obj of objTotesArr) {
      if (obj["total"] == badNum) {
        console.log(`Total comes from: ${obj["sumNums"]}`);
        const max = Math.max(...obj["sumNums"]);
        const min = Math.min(...obj["sumNums"]);
        const maxMinTote = max + min;
        console.log(`Max: ${max}  Min: ${min}  Total: ${maxMinTote}`);
        return true;
      }
    }
  } else {
    console.log(`No contiguous totals found for ${badNum}`);
    return false;
  }
};

const checkMoContiguous = (contig = 2, arr, badNum) => {
  let contigsXArr = grabAllX(contig, arr);
  let [contigTotals, contigTotalObjs] = sumContigGrabs(contigsXArr);
  let answered = checkContigTotalsForNum(contigTotals, contigTotalObjs, badNum);

  if (answered) {
    console.log("finished");
    return true;
  } else {
    contig++;
    checkMoContiguous(contig, arr, badNum);
  }
};

checkMoContiguous(2, inputNum, badTestNum);
