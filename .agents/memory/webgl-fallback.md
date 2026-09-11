---
name: WebGL fallback behavior
description: Browser previews may not expose a WebGL context, so interactive 3D must be capability-gated.
---

Gate Three.js or React Three Fiber initialization behind a browser WebGL capability check and render a designed fallback when unavailable.

**Why:** The Replit preview browser can fail WebGL renderer creation even when the bundle is correct; relying only on a renderer fallback can still trigger the Vite error overlay.

**How to apply:** Keep the fallback visually intentional and make the 3D layer progressive enhancement, not a requirement for the page to render.