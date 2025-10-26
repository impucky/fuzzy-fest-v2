export function dateString(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

export function formatFestivalDates(start: string, end: string) {
  const year = new Date(start).getFullYear();
  const startStr = dateString(start);
  const endStr = dateString(end);

  // Single day: July 14
  if (start === end) return `${startStr}, ${year}`;
  // Same month: July 14 - 16
  if (new Date(start).getMonth() === new Date(end).getMonth())
    return `${startStr} - ${endStr.split(" ")[1]}, ${year}`;
  // Different month: July 30 - August 1
  return `${startStr} - ${endStr}, ${year}`;
}

export function formatProvisionalDate(date: string) {
  return `~ ${new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })} (TBA)`;
}

export function todayOutOf365(date: Date) {
  return (
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) /
    24 /
    60 /
    60 /
    1000
  );
}
