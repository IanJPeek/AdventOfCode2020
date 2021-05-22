// update startLength + seqpick (inc modulo) before running...
let egSeq = [0, 3, 6]; // 2020th num = 436      the 30000000th number spoken is 175594.
let eg2 = [1, 3, 2]; // 2020th num = 1          the 30000000th number spoken is 2578.
let eg3 = [2, 1, 3]; // 2020th num = 10         the 30000000th number spoken is 3544142.
let eg4 = [1, 2, 3]; // 2020th num = 27         the 30000000th number spoken is 261214.
let eg5 = [2, 3, 1]; // 2020th num = 78         the 30000000th number spoken is 6895259.
let eg6 = [3, 2, 1]; // 2020th num = 438        the 30000000th number spoken is 18.
let eg7 = [3, 1, 2]; // 2020th num = 1836       the 30000000th number spoken is 362.

// Given 0,3,6, the 30000000th number spoken is 175594.
// Given 1,3,2, the 30000000th number spoken is 2578.
// Given 2,1,3, the 30000000th number spoken is 3544142.
// Given 1,2,3, the 30000000th number spoken is 261214.
// Given 2,3,1, the 30000000th number spoken is 6895259.
// Given 3,2,1, the 30000000th number spoken is 18.
// Given 3,1,2, the 30000000th number spoken is 362.


let pt1 = [0, 1, 4, 13, 15, 12, 16]; // 2020th num = 1665 => * !!

let turns = [];
let trackObj = {};
let startLength = egSeq.length;
let limit = 30000000;

const isLastNumSpokenForFirstTime = lastPick => {
  // console.log("turns slice:", turns.slice(0,-1))
  if (
    (turns.includes(lastPick) && !turns.slice(0, -1).includes(lastPick)) ||
    !turns.includes(lastPick)
  ) {
    // console.log(`Last turn was the first time spoken for ${lastPick}`);
    return true;
  }
  return false;
};

const findAgeOfLastNumSpoken = (lastPick, i) => {
  // console.log("turns:", turns);
  // console.log("last pick:", lastPick);

  const difference =
    trackObj[lastPick].lastSpoken - trackObj[lastPick].lastSpokenBefore;
  // console.log(
  //   trackObj[lastPick].lastSpoken,
  //   " - ",
  //   trackObj[lastPick].lastSpokenBefore
  // );
  // console.log("difference:", difference);

  if (!turns.includes(difference)) {
    // console.log("adding new object");
    // console.log(trackObj);
    trackObj[difference] = { lastSpoken: i };
    turns.push(difference);
  } else {
    turns.push(difference);
    trackObj[difference]["lastSpokenBefore"] = trackObj[difference].lastSpoken;
    trackObj[difference].lastSpoken = i;
  }
};

// RUN sequence...
for (let i = 0; i < limit; i++) {
  let currentTurn = i + 1;
  let seqPick = pt1[i % 3];
  let lastPick = turns[i - 1];

  // run start numbers...
  if (i < startLength) {
    turns.push(seqPick);
    trackObj[seqPick] = { lastSpoken: i };
  }

  if (isLastNumSpokenForFirstTime(lastPick) && i >= startLength) {
    // console.log("\ncurrent turn:", currentTurn, "current i:", i);

    if (!turns.includes(0)) {
      trackObj[0] = { lastSpoken: i };
      turns.push(0);
    } else {
      turns.push(0);
      trackObj["0"]["lastSpokenBefore"] = trackObj["0"].lastSpoken;
      trackObj["0"].lastSpoken = i;
    }
  } else if (i >= startLength) {
    // console.log("\ncurrent turn:", currentTurn, "current i:", i);
    findAgeOfLastNumSpoken(lastPick, i);
  }
}

// console.log("turns", turns);
// console.log(trackObj);
console.log("30000000", turns[29999999]);
