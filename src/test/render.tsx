import { render, type RenderOptions } from "@testing-library/react";
import axe from "axe-core";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import messages from "../../messages/tr.json";

function Providers({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="tr" messages={messages} timeZone="Europe/Istanbul">
      {children}
    </NextIntlClientProvider>
  );
}

export function renderWithIntl(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}

/** Runs axe on a rendered fragment. Contrast is checked separately (jsdom has no layout). */
export async function axeViolations(container: Element) {
  const result = await axe.run(container, {
    rules: {
      "color-contrast": { enabled: false },
      region: { enabled: false },
    },
  });
  return result.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`);
}
