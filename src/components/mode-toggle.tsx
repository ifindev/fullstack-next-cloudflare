"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch by only rendering after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" disabled>
				<Sun className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">Loading theme</span>
			</Button>
		);
	}

	const cycleTheme = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	};

	return (
		<Button variant="ghost" size="icon" onClick={cycleTheme} title={`Current theme: ${theme}`}>
			{theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
			{theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
			{theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
			<span className="sr-only">Toggle theme (currently {theme})</span>
		</Button>
	);
}
