export const SERVICE_LABELS = [
  'Brand and print',
  'Website',
  'Customer apps',
  'Internal software',
  'Care',
] as const;

export type ServiceLabel = (typeof SERVICE_LABELS)[number];

export const EMPTY_SCOPE_LABEL = 'scope to discuss';

export function isServiceLabel(value: unknown): value is ServiceLabel {
  return typeof value === 'string' && SERVICE_LABELS.some((label) => label === value);
}

export function validateScope(values: readonly unknown[]): ServiceLabel[] | null {
  if (!values.every(isServiceLabel)) return null;
  const selected = new Set(values);
  return SERVICE_LABELS.filter((label) => selected.has(label));
}
