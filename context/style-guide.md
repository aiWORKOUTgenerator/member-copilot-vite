# 🌐 Glassmorphism Style Guide

_For B2B2C Gym Web & Mobile Apps (React + TailwindCSS + DaisyUI + Vite)_

---

## 🎨 Color System & Theming

- **Primary Palette**:
  - Use gym-specific brand colors for `--color-primary`, `--color-secondary`, `--color-accent`.
  - Example: `--color-primary: #00FF88; --color-primary-content: #000000;`
- **Backgrounds**:
  - Dark gradient backdrops: `linear-gradient(180deg, #0d0f0f 0%, #131a14 100%)`
  - Support both dark and light modes, but default to dark for immersive look.
- **Neon Accents**:
  - Glowing rings and highlights around CTAs (e.g., green, yellow, purple, or gym theme color).
  - Use `box-shadow: 0 0 20px var(--color-primary);` for glow.
- **Dynamic Theming**:
  - Each gym loads a theme file overriding DaisyUI tokens.
  - Always use semantic classes (`bg-primary`, `text-primary-content`, `btn-accent`) instead of hardcoded colors.

---

## 🪟 Glassmorphism Principles

- **Frosted Glass Panels**:
  - Background blur: `backdrop-filter: blur(20px);`
  - Semi-transparent panels: `background: rgba(255,255,255,0.05);`
  - Border: `1px solid rgba(255,255,255,0.1);`
- **Depth**:
  - Layer multiple glass cards with shadows:
    - `box-shadow: 0 4px 30px rgba(0,0,0,0.2);`
- **Contrast**:
  - White/gray text on dark translucent cards.
  - Neon outlines for active states.

---

## 📱 Layout & Responsiveness

- **Mobile-First**:
  - Vertical flow with single-column cards.
  - Bottom nav bar with 3–5 icons.
- **Grid Usage**:
  - For dashboards, use 2-column card grids on mobile, 3–4 columns on tablet/desktop.
- **Spacing**:
  - Padding: `p-4` min on cards, `p-6` for full-width sections.
  - Rounded corners: `rounded-2xl` consistently.

---

## 🖼️ Typography

- **Font**: Sans-serif, geometric, modern (e.g., Inter, Poppins, or system font).
- **Hierarchy**:
  - Titles: `text-2xl font-bold`
  - Subtitles: `text-lg font-medium`
  - Body: `text-base text-gray-300`
- **Accents**:
  - Use gym primary color for headings or emphasis text sparingly.

---

## 🧩 Components

### Buttons

- **Primary CTA**:
  - Glass button with neon glow (`btn btn-primary` + `shadow-[0_0_20px_var(--color-primary)]`).
  - Rounded pill shape (`rounded-full`).
- **Secondary**:
  - Ghost style (`btn btn-ghost text-base-content`).
  - Subtle borders with 30% opacity.

### Cards

- **Glass cards with gradients & neon edges**
  - `bg-base-100/10 backdrop-blur-xl border border-white/10`
  - Inside: icon, title, value, sparkline/mini-chart.
- **Hover State**: Slight scale-up + intensified glow.

### Charts

- **Style**: Sparkline charts with **matching neon accent colors**.
- **Background**: Semi-transparent, integrated into card.
- **Consistency**: Always color-code by metric (green for growth, red for decrease).

### Nav Bar

- **Bottom Tab Bar**:
  - Rounded pill background (glassmorphic).
  - Highlight active icon with neon glow + filled circle.
- **Icons**: Minimal line icons, theme-colored when active.

---

## ✨ Motion & Micro-Interactions

- **Voice/AI Interactions**:
  - Animated rings around mic icon with pulsing glow.
  - Smooth transitions (`transition-all duration-300`).
- **Onboarding**:
  - Slide/fade animations for step transitions.
- **Feedback**:
  - Success → checkmark glow + micro animation.
  - Error → subtle shake with red glow.

---

## 🔒 Accessibility

- Maintain **contrast ratio ≥ 4.5** (check light text on glass backgrounds).
- Ensure large tappable areas (≥ 44px).
- Provide **alt text** and ARIA labels for icons.
- Avoid relying solely on neon color for meaning – always include text/icon cues.

---
