"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { UserStoreProvider } from "@/providers/UserStoreProvider";

import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
			<UserStoreProvider>{children}</UserStoreProvider>
		</ThemeProvider>
	);
}
