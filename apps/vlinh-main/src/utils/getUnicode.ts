export function getUnicode(char: string) {
  return char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0");
}
