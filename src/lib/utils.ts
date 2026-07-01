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

const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"];

const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

const toWordsHelper = (n: number): string => {
  if (n === 0) return "";
  if (n < 20) return ones[n] + " ";
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "") + " ";
  if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + toWordsHelper(n % 100);
  if (n < 100000) return toWordsHelper(Math.floor(n / 1000)) + "Thousand " + toWordsHelper(n % 1000);
  if (n < 10000000) return toWordsHelper(Math.floor(n / 100000)) + "Lakh " + toWordsHelper(n % 100000);
  return toWordsHelper(Math.floor(n / 10000000)) + "Crore " + toWordsHelper(n % 10000000);
};

export const toWords = (amount: number): string => {
  if (amount === 0) return "Indian Rupees Zero Only";

  const rupees = Math.floor(amount);
  const paise  = Math.round((amount - rupees) * 100);

  const rupeeWords = toWordsHelper(rupees).trim();
  const paiseWords = paise > 0 ? ` and ${toWordsHelper(paise).trim()} Paise` : "";

  return `${rupeeWords}${paiseWords} Only`;
};