let { allTest, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  return processed;
};
const testSums = processInput(allTest);
const inputSums = processInput(input);
// console.log(testSums)

const test1 = "1 + (2 * 3) + (4 * (5 + 6))";
const test2 = "2 * 3 + (4 * 5)";
const test3 = "5 + (8 * 3 + 9 + 3 * 4 * 3)";
const test4 = "5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))";
const test5 = "((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2";
const test6 = "1 + 2 * 3 + 4 * (5 + 6)";

// pt. 1
// handle inner brackets - extract, process sum, return value to string
// handle outer brackets - extract, process sum, return value to string
// handle remaining

// pt. 2
// modify by adding first

const constructSum = sumStr => {
  let oneNum = false;
  let num1Str = "";
  let num1 = 0;
  let num2 = 0;
  let num2Str = "";
  let symbol = "";
  let total = 0;

  let strLength = sumStr.length;
  let counter = 0;

  const runSum = (num1, num2, symbol) => {
    if (symbol == "+") {
      total = num1 + num2;
    } else if (symbol == "-") {
      total = num1 - num2;
    } else if (symbol == "*") {
      total = num1 * num2;
    } else if (symbol == "/") {
      total = num1 / num2;
    }
    // console.log(`${num1} ${symbol} ${num2} = ${total}`);
    return total;
  };

  for (let char of sumStr) {
    counter++;

    // USE: real no.'s are truthy, zero/Nan are falsy
    if (char == "0" || Number(char)) {
      if (!oneNum) {
        num1Str = num1Str + char;
        num1 = Number(num1Str);
      } else {
        num2Str = num2Str + char;
        num2 = Number(num2Str);
      }
    }

    // USE: Number(" ")[space] evaluates to zero, symbols become 'Nan'
    else if (Number(char) != 0) {
      symbol = char;
      if (num1 && num2) {
        num1 = runSum(num1, num2, symbol);
        num2Str = "";
        num2 = 0;
      }
    } else if (Number(char) == 0) {
      if (num2) {
        num2Str = num2Str + char;
        num2 = Number(num2Str);
      }
      if (num1 && num2) {
        num1 = runSum(num1, num2, symbol);
        num2Str = "";
        num2 = 0;
      } else if (num1) {
        oneNum = true;
      }
    }

    if (counter == strLength) {
      runSum(num1, num2, symbol);
    }
  }

  // console.log("finished evaluating string, total:", total, "\n");
  return total;
};
// constructSum(test1);

const addFirst = sumStr => {
  // console.log("in add first:", sumStr)
  let oneNum = false;
  let num1Str = "";
  let num1 = 0;
  let num2 = 0;
  let num2Str = "";
  let symbol = "";
  let total = 0;

  let changeStr = sumStr
  let newStr = ""

  let strLength = sumStr.length;
  let counter = 0;

  const runSum = (num1, num2, symbol) => {
    if (symbol == "+") {
      // console.log(num1)
      total = num1 + num2;
      let replaceStr = `${num1} + ${num2}`
      // num1 = 0
      num1 = num2
      // console.log(changeStr)
      // console.log("replaceStr:", replaceStr, "total:", total)
      changeStr = changeStr.replace(`${replaceStr}`, `${total}`)
      // console.log("changeStr", changeStr)

    } else if (symbol == "-") {
      num1 = num2
      num2 = 0
      // total = num1 - num2;
    } else if (symbol == "*") {
      // console.log("ran multiply")
      num1 = num2
      num2 = 0
      // total = num1 * num2;
    } else if (symbol == "/") {
      num1 = num2;
      num2 = 0
      // total = num1 / num2;
    }
    // console.log(`${num1} ${symbol} ${num2} = ${total}`);
    // return total
    return num1;
  };

  for (let char of sumStr) {
    counter++;
    // console.log("char", char)
    // console.log("num1 at start:", num1)

    // USE: real no.'s are truthy, zero/Nan are falsy
    if (char == "0" || Number(char)) {
      if (!oneNum) {
        num1Str = num1Str + char;
        num1 = Number(num1Str);
      } else {
        num2Str = num2Str + char;
        num2 = Number(num2Str);
      }
    }

    // USE: Number(" ")[space] evaluates to zero, symbols become 'Nan'
    else if (Number(char) != 0) {
      symbol = char;
      if (num1 && num2) {
        num1 = runSum(num1, num2, symbol);
        // runSum(num1, num2, symbol);
        num2Str = "";
        num2 = 0;
      }
    } else if (Number(char) == 0) {
      if (num2) {
        num2Str = num2Str + char;
        num2 = Number(num2Str);
      }
      if (num1 && num2) {
        num1 = runSum(num1, num2, symbol);
        // runSum(num1, num2, symbol);
        num2Str = "";
        num2 = 0;
      } else if (num1) {
        oneNum = true;
      }
    }

    // console.log("num1 at end:", num1);

    if (counter == strLength) {
      runSum(num1, num2, symbol);
    }
  }

  // console.log("finished evaluating string, total:", total, "\n");
  // console.log("FINAL changeStr:", changeStr)


  return changeStr;
};

// let failStr = "8 * 12 + 3 * 4 * 3";
// let fail1 = addFirst(failStr)
// addFirst(fail1)



// console.log(test4);
// const firstAdd = addFirst(test4);
// addFirst(firstAdd)

const extractInner = sumStr => {
  // console.log("in extractInner", sumStr)
  let innerBrac = "";
  let innerBracketExtract = false;
  let bracketCount = 0;
  let newSum = "";

  for (let char of sumStr) {
    // modify behaviour for brackets
    if (char == "(") {
      if (bracketCount > 0) {
        innerBracketExtract = true;
        bracketCount++;
      } else {
        bracketCount++;
      }
    } else if (char == ")") {
      bracketCount--;
      innerBracketExtract = false;
      if (bracketCount >= 1) {
        let add1 = addFirst(innerBrac)
        // console.log("add1", add1)
        if (!Number(add1)){
        // console.log("addFirst", addFirst)
        // console.log("in extractInner, re-adding")
        add1 = addFirst(add1)
        }
        // console.log("secondPass", secondPass)
        if (!Number(add1)){
        let innerTotal = constructSum(add1);
        // console.log("innerTotal", innerTotal)
        newSum = newSum + innerTotal;
        innerBrac = "";
        }
        else {newSum = newSum + add1;
              innerBrac = "";}
      }
    }

    // handle chars according to status of brackets
    if (innerBracketExtract == true) {
      if (char != "(" && char != ")") {
        innerBrac = innerBrac + char;
      }
    } else if (innerBracketExtract == false && bracketCount <= 1) {
      if (char != ")") {
        newSum = newSum + char;
      } else if (bracketCount < 1) {
        newSum = newSum + char;
      }
    }
  }
  // console.log("in extractInner newSum", newSum);
  return newSum;
};
// console.log(test1)
// extractInner(test1)
// console.log(test4)
// const flatBracs4 = extractInner(test4);
// console.log(test5);
// const flatBracs5 = extractInner(test5);
// console.log(flatBracs4);
// console.log(flatBracs5);

handleRemainingBrackets = sumStr => {
  // console.log("in handleRemainingBrac:", sumStr)
  let innerBrac = "";
  let innerBracketExtract = false;
  let bracketCount = 0;
  let newSum = "";

  for (let char of sumStr) {
    // modify behaviour for brackets
    if (char == "(") {
      innerBracketExtract = true;
      bracketCount++;
    } else if (char == ")") {
      bracketCount--;
      innerBracketExtract = false;

      let firstPass = addFirst(innerBrac);
      // console.log("badmas firstPass", firstPass);
      if (!Number(firstPass)){
      firstPass = addFirst(firstPass);
      }
      if (!Number(firstPass)) {
        let innerTotal = constructSum(firstPass);
        newSum = newSum + innerTotal;
        innerBrac = "";
      } else {
        newSum = newSum + firstPass;
        innerBrac = "";
      }
       // console.log("innerTotal", innerTotal);
    }

    if (innerBracketExtract == true) {
      if (char != "(" && char != ")") {
        innerBrac = innerBrac + char;
      }
    } else if (innerBracketExtract == false && bracketCount <= 1) {
      if (char != ")") {
        newSum = newSum + char;
      }
    }
  }
  // console.log("newSum", newSum);
  return newSum;
};
// const fail1 = "8 * 15 * 4 * 3";
// handleRemainingBrackets(fail1)


// const flatBracs4 = "5 * 9 * (7 * 3 * 3 + 9 * 3 + 56)";
// const flatBracs5 = "(54 * 126 + 6) + 2 + 4 * 2"
// console.log("\nflatBracs4",flatBracs4)
// sumRemainingBrackets(flatBracs4)
// console.log("\nflatBracs5",flatBracs5);
// sumRemainingBrackets(flatBracs5);

const bracketExtractor = sumStr => {
  let nonBrac = "";
  let brac = "";
  let bracketExtract = false;
  let bracketCount = 0;
  let innerBracArr = [];
  let bracArr = [];
  let nonBracArr = [];

  for (let char of sumStr) {
    if (char == "(") {
      bracketExtract = true;
      bracketCount++;
      nonBracArr.push(nonBrac.slice(0, -1));
      nonBrac = "";
    }
    if (char == ")") {
      bracketExtract = false;
      bracketCount--;
      bracArr.push(brac);
      brac = "";
    }

    if (bracketExtract == true && bracketCount > 0) {
      if (char != "(" && char != ")") {
        brac = brac + char;
      }
    } else {
      if (char != "(" && char != ")") {
        nonBrac = nonBrac + char;
      }
    }
  }
  // console.log("nonBrac", nonBracArr, nonBrac);
  // console.log("brac", bracArr, brac);
};
// console.log("test", test2);
// bracketExtractor(test2)

const answersArr = [];

const badmas = sumStr => {
  let flatterSum = extractInner(sumStr);
  // console.log("\nflatterSum", flatterSum)

  if (Number(flatterSum)) {
    console.log("early pass (extracted inner)!", flatterSum, sumStr);
    answersArr.push(flatterSum);
    return flatterSum;
  }

  let flatSum = handleRemainingBrackets(flatterSum);
  // console.log("\nflatSum",flatSum)

  if (Number(flatSum)) {
    console.log("early pass (handled all brackets)!", flatSum, sumStr);
    answersArr.push(Number(flatSum));
    return flatSum;
  }

  let firstPass = addFirst(flatSum)
  // console.log("\nbadmas firstPass", firstPass)
  let check = addFirst(firstPass)
  // console.log("\nbadmas after check", check)


  if (Number(check)){
    console.log("early pass (before final sum)!", check, sumStr)
    answersArr.push(Number(check))
    return check
  }

  console.log("FINAL sum:", check)
  console.log("Initial sum...", sumStr)
  
  let answer = constructSum(check);
  // console.log(answer)
  answersArr.push(answer);
};

// const badd1stmas = sumStr => {
//   let flatterSum = extractInner(sumStr);
  // console.log("flatterSum", flatterSum)
//   let flatSum = handleRemainingBrackets(flatterSum);
//   // console.log("flatSum",flatSum)
//   let answer = constructSum(flatSum);
//   // console.log(answer)
//   answersArr.push(answer);
// };


const badmasAll = sumsArr => {
  for (let sum of sumsArr) {
    badmas(sum);
  }
};

const sumAnswers = answersArr => {
  let total = 0;
  answersArr.forEach(ans => {
    total = total + ans;
  });
  console.log("Total of all sums:", total);
  return total;
};
badmasAll(inputSums)
// console.log("test1", test5);

// badmas(test1)
// badmas(test2);
// badmas(test3);
// badmas(test4);
// badmas(test5)
// badmas(test2);
// badmas(test4)
// console.log("test3", test4)
// badmas(test2);
// badmas(test3);
// badmas(test4);
// badmas(test5);
// badmas(test6);
// const tough1 =
//   "(4 * 8 + 2 * (7 + 6 + 7) * 2) + ((4 * 2 + 4) + (6 + 7 * 2 * 3) + 5 * 2) * (4 + (4 + 5 + 4) * 7 * 8 * 4 + (7 * 7 + 5 * 3 * 6)) + 8";
//   badmas(tough1)


console.log("answers:", answersArr)
sumAnswers(answersArr)

// console.log("inputs", inputSums.length)
// console.log("answers", answersArr.length)