// Single source of truth for content categories and their pastel colour token.

export const categories = {
  history: { color: "peach" },
  language: { color: "rose" },
  space: { color: "lavender" },
  nature: { color: "butter" },
  science: { color: "sky" },
  geography: { color: "mint" },
} as const;

export type Category = keyof typeof categories;
export type Pastel = "peach" | "rose" | "lavender" | "butter" | "sky" | "mint";

export const categoryList = Object.keys(categories) as Category[];
export const pastels: Pastel[] = ["peach", "rose", "lavender", "sky", "mint", "butter"];

export function categoryColor(category: Category): Pastel {
  return categories[category].color;
}
