const { input, testInput, testInput2 } = require("./input");
const rules = input.split("\n");
const testRules = testInput.split("\n");
const testRules2 = testInput2.split("\n");
rules.shift(), testRules.shift(), testRules2.shift();

// console.log("testRules", testRules);
// console.log("testRules2", testRules2);
// console.log("rules", rules);

const canCarryBags = [];
const noHoldsBags = [];
const allBags = [];

for (let rule of testRules) {
  const innerAndOuter = rule.split("contain");

  const outerColor = innerAndOuter[0].slice(0, -6);
  const innerColorz = innerAndOuter[1].slice(1);
  const carriedBags = innerColorz.split(", ");

  const ruleObj = {
    outerColor: outerColor
  };

  let empty = null;
  let carryTypesNumber = null;

  // assign how many other bag types obj can carry
  carriedBags[0].includes("no other")
    ? (carryTypesNumber = 0)
    : (carryTypesNumber = carriedBags.length);
  ruleObj["carryTypesNumber"] = carryTypesNumber;

  // assign if "empty" - T/F
  ruleObj["carryTypesNumber"] == 0 ? (empty = true) : (empty = false);
  ruleObj["empty"] = empty;
  //  ? null : ((ruleObj["empty"] = false), (ruleObj["inner"] = innerColorz))

  // assigns "carried" - array containing carried objs:
  // { carryNum: '5', color: 'faded blue' },{ carryNum: '6', color: 'dotted black' }
  if (ruleObj["carryTypesNumber"]) {
    const carryArray = [];
    for (let carryType of carriedBags) {
      const carriedObj = {};
      let color = null;
      let carryNum = null;

      carriedSplit = carryType.split(" ");
      carryNum = carriedSplit[0];
      color = carriedSplit[1] + " " + carriedSplit[2];
      carriedObj["carryNum"] = carryNum;
      carriedObj["color"] = color;

      carryArray.push(carriedObj);
    }
    ruleObj["carried"] = carryArray;
  }

  // create parent arrays of empty bags + canCarry bags + allBags
  ruleObj["empty"] == true
    ? noHoldsBags.push(ruleObj)
    : canCarryBags.push(ruleObj);

  allBags.push(ruleObj);
}

// console.log("noHoldsBags: ", noHoldsBags.length)
// console.log("canCarryBags: ", canCarryBags.length);
// console.log("allBags: ", allBags.length);

const holdsSearchColor = [];
const extraSearches = [];

const findHolders = (searchColor, bagObjArray) => {
  for (let bagObj of bagObjArray) {
    for (let bagCarried of bagObj["carried"]) {
      const searchCol = searchColor;
      if (bagCarried["color"] == searchCol) {
        // console.log(`Winner! ${bagObj["outerColor"]} carries ${searchColor}`);
        if (!extraSearches.includes(bagObj["outerColor"])) {
          extraSearches.push(bagObj["outerColor"]);
          holdsSearchColor.push(bagObj);
        }
      }
    }
  }
  return extraSearches;
};

// console.log("allBags", allBags)
const containedWithin = [];
const findContained = (outerColor, bagObjArray, parentNo) => {
  // let bagsHereTotal = 0
  let parentNums = []
  const carriedObj = {
    "carried": null
  }
  for (let bagObj of bagObjArray) {
    if (bagObj["outerColor"] === outerColor) {
      parentNums.push(parentNo)
      // bagObj["parentNums"] = parentNums
      // let parentNum = parentNo   // eg 
      // console.log("passed parentNum:", parentNum)
      // const parentNum = bagObj["carryNum"]
      // console.log(`Matched colour ${outerColor}, found:`,bagObj, parentNum)
      // console.log("bagObj", bagObj, "parentNum", parentNum)
      
      // bagObj["carried"].map( carryBag => bagsHereTotal = bagsHereTotal += Number(carryBag["carryNum"]) )

      // bagObj["carried"].map (carryBag => carryBag["parentTotal"] = ) 
      
      carriedObj["carried"] = bagObj["carried"]
      carriedObj["parentNum"] = parentNums
      // containedWithin.push(bagObj["carried"]);
      
      // if (parentNum){
      //   bagsHereTotal = bagsHereTotal * parentNum
      // }
      // carriedObj["bagsHereTotal"] = bagsHereTotal
      console.log(bagObj)
// IF (parent total)  {bagshereTotal = bagsHereTotal * parentTotal}

      containedWithin.push(carriedObj)
    }
  }
  // bagsHereTotal.push
};
findContained("shiny gold", canCarryBags);

console.log("containedWithin FIRSTPASS", `${containedWithin.length} in array`, containedWithin, containedWithin[0]);

for (let containers of containedWithin){
  // console.log("FOUND INSIDE", containers)
  for (let bagType of containers["carried"]) {
    const newContainerColor = bagType["color"];

    
    // gives correctAns for tests2 when added:
    let parentNum = containers["bagsHereTotal"]
    // if parentNum = ... eg not 3, but "1" or "2"

    // experimental parentNum
    // let parentNum = bagType["carryNum"];

    // gives incorrectAns for tests2...
    // let parentNum = bagType["carryNum"]; // * containers["bagsHereTotal"]

    console.log("parentNum: ", parentNum);

    findContained(newContainerColor, canCarryBags, parentNum);
  }
}
console.log ("SECOND PASS", `${containedWithin.length} in array`, containedWithin)
console.log("Second + Third object", containedWithin[1], containedWithin[2])

// for (let containers of containedWithin){
//   // console.log("FOUND INSIDE", containers)
//   for (let bagType of containers["carried"]){

//     const newContainerColor = bagType["color"]
//     const parentNum = bagType["carryNum"]
//     findContained(newContainerColor, canCarryBags, parentNum)
//   }
// }
// console.log ("THIRD PASS", `${containedWithin.length} in array`, containedWithin)

// for (let containers of containedWithin){
//   // console.log("FOUND INSIDE", containers)
//   for (let bagType of containers["carried"]){

//     const newContainerColor = bagType["color"]
//     const parentNum = bagType["carryNum"]
//     findContained(newContainerColor, canCarryBags, parentNum)
//   }
// }
// console.log ("FOURTH PASS", `${containedWithin.length} in array`)



let bagsTotal = 0
for (let carryObj of containedWithin){
  // console.log(carryObj)
  bagsTotal = bagsTotal + carryObj["bagsHereTotal"]
}

console.log(bagsTotal)
// const secondContained = containedWithin.map(carriedBags => {
//   return console.log(carriedBags)
//   // console.log("FOUND INSIDE", carriedBags[color])
// })
// console.log(secondContained)


const newSearches = findHolders("shiny gold", canCarryBags);
const secondSearches = newSearches.map(searchCol => {
  return findHolders(searchCol, canCarryBags);
});
const thirdSearches = newSearches.map(searchCol => {
  return findHolders(searchCol, canCarryBags);
});
const fourthSearches = newSearches.map(searchCol => {
  return findHolders(searchCol, canCarryBags);
});
const fifthSearches = newSearches.map(searchCol => {
  return findHolders(searchCol, canCarryBags);
});
const sixthSearches = newSearches.map(searchCol => {
  return findHolders(searchCol, canCarryBags);
});
const seventhSearches = newSearches.map(searchCol => {
  return findHolders(searchCol, canCarryBags);
});
const eighthSearches = newSearches.map(searchCol => {
  return findHolders(searchCol, canCarryBags);
});
const ninthSearches = newSearches.map(searchCol => {
  return findHolders(searchCol, canCarryBags);
});

//  console.log("canCarryBags: ", canCarryBags)
//  console.log(holdsSearchColor)
// console.log(secondSearches)

// console.log(newSearches);
// const outerBags = holdsSearchColor.length;
// console.log(outerBags);

// console.log()
