export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace("æ", "ae")
    .replace("ø", "o")
    .replace("å", "a")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .trim();
};
