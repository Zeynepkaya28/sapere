export type NavKey = "feed" | "live" | "games" | "map" | "profile" | "editor";

export type NavItem = { key: NavKey; href: string; editorOnly?: boolean };

export const navItems: NavItem[] = [
  { key: "feed", href: "/" },
  { key: "live", href: "/canli" },
  { key: "games", href: "/oyunlar" },
  { key: "map", href: "/harita" },
  { key: "profile", href: "/profil" },
  // Visibility only. The server still checks the role on every editor route and RPC.
  { key: "editor", href: "/editor", editorOnly: true },
];

export function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function visibleItems(isEditor: boolean): NavItem[] {
  return navItems.filter((item) => !item.editorOnly || isEditor);
}
