import { number } from "zod";

export function degreeYearText(degreeYears: Array<number>): string {
  if (degreeYears.length == 0) {
    return "alle";
  }

  let result = "";
  let start = degreeYears[0];
  let end = degreeYears[0];

  if (typeof(end) === "number"){
    if (degreeYears.length === 1){
      result += degreeYears[0]
      return result;
    }

    for (let i = 1; i < degreeYears.length; i++){
      if (degreeYears[i] == end + 1){
        end = degreeYears[i]
      }
    }
  } else{
    return "error"
  }
}

function findSequence() {}
