export function toCategoryKey(cat: string): string {
  return cat.replace(/'/g, '').replace(/\s+/g, '_');
}
