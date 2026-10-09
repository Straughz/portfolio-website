import {
  contactHref,
  initialScopeForPage,
  scopeSummary,
  setSelectedScope,
} from '../lib/scope-state';
import { SERVICE_LABELS, type ServiceLabel } from '../lib/services';

const section = document.querySelector<HTMLElement>('[data-service-column]');

if (section) {
  const choices = [...section.querySelectorAll<HTMLInputElement>('input[name="scope"]')];
  const summary = section.querySelector<HTMLElement>('#scope-summary');
  const contactLink = section.querySelector<HTMLAnchorElement>('[data-scope-contact-link]');

  function render(labels: readonly ServiceLabel[]) {
    for (const choice of choices) choice.checked = labels.includes(choice.value as ServiceLabel);
    if (summary) summary.textContent = scopeSummary(labels);
    if (contactLink) contactLink.href = contactHref(labels);
  }

  function publishFromChoices() {
    const selected = SERVICE_LABELS.filter((label) =>
      choices.some((choice) => choice.value === label && choice.checked),
    );
    const valid = setSelectedScope(selected);
    if (valid) render(valid);
  }

  for (const choice of choices) choice.addEventListener('change', publishFromChoices);

  const initial = setSelectedScope(initialScopeForPage());
  if (initial) render(initial);
}
