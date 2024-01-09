export function initials(name: string): string {
  const words = name
    .split("")
    .filter((char) => char.charCodeAt(0) < 128)
    .join("")
    .split(" ")
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]!.slice(0, 2).toUpperCase();
  }

  const [first, second] = words;

  return `${first![0]}${second![0]}`.toUpperCase();
}
