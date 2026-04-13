// Lowercases and trims a string for consistent comparison.
export const normalize = (str: string): string => {
  return str.toLowerCase().trim();
};

export const matchTask = (title: string, query: string): boolean => {
  const t = normalize(title);
  const q = normalize(query);

  if (!q) return true;

  return t.includes(q) || q.split(" ").every((word) => t.includes(word));
};

export const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;

  const words = query.toLowerCase().split(" ").filter(Boolean);
  const regex = new RegExp(`(${words.join("|")})`, "gi");

  return text
    .split(regex)
    .map((part, i) =>
      words.includes(part.toLowerCase()) ? <mark key={i}>{part}</mark> : part,
    );
};
