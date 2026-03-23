
export function detectLanguage(code: string): string {
  const c = code.trim();
  if (/\b(function|const|let|=>|console\.|Math\.|async\s|await\s|import\s)/.test(c)) return "javascript";
  if (/\b(def |from |import |#.*\n)/.test(c) && !c.includes("{")) return "python";
  if (/<\?php|<\?=|\$[a-zA-Z_]/m.test(c)) return "php";
  if (/\b(fn |impl |fn\(|pub |::|let mut )/.test(c)) return "rust";
  if (/\b(interface |type |func |package )/.test(c)) return "go";
  if (/<(html|div|span|script|style)\b/i.test(c)) return "html";
  if (/^\s*{[\s\S]*"[\w]+"\s*:/.test(c)) return "json";
  if (/^\s*#\s|^\s*---/.test(c)) return "yaml";
  return "text";
}
