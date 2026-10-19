(function () {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  // hero headline: reveal word by word (keeps the <em> styling)
  const h1 = $('#heroTitle');
  let i = 0;
  (function wrap(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
          const w = document.createElement('span'); w.className = 'w' + (node.tagName === 'EM' ? ' g' : '');
          const s = document.createElement('span'); s.style.setProperty('--i', i++); s.textContent = part;
          w.appendChild(s); frag.appendChild(w);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) wrap(n);
    });
  })(h1);

  // header, progress bar
  const hdr = $('#hdr'), bar = $('#progress');
  function onScroll() {
    hdr.classList.toggle('solid', scrollY > 30);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  const burger = $('#burger'), drawer = $('#drawer');
  function setMenu(open) {
    burger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setMenu(!drawer.classList.contains('open')));
  $$('.drawer a, .nav a, .hdr-cta, a[href^="#"]').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$('.rv').forEach(el => io.observe(el));

  // tap to copy email
  const copy = $('#copyMail'), note = $('#copyNote');
  copy.addEventListener('click', async () => {
    const email = copy.dataset.email;
    try { await navigator.clipboard.writeText(email); note.textContent = 'Copied ✓'; }
    catch (e) { location.href = 'mailto:' + email; }
    setTimeout(() => { note.textContent = 'Tap to copy'; }, 2000);
  });

  // gentle 3D tilt on the hero phones (desktop pointers only)
  const art = $('#heroArt');
  if (art && matchMedia('(hover: hover)').matches) {
    art.addEventListener('pointermove', e => {
      const r = art.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      art.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
    art.addEventListener('pointerleave', () => { art.style.transform = ''; });
    art.style.transition = 'transform .4s ease-out';
  }

  $('#yr').textContent = new Date().getFullYear();
})();
