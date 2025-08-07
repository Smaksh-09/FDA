# ReelBites Design System: Neobrutalism

This document is the single source of truth for the visual identity and component styling of the ReelBites application. All new pages and components MUST adhere to these rules to maintain a cohesive user experience.

## 1. Core Principles

-   **Honesty:** Components should be what they are. No fake textures or soft gradients. We embrace the digital nature of the medium.
-   **High Contrast:** The design relies on a stark contrast between a light background and dark content to ensure clarity and impact.
-   **Function over Form:** The UI is functional and raw, but with a deliberate, bold, and energetic personality.
-   **Consistency is Key:** Every element must follow the rules below without exception.

## 2. Color Palette

| Role                 | Color Name       | HEX Code  | Tailwind Class      |
| :------------------- | :--------------- | :-------- | :------------------ |
| **Primary Background** | Off-White        | `#F5F5F5` | `bg-gray-100`       |
| **Primary Content** | Pure Black       | `#000000` | `bg-black`, `text-black`, `border-black` |
| **Primary Accent** | Electric Lime    | `#39FF14` | `bg-lime-400`, `text-lime-400`, `border-lime-400` |
| **Secondary Accent** | Warning Blue     | `#0052FF` | `bg-blue-600`       |

## 3. Typography

-   **Font Family:** Use **"Inter"** (from Google Fonts) for all text site-wide.
-   **Headings (`h1`, `h2`, `h3`):** Use a bold weight (`font-bold` or `font-extrabold`).
-   **Body Text (`p`, `span`):** Use a regular weight (`font-normal`).

## 4. The Component Manifesto (Strict Rules)

#### **Borders:**
-   All components (cards, buttons, inputs, containers) **MUST** have a `solid, 2px black border`.

#### **Corners:**
-   There are **NO** rounded corners. All elements **MUST** use `rounded-none`.

#### **Shadows:**
-   Interactive or elevated elements (buttons, cards on hover) **MUST** have a hard, solid black `box-shadow` with **NO blur**.
-   The standard shadow is `4px 4px 0px #000`.

#### **Buttons:**
-   **Primary Button (Default State):** Solid `Electric Lime` background, black text, 2px black border.
-   **Primary Button (Hover/Active State):** Add the hard black box-shadow. The button can also shift position slightly (e.g., `translate-x-1 translate-y-1`).
-   **Secondary Button:** White background, black text, 2px black border. On hover, the background turns `Electric Lime`.

#### **Inputs (Text Fields):**
-   White background, black text, 2px black border.
-   On focus (`focus:`), the border color **MUST** change to `Electric Lime`.

#### **Cards / Containers:**
-   Solid `Pure Black` background with `Off-White` text, or `Off-White` background with `Pure Black` text.
-   **MUST** have a `2px black border`.

## 5. Iconography

-   **Library:** Use **Feather Icons** exclusively.
-   **Style:** Icons should be `Pure Black` with a consistent stroke width (e.g., `stroke-width-2`).