const input = require("./input");
const lineSplit = input.split("\n");

const testline1 = "9-15 f: qqflwbjgffwfxkv";
const testline2 = "4-6 h: hhhqhhh";
const passwordPass = [];
const passwordFail = [];

const getInfoFromLine = lineSplitArr => {
  for (let line of lineSplit) {
    const parts = line.split(" ");
    
    const nums = parts[0];
    const minMax = nums.split("-");
    const min = minMax[0];
    const max = minMax[1];

    const checkLetter = parts[1][0];
    const password = parts[2];

    checkPasswordV2(min, max, checkLetter, password);
  }
};

const checkPassword = (min, max, checkLetter, password) => {
  let letterCount = 0;
  for (let letter of password) {
    if (letter === checkLetter) {
      letterCount++;
    }
  }
  console.log("letterCount:", letterCount);
  if (letterCount >= min && letterCount <= max) {
    // console.log("adding to passes: ", password);
    passwordPass.push(password);
  } else {
    // console.log("failed check: ", password);
    passwordFail.push(password);
  }
};

const checkPasswordV2 = (min, max, checkLetter, password) => {
  const position1 = min-1
  const position2 = max-1

  const pos1Pass = password[position1] === checkLetter
  const pos2Pass = password[position2] === checkLetter;
  const passesCheck = pos1Pass ^ pos2Pass

  if (passesCheck){
    // console.log("Passes test 2: ", password)
    passwordPass.push(password);
  } else if (!passesCheck) {
    // console.log("Fails test 2: ", password)
    passwordFail.push(password);
  }
}
getInfoFromLine(lineSplit);

console.log("PASSES:", passwordPass.length);
console.log("FAILS:", passwordFail.length);