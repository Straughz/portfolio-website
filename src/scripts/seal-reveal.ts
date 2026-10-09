import engravedUrl from '../assets/identity/nvg-monogram-engraved-woven.svg?url';

const seal = document.querySelector<HTMLElement>('[data-engraved-seal]');

if (seal && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const bounds = seal.getBoundingClientRect();
  // A restored scroll position or a short viewport should start with the complete mark.
  const alreadyVisible = bounds.top < window.innerHeight && bounds.bottom > 0;

  if (!alreadyVisible) {
    let engraving: Promise<SVGSVGElement | null> | undefined;
    let inView = false;
    let played = false;

    const loadEngraving = () => engraving ??= fetch(engravedUrl)
      .then((response) => response.ok ? response.text() : '')
      .then((markup) => {
        const svg = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement;
        return svg instanceof SVGSVGElement ? svg : null;
      })
      .catch(() => null);

    const prepare = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      void loadEngraving();
      prepare.disconnect();
    }, { rootMargin: '400px' });

    const reveal = new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      if (!inView || played) return;
      void loadEngraving().then((svg) => {
        if (!svg || !inView || played || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        played = true;
        seal.dataset.sealPlaying = '';
        seal.replaceChildren(document.importNode(svg, true));
        reveal.disconnect();
        prepare.disconnect();
      });
    }, { threshold: 0.1 });

    prepare.observe(seal);
    reveal.observe(seal);
  }
}
