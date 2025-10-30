# Sanki Yedim - Design Guidelines

## Design Approach

**Hybrid Strategy**: Blend Notion's warm approachability with YNAB's financial clarity, wrapped in subtle Turkish cultural aesthetics. Use Chakra UI as the foundation while customizing for emotional resonance and cultural authenticity.

**Core Philosophy**: Create a warm, encouraging experience that celebrates small victories while maintaining the clarity needed for financial tracking. The design should feel like a supportive friend, not a banking app.

---

## Typography System

**Primary Typeface**: Merriweather (serif) for headlines - evokes tradition and storytelling warmth
**Secondary Typeface**: Inter (sans-serif) for body text and UI elements - ensures excellent readability for data

**Hierarchy**:
- Hero Headlines: Merriweather, 48px (mobile: 32px), font-weight 700, letter-spacing -0.02em
- Section Titles: Merriweather, 32px (mobile: 24px), font-weight 600
- Card Titles: Inter, 20px, font-weight 600
- Body Text: Inter, 16px, font-weight 400, line-height 1.6
- Captions/Labels: Inter, 14px, font-weight 500
- Data Display (amounts): Inter, 24px, font-weight 700, tabular-nums

---

## Layout & Spacing System

**Spacing Scale**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Container Strategy**:
- Marketing pages: max-w-7xl (1280px) with px-6
- App pages: max-w-6xl (1152px) with px-4
- Content sections: max-w-prose (65ch) for readability
- Dashboard cards: Grid system with gap-6

**Vertical Rhythm**:
- Section padding: py-20 (desktop), py-12 (mobile)
- Card padding: p-6
- Component spacing: space-y-4 for forms, space-y-6 for sections
- Inter-element gaps: gap-4 (tight), gap-6 (standard), gap-8 (loose)

---

## Component Library

### Navigation & Headers
**Top Navigation Bar**:
- Fixed header with backdrop blur effect
- Height: h-16
- Logo (left): Turkish tile icon + "Sanki Yedim" wordmark
- Desktop menu (center): Dashboard, Entries, Transfers, Settings
- User actions (right): Profile avatar with dropdown
- Mobile: Hamburger menu with slide-out drawer

### Dashboard Components
**Quick-Add Entry Card**:
- Prominent placement, subtle elevation shadow
- Form fields vertically stacked with labels above inputs
- Input groups: Item name (text), Amount (number with currency symbol), Category (select), Note (textarea), Date (date picker)
- Primary action button: Full-width, accent color
- Micro-interaction: Gentle scale on hover

**KPI Cards** (4 cards in 2x2 grid on desktop, stacked on mobile):
- Equal-height cards with rounded-lg corners
- Each card structure: Icon (top-left), Label (small text), Value (large, bold), Progress indicator or sparkline
- Cards: Total Saved, Saved This Month, Current Streak, Monthly Goal Progress
- Subtle gradient background from warm neutral to slightly warmer tone

**Sparkline Component**:
- Canvas-based line chart showing last 30 days
- Height: 80px, responsive width
- Smooth curve with gradient fill below line
- Minimal axes, no grid lines
- Tooltip on hover showing date and amount

### Data Tables (Entries Page)
**Table Structure**:
- Sticky header row with filter/search bar above
- Columns: Item (left-aligned), Amount (right-aligned, tabular), Category (tag/badge), Date, Actions (icon buttons)
- Row hover state with subtle background shift
- Checkbox column for bulk selection
- Pagination controls at bottom (page numbers + next/prev)

**Filter Bar**:
- Horizontal layout with gap-4
- Date range picker (from/to), Category dropdown, Text search input
- Clear filters button (secondary style)

### Transfer Components
**Transfer Card**:
- Card layout showing: Status badge, Total amount (prominent), Entry count, Created date
- Expandable accordion showing included entries list
- Action buttons based on status: "View Checklist" (pending_manual), "Mark Complete" (button), Status indicator (completed/failed)

**Manual Transfer Checklist Modal**:
- Center modal overlay with backdrop blur
- Header: "Transfer Checklist" with close button
- Content sections with copy-to-clipboard buttons:
  - Amount to transfer (large, bold)
  - Memo text: "Sanki Yedim – [date] – [n] items"
  - From account label
  - To account label
- Step-by-step instructions (numbered list)
- Footer: "Mark as Completed" primary button + "Cancel" secondary

### Forms & Inputs
**Input Style**:
- Border radius: rounded-md
- Border: 1px solid neutral-300, focus: accent color with ring
- Padding: px-4 py-3
- Font size: 16px (prevents mobile zoom)
- Label above input with small margin-bottom

**Buttons**:
- Primary: Solid accent background, white text, rounded-lg, px-6 py-3, shadow-md
- Secondary: Outlined with border, accent color text, transparent background
- Danger: Red background for delete actions
- Icon buttons: Rounded-full, p-2, hover background
- All buttons: Smooth transition on hover/active states

### Cards & Containers
**Standard Card**:
- Background: White with subtle shadow (shadow-md)
- Border radius: rounded-xl
- Padding: p-6
- Border: 1px solid neutral-200

**Stat Cards**:
- Slightly deeper shadow for hierarchy
- Optional: Subtle left-border accent (4px width)

---

## Turkish Cultural Motifs

**Tile Pattern Background**:
- Geometric SVG pattern inspired by Iznik tiles (hexagons, stars, arabesque)
- Usage: Faint watermark in header/footer sections at 5% opacity
- Colors: Neutral-200 strokes on neutral-50 background
- Non-intrusive, adds cultural authenticity

**Accent Elements**:
- Decorative borders using simplified geometric patterns on section dividers
- Icon set: Custom illustrations for categories (coffee cup, book, clothing) with Turkish aesthetic touches

---

## Color Palette

While specific colors will be defined later, establish clear semantic roles:
- **Background**: Warm off-white base creating inviting atmosphere
- **Surface**: Pure white for cards and elevated elements
- **Accent**: Warm, energetic hue for CTAs and highlights (think terracotta/warm orange family)
- **Success**: For completed transfers and positive streaks
- **Neutral Grays**: Multi-level scale for text hierarchy and borders
- **Data Visualization**: Complementary palette for charts (avoid pure primary colors)

---

## Marketing & Landing Pages

### Home Page (/)
**Hero Section** (80vh):
- Full-width background: Subtle Turkish tile pattern overlay at 3% opacity
- Center-aligned content with max-w-4xl
- Headline: "Little Choices. Big Results." (Merriweather, 56px)
- Subheadline: Story hook in 1-2 sentences about daily discipline
- CTA buttons: "Sign in with Google" (primary) + "Try with Email" (secondary) - side by side with gap-4
- Background for buttons: Backdrop blur with semi-transparent white

**How It Works Section** (py-20):
- 3-column grid (stacked on mobile)
- Each column: Icon illustration (top), Title (h3), Description (2-3 sentences)
- Steps: "Log What You Saved" → "Track Your Progress" → "Move to Savings"

**Social Proof Section**:
- Single row with 3 stat cards
- Format: Large number + Label below
- Stats: Users joined, Total saved, Average streak

**Story Teaser**:
- 2-column layout (60/40 split)
- Left: Decorative image (Turkish mosque or tiles)
- Right: Pull quote from Sanki Yedim story + "Read More" link to /about

**Final CTA Section**:
- Centered, simple: Headline + Single primary CTA
- Minimal, focused on conversion

### About Page (/about)
**Layout**:
- Single column, max-w-prose, centered
- Hero image: Turkish mosque or cultural scene (16:9 aspect ratio, rounded corners)
- Story content: 3-4 paragraphs with generous line-height (1.8)
- Pull quotes styled with left border accent and italic text
- Ending: Gentle transition CTA to "Start Your Journey"

---

## Accessibility Standards

- **Focus States**: 2px solid ring with offset, high contrast
- **Color Contrast**: Minimum 4.5:1 for body text, 3:1 for large text
- **Interactive Elements**: Minimum 44x44px touch targets on mobile
- **Form Labels**: Always visible (no placeholder-only patterns)
- **Skip Links**: "Skip to main content" for keyboard users
- **ARIA**: Proper landmarks, live regions for dynamic content updates
- **Screen Reader**: Descriptive button text, no icon-only buttons without labels

---

## Animation & Transitions

**Principles**: Purposeful motion that enhances understanding, never decorative excess

**Allowed Animations**:
- Page transitions: Gentle fade-in (200ms)
- Modal overlays: Slide-up with backdrop fade (300ms)
- Button hover: Scale (1.02) with 150ms ease-out
- Card hover: Shadow elevation shift (200ms)
- Toast notifications: Slide-in from top-right (250ms)
- Sparkline: Draw-in animation on initial load (800ms)

**Forbidden**:
- Auto-playing carousels
- Parallax scroll effects
- Continuous animations or spinners (except loading states)
- Complex page transition choreography

---

## Images

**Hero Image** (Home page):
- Lifestyle photography showing everyday moments of choice (coffee shop, bookstore)
- Warm, natural lighting with slightly desaturated tones
- Overlay: 40% dark gradient from bottom to maintain text readability
- Dimensions: Full-width, 80vh height, object-fit: cover

**About Page Image**:
- Turkish mosque or cultural tile detail
- High resolution, professionally shot
- Aspect ratio: 16:9
- Rounded corners (rounded-lg)
- Placement: Top of content, before story begins

**Dashboard Illustrations**:
- Empty states: Friendly, minimal line art illustrations
- Size: 200x200px, centered
- Style: Single-color with warm neutral tone

**Category Icons**:
- Custom illustrated icons for entry categories
- Style: Outlined, 24x24px
- Colors: Match category tags

**Settings/Profile**:
- User avatar images (Google OAuth or placeholder)
- Circular crop, 40x40px (nav), 80x80px (settings page)

---

## Responsive Breakpoints

- **Mobile**: Base styles (< 768px)
- **Tablet**: md: prefix (768px - 1024px)
- **Desktop**: lg: prefix (> 1024px)
- **Wide**: xl: prefix (> 1280px) for max-width constraints

**Mobile-First Adjustments**:
- Navigation: Hamburger menu
- KPI Grid: Single column stack
- Tables: Horizontal scroll or card view
- Forms: Full-width inputs
- Modals: Full-screen on mobile, centered on desktop