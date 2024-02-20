export function degreeYearText(degreeYears: Array<number>): string {
  if (degreeYears.length === 0) {
    return "ingen";
  }
  if (degreeYears.length === 5) {
    return "alle";
  }

  const first = degreeYears[0]!;

  if (degreeYears.length === 1) {
    return first.toString() + ". trinn";
  }

  let start = first;
  let curr = first;

  const seqs: Array<string> = [];

  for (const year of degreeYears.slice(1)) {
    if (year !== curr + 1) {
      if (start === curr) {
        seqs.push(start.toString());
      } else {
        seqs.push(`${start} - ${curr}`);
      }
      start = year;
    }
    curr = year;
  }

  if (start === curr) {
    seqs.push(start.toString());
  } else {
    seqs.push(`${start} - ${curr}`);
  }

  const last = seqs.pop()!;
  if (seqs.length === 0) {
    return last + ". trinn";
  }

  return `${seqs.join(", ")} og ${last}. trinn`;
}
