# Cybernetic AAA UI Developer Portfolio

A cinematic, high-fidelity cyberpunk portfolio website designed for **Sanish Bhandari**, built using **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, **GSAP**, and **Three.js (React Three Fiber)**. 

Featuring immersive Web Audio API sounds, interactive console Easter eggs, custom canvas trailing cursors, and responsive handheld navigation grids, this portfolio acts as an interactive game-style dashboard.

---

## 🚀 Key Features

*   **Particle Space Field Hero**: A custom WebGL Three.js canvas featuring 500 drift-animated instanced icosahedron particles with cursor spring repulsion physics, a background wireframe torus knot, and depth fading.
*   **Decryption Preloader Split-Exit**: Spells the developer's name using dynamic typing sound sweeps and scrambling code cyphers, exiting via a horizontal parting split-screen door transition.
*   **Dual HUD Navigation**: Contains a clean desktop header and a responsive mobile bottom tab navigation dock with scroll-based logo morphing.
*   **Holographic Project Cards**: Projects feature mouse pointer-tracked radial holographic rainbow foil overlays, capped 3D card tilt rotations at exactly $\pm 8^\circ$, diagonal striped planned indicators, and functional likes stored in local cache.
*   **Interactive Tech Arsenal Visualizer**: Switchable between two visual states:
    *   **Honeycomb Hex Grid**: A responsive grid mapping custom tech icons in hexagons that scale, beep, and glow on mouse hover.
    *   **PCB Progress Bars**: Circuit trace bars featuring neon boundary paths, electric scanner overlays, end-aligned pulsing LEDs, and scroll-bound counters.
*   **Vintage Green-Screen Command Shell**: A floating console input allowing custom command inputs (`whoami`, `skills`, `projects`, `contact`, `clear`, `sudo hire-me` with falling matrix confetti).
*   **Gaming Achievement System**: Unlocks 10 unique achievements on scroll spy triggers and interaction nodes, featuring session-cached queues and dynamically synthesized double chime beeps.
*   **Comms Portal**: Input form containing validation rules, rotatable vertical headers, and high-performance HTML5 Canvas neon particle explosions on successful submissions.
*   **Performance Canvas Trailing Pointer**: A performance-optimized screen canvas drawing 8 chained trail dots with lag interpolation and custom color blending.

---

## 👾 Easter Eggs

### 1. God Mode (Konami Code)
Type this sequence on your keyboard anywhere on the page:
`↑` `↑` `↓` `↓` `←` `→` `←` `→` `b` `a`

This triggers a fullscreen overrides visual reading **"GOD MODE ENGAGED"** with dynamic glitching indicators for 5 seconds.

### 2. Administrator Access
Open the terminal console (bottom-left trigger) and enter:
```bash
sudo hire-me
```
This unlocks the executive recruitment achievement and triggers a custom falling matrix colored confetti event.

---

## 🛠️ Commands List (Terminal Console)

*   `help` — List all available command channels.
*   `whoami` — Prints profile info, coordinate metrics, and status.
*   `skills` — Scans tech arsenal with diagnostic ASCII indicators.
*   `projects` — Lists repository builds with direct click links.
*   `contact` — Prints email comms port and social handles.
*   `clear` — Clears the terminal screen buffer.
*   `sudo hire-me` — Initiates the executive recruitment sequence.
*   `exit` — Closes the terminal overlay.

---

## 💻 Tech Stack & Dependencies

*   **Framework**: [React 19](https://react.dev)
*   **Build Tool**: [Vite 8](https://vite.dev)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + Vanilla CSS transitions
*   **Physics & WebGL**: [Three.js](https://threejs.org) + [React Three Fiber](https://r3f.docs.pmnd.rs) + `@react-three/drei`
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com)
*   **Scroll Mechanics**: [Lenis](https://lenis.darkroom.engineering) (Inertial smooth scroll)
*   **Icons**: `react-icons`

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Local Development
Spin up the local Vite hot-reload server:
```bash
npm run dev
```

### 3. Production Build
Compile the codebase into minified static assets inside `/dist`:
```bash
npm run build
```
