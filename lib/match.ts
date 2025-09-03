export function queryToCategory(q: string): string {
  const s = q.toLowerCase();
  const has = (...keys: string[]) => keys.some(k => s.includes(k));
  if (has("shoe","run","runner","sneaker")) return "running_shoes";
  if (has("coffee","espresso","grinder")) return "coffee";
  if (has("project","task","productivity","pm tool","kanban")) return "productivity_saas";
  return "";
}
