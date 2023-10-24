export function isBoard(str: string) {
  if (!str.includes("/")) {
    return false;
  }

  const delimIndex = str.indexOf("/");
  const start = str.slice(0, delimIndex);
  const end = str.slice(delimIndex + 1);

  const startIsNumber = !isNaN(Number(start));
  const endIsNumber = !isNaN(Number(end));

  if (startIsNumber && endIsNumber) {
    return true;
  }

  return false;
}
