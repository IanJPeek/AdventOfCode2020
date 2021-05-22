let { test, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  // const processed = process.split(",")
  return processed;
};

test = processInput(test);
input = processInput(input);
const testEst = Number(test.shift());
const inputEst = Number(input.shift());

test = test[0].split(",");
input = input[0].split(",");
testnoX = test.filter(depTime => depTime != "x").map(n => Number(n));
inputnoX = input.filter(time => time != "x").map(n => Number(n));
// const testNos = test.map(n => Number(n));
// const inputNos = input.map(n => Number(n));

// console.log(inputEst, input)
// console.log(test);
// console.log(testNos)

const answerObjs = [];

const findEarliest = (num, estArrival) => {
  const multiplier = estArrival / num;
  const below = Math.floor(multiplier);
  const above = Math.ceil(multiplier);
  const belowEg = below * num;
  const aboveEg = above * num;
  const minsDiff = aboveEg - estArrival;
  const resultsObj = {
    num: num,
    below: belowEg,
    above: aboveEg,
    waitTime: minsDiff,
    ans: minsDiff * num
  };
  answerObjs.push(resultsObj);
};
inputnoX.map(num => findEarliest(num, inputEst));
// console.log(answerObjs)

// PT 2

// pt1 eg = 7,13,x,x,59,x,31,19
// i) num % 7  = 0
// ii) (num + 1) % 13 = 0
// iii) (num + 4) % 59 = 0
// iv) (num + 6) % 31 = 0
// v) (num + 7) % 19 = 0

// attempt 1
const magicNumChecker = (counter) => {
console.log("checking:", counter)
  if (
  ((counter+1) % 13 == 0) 
  && ((counter + 4) % 59 ==0)
  // && ((counter + 6) % 31 ==0)
  // && ((counter + 7) % 19 ==0)
  )
  {
    
  console.log(counter)
  // magicNumCheckerPt2(counter)
  return counter
}
else counter += 7
magicNumChecker(counter)
} 

// attempt 2

// pt1 eg = 7,13,x,x,59,x,31,19
// i) num % 7  = 0
// ii) (num + 1) % 13 = 0
// iii) (num + 4) % 59 = 0
// iv) (num + 6) % 31 = 0
// v) (num + 7) % 19 = 0

const condition1Checker = (counter) => {
  // console.log("checking:", counter)

  if  ((counter-3) % 13 == 0){
// console.log("checking second condition")
 condition2Checker(counter)
 return counter
  }
    else counter += 59
    condition1Checker(counter);
}

const condition2Checker = (counter) => {
  // console.log("in condition 2:", counter)
    if ((counter - 4) % 7 == 0) {
      console.log("checking third condition");
      condition3Checker(counter);
      return counter
    } else counter += 59;
    condition1Checker(counter);
  return counter
}

const condition3Checker = counter => {
  console.log("in condition 3:", counter);
  if ((counter + 2) % 31 == 0) {
    console.log("checking fourth condition");
    condition4Checker(counter);
    return counter
  } else counter += 59;
  condition1Checker(counter);
  return counter;
};

const condition4Checker = counter => {
  console.log("in condition 4:", counter);
  if ((counter + 3) % 19 == 0) {
    console.log("RESULT", counter-4);
    return counter
    // condition4Checker(counter);
  } else counter += 59;
  condition1Checker(counter);
  return counter;
};
 // 70151 ??   // 730538
// check in +59s...  // 70151
// const ans = condition1Checker(730538)



// The earliest timestamp that matches the list 17,x,13,19 is 3417.

// 3417 / 17 == 201
// 3417 + 2 (3419) / 13 = 263
// 3417 + 3 (3420) / 19 = 180


// i) num % 17 = 0
// ii) (num +2) % 13 = 0
// iii (num + 3) % 19 = 0
// const check1 = counter => {
//   if ((counter - 3) % 17 == 0) {
//     check2(counter);
//     return counter;
//   } else counter += 19;
//   check1(counter);
// };
// const check2 = counter => {
//   if ((counter - 1) % 13 == 0) {
//     console.log("RESULT:", counter -3)
//     return counter;
//   } else counter += 19;
//   check1(counter);
// };
// const eg2 = check1(19)


// 67,7,59,61 first occurs at timestamp 754018.
// i) num % 67 = 0
// ii) (num + 1) % 7 = 0
// iii) (num + 2) % 59 = 0
// iv) (num + 3) % 61 = 0
// const check1 = counter => {
//   if ((counter + 3) % 61 == 0) {
//     check2(counter);
//     return counter;
//   } else counter += 67;
//   check1(counter);
// };
// const check2 = counter => {
//   console.log("in check2", counter)
//   if ((counter + 2) % 59 == 0) {
//     check3(counter);
//     return counter;
//   } else counter += 67;
//   check1(counter);
// };
// const check3 = counter => {
//   if ((counter + 1) % 7 == 0) {
//     console.log("RESULT:", counter);
//     return counter;
//   } else counter += 67;
//   check1(counter);
// };
// check1(67)

// 67,x,7,59,61 first occurs at timestamp 779210.
// i) num % 67 = 0
// ii) (num + 2) % 7 = 0
// iii) (num + 3) % 59 = 0
// iv) (num + 4) % 61 = 0
// const check1 = counter => {
//   if ((counter + 4) % 61 == 0) {
//     check2(counter);
//     return counter;
//   } else counter += 67;
//   check1(counter);
// };
// const check2 = counter => {
//   // console.log("in check2", counter)
//   if ((counter + 3) % 59 == 0) {
//     check3(counter);
//     return counter;
//   } else counter += 67;
//   check1(counter);
// };
// const check3 = counter => {
//   console.log("in check3", counter);
//   if ((counter + 2) % 7 == 0) {
//     console.log("RESULT:", counter);
//     return counter;
//   } else counter += 67;
//   check1(counter);
// };
// check1(67)


// 67,7,x,59,61 first occurs at timestamp 1261476.
// i) num % 67 = 0
// ii) (num + 1) % 7 = 0
// iii) (num + 3) % 59 = 0
// iv) (num + 4) % 61 = 0
// const check1 = counter => {
//   if ((counter + 4) % 61 == 0) {
//     check2(counter);
//     return counter;
//   } else counter += 67;
//   check1(counter);
// };
// const check2 = counter => {
//   // console.log("in check2", counter)
//   if ((counter + 3) % 59 == 0) {
//     check3(counter);
//     return counter;
//   } else counter += 67;
//   check1(counter);
// };
// const check3 = counter => {
//   console.log("in check3", counter);
//   if ((counter + 1) % 7 == 0) {
//     console.log("RESULT:", counter);
//     return counter;
//   } else counter += 67;
//   check1(counter);
// };
// check1(779210)
// exceeds at 779210
// passes w/ 1261476 on next run


// 1789,37,47,1889 first occurs at timestamp 1202161486.
// i) num % 1789 = 0
// ii) (num + 1) % 37 = 0
// iii) (num + 2) % 47 = 0
// iv) (num + 3) % 1889 = 0
// const check1 = counter => {
//   if ((counter - 3) % 1789 == 0) {
//     check2(counter);
//     return counter;
//   } else counter += 1889;
//   check1(counter);
// };
// const check2 = counter => {
//   console.log("in check2", counter);
//   if ((counter - 1) % 47 == 0) {
//     check3(counter);
//     return counter;
//   } else counter += 1889;
//   check1(counter);
// };
// const check3 = counter => {
//   console.log("in check3", counter);
//   if ((counter - 2) % 37 == 0) {
//     // check3(counter);
//     console.log("RESULT:", counter);
//     return counter;
//   } else counter += 1889;
//   check1(counter);
// };
// check1(1181884963);


// 1) in check2 22743560    16) 377582765         31) 732421970     46) 1063605228
// 2) in check2 46399507    17) 401238712         32) 756077917     47) 1087261175
// 3) 70055454;             18) 424894659         33) 779733864     48) 1110917122 
// 4) 93711401              19) 448550606         34) 803389811     49) 1134573069
// 5) 117367348             20) 472206553         35) 827045758     50) 1158229016
// 6) 141023295             21) 495862500         36) 850701705     51) 1181884963
// 7) 164679242             22) 519518447         37) 874357652     52) RESULT 1 202 161 489
// 8) 188335189             23) 543174394         38) 898013599
// 9) 211991136             24) (chk3) 566830341  39) 921669546
// 10) 235647083            25) 590486288         40) 945325493
// 11) 259303030            26) 614142235         41) 968981440
// 12) 282958977            27) 637798182         42) 992637387
// 13) 306614924            28) 661454129         43) 1016293334
// 14) 330270871            29) 685110076         44) 1016293334
// 15) 353926818            30) 708766023         45) 1039949281

// However, with so many bus IDs in your list, surely the actual 
// earliest timestamp will be larger than 100 000 000 000 000!







const findTimeStamps = arrWithXs => {
  const tArr = [];

  for (let num in arrWithXs) {
    const timestampObj = {
      num: arrWithXs[num] == "x" ? "x" : Number(arrWithXs[num])
    };
    if (arrWithXs[num] != "x") {
     timestampObj["offset"] =  Number(num);
      tArr.push(timestampObj);
    } else {
      timestampObj["offset"] =  arrWithXs[num] ;
      tArr.push(timestampObj);
    }
    // console.log(arrWithXs[num])
  }
  console.log(tArr);

};

findTimeStamps(input);
// from inputdata:
// 19, ... 37,
// i) num % 19 = 0
// ii) (num + 13) % 37 = 0 
// iii) (num + 19) % 599 = 0
// iv) (num + 21) % 29 = 0
// v) (num + 36) % 17 = 0
// vi) (num + 42) % 23 = 0
// vii) (num + 50) % 761 = 0
// viii) (num + 60) % 41 = 0
// ix) (num + 63) % 13 = 0

// 1789,37,47,1889 first occurs at timestamp 1202161486.
// i) num % 1789 = 0
// ii) (num + 1) % 37 = 0
// iii) (num + 2) % 47 = 0
// iv) (num + 3) % 1889 = 0
