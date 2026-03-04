// lib/utils.js
export function formatDate(dateString) {
  // from this  2026-02-10 to this to Feb 10, 2026
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}