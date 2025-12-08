# Design Guidelines: Bilingual Recruiting Website

## Design Approach

**Landing Page (/)**: Reference-based approach inspired by modern recruiting platforms (LinkedIn Careers, The Muse, and specifically the provided reference coke-ver2.monamedia.net) - emphasizing clean professionalism with subtle sophistication.

**Admin Dashboard (/admin)**: Material Design system for efficient content management with clear form patterns and data tables.

---

## Core Design Elements

### Typography

**Landing Page:**
- Headlines: Inter or Poppins, weights 600-700, sizes: 48px (desktop hero), 36px (section headers), 24px (job titles)
- Body: Inter Regular 16px, line-height 1.6 for optimal readability
- CTA buttons: Inter SemiBold 16px, uppercase tracking-wide

**Admin Dashboard:**
- System: Inter throughout for consistency
- Form labels: 14px Medium
- Input text: 16px Regular
- Table headers: 14px SemiBold

### Layout System

**Spacing Units:** Use Tailwind spacing of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24 (desktop), py-12 (mobile)
- Card gaps: gap-6 to gap-8

**Grid Systems:**
- Landing: max-w-7xl container, grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for job cards
- Admin: max-w-6xl container, single column forms with max-w-2xl for optimal form width

---

## Landing Page Components

### Hero Section
- Full viewport height (min-h-screen) with background image/video support
- Centered content with max-w-4xl
- Headline + subtitle + CTA button stack
- Language toggle positioned top-right (absolute top-6 right-6)
- Overlay gradient for text readability
- CTA button with backdrop-blur-sm bg-white/10 treatment

### Navigation
- Sticky header with backdrop-blur-md
- Logo left, language toggle right
- Minimal navigation: Home, Jobs, About, Contact
- Height: h-20, horizontal padding px-6

### Job Listings Section
- Grid layout: 3 columns desktop, 2 tablet, 1 mobile
- Job cards with:
  - Rounded-xl with subtle shadow (shadow-md hover:shadow-xl transition)
  - Padding p-6
  - Job title (text-xl font-semibold)
  - Department + Location (text-sm with icons from Heroicons)
  - Salary range (text-lg font-medium)
  - Short description excerpt (text-sm line-clamp-3)
  - "Apply Now" button (full-width or inline with arrow icon)
  - Active/Inactive visual indicator

### Additional Sections
- **Why Join Us**: 3-column feature grid with icons, titles, descriptions
- **Company Values**: 2-column alternating image-text layout
- **Testimonials**: Carousel or 3-column grid with employee quotes
- **Contact/CTA**: Full-width section with centered content

### Footer
- 3-column layout: Company info, Quick links, Contact details
- Social media icons (Heroicons or Font Awesome)
- Copyright + language selector
- Background slightly elevated from main content

---

## Admin Dashboard Components

### Layout
- Sidebar navigation (w-64) with logo, menu items, logout
- Main content area with page header + breadcrumbs
- White background with subtle borders

### Forms (Hero Editor, Job Forms)
- Stacked label-above-input pattern
- Input groups with consistent spacing (space-y-6)
- Bilingual field pairs side-by-side on desktop (grid-cols-2 gap-4)
- Field structure:
  - Label: text-sm font-medium mb-2
  - Input: rounded-lg border px-4 py-2.5 text-base
  - Helper text: text-xs mt-1
- Radio buttons for background type (image/video)
- File upload with preview thumbnail
- Rich text editor for description/requirements fields
- Toggle switch for isActive status
- Action buttons: Save (primary), Cancel (secondary), aligned right

### Tables (Job Listings)
- Full-width responsive table
- Columns: Title, Department, Location, Status, Actions
- Row hover state with subtle background
- Action buttons: Edit (icon), Delete (icon) with confirmation
- "Create New Job" button top-right above table
- Pagination if needed (bottom-center)

### Cards
- Rounded-lg with border
- Padding p-6
- Shadow-sm for subtle elevation
- Used for statistics, quick actions

---

## Animations (Minimal)

- Hero entrance: Fade-in + slide-up on load (Framer Motion)
- Job cards: Stagger animation on scroll-into-view (delay 50ms each)
- Button hover: Scale 1.02 + shadow increase
- Form submission: Loading spinner overlay
- No parallax, no complex scroll animations

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, full-width CTAs, stacked forms)
- Tablet: 768px - 1024px (2-column grids, sidebar collapses to hamburger)
- Desktop: > 1024px (full layouts as described)

**Mobile Considerations:**
- Language toggle becomes dropdown or icon button
- Admin sidebar becomes hamburger menu
- Tables convert to card-based mobile view
- Touch-friendly button sizes (min h-12)

---

## Images

**Hero Section:**
- Large, professional hero image (1920x1080+)
- Subject: Modern office environment, diverse team collaborating, or company-specific branding
- Treatment: Subtle gradient overlay (from transparent to dark at bottom) for text contrast
- Alternative: Background video (loop, muted, office scenes or company culture)

**Why Join Us / Company Values:**
- Supporting images: Office spaces, team events, workplace culture
- Size: 800x600 minimum
- Treatment: Rounded corners (rounded-xl), subtle shadow

**Placeholder locations:**
- No actual images needed in code - use placeholder services or background gradients initially
- Image fields in admin allow upload for dynamic replacement

---

## Language Toggle

- Pill-shaped toggle button with flags or text labels (VI | EN)
- Active state: filled background
- Inactive state: transparent with border
- Position: Top-right of viewport (fixed or sticky)
- Icon-only on mobile (space-saving)