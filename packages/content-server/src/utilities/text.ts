export function normalizeNoSpace(text: string) {
  return text
    .replace(/\s+/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function includesWithoutCase(value: string, text: string | undefined) {
  return text?.toLowerCase().includes(value.toLowerCase());
}
