const input = require("./input.js");
let inputSplit = input.split("\n\n");

const groups = [];
for (let group of inputSplit) {
  const groupMembers = group.split("\n");
  groups.push(groupMembers);
}

const groupSample = [];
for (let strNum in groups) {
  if (strNum < 20) {
    groupSample.push(groups[strNum]);
  }
}

// let qAnswers = [];
let allUniqueGroupAnswers = [];
let allGroupAnswers = [];
let allGroupAnswersGiven = [];
for (let group of groups) {
  let groupAnswers = [];
  let personCount = 0;
  for (let person of group) {
    personCount++;
    const personAnswers = person.split("");

    // PT 1 - EVERY UNIQUE ANSWER
    // for (letter of personAnswers) {
    // if (!groupAnswers.includes(letter)) {
    //   groupAnswers.push(letter);
    // }
    // }

    // PT 2 - ALL ANSWERS 'YES' FOR EVERYONE
    for (letter of personAnswers) {
      groupAnswers.push(letter);
    }
  }
  groupAnswers.push(personCount);
  allGroupAnswersGiven.push(groupAnswers);
  // allUniqueGroupAnswers.push(groupAnswers);
}
// console.log("allGroupAnswers", allGroupAnswersGiven);

let finalAnswers = [];
for (let groupAnswers of allGroupAnswersGiven) {
  answerObj = {
    people: groupAnswers.pop()
  };

  for (let answer of groupAnswers) {
    answerObj[answer] ? answerObj[answer]++ : (answerObj[answer] = 1);
  }
  allAgreed = [];

  const keys = Object.keys(answerObj);
  for (let key of keys) {
    if (
      key !== "people" &&
      answerObj[key] == answerObj["people"] &&
      !allAgreed.includes(answerObj[key])
    ) {
      allAgreed.push(key);
    }
  }
  // console.log(answerObj)
  // console.log(allAgreed)
  finalAnswers.push(allAgreed);
}
// console.log(finalAnswers);

const finalAnswersNum = [];

for (let group of finalAnswers) {
  finalAnswersNum.push(group.length);
}

let finalAnswerTotal = 0;
for (let num of finalAnswersNum) {
  finalAnswerTotal = finalAnswerTotal + num;
}
console.log("Total Qs all group members answered yes to...", finalAnswerTotal);

const yesAnswersNum = [];

for (let group of allUniqueGroupAnswers) {
  yesAnswersNum.push(group.length);
}

let totalYesses = 0;
for (let num of yesAnswersNum) {
  totalYesses = totalYesses + num;
}
// console.log(allGroupAnswers, allGroupAnswers.length)
// console.log(totalYesses)
