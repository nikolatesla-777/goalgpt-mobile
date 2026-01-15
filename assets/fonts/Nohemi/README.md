# Nohemi Font Installation

## Required Font Files

According to the GoalGPT Brandbook, the Nohemi font family is our primary brand font.

Please add the following Nohemi font files to this directory:

```
Nohemi/
├── Nohemi-Regular.ttf
├── Nohemi-Medium.ttf
├── Nohemi-SemiBold.ttf
└── Nohemi-Bold.ttf
```

## Where to Get Nohemi Fonts

Nohemi is a commercial font. Please obtain it from:
- **Official Source**: The GoalGPT brand assets package
- **Alternative**: Download from the brandbook provided fonts folder
- **Purchase**: If needed, purchase from the official Nohemi font distributor

## Font Weights

- **Regular (400)**: UI text, body copy
- **Medium (500)**: Subtitles, emphasized text
- **SemiBold (600)**: Section headers, important labels
- **Bold (700)**: Page titles, main headers

## Installation

1. Add the `.ttf` files to this directory
2. The app will automatically load them on next launch
3. No code changes needed - fonts are already configured in `app/_layout.tsx`

## Fallback

If Nohemi fonts are not available, the app will fall back to:
- **iOS**: System (San Francisco)
- **Android**: Roboto

This ensures the app works during development even without the commercial fonts.

## Brand Compliance

Using Nohemi is essential for brand compliance. Please prioritize obtaining these fonts from the official brand assets.

---

**Status**: 🟡 REQUIRED - Please add font files before production build
