export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim() // Remove leading/trailing whitespace
    .replace(/[\s\W-]+/g, "-") // Replace spaces and special chars with '-'
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing '-'
}

export function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
