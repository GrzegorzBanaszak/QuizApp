# Design System Strategy: Neon Kineticism

## 1. Overview & Creative North Star: "The Electric Social"
The Creative North Star for this design system is **"The Electric Social."** We are moving away from the static, boxy layouts of traditional web design and toward a high-octane, broadcast-inspired interface. This system captures the adrenaline of a high-tech game show—think neon lights, glass surfaces, and vibrating energy—while maintaining the slick, intuitive usability of a premium social app.

To break the "template" look, we utilize **Intentional Asymmetry** and **Kinetic Layering**. Hero elements should overlap container boundaries; typography should scale aggressively to create an editorial rhythm; and the UI should feel like it’s "floating" in a deep midnight digital void. We don't just present information; we stage it.

---

## 2. Colors & Surface Architecture
The palette is built on high-contrast vibrance set against a massive, dark foundation.

*   **Primary (`#e08dff`) & Secondary (`#ff68a7`):** These are your "Neon Core" colors. Use them for high-impact CTAs and focal points.
*   **Surface Foundation (`#0c0c21`):** All layouts begin at the `surface` or `surface-dim` level to establish the "Midnight" atmosphere.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Structural definition must be achieved through:
1.  **Background Shifts:** Transitioning from `surface` to `surface-container-low` to define a new content area.
2.  **Tonal Transitions:** Using subtle gradients to guide the eye rather than "locking" content in a box.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. To create depth:
*   **Level 0 (Deepest):** `surface-container-lowest` (#000000) for background-sink elements.
*   **Level 1 (Base):** `surface` (#0c0c21) for the main page body.
*   **Level 2 (Raised):** `surface-container` (#171730) for primary content cards.
*   **Level 3 (Interactive):** `surface-bright` (#29294a) for hover states or active components.

### The "Glass & Gradient" Rule
To achieve a "High-Tech" soul, use **Glassmorphism**. Floating panels should use `surface-variant` at 60% opacity with a `backdrop-blur: 20px`. 
**Signature Texture:** Apply a linear gradient from `primary` (#e08dff) to `secondary` (#ff68a7) at a 135° angle for Hero CTAs and decorative "light-leak" accents in the background.

---

## 3. Typography: Bold Pulse
We pair the geometric authority of **Spline Sans** with the rhythmic readability of **Be Vietnam Pro**.

*   **Display Scale (`display-lg` 3.5rem):** Use for game titles and "Hook" copy. Set with tight letter-spacing (-0.02em) to feel impactful and modern.
*   **Headline Scale (`headline-lg` to `headline-sm`):** These are the "Game Show" voices. Use `primary` or `tertiary` color tokens for headlines to make them pop against the midnight background.
*   **Body Scale (`body-lg` to `body-sm`):** High-legibility `on-surface-variant` (#aaa8c4) should be used for descriptions to ensure the interface doesn't feel "noisy."

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too "web 2.0." We use **Ambient Glow** and **Tonal Stacking**.

*   **The Layering Principle:** Place a `surface-container-high` card on a `surface` background. The slight lift in brightness (from #0c0c21 to #1d1d39) creates a cleaner, more sophisticated separation than a black shadow.
*   **Ambient Shadows:** For floating modals, use a large, diffused shadow (blur: 40px) using the `primary` token at 8% opacity. This mimics the glow of a neon sign against a dark wall.
*   **The Ghost Border:** If a boundary is required for accessibility, use the `outline-variant` token at 15% opacity. Never use 100% opaque outlines.

---

## 5. Components & Interface Elements

### Buttons
*   **Primary:** A vibrant gradient from `primary` to `primary-container`. `rounded-full` (9999px) is mandatory. Text should be `on-primary` (#4f006c) for maximum contrast.
*   **Secondary:** `surface-bright` background with a `primary` "Ghost Border" (20% opacity).
*   **Tertiary:** Text-only using `tertiary` (#8ff5ff) with an underline that appears only on hover.

### Cards & Lists
*   **Strict Rule:** No divider lines. Separate list items using `spacing-4` (1.4rem) and a subtle background shift to `surface-container-low` on hover.
*   **Rounding:** All cards must use `rounded-lg` (2rem) to maintain the "Friendly Social" aesthetic.

### Dynamic Chips
*   Use `secondary-container` for active states with `on-secondary-container` text. Use `rounded-md` (1.5rem) to differentiate them from the "pills" of the main buttons.

### High-Tech Game Components (Custom)
*   **The "Leaderboard" Row:** A `surface-container-highest` background with a `primary` left-accent bar (4px width) to denote the current player.
*   **The "Hype" Indicator:** A progress bar using a `tertiary` to `primary` gradient, housed in a `surface-container-lowest` track.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use the `20` (7rem) spacing token for section margins to allow the "Electric" elements room to breathe.
*   **Do** overlap images (like game avatars or cards) across section boundaries to create a sense of motion.
*   **Do** use `tertiary` (#8ff5ff) for technical data or "System" messages (e.g., "3 Players Online") to give it a HUD-like feel.

### Don’t:
*   **Don’t** use pure white (#ffffff) for text. Use `on-surface` (#e5e3ff); it’s a soft lavender-white that blends better with the midnight theme.
*   **Don’t** use `rounded-none`. Everything in this system must have at least a `sm` (0.5rem) radius to feel approachable.
*   **Don’t** use standard "Drop Shadows." If an element needs to stand out, use a color-tinted ambient glow or a background color shift.