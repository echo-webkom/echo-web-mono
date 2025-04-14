import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...classes: Array<ClassValue>) => twMerge(clsx(classes));