let { test, test2, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  return processed;
};
test = processInput(test);
test2 = processInput(test2);

input = processInput(input);

testFields = test.slice(0, 3);
testYrTick = test.slice(4, 6);
testNear = test.slice(7);

test2Fields = test2.slice(0, 3);
test2YrTick = test2.slice(4, 6);
test2Near = test2.slice(7);

inputFields = input.slice(0, 20);
inputYrTick = input.slice(21, 23);
inputNear = input.slice(24);

// 1) process fields for (testFields/ inputFields)  ...approx line 55
// 2) find invalids for nearby (testNear/ inputNear) ...approx line 99
// PT 2
// 3) discard invalid tix for (testNear/ inputNear)  ...approx line 145

// console.log(test)
// console.log(testFields, testYrTick, testNear)
// console.log(input)
// console.log(inputFields, inputYrTick, inputNear);
// console.log(testFields)
// console.log(testNear)

const processFields = fieldInput => {
  fieldsArr = [];
  for (let field of fieldInput) {
    const fieldObj = {};
    fieldSplit = field.split(":");
    const [valid1, valid2] = fieldSplit[1].split(" or ");
    const [min1, max1] = valid1.split("-");
    const [min2, max2] = valid2.split("-");
    // console.log(min1, max1, min2, max2);

    fieldObj[fieldSplit[0]] = {
      range1: { min: Number(min1.slice(1)), max: Number(max1) },
      range2: { min: Number(min2), max: Number(max2) }
    };
    fieldsArr.push(fieldObj);
  }
  // console.log(fieldsArr)
  return fieldsArr;
};
const validObjArr = processFields(inputFields);

const fetchRanges = (validObjArr, objKeys) => {
  const rangeArr = [];
  for (let objNum in validObjArr) {
    const object = validObjArr[objNum];
    const key = objKeys[objNum];
    const ranges = object[key];
    const { range1, range2 } = ranges;
    rangeArr.push(range1, range2);
  }
  // console.log("ranges", rangeArr)
  return rangeArr;
};

const findInvalid = (validObjArr, ticket) => {
  // get values for all tix
  const allTickets = [];
  const ticketVals = ticket.slice(1);
  ticketVals.forEach(values =>
    values.split(",").forEach(value => allTickets.push(value))
  );

  // get ranges where tix are valid
  const objKeys = validObjArr.map(obj => Object.keys(obj)[0]);
  const rangeArr = fetchRanges(validObjArr, objKeys);

  // find invalids
  const invalidArr = [];
  for (let ticket of allTickets) {
    let isValid = false;
    for (let range of rangeArr) {
      if (ticket >= range.min && ticket <= range.max) {
        isValid = true;
      }
    }
    isValid ? null : invalidArr.push(Number(ticket));
  }

  // console.log("invalidArr", invalidArr);
  return invalidArr;
};
const invalidArr = findInvalid(validObjArr, inputNear);

// Pt.1 - Doesn't need to be unique numbers!
// const getUniqueInvalids = (invalidArr) => {
//   const uniqueInvalids = []
//   for (let value of invalidArr){
//     if (!uniqueInvalids.includes(value)){
//       uniqueInvalids.push(value)
//     }
//   }
// console.log("unique:", uniqueInvalids, uniqueInvalids.length)
// return uniqueInvalids
// }
// const uniqueInvalids = getUniqueInvalids(invalidArr)

const totalInvalids = invalidArr => {
  let total = 0;
  invalidArr.forEach(tick => (total += tick));
  // console.log(total)
  return total;
};

totalInvalids(invalidArr);

// console.log(validObjArr)

const discardInvalids = (invalidArr, nearBys) => {
  const ticketVals = nearBys.slice(1);
  const validTix = [];

  for (let valueSpread of ticketVals) {
    let values = valueSpread.split(",");
    let valid = true;
    for (let value of values) {
      if (invalidArr.includes(Number(value))) {
        valid = false;
      }
    }
    if (valid) {
      validTix.push(valueSpread);
    }
  }
  // console.log("validTixArr:", validTix);
  return validTix;
};
const validTix = discardInvalids(invalidArr, inputNear);

const makeTicketFieldObj = validTix => {
  const numOfTicketFields = validTix[0].split(",").length;
  const ticketFieldsObj = {};
  for (let i = 0; i < numOfTicketFields; i++) {
    ticketFieldsObj[i] = [];
  }
  return ticketFieldsObj;
};

const populateTicketObj = (tickFieldsObj, validTix) => {
  for (let valueSpread of validTix) {
    let valueSplit = valueSpread.split(",");

    for (let fieldIndex in valueSplit) {
      tickFieldsObj[fieldIndex].push(Number(valueSplit[fieldIndex]));
    }
  }
  return tickFieldsObj;
};

const objFieldChecker = (
  fieldValsArr,
  rangeObj1,
  rangeObj2,
  fieldName,
  fieldIndex,
  fieldIdentifyObj
) => {
  // console.log(`in objFieldChecker with ${fieldValsArr}`);

  let allValid = true;
  for (let value of fieldValsArr) {
    // console.log(value)
    if (
      (value >= rangeObj1.min && value <= rangeObj1.max) ||
      (value >= rangeObj2.min && value <= rangeObj2.max)
    ) {
      // console.log(`${value} valid for ${fieldName}`)
    } else {
      // console.log(`allValid false for: ${value} in ${fieldName}`);
      allValid = false;
    }
  }

  if (allValid) {
    // console.log(`${fieldValsArr} valid for ${fieldName}`);
    fieldIdentifyObj[fieldIndex].push(fieldName)
    // console.log("fieldIdentifyObj:", fieldIdentifyObj)
  }
  return fieldIdentifyObj
};

// let fieldIdentifyObj = {};
const determineFields = (validTix, validObjArr) => {
  let ticketFieldsObj = makeTicketFieldObj(validTix);
  ticketFieldsObj = populateTicketObj(ticketFieldsObj, validTix);

  // console.log("validObjArr", validObjArr)
  // console.log("ticketFieldsObj", ticketFieldsObj);
  let fieldIdentifyObj = makeTicketFieldObj(validTix);

  for (let obj of validObjArr) {
    let fieldName = Object.keys(obj)[0];
    let { range1, range2 } = obj[fieldName];

    // console.log("\n",fieldName);
    // console.log(range1, range2);
    
    for (let fieldsIndex in ticketFieldsObj) {
      let objIndex = fieldsIndex;
      let fieldArr = ticketFieldsObj[fieldsIndex];
      fieldIdentifyObj = objFieldChecker(fieldArr, range1, range2, fieldName, objIndex, fieldIdentifyObj);
    }
    // console.log(`fieldObj after ${fieldName} loop:`, fieldIdentifyObj)

    // for (let )

    // let {min}
  }
  console.log("final fieldIdentifyObj", fieldIdentifyObj)

  for(let index in fieldIdentifyObj){
    console.log(fieldIdentifyObj[index].length)
  }
};

determineFields(validTix, validObjArr);

const fieldsproduct = (113*71*97*103*157*107)

console.log(fieldsproduct)
