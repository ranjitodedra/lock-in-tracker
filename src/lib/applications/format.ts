export const EMPTY_VALUE = "—";

export function formatDate(value: string | null | undefined): string {
  if (!value) return EMPTY_VALUE;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return EMPTY_VALUE;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatText(value: string | null | undefined): string {
  if (!value?.trim()) return EMPTY_VALUE;
  return value;
}

export function formatList(values: string[] | null | undefined): string {
  if (!values?.length) return EMPTY_VALUE;
  return values.join(", ");
}

export function formatBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return EMPTY_VALUE;
  return value ? "Yes" : "No";
}
