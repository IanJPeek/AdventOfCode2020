let { test, test2, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  return processed;
};
test = processInput(test);
test2 = processInput(test2);
input = processInput(input);

const instructObjArr = [];
// console.log(test2);
// console.log(instructObjArr)

// 1) processInstructions with (test/ input) for inputArr / testArr   ~  approx line 69-70
// 2) followInstructionsV2 (for pt.2) with arr from 1) ~ (bottom of file)

// create memory array (of blank value objects) to specified size...
const initialiseMem = memLength => {
  const memArr = [];
  memArr.length = memLength;
  for (let i = 0; i < memLength; i++) {
    const objInMem = { value: "000000000000000000000000000000000000" };
    memArr[i] = objInMem;
  }
  return memArr;
};

// process an individual instruction into an instruction object. Either:
// { instruction: 'mask',  bitmask: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'}  OR
// { instruction: 'mem', memIndex: 7, value: 101 },
const processInstruction = instruction => {
  const instructionObj = {};

  const parts = instruction.split("=");
  let memOrMask = parts[0].slice(0, -1);
  let value = parts[1].slice(1);

  if (memOrMask == "mask") {
    instructionObj["instruction"] = "mask";
    instructionObj["bitmask"] = value;
  } else {
    instructionObj["instruction"] = "mem";
    instructionObj["memIndex"] = Number(memOrMask.slice(4, -1));
    instructionObj["value"] = Number(value);
  }
  instructObjArr.push(instructionObj);
};

const processInstructions = instructionArr => {
  for (let instruction of instructionArr) {
    processInstruction(instruction);
  }
  // console.log(instructObjArr)
  return instructObjArr;
};

// pt1 found Maximum Size for memory
const findMaxMemIndex = instructArr => {
  let max = 0;
  for (let instructionObj of instructArr) {
    if (instructionObj.memIndex) {
      instructionObj.memIndex > max ? (max = instructionObj.memIndex) : null;
    }
  }
  return max;
};

const inputArr = processInstructions(input);
// const inputChkArr = processInstructions(input);
// const testArr = processInstructions(test2);

// used in pt.1
// const maxMem = findMaxMemIndex(testArr);
// const memArr = initialiseMem(maxMem + 1);
// const memArr = initialiseMem(100);

// convert num to binary num + prepend with zeros
const num2bin = num => {
  const zeroStr = "000000000000000000000000000000000000";
  const binary = num.toString(2);
  const binaryLen = binary.length;
  const zeroedBin = zeroStr.slice(0, -binaryLen) + binary;
  return zeroedBin;
};

// return new bin value by applying mask to num
const applyMask = (binNumStr, mask) => {
  let newStr = "";
  let binSplit = binNumStr.split("");
  let maskSplit = mask.split("");
  for (let charNum in maskSplit) {
    char = maskSplit[charNum];
    char == "X"
      ? (newStr = newStr + binSplit[charNum])
      : (newStr = newStr + char);
  }
  // console.log("value after mask applied: ", newStr)
  return newStr;
};

const totalMemory = memoryArr => {
  let total = 0;
  for (let i in memoryArr) {
    let value = memoryArr[i]["value"];
    // total = total + value
    total = total + parseInt(value, 2);
  }
  console.log(total);
  return total;
};

const followInstructions = instructObjArr => {
  let blankMask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  let mask = blankMask;

  for (let instructObj of instructObjArr) {
    if (instructObj.instruction == "mask") {
      mask = instructObj.bitmask;
      // console.log(`New mask set: ${mask}`);
    } else if (instructObj.instruction == "mem") {
      let numToWrite = num2bin(instructObj.value);
      let maskedNum = applyMask(numToWrite, mask);
      memArr[instructObj.memIndex]["value"] = maskedNum;
      // console.log(`${numToWrite} written to memory at ${instructObj.memIndex}`);
    }
  }
  totalMemory(memArr);
};
// followInstructions(testArr)
// console.log("Memory 7", memArr[7])
// console.log("Memory 8", memArr[8]);
// console.log("Memory 4", memArr[4])

const newFloats = memStr => {
  extrasObj = {};
  extrasArr = [];
  stringsArr = [];

  let newStr = "";
  let memSplit = memStr.split("");

  for (let charNum in memSplit) {
    let char = memSplit[charNum];

    // Final char condition (if not X) - ADD STR if newStr.length>0
    if (charNum == memSplit.length - 1 && char != "X") {
      let copyStringsArr = [];

      for (string of stringsArr) {
        copyStringsArr.push(string + newStr + char);
        stringsArr = [];
        stringsArr = [...copyStringsArr];
      }
    }

    if (char != "X") {
      newStr = newStr + char;
    } else if (char == "X") {
      // pushes first strings...
      if (stringsArr.length == 0) {
        stringsArr.push(newStr + "1");
        stringsArr.push(newStr + "0");
        newStr = "";
      } else {
        let copyStringsArr = [];
        for (let string of stringsArr) {
          let extraString = string + newStr + "0";
          string = string + newStr + "1";

          copyStringsArr.push(extraString);
          copyStringsArr.push(string);

          stringsArr = [];
          stringsArr = [...copyStringsArr];
        }

        newStr = "";
      }
    }
  }

  if (stringsArr[1].length < 36) {
    console.log("String 2 too short...", stringsArr[1].length, memStr);
  }

  let memIndexArr = stringsArr.map(memAddr => parseInt(memAddr, 2));
  // console.log("memIndexes:", memIndexArr);
  return memIndexArr;
};

const getMemoryAddress = memIndex => {
  const memAdd = num2bin(memIndex);
  // console.log("got memory address:", memAddress)
  return memAdd;
};

const maskAddress = (mask, memA) => {
  let startMem = memA;
  let memSplit = startMem.split("");
  let maskSplit = mask.split("");
  let newMem = "";

  for (let charNum in maskSplit) {
    char = maskSplit[charNum];

    if (char == "0") {
      newMem = newMem + memSplit[charNum];
    } else if (char == "1") {
      newMem = newMem + "1";
    } else if (char == "X") {
      newMem = newMem + "X";
    }
  }

  const memIndexes = newFloats(newMem);
  return memIndexes;
};

const totalMemoryV2 = memoryArr => {
  let total = 0;
  for (let addressObj of memoryArr) {
    let value = addressObj["value"];
    // total = total + value
    total = total + parseInt(value, 2);
  }
  console.log(total);
  return total;
};

let newAddArr = [];
let usedAddressArr = [];

const followInstructionsV2 = instructObjArr => {
  let blankMask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  let mask = blankMask;

  for (let instructObj of instructObjArr) {
    if (instructObj.instruction == "mask") {
      mask = instructObj.bitmask;
      // console.log(`New mask set: ${mask}`);
    } else if (instructObj.instruction == "mem") {
      let numToWrite = num2bin(instructObj.value);
      let memAddress = getMemoryAddress(instructObj.memIndex);
      let addressArr = maskAddress(mask, memAddress);

      for (let memAddr of addressArr) {
        const memObj = {
          address: memAddr,
          value: numToWrite
        };
        if (!usedAddressArr.includes(memAddr)) {
          newAddArr.push(memObj);
          usedAddressArr.push(memAddr);
        } else {
          for (let obj of newAddArr) {
            if (obj["address"] == memAddr) {
              obj["value"] = numToWrite;
            }
          }
        }
      }
    }
  }
  totalMemoryV2(newAddArr);
};
followInstructionsV2(inputArr);
