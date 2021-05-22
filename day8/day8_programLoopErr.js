const { input, testInput } = require("./input");
const inputSplit = input.split("\n");
const testSplit = testInput.split("\n");
testSplit.shift();
testSplit.pop(), inputSplit.pop();
// console.log(inputSplit)

// 1) make instructionObj + push to arr
const arr2 = [];
const instructionArr = [];
const successArr = [];
const successAcc = [];

for (let instructionNum in inputSplit) {
  let instructStr = inputSplit[instructionNum];
  const instructionObj = {
    firstVisit: true,
    index: Number(instructionNum)
  };

  let instructParts = instructStr.split(" ");
  const instruction = instructParts[0];
  const changeVal = instructParts[1];
  const changeType = changeVal[0];
  const changeAmount = changeVal.slice(1);
  instructionObj["instruction"] = instruction;
  instructionObj["changeType"] = changeType;
  instructionObj["changeAmount"] = Number(changeAmount);

  instructionArr.push(instructionObj);
  arr2.push(instructionObj);
}

// ** Pt 2 - Add object to signal successful program end at end of array
const endLength = instructionArr.length;
const endObj = {
  firstVisit: true,
  index: endLength,
  instruction: "end",
  changeType: null,
  changeAmount: null
};
arr2.push(endObj);
instructionArr.push(endObj);

// !!SPREADING array does not change refs of objects within array...!! Below method does!
// Modify for better deep copy
const newRefArr = JSON.parse(JSON.stringify(instructionArr));

// 2) followInstruction to move through array, alter accumulator value + return (/log) after
let accumulator = 0;
const followInstruction = (
  instructObj,
  instructArr,
  changedInstructionIndex
) => {
  const lookUpIndex = instructObj["index"];
  const copyArrToTest = [...instructArr];
  const copyObjToTest = copyArrToTest[lookUpIndex];

  let {
    firstVisit,
    index,
    instruction,
    changeType,
    changeAmount
  } = copyObjToTest;

  if (firstVisit) {
    if (instruction === "nop") {
      copyObjToTest["firstVisit"] = false;
      index++;
      followInstruction(
        copyArrToTest[index],
        copyArrToTest,
        changedInstructionIndex
      );
    }
    if (instruction === "acc") {
      copyObjToTest["firstVisit"] = false;
      changeType === "+"
        ? (accumulator = accumulator + changeAmount)
        : (accumulator = accumulator - changeAmount);
      index++;
      followInstruction(
        copyArrToTest[index],
        copyArrToTest,
        changedInstructionIndex
      );
    }
    if (instruction === "jmp") {
      copyObjToTest["firstVisit"] = false;
      changeType === "+"
        ? (index = index + changeAmount)
        : (index = index - changeAmount);
      followInstruction(
        copyArrToTest[index],
        copyArrToTest,
        changedInstructionIndex
      );
    }
    if (instruction === "end") {
      console.log(
        `Program ran SUCCESSFULLY (changed index: ${changedInstructionIndex})`
      );
      successArr.push(changedInstructionIndex);
    }
  } else if (!firstVisit) {
    // console.log("TERMINATED at:", index);
  }
};

// Solution for pt 1:
// followInstruction(instructionArr[0], instructionArr);
// console.log(accumulator);

// Pt 2
// change instruction (@ index) then followInstruction()...
const changeOneInstruction = (instructionIndex, arr) => {
  const testArr = [...arr];
  const instructionObjToChange = testArr[instructionIndex];
  let { instruction } = instructionObjToChange;

  if (instruction === "jmp") {
    // console.log(`Changed 'jmp' to 'nop' at ${instructionIndex}, running...`)
    instructionObjToChange["instruction"] = "nop";
    followInstruction(testArr[0], testArr, instructionIndex);
  }
  if (instruction === "nop") {
    // console.log(`Changed 'nop' to 'jmp' at ${instructionIndex}, running...`);
    instructionObjToChange["instruction"] = "jmp";
    followInstruction(testArr[0], testArr, instructionIndex);
  }
  if (instruction === "acc") {
    // console.log("Found 'acc', no change")
  }
};

// use loop to run "changeOneInstruction" for all indexes... (prints if change successful)
let useIndex = 0;
for (let i = 0; i < instructionArr.length; i++) {
  // console.log("RUNNING for index: ", useIndex)
  let copyArr = JSON.parse(JSON.stringify(newRefArr));
  changeOneInstruction(useIndex, copyArr);
  useIndex++;
  copyArr = [...newRefArr];
}

// run with loop to obtain Success index, then run changeOneInstruction once with success Index for ans...
console.log("Success Index: ", successArr);

// changeOneInstruction(377, newRefArr)
// console.log(accumulator)


