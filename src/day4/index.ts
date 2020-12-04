import { test, readInput } from "../utils/index";

const prepareInput = (rawInput: string) => rawInput;

const input = prepareInput(readInput());

const requiredFields = [
  {
    field: "byr",
    isValid: (val) =>
      val.length === 4 && Number(val) >= 1920 && Number(val) <= 2002,
  },
  {
    field: "iyr",
    isValid: (val) =>
      val.length === 4 && Number(val) >= 2010 && Number(val) <= 2020,
  },
  {
    field: "eyr",
    isValid: (val) =>
      val.length === 4 && Number(val) >= 2020 && Number(val) <= 2030,
  },
  {
    field: "hgt",
    isValid: (val) => {
      let height;
      if (val.indexOf("in") > -1) {
        height = Number(val.split("in")[0]);
        return height >= 59 && height <= 76;
      } else if (val.indexOf("cm") > -1) {
        height = Number(val.split("cm")[0]);
        return height >= 150 && height <= 193;
      }
      return false;
    },
  },
  {
    field: "hcl",
    isValid: (val) => {
      if (val.indexOf("#") === 0) {
        return (
          val.split("#")[1].length === 6 &&
          !!val.split("#")[1].match(/^([0-9]|[a-f])+([0-9a-f]+)$/i)
        );
      }
      return false;
    },
  },
  {
    field: "ecl",
    isValid: (val) =>
      ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(val),
  },
  { field: "pid", isValid: (val) => val.length === 9 },
  // "cid"
];

const goA = (input) => {
  const parsedInput = input
    .split("\n\n")
    .map((item) => item.split("\n").join(" "))
    .filter(Boolean)
    .map((item) =>
      item.split(" ").map((subItem) => ({
        field: subItem.split(":")[0],
        value: subItem.split(":")[1],
      }))
    );

  const valid = parsedInput.reduce((amountValid, passport) => {
    if (
      requiredFields.every(
        (requiredField) =>
          !!passport.find(({ field }) => {
            // console.log("heyo", field, requiredField, field === requiredField);
            return field === requiredField.field;
          })
      )
    ) {
      amountValid++;
    }

    return amountValid;
  }, 0);
  return valid;
};

const goB = (input) => {
  const parsedInput = input
    .split("\n\n")
    .map((item) => item.split("\n").join(" "))
    .filter(Boolean)
    .map((item) =>
      item.split(" ").map((subItem) => ({
        field: subItem.split(":")[0],
        value: subItem.split(":")[1],
      }))
    );

  const valid = parsedInput.reduce((amountValid, passport) => {
    if (
      requiredFields.every((requiredField) => {
        const isValid = !!passport.find(({ field, value }) => {
          if (!!value && field === requiredField.field) {
            console.log("alright!", field, value, requiredField.isValid(value));
            return requiredField.isValid(value);
          }
          return false;
        });

        if(!isValid) {
          console.warn(requiredField.field, "not found!")
        }

        return isValid;
      })
    ) {
      amountValid++;
    }

    return amountValid;
  }, 0);

  return valid;
};

/* Tests */

test(
  goB(`hcl:#888785
  hgt:164cm byr:2001 iyr:2015 cid:88
  pid:545766238 ecl:hzl
  eyr:2022
`),
  1
);

/* Results */

console.time("Time");
console.log("Solution to part 1:", goA(input));
console.log("Solution to part 2:", goB(input));
console.timeEnd("Time");
