const seal = document.querySelector<HTMLElement>('[data-engraved-seal]');

if (seal && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      observer.disconnect();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      seal.dataset.sealPlaying = '';
    },
    { threshold: 0.25 },
  );

  observer.observe(seal);
}
