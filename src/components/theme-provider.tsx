"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: Readonly<React.ComponentProps<typeof NextThemesProvider>>) {
  return (
    <NextThemesProvider
      {...props}
      // O next-themes já salva automaticamente no localStorage
      // e sincroniza com cookies quando necessário
      enableColorScheme={false}
      storageKey="pokedex-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
