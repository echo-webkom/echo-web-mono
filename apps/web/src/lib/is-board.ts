export function isBoard(str: string) {
  if (!str.includes("/")) {
    return false;
  }

  const [start, end] = str.split("/");

  const startIsNumber = !isNaN(Number(start));
  const endIsNumber = !isNaN(Number(end));

  if (startIsNumber && endIsNumber) {
    return true;
  }

  return false;
}
