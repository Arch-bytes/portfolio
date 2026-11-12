// One particle field. Scroll shapes: raw scatter → clean table → flowing stream → served sphere.
// Hovering a project morphs the field into that project's own shape.
import * as THREE from 'three';

export const SHAPES = ['formata', 'personalapi', 'cropchain', 'trip', 'bullbot'];

const vert = /* glsl */ `
  attribute vec3 aScatter; attribute vec3 aGrid; attribute vec3 aStream; attribute vec3 aSphere;
  attribute vec3 aS0; attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3; attribute vec3 aS4;
  attribute float aBad; attribute float aSeed;
  uniform float uProgress, uTime, uPixel, uIntro, uPulse, uRepel, uRippleT;
  uniform float uW[5];
  uniform vec2 uMouse, uRippleO;
  uniform float uAspect;
  uniform vec3 uEmber, uAmber, uInk, uTeal;
  varying vec3 vColor; varying float vAlpha;

  vec3 stage(float p) {
    vec3 a = mix(aScatter, aGrid, smoothstep(0.0, 1.0, clamp(p, 0.0, 1.0)));
    vec3 b = mix(a, aStream, smoothstep(0.0, 1.0, clamp(p - 1.0, 0.0, 1.0)));
    return mix(b, aSphere, smoothstep(0.0, 1.0, clamp(p - 2.0, 0.0, 1.0)));
  }
  vec3 flow(vec3 p, float t) {
    return vec3(
      sin(p.y * 0.9 + t * 0.7) + cos(p.z * 1.1 + t * 0.4),
      sin(p.z * 0.8 + t * 0.5) + cos(p.x * 0.7 - t * 0.6),
      sin(p.x * 1.0 - t * 0.3) + cos(p.y * 0.6 + t * 0.8)
    );
  }
  vec3 palette(float t) {
    vec3 c = mix(uEmber, uAmber, smoothstep(0.0, 0.25, t));
    c = mix(c, uInk, smoothstep(0.25, 0.55, t));
    return mix(c, uTeal, smoothstep(0.7, 1.0, t));
  }

  void main() {
    vec3 pos = stage(uProgress);
    float wSum = uW[0] + uW[1] + uW[2] + uW[3] + uW[4];
    float wc = min(wSum, 1.0);
    if (wSum > 0.001) {
      vec3 f = (aS0 * uW[0] + aS1 * uW[1] + aS2 * uW[2] + aS3 * uW[3] + aS4 * uW[4]) / wSum;
      pos = mix(pos, f, smoothstep(0.0, 1.0, wc));
    }
    float raw = 1.0 - smoothstep(0.0, 1.0, uProgress);
    pos += flow(pos * 0.35 + aSeed * 3.0, uTime * 0.6) * (0.04 + raw * 0.18) * (1.0 - wc * 0.8);
    float streamW = smoothstep(1.0, 2.0, uProgress) * (1.0 - smoothstep(2.0, 3.0, uProgress)) * (1.0 - wc);
    pos.x += streamW * (fract(aSeed + uTime * 0.05) - 0.5) * 1.4;
    float drop = smoothstep(0.35, 1.0, uProgress) * aBad * (1.0 - wc);
    pos.y -= drop * (3.0 + aSeed * 4.0);
    pos *= 1.0 + uPulse * 0.12 * sin(uTime * 3.0 + aSeed * 6.0);
    float e = 1.0 - pow(1.0 - uIntro, 4.0);
    pos *= e;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
    float push = smoothstep(0.35, 0.0, length(d)) * uRepel * 0.22;
    vec2 rd = (ndc - uRippleO) * vec2(uAspect, 1.0);
    float ring = exp(-pow((length(rd) - uRippleT * 1.6) * 7.0, 2.0)) * max(0.0, 1.0 - uRippleT) * 0.18;
    vec2 off = normalize(d + 1e-5) * push + normalize(rd + 1e-5) * ring;
    gl_Position.xy += off / vec2(uAspect, 1.0) * gl_Position.w;

    float depth = clamp((-mv.z - 4.0) / 12.0, 0.0, 1.0);
    gl_PointSize = uPixel * (4.2 + aBad * 3.0 + ring * 22.0) * (10.0 / -mv.z);
    float hue = fract(aSeed * 0.35 + (pos.x + 7.0) / 22.0 + depth * 0.35);
    vColor = mix(palette(hue), uEmber, aBad) + ring * 4.0;
    vAlpha = (1.0 - drop * 0.95) * mix(1.0, 0.35, depth) * smoothstep(0.0, 0.2, uIntro);
  }
`;

const frag = /* glsl */ `
  uniform float uFade;
  varying vec3 vColor; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float core = smoothstep(0.24, 0.0, d);          // bright centre
    float halo = exp(-d * d * 16.0) * 0.6;          // soft glow around it
    gl_FragColor = vec4(vColor * (0.8 + core * 1.1), min(1.0, core + halo) * vAlpha * uFade);
  }
`;

const rnd = (a = -1, b = 1) => a + Math.random() * (b - a);

function baseShapes(n) {
  const scatter = new Float32Array(n * 3), grid = new Float32Array(n * 3), stream = new Float32Array(n * 3), sphere = new Float32Array(n * 3);
  const bad = new Float32Array(n), seed = new Float32Array(n);
  const cols = 160, rows = Math.ceil(n / cols), golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    const arm = i % 3, r = Math.pow(Math.random(), 0.7) * 6, ang = r * 0.55 + arm * (Math.PI * 2 / 3) + rnd(-0.5, 0.5);
    scatter[k] = Math.cos(ang) * r * 1.2 + rnd(-0.6, 0.6); scatter[k + 1] = rnd(-1, 1) * (1.6 - r * 0.15) + rnd(-0.4, 0.4); scatter[k + 2] = Math.sin(ang) * r + rnd(-0.6, 0.6);
    const cx = i % cols, cy = Math.floor(i / cols);
    grid[k] = (cx / cols - 0.5) * 11; grid[k + 1] = (cy / rows - 0.5) * 5.5; grid[k + 2] = Math.sin(cx * 0.15) * 0.15;
    const lane = i % 7, x = rnd(-8, 8);
    stream[k] = x; stream[k + 1] = Math.sin(x * 0.45 + lane * 0.9) * 1.6 + (lane - 3) * 0.28; stream[k + 2] = Math.cos(x * 0.3 + lane) * 1.2;
    const yy = 1 - (i / (n - 1)) * 2, rr = Math.sqrt(1 - yy * yy), th = golden * i;
    sphere[k] = Math.cos(th) * rr * 3.1; sphere[k + 1] = yy * 3.1; sphere[k + 2] = Math.sin(th) * rr * 3.1;
    bad[i] = Math.random() < 0.07 ? 1 : 0;
    seed[i] = Math.random();
  }
  return { scatter, grid, stream, sphere, bad, seed };
}

function shape(name, n) {
  const a = new Float32Array(n * 3);
  const set = (i, x, y, z) => { a[i * 3] = x; a[i * 3 + 1] = y; a[i * 3 + 2] = z; };
  if (name === 'formata') { // messy cone pours into neat rows
    const half = Math.floor(n / 2), c = 120, rowsN = Math.ceil(half / c);
    for (let i = 0; i < n; i++) {
      if (i < half) { const y = Math.random() * 3.2, r = 0.25 + y * 1.1, t = rnd(0, Math.PI * 2), m = Math.random(); set(i, Math.cos(t) * r * m, y, Math.sin(t) * r * m); }
      else { const j = i - half; set(i, ((j % c) / c - 0.5) * 9, -0.6 - (Math.floor(j / c) / rowsN) * 3, 0); }
    }
  } else if (name === 'personalapi') { // a hub wired to seven services
    const nodes = [[0, 0, 0]];
    for (let k = 0; k < 7; k++) { const t = (k / 7) * Math.PI * 2; nodes.push([Math.cos(t) * 3.6, rnd(-1.4, 1.4), Math.sin(t) * 3.6]); }
    for (let i = 0; i < n; i++) {
      if (Math.random() < 0.45) { const nd = nodes[i % nodes.length], s = i % nodes.length === 0 ? 0.9 : 0.45, t = rnd(0, Math.PI * 2), p = Math.acos(rnd()); set(i, nd[0] + Math.sin(p) * Math.cos(t) * s, nd[1] + Math.cos(p) * s, nd[2] + Math.sin(p) * Math.sin(t) * s); }
      else { const b = nodes[1 + (i % 7)], f = Math.random(); set(i, b[0] * f + rnd(-0.04, 0.04), b[1] * f + rnd(-0.04, 0.04), b[2] * f + rnd(-0.04, 0.04)); }
    }
  } else if (name === 'cropchain') { // rolling field
    const side = Math.ceil(Math.sqrt(n));
    for (let i = 0; i < n; i++) { const x = ((i % side) / side - 0.5) * 12, z = (Math.floor(i / side) / side - 0.5) * 9; set(i, x, Math.sin(x * 0.7) * Math.cos(z * 0.6) * 0.9 + Math.sin(x * 2 + z) * 0.15 - 0.6, z); }
  } else if (name === 'trip') { // globe with a route arc
    const golden = Math.PI * (3 - Math.sqrt(5)), m = Math.floor(n * 0.85);
    const A = new THREE.Vector3(1, 0.6, 0.4).normalize(), B = new THREE.Vector3(-0.6, 0.2, 0.9).normalize(), v = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      if (i < m) { const yy = 1 - (i / (m - 1)) * 2, rr = Math.sqrt(1 - yy * yy), th = golden * i; set(i, Math.cos(th) * rr * 2.7, yy * 2.7, Math.sin(th) * rr * 2.7); }
      else { const f = Math.random(); v.copy(A).lerp(B, f).normalize().multiplyScalar(2.7 + Math.sin(f * Math.PI) * 1.3); set(i, v.x + rnd(-0.03, 0.03), v.y + rnd(-0.03, 0.03), v.z + rnd(-0.03, 0.03)); }
    }
  } else if (name === 'bullbot') { // candlesticks with a moving-average line
    const N = 26; let p = 0; const o = [], c = [];
    for (let k = 0; k < N; k++) { o.push(p); p += rnd(-0.55, 0.62); c.push(p); }
    for (let i = 0; i < n; i++) {
      const k = i % N, x = (k / N - 0.5) * 11;
      if (i < n * 0.8) { const lo = Math.min(o[k], c[k]), hi = Math.max(o[k], c[k]) + 0.08, wick = Math.random() < 0.15; set(i, x + (wick ? 0 : rnd(-0.14, 0.14)), (wick ? rnd(lo - 0.5, hi + 0.5) : rnd(lo, hi)) - 1.5, rnd(-0.14, 0.14)); }
      else { const f = Math.random() * (N - 1), j = Math.floor(f), t = f - j; set(i, (f / N - 0.5) * 11, c[j] * (1 - t) + c[j + 1] * t - 0.9, 0); }
    }
  }
  return a;
}

export function startScene(canvas, getProgress, { intro = false } = {}) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' }); } catch { return null; }
  if (!renderer.getContext()) return null;

  const css = getComputedStyle(document.documentElement);
  const color = (v) => new THREE.Color(css.getPropertyValue(v).trim());
  renderer.setClearColor(color('--bg'), 1);
  const small = innerWidth < 760;
  const N = small ? 9000 : 18000;
  const s = baseShapes(N);

  const geo = new THREE.BufferGeometry();
  const attr = (name, arr, size = 3) => geo.setAttribute(name, new THREE.BufferAttribute(arr, size));
  attr('position', s.scatter); attr('aScatter', s.scatter); attr('aGrid', s.grid); attr('aStream', s.stream); attr('aSphere', s.sphere);
  attr('aBad', s.bad, 1); attr('aSeed', s.seed, 1);
  SHAPES.forEach((name, i) => attr(`aS${i}`, shape(name, N)));

  const uniforms = {
    uProgress: { value: 0 }, uTime: { value: 0 }, uPixel: { value: 1 }, uIntro: { value: intro ? 0 : 1 },
    uPulse: { value: 0 }, uRepel: { value: 0 }, uRippleT: { value: 1 }, uRippleO: { value: new THREE.Vector2(9, 9) },
    uW: { value: [0, 0, 0, 0, 0] }, uMouse: { value: new THREE.Vector2(9, 9) }, uAspect: { value: 1 }, uFade: { value: 1 },
    uEmber: { value: color('--ember') }, uAmber: { value: color('--amber') }, uInk: { value: color('--ink') }, uTeal: { value: color('--teal-light') },
  };
  const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(points);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 12);


  function resize() {
    const dpr = Math.min(devicePixelRatio, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.setViewOffset(innerWidth, innerHeight, innerWidth > 900 ? -innerWidth * 0.14 : 0, 0, innerWidth, innerHeight);
    camera.updateProjectionMatrix();
    uniforms.uPixel.value = dpr * (small ? 1.25 : 1);
    uniforms.uAspect.value = innerWidth / innerHeight;
  }
  resize();
  addEventListener('resize', resize);

  const mouse = new THREE.Vector2(9, 9);
  let mouseActive = 0;
  addEventListener('pointermove', (e) => { mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); mouseActive = e.pointerType === 'mouse' ? 1 : 0; });
  document.addEventListener('pointerleave', () => { mouseActive = 0; });
  addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, input, textarea')) return;
    uniforms.uRippleO.value.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    uniforms.uRippleT.value = 0;
  });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const weights = [0, 0, 0, 0, 0];
  let focus = -1, pulse = 0, introV = uniforms.uIntro.value, introTarget = introV, running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) requestAnimationFrame(tick); });

  const clock = new THREE.Clock();
  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const k = reduced ? 1 : 1 - Math.pow(0.001, dt);
    uniforms.uProgress.value += (getProgress() - uniforms.uProgress.value) * (reduced ? 1 : k * 0.6);
    for (let i = 0; i < 5; i++) weights[i] += ((i === focus ? 1 : 0) - weights[i]) * (reduced ? 1 : k * 0.55);
    uniforms.uW.value = weights;
    uniforms.uPulse.value += (pulse - uniforms.uPulse.value) * k * 0.4;
    introV += (introTarget - introV) * (reduced ? 1 : k * 0.35);
    uniforms.uIntro.value = introV;
    uniforms.uTime.value = reduced ? 0 : t;
    uniforms.uMouse.value.lerp(mouse, 0.15);
    uniforms.uRepel.value += (mouseActive * (reduced ? 0 : 1) - uniforms.uRepel.value) * 0.08;
    uniforms.uRippleT.value = Math.min(1, uniforms.uRippleT.value + dt * 0.7);
    const p = uniforms.uProgress.value, w = Math.min(1, weights.reduce((a, b) => a + b, 0));
    const facing = Math.max(0, 1 - Math.abs(p - 1.2) / 0.9) * (1 - w);
    const behindText = Math.max(0, 1 - Math.abs(p - 2.1) / 0.7) * (1 - w);
    uniforms.uFade.value = 1 - behindText * 0.5;
    const sway = reduced ? 0.3 : Math.sin(t * 0.08) * 0.7 + p * 0.25 + w * Math.sin(t * 0.3) * 0.6;
    points.rotation.y = sway * (1 - facing) + 0.12 * facing;
    points.rotation.x = 0.18 - p * 0.04 + w * 0.12;
    renderer.render(scene, camera);
    if (!reduced) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  const kick = () => { if (reduced) requestAnimationFrame(tick); };
  if (reduced) addEventListener('scroll', kick, { passive: true });

  function applyTheme() {
    const c = getComputedStyle(document.documentElement);
    const col = (v) => new THREE.Color(c.getPropertyValue(v).trim());
    const paper = document.documentElement.dataset.theme === 'paper';
    renderer.setClearColor(col('--bg'), 1);
    uniforms.uEmber.value = col('--ember'); uniforms.uAmber.value = col('--amber');
    uniforms.uInk.value = col('--ink'); uniforms.uTeal.value = col('--teal-light');
    // glowing light on dark; ink dots on paper
    mat.blending = paper ? THREE.NormalBlending : THREE.AdditiveBlending;
    mat.needsUpdate = true;
    kick();
  }
  applyTheme();

  return {
    setTheme: applyTheme,
    setFocus(name) { focus = name ? SHAPES.indexOf(name) : -1; kick(); },
    burst() { introTarget = 1; kick(); },
    pulse(on) { pulse = on ? 1 : 0; kick(); },
  };
}
