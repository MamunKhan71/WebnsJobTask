export type DueStatus =
  | { readonly kind: "none" }
  | { readonly kind: "overdue"; readonly label: string }
  | { readonly kind: "today"; readonly label: string }
  | { readonly kind: "upcoming"; readonly label: string }
  | { readonly kind: "past"; readonly label: string }; 

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatShortDate(isoDate: string, now: Date = new Date()): string {
  const date = new Date(`${isoDate}T00:00:00`);
  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export function getDueStatus(
  dueDate: string | null,
  isDone: boolean,
  now: Date = new Date(),
): DueStatus {
  if (dueDate === null) {
    return { kind: "none" };
  }
  const shortDate = formatShortDate(dueDate, now);
  if (isDone) {
    return { kind: "past", label: shortDate };
  }
  const due = new Date(`${dueDate}T00:00:00`).getTime();
  const today = startOfDay(now);
  const dayDiff = Math.round((due - today) / DAY_MS);

  if (dayDiff < 0) {
    const days = Math.abs(dayDiff);
    return { kind: "overdue", label: days === 1 ? "1 day over" : `${days} days over` };
  }
  if (dayDiff === 0) {
    return { kind: "today", label: "Due today" };
  }
  return { kind: "upcoming", label: shortDate };
}

export function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter((part) => part.length > 0);
  const first = parts[0]?.charAt(0) ?? "?";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? "") : "";
  return (first + last).toUpperCase();
}
