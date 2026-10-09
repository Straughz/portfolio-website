import { SERVICE_LABELS, validateScope, type ServiceLabel } from './services';

/**
 * Home form contract for Task 9:
 * Listen on window for SCOPE_CHANGE_EVENT (`nvg:scope-change`).
 * CustomEvent.detail is { labels: ServiceLabel[], summary: string }, with labels
 * deduplicated and ordered exactly as SERVICE_LABELS. An empty selection sends
 * { labels: [], summary: 'Scope to discuss' }; it never blocks submission.
 * Call getSelectedScope() when mounting in case the initial event already fired.
 * On /contact, call initialScopeForPage() to read the validated URL query.
 * ServiceColumn owns #scope-summary; give the form's own live line a distinct ID.
 */
export const SCOPE_CHANGE_EVENT = 'nvg:scope-change';
export const SCOPE_QUERY_PARAM = 'scope';
export const EMPTY_SCOPE_SUMMARY = 'Scope to discuss';
const STORAGE_KEY = 'nvg:scope:v1';

export type ScopeChangeDetail = {
  labels: ServiceLabel[];
  summary: string;
};

let selectedScope: ServiceLabel[] = [];

export function scopeSummary(labels: readonly ServiceLabel[]): string {
  return labels.length ? `Selected scope: ${labels.join(', ')}` : EMPTY_SCOPE_SUMMARY;
}

export function getSelectedScope(): ServiceLabel[] {
  return [...selectedScope];
}

export function readScopeFromQuery(search: string): ServiceLabel[] | null {
  const params = new URLSearchParams(search);
  if (!params.has(SCOPE_QUERY_PARAM)) return null;
  // Reject the whole query if any value is outside the shared service allowlist.
  return validateScope(params.getAll(SCOPE_QUERY_PARAM)) ?? [];
}

export function readStoredScope(): ServiceLabel[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (validateScope(parsed) ?? []) : [];
  } catch {
    // Storage may be disabled, or its value may be malformed.
    return [];
  }
}

export function initialScopeForPage(
  search = window.location.search,
  pathname = window.location.pathname,
): ServiceLabel[] {
  const fromQuery = readScopeFromQuery(search);
  if (fromQuery !== null) return fromQuery;
  // A direct contact visit is a fresh inquiry, even if this tab held home ticks.
  if (pathname.replace(/\/$/, '') === '/contact') return [];
  return readStoredScope();
}

export function setSelectedScope(values: readonly unknown[]): ServiceLabel[] | null {
  const valid = validateScope(values);
  if (valid === null) return null;
  selectedScope = valid;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
  } catch {
    // The URL carries the same selection when storage is unavailable.
  }

  window.dispatchEvent(
    new CustomEvent<ScopeChangeDetail>(SCOPE_CHANGE_EVENT, {
      detail: { labels: [...valid], summary: scopeSummary(valid) },
    }),
  );
  return [...valid];
}

export function contactHref(labels: readonly ServiceLabel[]): string {
  const params = new URLSearchParams();
  for (const label of SERVICE_LABELS) {
    if (labels.includes(label)) params.append(SCOPE_QUERY_PARAM, label);
  }
  const query = params.toString();
  return query ? `/contact?${query}` : '/contact';
}
