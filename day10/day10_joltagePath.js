const { eg1, eg2, input } = require("./input");
const eg1Split = eg1.split("\n");
const eg2Split = eg2.split("\n");
const inputSplit = input.split("\n");
eg1Split.shift();
eg2Split.shift();
inputSplit.shift();

const eg1Nums = eg1Split
  .map(numStr => Number(numStr))
  .sort(function(a, b) {
    return a - b;
  });
const eg2Nums = eg2Split
  .map(numStr => Number(numStr))
  .sort(function(a, b) {
    return a - b;
  });
const inputNums = inputSplit
  .map(numStr => Number(numStr))
  .sort(function(a, b) {
    return a - b;
  });

const eg1Inbuilt = Math.max(...eg1Nums) + 3;
const eg2Inbuilt = Math.max(...eg2Nums) + 3;
const inputInbuilt = Math.max(...inputNums) + 3;
eg1Nums.push(eg1Inbuilt);
eg2Nums.push(eg2Inbuilt);
inputNums.push(inputInbuilt);
eg1Nums.unshift(0);
eg2Nums.unshift(0);
inputNums.unshift(0);

const countJoltDiffs = joltArr => {
  let oneCount = 0;
  let threeCount = 0;

  for (let num in joltArr) {
    num = Number(num);
    let joltDiff = joltArr[num + 1] - joltArr[num];
    console.log(joltDiff);
    if (joltDiff === 1) {
      oneCount = oneCount + 1;
    }
    if (joltDiff === 3) {
      threeCount = threeCount + 1;
    }
  }
  const product = oneCount * threeCount;
  console.log(
    `oneCount: ${oneCount}, threeCount: ${threeCount}, product: ${product}`
  );
  return product;
};

console.log(inputNums.slice(99));
// countJoltDiffs(eg1Nums);
// countJoltDiffs(eg2Nums);
// countJoltDiffs(inputNums);



// With these adapters, your device's built-in joltage adapter would be rated for 19 + 3 = 22 jolts, 3 higher than the highest-rated adapter.

// Because adapters can only connect to a source 1-3 jolts lower than its rating, in order to use every adapter, you'd need to choose them like this:

// The charging outlet has an effective rating of 0 jolts, so the only adapters that could connect to it directly would need to have a joltage rating of 1, 2, or 3 jolts. Of these, only one you have is an adapter rated 1 jolt (difference of 1).
// From your 1-jolt rated adapter, the only choice is your 4-jolt rated adapter (difference of 3).
// From the 4-jolt rated adapter, the adapters rated 5, 6, or 7 are valid choices. However, in order to not skip any adapters, you have to pick the adapter rated 5 jolts (difference of 1).
// Similarly, the next choices would need to be the adapter rated 6 and then the adapter rated 7 (with difference of 1 and 1).
// The only adapter that works with the 7-jolt rated adapter is the one rated 10 jolts (difference of 3).
// From 10, the choices are 11 or 12; choose 11 (difference of 1) and then 12 (difference of 1).
// After 12, only valid adapter has a rating of 15 (difference of 3), then 16 (difference of 1), then 19 (difference of 3).
// Finally, your device's built-in adapter is always 3 higher than the highest adapter, so its rating is 22 jolts (always a difference of 3).
