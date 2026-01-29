
# Apply Landing Page Style to Contact Page

## Overview
Restyle the `/contact` page to match the clean, minimal aesthetic of the home page with centered layouts, generous padding, and consistent section styling.

## Key Style Patterns from Landing Page
- **Hero sections**: `py-20 md:py-32` with centered text using `max-w-3xl mx-auto text-center`
- **Section headings**: `text-3xl font-bold mb-4` with subtitle in `text-muted-foreground`
- **Alternating backgrounds**: Plain white and `bg-muted/30` sections
- **Card grids**: Consistent gap-6 or gap-8 with max-width containers
- **Icon styling**: `h-12 w-12` containers with `bg-primary/10` and centered icons

## Changes

### 1. Hero Section Redesign
Transform the current split hero into a centered layout:
- Large centered headline: "Get in touch"
- Subtitle explaining the purpose
- Quick contact info (phone/email) displayed inline below
- Remove the side-by-side "Quick Response" card from hero

### 2. Response Time Section
Create a new standalone section with `bg-muted/30`:
- Section title: "Quick Response Times"
- Grid of response time cards (24h email, 1h WhatsApp)
- Matches the `ModuleCards` styling pattern

### 3. Contact Form Section
Restyle as centered content:
- Section heading with centered title
- Form card centered with `max-w-2xl mx-auto`
- Clean, minimal form layout

### 4. Contact Info Section
Create a new section for office and direct contact:
- Section title: "Find Us"
- Three cards in a grid layout matching `ModuleCards`
- Office address, Direct Contact, Message Us cards

### 5. Map Section
Keep the map but enhance styling:
- Use consistent section padding `py-20`
- Optional: move into the "Find Us" section

### 6. Footer
Add the same footer as the home page for consistency

## Section Order (Top to Bottom)
1. Hero (white background) - `py-20 md:py-32`
2. Response Times (muted background) - `py-20 bg-muted/30`
3. Contact Form (white background) - `py-20`
4. Contact Info + Map (muted background) - `py-20 bg-muted/30`
5. Footer

## Technical Details

### File Modified
- `src/pages/Contact.tsx`

### Styling Classes Applied
| Element | Classes |
|---------|---------|
| Hero section | `py-20 md:py-32` |
| Content wrapper | `max-w-3xl mx-auto text-center` |
| Section headings | `text-3xl font-bold mb-4` |
| Subtitles | `text-muted-foreground max-w-2xl mx-auto` |
| Card grids | `grid md:grid-cols-3 gap-6 max-w-5xl mx-auto` |
| Icon containers | `h-12 w-12 bg-primary/10 rounded-lg` |
| Alternating sections | `bg-muted/30` |
