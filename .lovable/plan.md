
## Optimize Login Page with Skeletons and Progressive Rendering

### Overview
Add skeleton placeholders and a staged reveal so the login page feels instant -- the layout and form shapes appear immediately, then content fills in progressively as assets load.

### Changes

#### 1. Auth.tsx -- Add a skeleton shell that renders instantly (File: `src/pages/Auth.tsx`)

- Show the full page layout (navbar, card shell) immediately with no animation delay
- **Left panel**: Render a skeleton shimmer (pulsing `bg-muted` div) that is always visible until `imageLoaded` is true, then crossfade to the real image using `AnimatePresence`
- **Right panel**: Show an `AuthFormSkeleton` component (skeleton lines for header, 2-3 input shapes, button shape) that renders for the first ~200ms while the form mounts, then fades out as the real `AuthForm` fades in
- Reduce initial animation delays: navbar from 0.5s to 0.3s, card entrance delay from 0.15-0.2s to 0s (render skeleton instantly, animate content in on top)

#### 2. New component: `AuthFormSkeleton` (File: `src/components/auth/AuthFormSkeleton.tsx`)

A lightweight skeleton that mimics the form layout:
- A wide skeleton line (title) + a narrower line (subtitle)
- Two tall rounded-xl skeleton rectangles (email + password inputs)
- One full-width skeleton button shape
- All using the existing `Skeleton` component from `src/components/ui/skeleton.tsx`
- Renders with zero delay so users see a structured layout immediately

#### 3. Auth.tsx -- Progressive image reveal

- Keep the existing `useImagePreload` hook
- Wrap the image + skeleton in `AnimatePresence` so the skeleton fades out and image fades in smoothly
- Remove the skeleton's `animate-pulse` when image is loaded

#### 4. Auth.tsx -- Staged content reveal timing

Current delays are stacked (navbar 0.5s, card 0.7s, panels 0.8s, text 0.8s+). New approach:
- Navbar: instant (0s delay, 0.3s duration)
- Card shell with skeletons: 0.05s delay, 0.4s duration
- Real form content replaces skeleton: 0.2s delay after card appears
- Image crossfade: triggered by `imageLoaded` (no fixed delay)

---

### Technical Details

**`src/components/auth/AuthFormSkeleton.tsx`** (new file):
- Uses `Skeleton` from `@/components/ui/skeleton`
- Renders: heading skeleton (h-8 w-3/4), subtext skeleton (h-4 w-1/2 mt-2), two input skeletons (h-12 w-full rounded-xl mt-5), button skeleton (h-12 w-full rounded-xl mt-6)
- Wrapped in a div matching the form's padding/spacing

**`src/pages/Auth.tsx`** changes:
- Import `AuthFormSkeleton` and `Skeleton`
- Add `const [formReady, setFormReady] = useState(false)` with a `useEffect(() => { const t = setTimeout(() => setFormReady(true), 150); return () => clearTimeout(t) }, [])`
- Right panel: render `AuthFormSkeleton` when `!formReady`, crossfade to `AuthForm` when `formReady`
- Left panel: wrap skeleton placeholder and image in `AnimatePresence` keyed on `imageLoaded`
- Reduce all entrance animation delays as described above
