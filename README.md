# ⚙️ The Inventor's Workshop

> *"Every invention in this workshop began the same way — as one idea in the dark."*

An immersive, scroll-driven interactive experience built as a personal portfolio. You enter a steampunk workshop, wake a dormant automaton, follow it through a vault door into a glowing 3D corridor lined with inventions, and arrive at the workshop's next unfinished creation.

**Live:** [reality-engine.vercel.app](https://reality-engine.vercel.app) *(or wherever deployed)*

---

## ✨ Experience Overview

The site is a single, continuous scroll journey split into distinct scenes:

| Scene | What happens |
|---|---|
| **Hero — The Entrance Hall** | A dark steampunk hall. A robot sleeps by the vault door. As you scroll, it wakes, stands, and walks to the door. The door cracks open and light floods in. |
| **The Corridor** | A perspective 3D tunnel rendered in CSS. Three invention frames line the walls — click any to read its lore. The camera moves forward as you scroll. |
| **The Workbench** | A half-finished steampunk automaton sits under a workbench lamp — the workshop's next invention, mid-construction. |
| **The Ending** | The automaton is revealed in full. The workshop lives again. |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | **React + Vite** (TypeScript) |
| Animations | **GSAP** + ScrollTrigger (scroll-scrubbed timelines) |
| Motion | **Framer Motion** (scene transitions, ending reveal) |
| Scroll | **Lenis** (smooth scroll) |
| Styling | **Tailwind CSS v4** |
| 3D Corridor | Vanilla CSS `perspective` + `translateZ` |
| Scene Art | Hand-authored SVG (all environments, robot, door, lamps, clock) |
| Asset Processing | `rembg` (Python, background removal for the automaton asset) |
| State | **Zustand** (`useWorkshopStore`, `useGlobalState`) |

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── environment/          # Scene environment layers
│   │   ├── BackgroundLayer   # Stone walls, arch, skylights
│   │   ├── MidgroundLayer    # Vault door, hanging lamps, clock
│   │   ├── ForegroundLayer   # Stone floor, corner shadows
│   │   ├── Lighting          # Mouse-parallax glow, vignette, beams
│   │   └── DustParticles     # Floating dust in lamplight
│   ├── scenes/               # Main scene controllers
│   │   ├── HeroScene         # Entrance hall + robot walk scroll timeline
│   │   ├── CorridorScene     # 3D CSS tunnel + invention frames
│   │   ├── TextOverlay       # Hero title, subtitle, CTA
│   │   └── TwistEndingScene  # Final reveal + credits
│   ├── gallery/              # Interactive inventory
│   │   ├── InventionFrame    # Clickable invention cases in corridor
│   │   ├── InventionCase     # Lore detail modal
│   │   ├── HalfInvention     # Half-finished automaton asset component
│   │   └── InventionInterior # Full-screen lore panel
│   ├── svg/                  # Hand-authored SVG components
│   │   ├── Robot             # The fully animated automaton (sleeping → walking)
│   │   ├── MedallionLink     # GitHub / LinkedIn link medallions
│   │   └── EyeTracking       # Robot eye follows mouse cursor
│   ├── experience/           # Top-level scene orchestration
│   ├── cursor/               # Custom mechanical cursor
│   └── Scroll/               # Lenis provider wrapper
├── store/
│   ├── useWorkshopStore      # Robot wake state
│   └── useGlobalState        # Active invention, scene state
└── public/
    └── assets/
        └── half-invention.png  # Steampunk automaton (rembg-processed)
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

> The dev server runs on port **3001** (configured in `vite.config.ts`).

---

## 🎨 Design System

The entire site uses a single warm amber/copper palette derived from candlelight and aged brass:

| Token | Hex | Usage |
|---|---|---|
| Warm Glow | `#fcdba1` | Lamp bulbs, door cracks, core glow |
| Copper | `#b58953` | Strokes, handles, highlights |
| Dark Copper | `#8a6535` | Secondary strokes, shadows |
| Deep Amber | `#c89040` | Title gradient midpoint |
| Background | `#050403` | Scene base, near-black |

Typography uses **EB Garamond** (serif, for titles/body) and a system sans-serif for labels.

---

## 🔗 Links

- **GitHub:** [github.com/Aryasurya12](https://github.com/Aryasurya12)
- **LinkedIn:** [linkedin.com/in/aryasurya12](https://www.linkedin.com/in/aryasurya12/)
