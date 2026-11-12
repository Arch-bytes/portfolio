// Intro, smooth scroll, reveals, scramble, project morphs, marquee, cursor, clock. Boots the 3D scene.
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const $$ = (s) => [...document.querySelectorAll(s)];

/* ---------- Split headings into words ---------- */
$$('[data-split]').forEach((el) => {
  let i = 0;
  el.setAttribute('aria-label', el.textContent.trim());
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
          const inner = document.createElement('span'); inner.textContent = part; inner.style.setProperty('--i', i++);
          w.append(inner); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) { n.setAttribute('aria-hidden', 'true'); walk(n); }
    });
  };
  walk(el);
});

/* ---------- Text scramble for mono labels ---------- */
const GLYPHS = '01#%&*+=<>/\\_ABCDEFGHJKLMNPQRSTUVWXYZ';
function scramble(el) {
  if (reduced || el.dataset.done) return;
  el.dataset.done = '1';
  const final = el.textContent;
  const start = performance.now(), dur = 700 + final.length * 12;
  (function frame(now) {
    const f = Math.min(1, (now - start) / dur);
    const solved = Math.floor(final.length * f);
    el.textContent = final.slice(0, solved) + [...final.slice(solved)].map((c) => (c === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
    if (f < 1) requestAnimationFrame(frame); else el.textContent = final;
  })(start);
}
$$('[data-scramble]').forEach((el) => el.setAttribute('aria-label', el.textContent));

/* ---------- Reveal observer ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.hasAttribute('data-scramble')) scramble(e.target);
    io.unobserve(e.target);
  });
}, { threshold: 0.2 });
$$('[data-split], [data-reveal], [data-scramble]').forEach((el) => io.observe(el));

/* ---------- Scroll progress for the scene ---------- */
const stages = $$('[data-stage]');
function progress() {
  const mid = scrollY + innerHeight * 0.5;
  const marks = stages.map((el) => ({ y: el.offsetTop + Math.min(el.offsetHeight, innerHeight) * 0.5, v: Number(el.dataset.stage) }));
  if (mid <= marks[0].y) return marks[0].v;
  for (let i = 1; i < marks.length; i++) {
    if (mid <= marks[i].y) { const a = marks[i - 1], b = marks[i]; return a.v + ((mid - a.y) / (b.y - a.y)) * (b.v - a.v); }
  }
  return marks[marks.length - 1].v;
}

/* ---------- Scene + intro ---------- */
const playIntro = root.classList.contains('intro-playing');
let scene = null;
const sceneReady = import('./scene.js')
  .then(({ startScene }) => { scene = startScene(document.getElementById('scene'), progress, { intro: playIntro }); if (!scene) root.classList.add('no-webgl'); })
  .catch(() => root.classList.add('no-webgl'));

function endIntro() {
  if (!root.classList.contains('intro-playing')) return;
  document.querySelector('.intro').classList.add('done');
  root.classList.remove('intro-playing');
  try { sessionStorage.setItem('intro-seen', '1'); } catch {}
  scene?.burst();
}
if (playIntro) {
  const count = document.querySelector('.intro-count');
  const label = document.querySelector('.intro-label');
  const labels = ['Loading raw data', 'Dropping duplicates', 'Filling gaps', 'Shaping the table', 'Ready'];
  document.querySelector('.intro-skip').addEventListener('click', endIntro);
  setTimeout(endIntro, 6000); // never trap the page behind a slow CDN
  addEventListener('keydown', endIntro, { once: true });
  const start = performance.now(), dur = 1900;
  (function frame(now) {
    const f = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - f, 3);
    count.textContent = String(Math.round(eased * 100)).padStart(3, '0');
    label.textContent = labels[Math.min(labels.length - 1, Math.floor(eased * labels.length))];
    if (f < 1) requestAnimationFrame(frame);
    else sceneReady.then(() => setTimeout(endIntro, 250));
  })(start);
} else {
  sceneReady.then(() => scene?.burst());
}

/* ---------- Smooth scroll + marquee skew ---------- */
const track = document.querySelector('.marquee-track');
let velocity = 0, lastY = scrollY;
if (!reduced) {
  import('https://cdn.jsdelivr.net/npm/lenis@1.1.13/+esm')
    .then(({ default: Lenis }) => {
      const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
      root.style.scrollBehavior = 'auto';
      $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.6 });
        history.replaceState(null, '', a.getAttribute('href'));
      }));
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    })
    .catch(() => {});
  (function skew() {
    const y = scrollY;
    velocity += ((y - lastY) - velocity) * 0.12;
    lastY = y;
    if (track) track.style.setProperty('--skew', `${Math.max(-12, Math.min(12, velocity * -0.25)).toFixed(2)}deg`);
    requestAnimationFrame(skew);
  })();
}

/* ---------- Project rows reshape the field ---------- */
const projects = $$('.project[data-shape]');
function activate(row) {
  projects.forEach((p) => p.classList.toggle('is-active', p === row));
  scene?.setFocus(row ? row.dataset.shape : null);
}
const list = document.querySelector('.projects');
if (fine) {
  projects.forEach((row) => row.addEventListener('pointerenter', () => activate(row)));
  list.addEventListener('pointerleave', () => activate(null));
} else {
  const centre = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) activate(e.target); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  projects.forEach((row) => centre.observe(row));
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) activate(null); }).observe(list);
}
projects.forEach((row) => {
  row.addEventListener('focusin', () => activate(row));
  row.addEventListener('focusout', (e) => { if (!list.contains(e.relatedTarget)) activate(null); });
});

/* ---------- Email pulses the sphere ---------- */
const mail = document.querySelector('.contact-mail');
mail.addEventListener('pointerenter', () => scene?.pulse(true));
mail.addEventListener('pointerleave', () => scene?.pulse(false));

/* ---------- Cursor + magnetic ---------- */
if (fine && !reduced) {
  const dot = document.querySelector('.cursor');
  const label = dot.querySelector('.cursor-label');
  root.classList.add('has-cursor');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; });
  (function loop() { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; dot.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); })();
  $$('a, button').forEach((a) => {
    const text = a.closest('.project') ? 'Open' : a.classList.contains('contact-mail') ? 'Write' : '';
    a.addEventListener('pointerenter', () => { dot.classList.add('is-big'); label.textContent = text; dot.classList.toggle('has-label', !!text); });
    a.addEventListener('pointerleave', () => { dot.classList.remove('is-big', 'has-label'); label.textContent = ''; });
  });
  $$('.magnetic').forEach((m) => {
    m.style.transition = 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), color 300ms';
    m.addEventListener('pointermove', (e) => {
      const r = m.getBoundingClientRect();
      m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.08}px, ${(e.clientY - r.top - r.height / 2) * 0.15}px)`;
    });
    m.addEventListener('pointerleave', () => { m.style.transform = ''; });
  });
}

/* ---------- Live clock (Vasai, IST) ---------- */
const clock = document.querySelector('[data-clock]');
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
const tickClock = () => { clock.textContent = fmt.format(new Date()); };
tickClock();
setInterval(tickClock, 1000);

/* ---------- Theme switch with ink spread ---------- */
const themeBtn = document.querySelector('.theme-btn');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function syncThemeUI() {
  const paper = root.dataset.theme === 'paper';
  themeBtn.setAttribute('aria-pressed', String(paper));
  themeBtn.setAttribute('aria-label', paper ? 'Switch to dark theme' : 'Switch to light theme');
  themeMeta.setAttribute('content', paper ? '#ece6db' : '#0e0d0c');
}
function setTheme(next) {
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  syncThemeUI();
  scene?.setTheme();
}
syncThemeUI();
themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'paper' ? 'night' : 'paper';
  const r = themeBtn.getBoundingClientRect();
  root.style.setProperty('--ink-x', `${r.left + r.width / 2}px`);
  root.style.setProperty('--ink-y', `${r.top + r.height / 2}px`);
  if (reduced) { setTheme(next); return; }
  if (document.startViewTransition) {
    document.startViewTransition(() => setTheme(next));
    return;
  }
  // fallback: grow a blot in the new background colour, then swap underneath it
  const ink = document.querySelector('.ink');
  ink.style.setProperty('--ink-to', next === 'paper' ? '#ece6db' : '#0e0d0c');
  ink.classList.remove('go'); void ink.offsetWidth; ink.classList.add('go');
  ink.addEventListener('animationend', () => {
    setTheme(next);
    ink.classList.remove('go');
  }, { once: true });
});
