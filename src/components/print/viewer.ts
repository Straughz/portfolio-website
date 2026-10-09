type Face = { src: string; alt: string; width: number; height: number };
type Piece = {
  title: string;
  kind: 'card' | 'brochure' | 'sticker' | 'sheet' | 'sign';
  faces: Face[];
};

let dialog: HTMLDialogElement | undefined;
let trigger: HTMLAnchorElement | undefined;
let piece: Piece | undefined;
let flipped = false;
let panel = 0;
let inertBefore: Array<[HTMLElement, boolean]> = [];

function faceImage(face: Face): HTMLImageElement {
  const image = document.createElement('img');
  image.src = face.src;
  image.alt = face.alt;
  image.width = face.width;
  image.height = face.height;
  image.decoding = 'async';
  image.className = 'pv-image';
  return image;
}

function faceElement(face: Face, className: string, index: number): HTMLElement {
  const surface = document.createElement('div');
  surface.className = `pv-face ${className}`;
  surface.dataset.faceIndex = String(index);
  surface.append(faceImage(face));
  return surface;
}

function makeObject(model: Piece): HTMLElement {
  const object = document.createElement('div');
  object.className = `pv-object pv-object--${model.kind} pv-tilt`;
  object.style.aspectRatio = `${model.faces[0].width} / ${model.faces[0].height}`;

  if (model.kind === 'card' && model.faces.length > 1) {
    const rotor = document.createElement('div');
    rotor.className = 'pv-card__rotor';
    rotor.append(
      faceElement(model.faces[0], 'pv-card__front', 0),
      faceElement(model.faces[1], 'pv-card__back', 1),
    );
    object.append(rotor);
  } else {
    object.append(faceElement(model.faces[0], 'pv-object__front', 0));
  }
  return object;
}

function makeBrochure(model: Piece): HTMLElement {
  if (model.faces.length === 1) return makeObject(model);

  const booklet = document.createElement('div');
  booklet.className = 'pv-booklet pv-tilt';
  booklet.dataset.panel = String(panel);
  const base = document.createElement('div');
  base.className = 'pv-booklet__base';
  if (model.faces[2]) base.append(faceElement(model.faces[2], 'pv-booklet__inside-right', 2));
  if (model.faces[3]) base.append(faceElement(model.faces[3], 'pv-booklet__back', 3));
  const leaf = document.createElement('div');
  leaf.className = 'pv-booklet__leaf';
  leaf.append(faceElement(model.faces[0], 'pv-booklet__cover', 0));
  if (model.faces[1]) leaf.append(faceElement(model.faces[1], 'pv-booklet__inside-left', 1));
  booklet.append(base, leaf);
  return booklet;
}

function setVisibleFaces(): void {
  if (!dialog || !piece) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const faces = dialog.querySelectorAll<HTMLElement>('.pv-face');
  faces.forEach((face) => {
    const index = Number(face.dataset.faceIndex);
    const visible = reduced || piece?.kind === 'sheet' || piece?.faces.length === 1 ||
      (piece?.kind === 'card' ? index === Number(flipped) :
        panel === 0 ? index === 0 : panel === 1 ? index === 1 || index === 2 : index === 3);
    face.setAttribute('aria-hidden', String(!visible));
  });
}

function button(label: string, action: string): HTMLButtonElement {
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'pv-control';
  control.textContent = label;
  control.dataset.action = action;
  return control;
}

function updateControls(): void {
  if (!dialog || !piece) return;
  const controls = dialog.querySelector<HTMLElement>('.pv-controls');
  const status = dialog.querySelector<HTMLElement>('.pv-status');
  if (!controls || !status) return;
  const focusedAction = dialog.contains(document.activeElement)
    ? (document.activeElement as HTMLElement).dataset.action
    : undefined;
  controls.replaceChildren();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    status.textContent = `All ${piece.faces.length} cleared ${piece.faces.length === 1 ? 'face' : 'faces'} visible`;
    if (focusedAction && focusedAction !== 'close') dialog.querySelector<HTMLButtonElement>('.pv-close')?.focus();
    return;
  }
  if (piece.kind === 'card' && piece.faces.length > 1) {
    controls.append(button('Flip', 'flip'));
    status.textContent = flipped ? 'Back of card' : 'Front of card';
  } else if (piece.kind === 'brochure' && piece.faces.length > 1) {
    if (panel === 0) controls.append(button('Open', 'open'));
    if (panel > 0) controls.append(button('Previous panel', 'previous'));
    if (panel < 2 && panel > 0 && piece.faces.length > 3) controls.append(button('Next panel', 'next'));
    status.textContent = panel === 0 ? 'Cover' : panel === 1 ? 'Inside panels' : 'Back panel';
  } else {
    status.textContent = piece.faces.length > 1 ? `${piece.faces.length} loose sheets` : 'One cleared face';
  }
  if (focusedAction && focusedAction !== 'close') {
    (controls.querySelector<HTMLButtonElement>(`[data-action="${focusedAction}"]`)
      ?? controls.querySelector<HTMLButtonElement>('button')
      ?? dialog.querySelector<HTMLButtonElement>('.pv-close'))?.focus();
  }
}

function updateStage(): void {
  if (!dialog || !piece) return;
  const stage = dialog.querySelector<HTMLElement>('.pv-stage');
  if (!stage) return;
  stage.replaceChildren();
  stage.className = `pv-stage pv-stage--${piece.kind}`;
  if (piece.kind === 'sheet' && piece.faces.length > 1) {
    for (const face of piece.faces) {
      stage.append(makeObject({ ...piece, faces: [face] }));
    }
  } else {
    stage.append(piece.kind === 'brochure' ? makeBrochure(piece) : makeObject(piece));
  }
  updateControls();
  setVisibleFaces();
}

function updateMotion(): void {
  if (!dialog || !piece) return;
  dialog.querySelector('.pv-card__rotor')?.classList.toggle('pv-card__rotor--flipped', flipped);
  const booklet = dialog.querySelector<HTMLElement>('.pv-booklet');
  if (booklet) booklet.dataset.panel = String(panel);
  updateControls();
  setVisibleFaces();
}

function ensureDialog(): HTMLDialogElement {
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.className = 'piece-viewer';
  dialog.setAttribute('aria-labelledby', 'piece-viewer-title');
  dialog.innerHTML = `
    <div class="pv-shell">
      <header class="pv-header">
        <div><p class="pv-kicker">The print drawer</p><h2 id="piece-viewer-title"></h2></div>
        <button class="pv-close" type="button" data-action="close">Close</button>
      </header>
      <div class="pv-stage" aria-label="Print piece"></div>
      <footer class="pv-footer"><div class="pv-controls"></div><p class="pv-status" role="status" aria-live="polite"></p></footer>
    </div>`;
  document.body.append(dialog);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) { dialog?.close(); return; }
    const action = (event.target as Element).closest<HTMLButtonElement>('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'close') dialog?.close();
    if (action === 'flip') flipped = !flipped;
    if (action === 'open') panel = 1;
    if (action === 'next') panel = Math.min(2, panel + 1);
    if (action === 'previous') panel = Math.max(0, panel - 1);
    updateMotion();
  });
  dialog.addEventListener('close', () => {
    for (const [element, wasInert] of inertBefore) element.inert = wasInert;
    inertBefore = [];
    trigger?.focus();
  });
  const stage = dialog.querySelector<HTMLElement>('.pv-stage');
  stage?.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = (event.target as Element).closest<HTMLElement>('.pv-tilt');
    if (!target) return;
    stage.querySelectorAll<HTMLElement>('.pv-tilt').forEach((other) => {
      if (other === target) return;
      other.style.removeProperty('--tilt-x');
      other.style.removeProperty('--tilt-y');
    });
    const bounds = target.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    target.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`);
    target.style.setProperty('--tilt-y', `${(x * 8).toFixed(2)}deg`);
  });
  stage?.addEventListener('pointerleave', () => {
    stage.querySelectorAll<HTMLElement>('.pv-tilt').forEach((target) => {
      target.style.removeProperty('--tilt-x');
      target.style.removeProperty('--tilt-y');
    });
  });
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    updateControls();
    setVisibleFaces();
  });
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
  const modal = ensureDialog();
  const title = modal.querySelector<HTMLElement>('#piece-viewer-title');
  if (title) title.textContent = piece.title;
  updateStage();
  modal.showModal();
  inertBefore = [...document.body.children]
    .filter((child): child is HTMLElement => child instanceof HTMLElement && child !== modal)
    .map((child): [HTMLElement, boolean] => [child, child.inert]);
  for (const [element] of inertBefore) element.inert = true;
  modal.querySelector<HTMLButtonElement>('.pv-close')?.focus();
}
