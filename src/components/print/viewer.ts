type Face = { src: string; alt: string; width: number; height: number };
type Piece = {
  title: string;
  spec?: string;
  kind: 'card' | 'brochure' | 'sticker' | 'sheet' | 'sign';
  faces: Face[];
};
type Drag = {
  pointerId: number;
  target: HTMLElement;
  startX: number;
  startY: number;
  action: -1 | 0 | 1;
  page?: HTMLElement;
  startAngle?: number;
  direction?: number;
  moved: boolean;
  lastX: number;
  lastTime: number;
  velocity: number;
};

let dialog: HTMLDialogElement | undefined;
let trigger: HTMLAnchorElement | undefined;
let piece: Piece | undefined;
let flipped = false;
let panel = 0;
let drag: Drag | undefined;
let suppressClick = false;
let sheetDepth = 1;
let inertBefore: Array<[HTMLElement, boolean]> = [];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function faceElement(face: Face, className: string, index: number): HTMLElement {
  const surface = document.createElement('div');
  surface.className = `pv-face ${className}`;
  surface.dataset.faceIndex = String(index);
  const image = document.createElement('img');
  image.src = face.src;
  image.alt = face.alt;
  image.width = face.width;
  image.height = face.height;
  image.decoding = 'async';
  image.className = 'pv-image';
  image.draggable = false;
  const gloss = document.createElement('span');
  gloss.className = 'pv-gloss';
  gloss.setAttribute('aria-hidden', 'true');
  surface.append(image, gloss);
  return surface;
}

function makeObject(model: Piece, faceIndex = 0): HTMLElement {
  const object = document.createElement('div');
  object.className = `pv-object pv-object--${model.kind} pv-tilt`;
  object.style.aspectRatio = `${model.faces[faceIndex].width} / ${model.faces[faceIndex].height}`;
  object.style.setProperty('--piece-ratio', String(model.faces[faceIndex].width / model.faces[faceIndex].height));
  if (model.kind === 'card' && model.faces.length > 1) {
    object.classList.add('pv-card');
    object.tabIndex = 0;
    object.setAttribute('role', 'group');
    object.setAttribute('aria-label', 'Card. Drag or click to turn. Use Left or Right arrow, Space, or Enter.');
    const rotor = document.createElement('div');
    rotor.className = 'pv-card__rotor';
    rotor.append(
      faceElement(model.faces[0], 'pv-card__front', 0),
      faceElement(model.faces[1], 'pv-card__back', 1),
    );
    object.append(rotor);
  } else {
    if (model.faces.length > 1) {
      object.tabIndex = 0;
      object.setAttribute('role', 'group');
      object.setAttribute('aria-label', `Sheet ${faceIndex + 1}. Click or press Enter to bring it to the front.`);
    }
    object.append(faceElement(model.faces[faceIndex], 'pv-object__front', faceIndex));
  }
  return object;
}

function makeBrochure(model: Piece): HTMLElement {
  if (model.faces.length < 4) return makeObject(model);
  const booklet = document.createElement('div');
  booklet.className = 'pv-booklet pv-tilt';
  booklet.style.aspectRatio = `${model.faces[0].width * 2} / ${model.faces[0].height}`;
  booklet.style.setProperty('--piece-ratio', String(model.faces[0].width / model.faces[0].height));
  booklet.dataset.panel = String(panel);
  booklet.tabIndex = 0;
  booklet.setAttribute('role', 'group');
  booklet.setAttribute('aria-label', 'Brochure. Click or drag the right page forward or the left page back. Use Left and Right arrows, Home, or End.');
  const base = document.createElement('div');
  base.className = 'pv-booklet__base';
  base.append(
    faceElement(model.faces[2], 'pv-booklet__inside-right', 2),
    faceElement(model.faces[3], 'pv-booklet__back', 3),
  );
  const leaf = document.createElement('div');
  leaf.className = 'pv-booklet__leaf';
  leaf.append(
    faceElement(model.faces[0], 'pv-booklet__cover', 0),
    faceElement(model.faces[1], 'pv-booklet__inside-left', 1),
  );
  booklet.append(base, leaf);
  return booklet;
}

function setVisibleFaces(): void {
  if (!dialog || !piece) return;
  dialog.querySelectorAll<HTMLElement>('.pv-face').forEach((face) => {
    const index = Number(face.dataset.faceIndex);
    const visible = piece?.kind === 'card' && piece.faces.length > 1
      ? index === Number(flipped)
      : piece?.kind === 'brochure' && piece.faces.length >= 4
        ? panel === 0 ? index === 0 : panel === 1 ? index === 1 || index === 2 : index === 3
        : true;
    face.setAttribute('aria-hidden', String(!visible));
  });
}

function updateState(): void {
  if (!dialog || !piece) return;
  const rotor = dialog.querySelector<HTMLElement>('.pv-card__rotor');
  if (rotor) rotor.style.setProperty('--rotation', flipped ? '180deg' : '0deg');
  const booklet = dialog.querySelector<HTMLElement>('.pv-booklet');
  if (booklet) booklet.dataset.panel = String(panel);
  const status = dialog.querySelector<HTMLElement>('.pv-status');
  if (status) {
    status.textContent = piece.kind === 'card' && piece.faces.length > 1
      ? flipped ? 'Back of card' : 'Front of card'
      : piece.kind === 'brochure' && piece.faces.length >= 4
        ? ['Cover', 'Inside panels', 'Back panel'][panel]
        : piece.faces.length > 1 ? `${piece.faces.length} loose sheets` : 'One cleared face';
  }
  setVisibleFaces();
}

function updateStage(): void {
  if (!dialog || !piece) return;
  const stage = dialog.querySelector<HTMLElement>('.pv-stage');
  if (!stage) return;
  stage.replaceChildren();
  stage.className = `pv-stage pv-stage--${piece.kind}`;
  if ((piece.kind === 'sheet' || piece.kind === 'sticker' || piece.kind === 'sign') && piece.faces.length > 1) {
    piece.faces.forEach((_, index) => stage.append(makeObject(piece!, index)));
  } else {
    stage.append(piece.kind === 'brochure' ? makeBrochure(piece) : makeObject(piece));
  }
  const hint = dialog.querySelector<HTMLElement>('.pv-hint');
  if (hint) hint.textContent = piece.kind === 'card' && piece.faces.length > 1
    ? 'Drag or click the card to turn it'
    : piece.kind === 'brochure' && piece.faces.length >= 4
      ? 'Click or drag a page to turn it'
      : piece.faces.length > 1 ? 'Click a sheet to bring it forward' : 'Move the pointer to tilt the piece';
  updateState();
}

function turnCard(): void {
  flipped = !flipped;
  updateState();
}

function turnPage(direction: number): void {
  panel = Math.max(0, Math.min(2, panel + direction));
  updateState();
}

function pageAction(booklet: HTMLElement, clientX: number): -1 | 0 | 1 {
  const bounds = booklet.getBoundingClientRect();
  const right = clientX >= bounds.left + bounds.width / 2;
  if (right && panel < 2) return 1;
  if (!right && panel > 0) return -1;
  return 0;
}

function clearTilt(stage: HTMLElement): void {
  stage.querySelectorAll<HTMLElement>('.pv-tilt').forEach((target) => {
    target.style.removeProperty('--tilt-x');
    target.style.removeProperty('--tilt-y');
    target.style.removeProperty('--sheen-x');
    target.style.removeProperty('--sheen-y');
  });
}

function ensureDialog(): HTMLDialogElement {
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.className = 'piece-viewer';
  dialog.setAttribute('aria-labelledby', 'piece-viewer-title');
  dialog.innerHTML = `
    <div class="pv-shell">
      <header class="pv-header">
        <div><p class="pv-kicker">The print drawer</p><h2 id="piece-viewer-title"></h2><p class="pv-spec"></p></div>
        <button class="pv-close" type="button">Close</button>
      </header>
      <div class="pv-stage" aria-label="Print piece"></div>
      <footer class="pv-footer"><p class="pv-hint"></p><p class="pv-status" aria-live="polite"></p></footer>
    </div>`;
  document.body.append(dialog);
  dialog.querySelector('.pv-close')?.addEventListener('click', () => dialog?.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) { dialog?.close(); return; }
    if (suppressClick) { suppressClick = false; return; }
    const target = event.target as Element;
    if (target.closest('.pv-card')) { turnCard(); return; }
    const booklet = target.closest<HTMLElement>('.pv-booklet');
    if (booklet) { turnPage(pageAction(booklet, event.clientX)); return; }
    const sheet = target.closest<HTMLElement>('.pv-object');
    if (sheet && piece && piece.faces.length > 1) sheet.style.zIndex = String(++sheetDepth);
  });
  dialog.addEventListener('close', () => {
    for (const [element, wasInert] of inertBefore) element.inert = wasInert;
    inertBefore = [];
    drag = undefined;
    trigger?.focus();
  });
  const stage = dialog.querySelector<HTMLElement>('.pv-stage')!;
  stage.addEventListener('keydown', (event) => {
    const target = event.target as Element;
    if (target.closest('.pv-card') && ['ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      turnCard();
    } else if (target.closest('.pv-booklet')) {
      if (event.key === 'ArrowRight') { event.preventDefault(); turnPage(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); turnPage(-1); }
      if (event.key === 'Home') { event.preventDefault(); panel = 0; updateState(); }
      if (event.key === 'End') { event.preventDefault(); panel = 2; updateState(); }
    } else if (target.closest('.pv-object') && [' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      (target.closest<HTMLElement>('.pv-object'))!.style.zIndex = String(++sheetDepth);
    }
  });
  stage.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const target = (event.target as Element).closest<HTMLElement>('.pv-card, .pv-booklet');
    if (!target) return;
    const action = target.classList.contains('pv-booklet') ? pageAction(target, event.clientX) : 1;
    if (action === 0) return;
    const page = target.classList.contains('pv-booklet')
      ? target.querySelector<HTMLElement>(panel === 0 || panel === 1 && action < 0 ? '.pv-booklet__leaf' : '.pv-booklet__base')
      : undefined;
    drag = {
      pointerId: event.pointerId, target, startX: event.clientX, startY: event.clientY,
      action, page: page ?? undefined,
      startAngle: page?.classList.contains('pv-booklet__leaf')
        ? panel === 0 ? 0 : -180
        : panel === 2 ? -180 : 0,
      direction: action > 0 ? -1 : 1,
      moved: false,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
    };
    target.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', (event) => {
    if (drag && event.pointerId === drag.pointerId) {
      const dx = event.clientX - drag.startX;
      const elapsed = event.timeStamp - drag.lastTime;
      if (elapsed > 0) drag.velocity = (event.clientX - drag.lastX) / elapsed;
      drag.lastX = event.clientX;
      drag.lastTime = event.timeStamp;
      if (Math.abs(dx) > 6 || Math.abs(event.clientY - drag.startY) > 6) drag.moved = true;
      if (!drag.moved || reducedMotion.matches) return;
      if (drag.target.classList.contains('pv-card')) {
        const width = drag.target.getBoundingClientRect().width;
        const delta = Math.max(-180, Math.min(180, dx / width * 240));
        const rotor = drag.target.querySelector<HTMLElement>('.pv-card__rotor');
        rotor?.classList.add('pv-dragging');
        rotor?.style.setProperty('--rotation', `${(flipped ? 180 : 0) + delta}deg`);
      } else if (drag.page) {
        const width = drag.target.getBoundingClientRect().width / 2;
        const progress = Math.max(0, Math.min(180, Math.abs(dx) / width * 180));
        drag.page.classList.add('pv-dragging');
        drag.page.style.transform = `rotateY(${(drag.startAngle ?? 0) + (drag.direction ?? -1) * progress}deg)`;
      }
      return;
    }
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    const target = (event.target as Element).closest<HTMLElement>('.pv-tilt');
    if (!target) return;
    clearTilt(stage);
    const bounds = target.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    target.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`);
    target.style.setProperty('--tilt-y', `${(x * 8).toFixed(2)}deg`);
    target.style.setProperty('--sheen-x', `${(50 - x * 70).toFixed(1)}%`);
    target.style.setProperty('--sheen-y', `${(50 - y * 70).toFixed(1)}%`);
  });
  const finishDrag = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const current = drag;
    drag = undefined;
    current.target.releasePointerCapture(event.pointerId);
    const dx = event.clientX - current.startX;
    current.target.querySelector('.pv-card__rotor')?.classList.remove('pv-dragging');
    current.page?.classList.remove('pv-dragging');
    current.page?.style.removeProperty('transform');
    if (!current.moved) return;
    suppressClick = true;
    window.setTimeout(() => { suppressClick = false; }, 0);
    const flick = Math.abs(current.velocity) > 0.45 && Math.abs(dx) > 12;
    const tap = Math.abs(dx) < 14;
    if (current.target.classList.contains('pv-card')) {
      const width = current.target.getBoundingClientRect().width;
      if (tap || flick || Math.abs(dx) >= width * 0.25) flipped = !flipped;
    } else if (tap || (Math.sign(dx) === current.direction && (flick || Math.abs(dx) > 32))) {
      panel = Math.max(0, Math.min(2, panel + current.action));
    }
    updateState();
  };
  stage.addEventListener('pointerup', finishDrag);
  stage.addEventListener('pointercancel', finishDrag);
  stage.addEventListener('pointerleave', () => { if (!drag) clearTilt(stage); });
  reducedMotion.addEventListener('change', () => { clearTilt(stage); updateState(); });
  return dialog;
}

export function openPiece(link: HTMLAnchorElement): void {
  const encoded = link.dataset.viewer;
  if (!encoded) return;
  const parsed = JSON.parse(encoded) as Piece;
  if (!parsed.faces.length) return;
  piece = parsed;
  trigger = link;
  flipped = false;
  panel = 0;
  sheetDepth = 1;
  const modal = ensureDialog();
  const title = modal.querySelector<HTMLElement>('#piece-viewer-title');
  if (title) title.textContent = piece.title;
  const specLine = modal.querySelector<HTMLElement>('.pv-spec');
  if (specLine) specLine.textContent = piece.spec ?? '';
  updateStage();
  modal.showModal();
  inertBefore = [...document.body.children]
    .filter((child): child is HTMLElement => child instanceof HTMLElement && child !== modal)
    .map((child): [HTMLElement, boolean] => [child, child.inert]);
  for (const [element] of inertBefore) element.inert = true;
  (modal.querySelector<HTMLElement>('.pv-card, .pv-booklet, .pv-object[tabindex]') ?? modal.querySelector<HTMLButtonElement>('.pv-close'))?.focus();
}
