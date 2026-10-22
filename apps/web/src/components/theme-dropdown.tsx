"use client";

import { Laptop, Check, Moon, Sun, Venus, Bug, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

import { useIsMounted } from "@/hooks/use-is-mounted";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const THEMES = [
    { value: "light", label: "Lys", icon: Sun },
    { value: "dark", label: "Mørk", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
    { value: "girly", label: "Girly", icon: Venus },
    { value: "hacker", label: "Hacker", icon: Bug },
] as const;

export const ThemeDropdown = () => {
    const { theme, setTheme } = useTheme();
    const mounted = useIsMounted();

    if (!mounted){
        return <div className="h-8 w-12" />;
    }

    const current = THEMES.find((t) => t.value === theme) ?? THEMES[2];
    const CurrentIcon = current.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="group flex h-8 items-center gap-0.5 rounded-md px-1 hover:bg-muted" 
                    aria-label={`Tema: ${current.label}`}>
                    <CurrentIcon className="h-6 w-6 p-0.5" />
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Velg tema</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {THEMES.map(({ value, label, icon: Icon }) => (
                <DropdownMenuItem key={value} onSelect={() => setTheme(value)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                    {theme === value && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};