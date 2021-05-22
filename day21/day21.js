let { test, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  return processed;
};
test = processInput(test);
input = processInput(input);
// console.log(test);

const listLineSeparator = input => {
  // 1) Make arr of  [ [[food], [allergens]], [[food], [allergens]], [[food], [allergens]] ]
  let foodAndAllergensArr = [];
  for (let listLine of input) {
    let foodAndAllergens = [];
    const listLineSplit = listLine.split(" (contains ");
    const foods = listLineSplit[0].split(" ");
    const allergens = listLineSplit[1].slice(0, -1).split(" ");
    for (let allergen of allergens) {
      if (allergen.includes(",")) {
        const index = allergens.indexOf(allergen);
        allergens[index] = allergen.replace(",", "");
      }
    }
    foodAndAllergens.push(foods, allergens);
    foodAndAllergensArr.push(foodAndAllergens);
  }

  // 2) Make + populate line/ list lookup obj { '0': {food: [], allergens: []}, '1': {food: [], allergens: []}}
  let listLookupObj = {};
  for (let lineNum in foodAndAllergensArr) {
    listLookupObj[lineNum] = {
      food: foodAndAllergensArr[lineNum][0],
      allergens: foodAndAllergensArr[lineNum][1]
    };
  }
  return [foodAndAllergensArr, listLookupObj];
};
const [foodAndAllergensArr, listLookupObj] = listLineSeparator(input);
// console.log("foodAndAllergensArr", foodAndAllergensArr);
// console.log("listLookupObj", listLookupObj);

const gatherAll = arrArr => {
  const allFoodsArr = [];
  const allAllergensArr = [];
  const allFoodsWithDuplicates = [];

  for (let arr of arrArr) {
    // 1) push foods
    for (let food of arr[0]) {
      if (!allFoodsArr.includes(food)) {
        allFoodsArr.push(food);
      }
      allFoodsWithDuplicates.push(food);
    }
    // 2) push allergens
    for (let allergens of arr[1]) {
      if (!allAllergensArr.includes(allergens)) {
        allAllergensArr.push(allergens);
      }
    }
  }
  return [allFoodsArr, allAllergensArr, allFoodsWithDuplicates];
};
let [allFoodsArr, allAllergensArr, allFoodsWithDuplicates] = gatherAll(
  foodAndAllergensArr
);
// console.log("allFoodsArr", allFoodsArr);
// console.log("allAllergensArr", allAllergensArr);
// console.log("allFoodsWithDuplicates", allFoodsWithDuplicates)

const findPossibleAllergens = (listLookUpObj, allAllergensArr) => {
  // make lookupObj for { allergen: {potentialAllergenFoods: []}, allergen: {potentialAllergenFoods: []} }
  let allergenLookupObj = {};
  for (let allergen of allAllergensArr) {
    allergenLookupObj[allergen] = {};
    let potentialAllergens = [];
    for (let numKey in listLookUpObj) {
      listObj = listLookupObj[numKey];
      if (listObj["allergens"].includes(allergen)) {
        for (let food of listObj["food"]) {
          if (!potentialAllergens.includes(food)) {
            potentialAllergens.push(food);
          }
        }
      }
    }
    allergenLookupObj[allergen]["potentialAllergenFoods"] = potentialAllergens;
  }
  return allergenLookupObj;
};
let allergenLookupObj = findPossibleAllergens(listLookupObj, allAllergensArr);
// console.log(allergenLookupObj)

// check if food always present when allergen specified
const verifyFoodAlwaysWithAllergen = allergenLookupObj => {
  let allergens = Object.keys(allergenLookupObj);

  for (let allergen of allergens) {
    let alwaysPresentWith = [];
    let notPresentWith = [];
    const foodsToVerify = allergenLookupObj[allergen]["potentialAllergenFoods"];

    for (let food of foodsToVerify) {
      let alwaysPresent = true;
      for (let indexKey in listLookupObj) {
        const listLookup = listLookupObj[indexKey];
        if (listLookup["allergens"].includes(allergen)) {
          listLookup["food"].includes(food) ? null : (alwaysPresent = false),
            notPresentWith.push(food);
        }
      }
      if (alwaysPresent) {
        alwaysPresentWith.push(food);
      }
      allergenLookupObj[allergen]["alwaysPresentWith"] = alwaysPresentWith;
    }
  }
  return allergenLookupObj;
};
allergenLookupObj = verifyFoodAlwaysWithAllergen(
  allergenLookupObj,
  listLookupObj
);
// console.log(allergenLookupObj);

let allergenFoundFoods = [];
let identifiedAllergyFoods = {};

const allergenIdentifier = (allergenLookupObj, allAllergensArr) => {
  const allergensAmount = allAllergensArr.length;
  let allergens = Object.keys(allergenLookupObj);

  // continue loop until all allergens identified
  while (allergenFoundFoods.length < allergensAmount) {
    for (let allergen of allergens) {
      let probableAllergyFoodArr =
        allergenLookupObj[allergen]["alwaysPresentWith"];

      // 1) remove foods if allergen already found
      if (allergenFoundFoods.length > 0) {
        allergenFoundFoods.forEach(
          excludedFood =>
            (probableAllergyFoodArr = probableAllergyFoodArr.filter(
              food => food != excludedFood
            ))
        );
      }

      // 2) identify foods if unique to allergen
      if (probableAllergyFoodArr.length == 1) {
        identifiedAllergyFoods[allergen] = probableAllergyFoodArr[0];
        allergenFoundFoods.push(probableAllergyFoodArr[0]);
      }
      // repeat until all allergens identified
    }
  }
  return [identifiedAllergyFoods, allergenFoundFoods];
};
[identifiedAllergyFoods, allergenFoundFoods] = allergenIdentifier(
  allergenLookupObj,
  allAllergensArr
);
console.log("\nidentifiedAllergyFoods", identifiedAllergyFoods);
// console.log("\nallergenFoundFoods", allergenFoundFoods);
// console.log("\nallAllergensArr", allAllergensArr)
// console.log("\nallergenLookupObj", allergenLookupObj)
// console.log("allFoodsArr", allFoodsArr)

const removeAllergens = (allergenFoundFoods, allFoodsArr) => {
  for (let allergyFood of allergenFoundFoods) {
    allFoodsArr = allFoodsArr.filter(food => food != allergyFood);
  }
  return allFoodsArr;
};
const safeFoods = removeAllergens(allergenFoundFoods, allFoodsArr);

// answer for pt.1 below
let safeCount = 0;
for (let food of allFoodsWithDuplicates) {
  if (safeFoods.includes(food)) {
    safeCount++;
  }
}
console.log("\nNumber of safe foods:", safeCount);
// Pt2 - Foods by allergen in alphabetical order: Dairy, eggs, fish, nuts, peanuts, sesame, soy, wheat
// see "identifiedAllergyFoods" obj
// canonicalDangerousIngredientList = fqhpsl,zxncg,clzpsl,zbbnj,jkgbvlxh,dzqc,ppj,glzb
