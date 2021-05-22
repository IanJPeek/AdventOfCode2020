let { test, infinite, input } = require("./input");

const processInput = imported => {
  const processed = imported.split("\n");
  return processed;
};
test = processInput(test);
input = processInput(input);
infinite = processInput(infinite);
// console.log(test);

const makePlayers = input => {
  const players = {};
  const handP1 = [];
  const handP2 = [];
  let forP1 = true;

  for (let value of input) {
    if (value == "") {
      forP1 = false;
    }
    forP1 ? handP1.push(value) : handP2.push(value);
  }
  handP1.shift(), handP2.shift(), handP2.shift();

  players["p1"] = handP1;
  players["p2"] = handP2;
  return players;
};
const players = makePlayers(infinite);
// console.log(players);

const playRound = players => {
  const p1Go = Number(players.p1.shift());
  const p2Go = Number(players.p2.shift());

  p1Go > p2Go ? players["p1"].push(p1Go, p2Go) : players["p2"].push(p2Go, p1Go);

  // console.log(players);
  return players;
};

calculateWinScore = players => {
  let winArray;

  players.p1.length > 0 ? (winArray = players.p1) : (winArray = players.p2);

  let multiplier = 1;
  let score = 0;
  while (winArray.length > 0) {
    score = score + winArray.pop() * multiplier;
    multiplier++;
  }
  console.log(score);
};

// pt1 regular game
const playGame = players => {
  while (players.p1.length > 0 && players.p2.length > 0) {
    playRound(players);
  }
  calculateWinScore(players);
  console.log(players);
};
// playGame(players);

// pt2 recursive combat...
let infiniteLoop = false;

const checkHandAgainstPrevious = players => {
  let allMatch = true;

  for (let prevHand of players.p1Previous) {
    if (prevHand.length == players.p1.length) {
      for (let i = 0; i < prevHand.length; i++) {
        if (prevHand[i] != players.p1[i]) {
          allMatch = false;
        }
      }
    }
    if (allMatch) {
      const p1Go = Number(players.p1.shift());
      const p2Go = Number(players.p2.shift());
      players.p1.push(p1Go, p2Go);
      // return true
    }
  }
  return false;
};

const checkNotInfiniteLoop = players => {
  let p1HandArr = [];
  let p2HandArr = [];

  p1HandArr.push(players.p1);
  p2HandArr.push(players.p2);

  if (!players["p1Previous"]) {
    players["p1Previous"] = p1HandArr;
    players["p2Previous"] = p2HandArr;
  }
  infiniteLoop = checkHandAgainstPrevious(players);
  return infiniteLoop;
};

const runSubGame = players => {
  // const p1Go = Number(players.p1.shift());
  // const p2Go = Number(players.p2.shift());
  // let p1Remaining = players.p1.length;
  // let p2Remaining = players.p2.length;

  playRecursiveRnd(players)
  return players;
};

const playRecursiveRnd = players => {
  const p1Go = Number(players.p1.shift());
  const p2Go = Number(players.p2.shift());
  let p1Remaining = players.p1.length;
  let p2Remaining = players.p2.length;

  // console.log("\nremaining cards + card value, p1", p1Remaining, p1Go)
  // console.log("remaining cards + card value, p2", p2Remaining, p2Go);

  if (p1Remaining == p1Go || p2Remaining == p2Go) {
  console.log("playing subGame")
  runSubGame(players)
  // playRecursiveRnd(runSubGame(players))
  }

  p1Go > p2Go ? players["p1"].push(p1Go, p2Go) : players["p2"].push(p2Go, p1Go);

  // console.log()
  // console.log(players);
  return players;
};

const playRecursive = players => {
  while (players.p1.length > 0 && players.p2.length > 0 && !infiniteLoop) {
    // infiniteLoop = checkNotInfiniteLoop(players);
    playRecursiveRnd(players);
  }
  if (infiniteLoop) {
    console.log(players);
    console.log("Matched hand / Infinite loop - Player 1 WINS!!!");
  } else {
    calculateWinScore(players);
    console.log(players);
  }
};
playRecursive(players);
