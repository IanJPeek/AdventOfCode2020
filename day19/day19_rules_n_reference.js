let { test, input } = require("./input");

// grab full number rather than char..! (split on space?)

const processInput = imported => {
  const processed = imported.split("\n");
  return processed;
};
test = processInput(test);
input = processInput(input);

let testRules = [];
let testMsg = [];
let inputRules = [];
let inputMsg = [];

const pusher = (importInput, ruleArr, msgArr) => {
  let pushRules = true;
  for (let item of importInput) {
    if (item == "") {
      pushRules = false;
    } else if (pushRules) {
      ruleArr.push(item);
    } else {
      msgArr.push(item);
    }
  }
};
pusher(test, testRules, testMsg);
pusher(input, inputRules, inputMsg);

// console.log("rules",testRules)
// console.log("messages", testMsg)
// console.log("rules", inputRules);
// console.log("messages", inputMsg);

const ruleArranger = ruleArr => {
  let ruleObjArr = [];
  for (let rule of ruleArr) {
    let ruleObj = {};
    let [ruleNo, ruleCollection] = rule.split(":");
    ruleNo = Number(ruleNo)

    const letterMatch = /[a-z]/g;
    const letter = ruleCollection.match(letterMatch);

    if (letter) {
      ruleObj[ruleNo] = letter[0];
      ruleObjArr.push(ruleObj);
    } else {
      ruleCollection = ruleCollection.slice(1);
      let rules;

      ruleCollection.includes("|")
        ? (rules = ruleCollection.split("|"))
        : (rules = [ruleCollection]);

      // console.log("rules", rules)
      ruleObj[ruleNo] = rules;
      ruleObjArr.push(ruleObj);
    }
  }
  // console.log("ruleObjArr", ruleObjArr)
  return ruleObjArr;
};
let ruleObjsArr = ruleArranger(inputRules);

// makes lookupObj for {num: letters : < str || [str, str]>}
separateLettersAndRules = ruleObjArr => {
  const lookUpNums = [];
  const lookUpObj = {};
  const needToSubs = [];
  const fullSubs = [];

  // console.log(ruleObjArr)
  for (let objNum in ruleObjArr) {
    let objProp = ruleObjArr[objNum][objNum];
    // console.log(objProp)
    if (objProp == "a" || objProp == "b") {
      lookUpNums.push(objNum);
      fullSubs.push(objNum);
      lookUpObj[objNum] = objProp;
    }
    // else/ if condition breaks order of consecutive array...
    else {
      needToSubs.push(ruleObjArr[objNum]);
    }
  }
  console.log("freshly made lookUpObj", lookUpObj)
  console.log("needToSubs", needToSubs.length)
  return [lookUpNums, lookUpObj, needToSubs, fullSubs];
};

const modifyLookUpObj_basic = (lookUpNums, lookUpObj, needToSubs, fullSubs) => {
  let stillToSubs = [];

  for (let subRuleObj of needToSubs) {
    subRuleObj["subStr"] = [];
    let keyNum = Object.keys(subRuleObj)[0];
    let subsArr = subRuleObj[keyNum];
    lookUpObj[keyNum] = [];

    for (let subOption of subsArr) {
      for (let lookUpNum of lookUpNums) {
        if (subOption.includes(lookUpNum)) {
          if (!lookUpNums.includes(keyNum)) {
            lookUpNums.push(keyNum);
          }
          while (subOption.includes(lookUpNum)) {
            subOption = subOption.replace(lookUpNum, lookUpObj[lookUpNum]);
          }
        }
      }
      // FOR INPUT ... DON'T REMOVE WHITESPACE!
      // subOption = subOption.replace(/\s/g, "");
      subRuleObj["subStr"].push(subOption);
      // console.log("added 'substr' key:",subRuleObj)
      lookUpObj[keyNum].push(subOption);

      // if still has digits in substr...  /  ruleNums fully changed to str
      if (/\d/.test(subOption)) {
        if (!stillToSubs.includes(keyNum)) {
          stillToSubs.push(keyNum);
        }
      } else {
        if (!fullSubs.includes(keyNum)) {
          fullSubs.push(keyNum);
        }
      }
      // console.log("modified lookUpObj", lookUpObj)
      // console.log("lookUpNums", lookUpNums)
    }
  }

  // console.log("fullSubs", fullSubs);
  // console.log("stillToSubs", stillToSubs);
  return [stillToSubs];
};

let substituter = ruleObjArr => {
  const [lookUpNums, lookUpObj, needToSubs, fullSubs] = separateLettersAndRules(
    ruleObjArr
  );
  const [stillToSubs] = modifyLookUpObj_basic(
    lookUpNums,
    lookUpObj,
    needToSubs,
    fullSubs
  );

  // console.log("modified lookUpObj:", lookUpObj);
  // console.log("modified lookUpNums:", lookUpNums);
  // console.log("modified needToSubs:", needToSubs);
  // console.log("fullSubs", fullSubs);
  // console.log("stillToSubs", stillToSubs);

  const deepSub = (lookUpNums, lookUpObj, needToSubs) => {
    for (let subKeyNum of stillToSubs) {
      // needToSubs arr is still ordered...
      let subObj = needToSubs[subKeyNum];
      let subStrArr = subObj["subStr"];
      let replaceArr = [];
      let replaceStr = "";

      // looking for num chars to sub...
      for (let subStr of subStrArr) {
        let charStrArr = [];
        for (let char of subStr) {
          let charsToSubArr = lookUpObj[char];
          // console.log("charsToSubArr", charsToSubArr);
          if (charsToSubArr) {
            if (char !== "a" && char !== "b") {
              // when charStrArr is empty, push first strings to arr...

              if (charStrArr.length == 0) {
                for (let charsToSub of charsToSubArr) {
                  // if no digits, go ahead with sub
                  if (!/\d/.test(charsToSub)) {
                    charStrArr.push(charsToSub);
                  }
                }
                // console.log(
                //   "\nadded first strings to CharStrArr:",
                //   charStrArr,
                //   subStr
                // );
              }
              // if strings already in array, append new strings to each
              // make empty array to replace old...
              else {
                // let replaceArr = [];

                for (let charsToSub of charsToSubArr) {
                  if (!/\d/.test(charsToSub)) {
                    // console.log("charStrArr", charStrArr)
                    // console.log("charsToSub from arr", charsToSubArr, charsToSub);
                    // let newStr
                    charStrArr.map(charStr => {
                      (replaceStr = charsToSub + charStr),
                        replaceArr.push(replaceStr);
                    });
                    // charStrArr.push(charsToSub);
                    // console.log("replaceArr", replaceArr);
                    // charStrArr = replaceArr
                  }
                }
                // handles one char (eg "2"), needs "3" as well... CHANGE NESTING LEVEL...
                // make sure 0 isn't replaced in lookUpObj..! (should be ['a1b'])
              }
            } else if (char == "a" || char == "b") {
              if (charStrArr.length == 0) {
                replaceStr = replaceStr + char;
              } else if (charStrArr.length > 0) {
                // console.log("in CHAR else if", char, charStrArr);
                // console.log("replaceStr", replaceStr);
                // charStrArr.map(charStr => {
                //   (replaceStr = replaceStr + charStr + char), replaceArr.push(replaceStr);
                // });
                for (let charStr of charStrArr) {
                  // replaceStr = replaceStr + charStr + char;
                  replaceArr.push(replaceStr + charStr + char);
                }
              }
            }
          }
        }
        //(after chars)

        // console.log("charStrArr", charStrArr);
      }

      if (replaceArr.length > 0) {
        needToSubs[subKeyNum]["subStr"] = replaceArr;
        lookUpObj[subKeyNum] = replaceArr;
      }
      // console.log("new strings...", lookUpObj);
      // console.log("new strings...", needToSubs[subKeyNum]);
      // console.log("new strings...", needToSubs[0]);
    }
  };
  deepSub(lookUpNums, lookUpObj, needToSubs);
  // while loop for while ... subStrs still to make... while lookupObj[0].length == 1  (/ less than...)
  deepSub(lookUpNums, lookUpObj, needToSubs);
  return lookUpObj;
};
const lookUpObj = substituter(ruleObjsArr);

// console.log("testMsg", testMsg);
// console.log("rule zero", lookUpObj[0]);

const validMsgArr = [];

for (let msg of inputMsg) {
  if (lookUpObj[0].includes(msg)) {
    validMsgArr.push(msg);
  }
}

console.log(validMsgArr, validMsgArr.length);
