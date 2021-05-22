const { input } = require("./input");
const { testInput } = require("./input");

const testInputSplit = testInput.split("\n");
const inputSplit = input.split("\n");
// const newLineSplit = testInput.split("\n\n")  // <= better start!!

// Make a string to join info, then push the joined info when next arr item is "" (+ reset string), also push when loop reaches end of array
const joined = [];
let joinStr = "";
const hackyJoinIndividualInfo = splitArr => {
  for (let i = 0; i < splitArr.length; i++) {
    if (splitArr[i + 1] != "" && i + 1 < splitArr.length && splitArr[i] != "") {
      joinStr = joinStr + splitArr[i] + " ";
    } else if (splitArr[i + 1] == "") {
      joinStr = joinStr + splitArr[i];
      joined.push(joinStr);
      joinStr = "";
    } else if (i + 1 == splitArr.length) {
      joinStr = joinStr + splitArr[i];
      joined.push(joinStr);
    }
  }
  return joined;
};
joinedArr = hackyJoinIndividualInfo(inputSplit);

// passport strings
passportArr = [];
for (let passport of joinedArr) {
  const fields = passport.split(" ");
  passportArr.push(fields);
}

passportObjArr = [];
for (let passport of passportArr) {
  const passportObj = {};
  for (let attr of passport) {
    keyValuePair = attr.split(":");
    passportObj[keyValuePair[0]] = keyValuePair[1];
  }
  passportObjArr.push(passportObj);
}
// console.log("Passport OBJECTS", passportObjArr)

// passports w/ 8 fields or the 7 preferred ones only...
const passportsToCheck = [];
for (let passport of passportObjArr) {
  fieldsPresent = Object.keys(passport);
  if (fieldsPresent.length >= 7) {
    passportsToCheck.push(passport);
  }
}

// passports w/ 8 fields and the 7 less cid ...  (could easily merge with func above for only one func)
const verifiedPass = [];
for (let passport of passportsToCheck) {
  fieldsPresent = Object.keys(passport);

  if (fieldsPresent.length == 7 && !fieldsPresent.includes("cid")) {
    verifiedPass.push(passport);
  } else if (fieldsPresent.length == 8) {
    verifiedPass.push(passport);
  }
}
console.log("'validated': ", verifiedPass.length);

// PT 2 - Validation  checks
// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
// If cm, the number must be at least 150 and at most 193.
// If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.

// TEST - grab limited data sample for testing
const passSample = [];
for (let passNum in verifiedPass) {
  if (passNum < 20) {
    passSample.push(verifiedPass[passNum]);
  }
}

const rejectedOnValidation = [];
const passedValidation = [];
const failReasons = [];
const passValidator = passSample => {
  for (let passNum in passSample) {
    passport = passSample[passNum];
    const { byr, iyr, eyr, hgt, hcl, ecl, pid } = passport;

    byrValid = byrCheck(byr, passport);
    iyrValid = iyrCheck(iyr, passport);
    eyrValid = eyrCheck(eyr, passport);
    hgtValid = hgtCheck(hgt, passport);
    hclValid = hclCheck(hcl, passport);
    eclValid = eclCheck(ecl, passport);
    pidValid = pidCheck(pid, passport);

    let valid = true;
    validateArr = [
      byrValid,
      iyrValid,
      eyrValid,
      hgtValid,
      hclValid,
      eclValid,
      pidValid
    ];
    for (let value of validateArr) {
      if (!value) {
        valid = false;
      }
    }

    if (valid) {
      passedValidation.push(passport);
    } else if (!valid) {
      rejectedOnValidation.push(passport);
    }
  }
};

const byrCheck = (byr, passport) => {
  if (byr >= 1920 && byr <= 2002) {
    return true;
  } else {
    passport["failReason"] = "byr: " + byr;
    failReasons.push("byr");
    return false;
  }
};

const iyrCheck = (iyr, passport) => {
  if (iyr >= 2010 && iyr <= 2020) {
    return true;
  } else {
    passport["failReason"] = "iyr: " + iyr;
    failReasons.push("iyr");
    return false;
  }
};

const eyrCheck = (eyr, passport) => {
  if (eyr >= 2020 && eyr <= 2030) {
    return true;
  } else {
    passport["failReason"] = "eyr: " + eyr;
    failReasons.push("eyr");
    return false;
  }
};

const hgtCheck = (hgt, passport) => {
  if (!(hgt.includes("cm") || hgt.includes("in"))) {
    passport["failReason"] = "hgt: " + hgt;
    failReasons.push("hgt0NM");
    return false;
  }

  if (hgt.includes("cm")) {
    const cmNum = hgt.split("cm")[0];
    if (!(cmNum >= 150 && cmNum <= 193)) {
      passport["failReason"] = "hgt: " + hgt;
      failReasons.push("hgtCM");
      return false;
    }
  }
  if (hgt.includes("in")) {
    const inNum = hgt.split("in")[0];
    if (!(inNum >= 59 && inNum <= 76)) {
      passport["failReason"] = "hgt: " + hgt;
      failReasons.push("hgtIN");
      return false;
    }
  } else return true;
};

const hclCheck = (hcl, passport) => {
  if (hcl[0] == "#" && hcl.slice(1).length == 6) {
    return true;
  } else {
    passport["failReason"] = "hcl: " + hcl;
    failReasons.push("hcl");
    return false;
  }
};

const eclCheck = (ecl, passport) => {
  eclArr = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
  if (eclArr.includes(ecl)) {
    return true;
  } else {
    passport["failReason"] = "ecl: " + ecl;
    failReasons.push("ecl");
    return false;
  }
};

const pidCheck = (pid, passport) => {
  if (pid.length == 9) {
    return true;
  } else {
    passport["failReason"] = "pid: " + pid;
    failReasons.push("pid");
    return false;
  }
};
passValidator(verifiedPass);

console.log("Passed validation: ", passedValidation.length);
// console.log("Failed validation: ", rejectedOnValidation.length);
// console.log("Passports validation checked: ", verifiedPass.length);
// console.log("starting passports: ", passportsToCheck.length);
// console.log("Fails: ", rejectedOnValidation);
// console.log("failReasons: ", failReasons)
