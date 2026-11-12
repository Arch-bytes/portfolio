# Om Sakhare: portfolio

A static portfolio for GitHub Pages: HTML, CSS and ES modules, with no build step and no backend.

A single Three.js particle field runs behind the page and changes shape as you scroll. It starts as raw scattered data, becomes a clean table (the orange "bad records" fall out), then a flowing pipeline, and ends as a sphere at the contact section.

## Structure

```
index.html       content (readable without JavaScript)
css/styles.css   tokens, layout, type (Instrument Serif, Geist, Geist Mono)
js/app.js        text reveals, scroll progress, cursor, loads the scene
js/scene.js      Three.js particle field and shaders (three@0.160.0 from jsDelivr via an import map)
assets/favicon.svg
```

Other details:

- A short intro counts to 100, then the field bursts out of a single point. It plays once per visit; press any key or Skip to end it.
- Hovering a project reshapes the field: a cleaning funnel for Formata, a service hub for PersonalAPI, a field for Crop-Chain, a globe with a route for AI Trip Planner, candlesticks for Bullbot. On phones the row in the middle of the screen does it.
- Points move away from the cursor, and clicking empty space sends out a ripple.
- Smooth scrolling (Lenis), a skills marquee that skews with scroll speed, text that unscrambles, film grain, and a live IST clock.

- The round button in the nav switches between Night (dark) and Paper (light). The new theme spreads out from the button like an ink blot. The choice is saved, and first-time visitors get whichever matches their system setting.

If WebGL is unavailable, a static backdrop is shown instead. With reduced motion on, the field doesn't animate and only changes shape on scroll.

## Run locally

```bash
npx serve .      # or: python -m http.server
```

## Deploy

Push to GitHub, then go to Settings, Pages, Deploy from a branch, and choose the branch with `/ (root)`.
