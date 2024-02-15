export function degreeYearText(degreeYears: Array<number>): string {
  
  if (degreeYears.length === 1) {
    return degreeYears[0]?.toString() ?? "noe gikk galt"
  }

  if (typeof degreeYears[0] === "undefined"){
    return "alle"
  }
  
  let start = degreeYears[0];
  let curr = degreeYears[0];

  const seqs: Array<string> = []
    
    for (const year of degreeYears) {
      if (year != curr + 1){
        if(start === curr) {
          seqs.push(start)

        }        
      }
    }



  
}
