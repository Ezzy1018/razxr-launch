import type { DebugChallenge } from "@/types";

export const debugChallenges: DebugChallenge[] = [
  {
    id: "dbg-js-1",
    title: "Off-by-one in pagination",
    language: "javascript",
    buggyCode:
      "export function totalPages(total, size) { return Math.floor(total / size) }",
    fixedCode:
      "export function totalPages(total, size) { return Math.ceil(total / size) }",
    hint: "Any remaining items still need one extra page.",
    difficulty: "easy",
  },
  {
    id: "dbg-js-2",
    title: "Mutating input array",
    language: "javascript",
    buggyCode:
      "export function sortScores(scores) { return scores.sort((a,b)=>b-a) }",
    fixedCode:
      "export function sortScores(scores) { return [...scores].sort((a,b)=>b-a) }",
    hint: "Avoid changing caller-owned objects.",
    difficulty: "medium",
  },
  {
    id: "dbg-js-3",
    title: "Falsy zero discount bug",
    language: "javascript",
    buggyCode:
      "export function applyDiscount(price, discount) { if (!discount) return price; return price - price * discount }",
    fixedCode:
      "export function applyDiscount(price, discount) { if (discount == null) return price; return price - price * discount }",
    hint: "Zero is valid input for discount.",
    difficulty: "easy",
  },
  {
    id: "dbg-js-4",
    title: "Leaky timeout cleanup",
    language: "javascript",
    buggyCode:
      "export function delayed(cb, ms) { const id = setTimeout(cb, ms); return () => clearInterval(id) }",
    fixedCode:
      "export function delayed(cb, ms) { const id = setTimeout(cb, ms); return () => clearTimeout(id) }",
    hint: "Pair timeout with timeout cleanup.",
    difficulty: "medium",
  },
  {
    id: "dbg-js-5",
    title: "Incorrect URL join",
    language: "javascript",
    buggyCode:
      "export function join(base, path) { return `${base}/${path}` }",
    fixedCode:
      "export function join(base, path) { return `${base.replace(/\\/$/, '')}/${path.replace(/^\\//, '')}` }",
    hint: "Handle existing leading or trailing slashes.",
    difficulty: "hard",
  },
  {
    id: "dbg-py-1",
    title: "Default list argument trap",
    language: "python",
    buggyCode:
      "def add_tag(tag, tags=[]):\n    tags.append(tag)\n    return tags",
    fixedCode:
      "def add_tag(tag, tags=None):\n    tags = tags or []\n    tags.append(tag)\n    return tags",
    hint: "Mutable defaults are shared across calls.",
    difficulty: "medium",
  },
  {
    id: "dbg-py-2",
    title: "Integer division mismatch",
    language: "python",
    buggyCode:
      "def average(total, count):\n    return total // count",
    fixedCode:
      "def average(total, count):\n    return total / count",
    hint: "Use float division for averages.",
    difficulty: "easy",
  },
  {
    id: "dbg-py-3",
    title: "Timezone-naive datetime compare",
    language: "python",
    buggyCode:
      "from datetime import datetime\n\ndef is_expired(expiry):\n    return datetime.utcnow() > expiry",
    fixedCode:
      "from datetime import datetime, timezone\n\ndef is_expired(expiry):\n    return datetime.now(timezone.utc) > expiry",
    hint: "Compare aware datetimes to aware datetimes.",
    difficulty: "hard",
  },
  {
    id: "dbg-ts-1",
    title: "Unsafe union narrowing",
    language: "typescript",
    buggyCode:
      "type Result = { ok: true; data: string } | { ok: false; error: string }\nexport const value = (r: Result) => r.data.length",
    fixedCode:
      "type Result = { ok: true; data: string } | { ok: false; error: string }\nexport const value = (r: Result) => (r.ok ? r.data.length : 0)",
    hint: "Narrow the union before accessing variant fields.",
    difficulty: "medium",
  },
  {
    id: "dbg-ts-2",
    title: "Readonly array mutation",
    language: "typescript",
    buggyCode:
      "export function append<T>(arr: readonly T[], item: T) { arr.push(item); return arr }",
    fixedCode:
      "export function append<T>(arr: readonly T[], item: T) { return [...arr, item] }",
    hint: "Preserve readonly contract by returning a new array.",
    difficulty: "hard",
  },
];
