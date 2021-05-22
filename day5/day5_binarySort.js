const { input } = require("./input.js");
const inputHaz = require("./inputHaz.js");
const inputSplit = input.split("\n")
const inputHazSplit = inputHaz.split("\n");

// Check + re-implement...

// Binary egs:-
// BFFFBBFRRR: row 70, column 7, seat ID 567.
// FFFBBBFRRR: row 14, column 7, seat ID 119.
// BBFFBBFRLL: row 102, column 4, seat ID 820.
const testInput = ["BFFFBBFRRR", "FFFBBBFRRR", "BBFFBBFRLL"];
const seatArr = [];

const inputSample = [];
for (let strNum in inputSplit) {
  if (strNum < 20) {
    inputSample.push(inputSplit[strNum]);
  }
}

const getRowAndColumn = inputArr => {
  for (let binaryStr of inputArr) {
    const rowStr = binaryStr.slice(0, -3);
    const colStr = binaryStr.slice(-3);

    const rowValue = binaryValueFetcher(rowStr, 128, "F");
    const colValue = binaryValueFetcher(colStr, 8, "L");
    const seatId = rowValue * 8 + colValue
    seatArr.push(seatId)
    
    console.log(`row: ${rowValue} col: ${colValue} seatId: ${seatId}`);
  }
};

const binaryValueFetcher = (binaryStr, topValue, lowValue) => {
  let total = topValue;
  let min = 1;
  let mid = total / 2;
  let max = total;
  let range = total / 2;

  console.log(`\n${binaryStr}`)

  for (let char of binaryStr) {
    char == lowValue
      ? ((total = total / 2),
        (range = total / 2),
        (min = min),
        (max = mid),
        (mid = min + range))
      : ((total = total / 2),
        (range = total / 2),
        (min = mid),
        (mid = max - range),
        (max = max));
    console.log( `char=${char}: min=${min}, mid=${mid}, max=${max}, [total=${total} range=${range}]`);
  }
  let value;
  binaryStr[0] == lowValue ? (value = min - 1) : (value = max - 1);
  return value;
};

getRowAndColumn(inputHazSplit);

console.log("start length:", inputSplit.length)
console.log("seatsTotal:", seatArr.length);
// console.log(seatArr)
// console.log(seatArr.shift())
seatArr.sort(function(a, b) {
  return a - b;
});
// console.log(seatArr)
console.log("Max:",Math.max(...seatArr))

const ans = seatArr.filter((seat, i) => {
  return seat - 1 !== seatArr[i - 1] && seat + 1 !== seatArr[i + 1];
})

console.log("ans", ans)

const all902Nums = []
for (let i = 0; i<903; i++){
  all902Nums.push(i)
}

const missingNum = []
for(let num of all902Nums){
  if (!seatArr.includes(num)){
    missingNum.push(num)
  }
}

missingNum.sort(function(a, b) {
  return a - b;
});

// console.log("allnums?:", all902Nums.length)
// console.log(missingNum.length)
// console.log(missingNum)
// 908!! Right

const trimmedNums = [];
for (let num in missingNum) {
  if (num>50) {
    trimmedNums.push(missingNum[num]);
  }
}
// console.log(trimmedNums.length);
// console.log(trimmedNums);

// console.log(inputSplit)
