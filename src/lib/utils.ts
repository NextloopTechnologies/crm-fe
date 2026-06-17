import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const  formatDate = (value: string) => {
  if (!value) return "";

  const [date, time] = value.split("T");
  const [year, month, day] = date.split("-");

  return `${day}-${month}-${year} ${time}`;
};

export const parseDateOnly = (dateTime: string): string => {
  return dateTime.split(" ")[0];
};
