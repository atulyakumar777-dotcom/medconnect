import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const SPECIALTIES = [
  { name: "General Physician", icon: "🩺", slug: "general-physician" },
  { name: "Cardiologist", icon: "❤️", slug: "cardiologist" },
  { name: "Dermatologist", icon: "🧴", slug: "dermatologist" },
  { name: "Pediatrician", icon: "👶", slug: "pediatrician" },
  { name: "Neurologist", icon: "🧠", slug: "neurologist" },
  { name: "Orthopedic", icon: "🦴", slug: "orthopedic" },
  { name: "Gynecologist", icon: "👩‍⚕️", slug: "gynecologist" },
  { name: "ENT Specialist", icon: "👂", slug: "ent-specialist" },
  { name: "Ophthalmologist", icon: "👁️", slug: "ophthalmologist" },
  { name: "Psychiatrist", icon: "🧘", slug: "psychiatrist" },
] as const;

export function getSpecialtyBySlug(slug: string) {
  return SPECIALTIES.find((s) => s.slug === slug);
}

export function getDayName(date: Date): string {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[date.getDay()];
}

export function generateTimeSlots(start: string, end: string, intervalMinutes: number = 30): string[] {
  const slots: string[] = [];
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  let current = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  while (current < endMinutes) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    current += intervalMinutes;
  }
  return slots;
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}
