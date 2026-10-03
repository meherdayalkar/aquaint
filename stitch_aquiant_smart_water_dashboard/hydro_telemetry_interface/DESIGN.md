---
name: Hydro-Telemetry Interface
colors:
  surface: '#0d131f'
  surface-dim: '#0d131f'
  surface-bright: '#333947'
  surface-container-lowest: '#080e1a'
  surface-container-low: '#161c28'
  surface-container: '#1a202c'
  surface-container-high: '#242a37'
  surface-container-highest: '#2f3542'
  on-surface: '#dde2f4'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dde2f4'
  inverse-on-surface: '#2a303e'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffe7e8'
  on-tertiary: '#67001b'
  tertiary-container: '#ffc1c4'
  on-tertiary-container: '#b40036'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0d131f'
  on-background: '#dde2f4'
  surface-variant: '#2f3542'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.015em
  display-md-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  telemetry-metric-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  telemetry-metric-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-mono:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style
The design system establishes an authoritative, mission-critical operational interface for municipal water infrastructure, smart-city utilities, and commercial conservation operators. The aesthetic fuses high-fidelity digital twin telemetry with precise enterprise controls. The visual tone is atmospheric yet hyper-legible: deep oceanic depths illuminated by luminescent, calibrated data points.

The style combines refined dark glassmorphism with technical precision minimalism. Visual hierarchy relies on calibrated luminescence rather than heavy solids. Panels exist as translucent physical layers sitting over dynamic geographic or topological telemetry layers, maintaining spatial awareness across sensor grids, pump stations, and acoustic flow monitoring points.

## Colors
The palette leverages a deep oceanic spectrum optimized for prolonged operations center viewing, high optical contrast, and instant anomaly detection.

### Surface Canvas Hierarchy
- **Canvas Base (`#080E1A`)**: Deep abyss canvas for foundational screen background and base map voids.
- **Surface Elevation 1 (`#0B1528`)**: Primary panel container base for static layout zones and sidebars.
- **Surface Elevation 2 (`#111F38`)**: Card backgrounds, grouped telemetry zones, and table header rows.
- **Glass Panel Surface (`rgba(20, 36, 65, 0.70)`)**: Frosted backdrop for floating overlays, flyouts, and active sensor inspect cards.
- **Border Subtle (`rgba(56, 189, 248, 0.15)`)**: Fine perimeter definition across all dark glass surfaces.
- **Border Strong (`rgba(56, 189, 248, 0.35)`)**: Active sensor selection, card focus, and hovered inputs.

### Functional Accents
- **Primary Flow (`#00E5FF`, `#38BDF8`, `#0EA5E9`)**: Active hydrodynamic streams, primary interactive states, live real-time metrics, and key chart vectors.
- **Baseline & Conservation (`#10B981`, `#059669`, `#34D399`)**: Optimal flow rate indicators, verified leak resolutions, net water savings, and nominal health states.
- **Critical Alert / Rupture (`#F43F5E`, `#E11D48`, `#FDA4AF`)**: Pipe bursts, sudden pressure drops, non-revenue water anomalies, and high-priority alarms.
- **Advisory Warning (`#F59E0B`)**: Early acoustic anomaly, scheduled maintenance, and threshold warnings.

### Text & Contrast Hierarchy
- **Text Headings (`#F8FAFC`)**: Crisp optic white for maximum readability of KPIs, telemetry units, and panel labels.
- **Text Body / Secondary (`#CBD5E1`, `#94A3B8`)**: High-legibility cool slate for data values, labels, and descriptive text.
- **Text Dim / Metadata (`#64748B`)**: Timestamps, device serial numbers, lat/long tags, and secondary axis markers.

## Typography
Typographic execution combines the structural geometric authority of Plus Jakarta Sans for displays, module headers, and large metric callouts with the systematic clarity of Inter for dense analytical tables, controls, and narrative reporting.

All numerical readouts, timestamps, coordinates, and telemetry streams must be rendered using `font-variant-numeric: tabular-nums lining-nums;` to guarantee alignment stability when live streaming sensor updates. Use uppercase styling with `0.04em` letter spacing for `label-sm` to identify status tiers, system IDs, sensor modes, and units of measure (e.g., `M^3/HR`, `BAR`, `PSI`).

## Layout & Spacing
The layout relies on a fluid grid foundation engineered for high-density command consoles, multi-monitor operations, and fieldwork tablets.

### Grid Architecture
- **Desktop (1440px+)**: 12-column fluid grid with `1.5rem` (`24px`) gutters and fixed vertical control rails (64px collapsed, 240px expanded). Section canvas margins use `2rem` (`32px`).
- **Tablet / Large Mobile (768px - 1439px)**: 8-column layout with `1rem` (`16px`) gutters and `1.5rem` (`24px`) screen margins. Sidebars collapse to slide-over drawers.
- **Handheld Mobile (<768px)**: 4-column layout with `0.75rem` (`12px`) gutters and `1rem` (`16px`) edge margins. Telemetry cards stack vertically with side-scrolling chart micro-views.

Spatial rhythm strictly follows an 8px scale (with a 4px half-step for dense table cells and micro status badges). Multi-metric cards utilize interior padding of `1.25rem` to `1.5rem`, ensuring strong visual grouping while preserving edge delineation.

## Elevation & Depth
Elevation is constructed through luminescence, surface translucency, and spectral border occlusion rather than heavy drop shadows.

### Surface Tiers
- **Tier 0 (Substratum)**: Non-interactive background `#080E1A` or dynamic GIS satellite canvas.
- **Tier 1 (Panels & Card Shells)**: `#0B1528` with 80% opacity, `backdrop-filter: blur(16px)`, defined by a single 1px hairline border of `rgba(56, 189, 248, 0.12)`.
- **Tier 2 (Interactive Modules & Popovers)**: Translucent surface `rgba(20, 36, 65, 0.75)` with `backdrop-filter: blur(24px)` and a directional top highlight border of `rgba(0, 229, 255, 0.25)`. Ambient shadow: `0 8px 32px -4px rgba(2, 6, 23, 0.6)`.
- **Tier 3 (Forensic Drawers & Dialog Overlays)**: Surface `rgba(11, 21, 40, 0.94)` with `backdrop-filter: blur(32px)`, bordered by `rgba(56, 189, 248, 0.25)` with a multi-layered ambient aura: `0 24px 64px -12px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(0, 229, 255, 0.15)`.

### Optical Glows
Active telemetry states employ diffused light cones. A critical leak warning card casts a faint inner ring glow `inset 0 0 16px rgba(244, 63, 94, 0.15)` paired with a soft drop illumination `0 0 24px -6px rgba(244, 63, 94, 0.35)`.

## Shapes
A technical, soft-geometry approach (Level 1) maintains crisp industrial instrumentation qualities without appearing aggressive. Standard UI cards, input controls, and modal structures implement `rounded` (`0.25rem` / `4px`) and `rounded-lg` (`0.5rem` / `8px`) geometry. Micro badges, status pills, and forensic timeline scrubbers feature `rounded-full` (`9999px`) boundaries to contrast immediately against rectangular structural layout grids.

## Components

### Buttons
- **Primary Flow Action**: Solid cyan fill `#00E5FF` with crisp dark text `#080E1A`, bold weight (600), `rounded-lg` (8px). Hover state triggers a cyan shadow glow `0 0 16px rgba(0, 229, 255, 0.45)`.
- **Secondary Ghost**: Surface `rgba(21, 35, 62, 0.6)` with 1px border `rgba(56, 189, 248, 0.25)` and text `#F8FAFC`. Hover expands border brightness to `rgba(0, 229, 255, 0.6)` with faint background lift.
- **Destructive/Emergency**: Red outline `rgba(244, 63, 94, 0.3)` with text `#FDA4AF`. Hover fills with `rgba(244, 63, 94, 0.15)` and border `#F43F5E`.

### Telemetry Cards & KPI Badges
- **Container**: Translucent base (`rgba(20, 36, 65, 0.70)`), 1px cyan hairline border, 16px padding.
- **Header**: Top-level slot featuring uppercase `label-sm` metadata, paired with a dynamic pulse node (a 6px luminous dot surrounded by an animated ping ring matching status color: `#00E5FF` active, `#10B981` stable, `#F43F5E` critical alert).
- **Metric Readout**: Large numerical display in `telemetry-metric-xl` using tabular numbers, followed by inline unit notation in slate `#94A3B8`.
- **Mini-Sparkline**: Embedded SVG sparkline integrated directly along the card's lower boundary with gradient fill fading downward to zero opacity.

### Interactive Charts & Timeline Scrubbers
- **Vector Styling**: Hydro-pressure and flow lines drawn with 2px stroke weight in `#00E5FF` or `#10B981`. Area beneath filled with a vertical gradient from accent color at 20% opacity to 0% at the x-axis.
- **Scrubbing Reticle**: Vertical cursor line in `rgba(248, 250, 252, 0.4)` with magnetic snapping to data nodes. Value callout floats in a high-elevation mini glass pill with precise tabular metrics.
- **Timeline Range Selector**: Dark pill track with dual cyan thumb scrubbers, showing selected temporal range (e.g., `LAST 24H`, `7D`, `30D`, `CUSTOM ISO`) with micro histogram distribution previewed within the track.

### Status Pills & Anomaly Badges
- **Geometry**: Compact pill-shaped tokens (`rounded-full`), height 22px, padding 2px 10px.
- **Nominal State**: Background `rgba(16, 185, 129, 0.12)`, border `rgba(16, 185, 129, 0.3)`, text `#34D399`.
- **Warning State**: Background `rgba(245, 158, 11, 0.12)`, border `rgba(245, 158, 11, 0.3)`, text `#F59E0B`.
- **Critical Anomaly**: Background `rgba(244, 63, 94, 0.15)`, border `rgba(244, 63, 94, 0.4)`, text `#FDA4AF`.

### Forensic Drawers & Deep-Dive Modals
- **Slide-Over Panel**: Anchored to screen right (width 480px on desktop, full-screen on mobile). Solid backdrop `#0B1528` with translucent inset panels.
- **Header**: Contains breadcrumb taxonomy (e.g., `DISTRICT 4 > MAIN TRUNK B > SENSOR #9021`), raw hexadecimal device address, and instant isolation valve toggle switch.
- **Body**: Split sectioning with sticky tabs: Acoustic Waveform Analysis, Historical Pressure Deltas, Valve Actuation Logs.

### Inputs & Selection Controls
- **Text & Numerical Fields**: Height 40px, background `rgba(11, 21, 40, 0.65)`, border 1px `rgba(56, 189, 248, 0.2)`, text `#F8FAFC`. Focus ring: 1px `#00E5FF` accompanied by subtle diffuse field shadow `0 0 10px rgba(0, 229, 255, 0.2)`.
- **Checkboxes & Radios**: 16px geometric squares or discs with 1px slate-cyan border. Checked state uses solid `#00E5FF` with an oceanic navy checkmark `#080E1A`.