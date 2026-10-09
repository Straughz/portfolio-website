import { getCollection, type CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'work'>;
export type PrintEntry = CollectionEntry<'print'>;

const byOrder = <T extends { data: { order: number } }>(entries: T[]): T[] =>
  entries.sort((a, b) => a.data.order - b.data.order);

export async function getWorkEntries(): Promise<WorkEntry[]> {
  return byOrder(await getCollection('work'));
}

export async function getClientWorkEntries(): Promise<WorkEntry[]> {
  return (await getWorkEntries()).filter((entry) => entry.data.kind === 'Client work');
}

export async function getStudioProductEntries(): Promise<WorkEntry[]> {
  return (await getWorkEntries()).filter((entry) => entry.data.kind === 'Studio product');
}

export async function getPrintEntries(): Promise<PrintEntry[]> {
  return byOrder(await getCollection('print'));
}

export function workHref(entry: WorkEntry): string {
  return entry.data.publicUrl ?? (entry.data.kind === 'Client work'
    ? '/projects/web-design'
    : '/projects/prospect');
}
