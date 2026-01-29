
## Add Visible Red Pin Marker to Google Maps

The Google Maps embed iframe doesn't support custom markers directly via URL parameters. I'll create a visual overlay solution using CSS to add a red pin marker on top of the map.

---

### Solution Approach

Since the standard Google Maps embed doesn't display markers for place searches (it only shows the location without a pin), I'll add a **CSS-positioned pin icon** that overlays the center of the map.

---

### How It Will Look

The map will have a red location pin icon positioned at the center, pointing to the exact building location. The pin will be styled to look like a standard Google Maps marker.

---

### Technical Changes

| File | Change |
|------|--------|
| `src/pages/Contact.tsx` | Wrap the iframe in a relative container and add an absolutely-positioned pin icon using Lucide's `MapPin` component |

The implementation will:
1. Add a `relative` wrapper around the iframe
2. Position a red `MapPin` icon at the center of the map
3. Use CSS transforms to ensure the pin tip points to the exact location
4. Add a subtle shadow for depth

```text
+---------------------------+
|                           |
|          [MAP]            |
|            📍             |  <-- Red pin overlaid at center
|                           |
+---------------------------+
```

---

### Code Preview

```tsx
<div className="relative">
  <iframe src="..." />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
    <MapPin className="h-10 w-10 text-red-600 fill-red-600 drop-shadow-lg" />
  </div>
</div>
```

This approach ensures the pin is always visible regardless of how Google renders the embedded map.
