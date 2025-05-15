# Sprint 2 – Crystal-Clear UX

## Objective
Make all copy and CTAs legible; establish visual hierarchy on the home screen.

## Tasks

### UX-01: Global colour-contrast update
- Audit current color usage throughout the application
- Update text colors for better contrast against backgrounds
- Ensure all text and interactive elements pass WCAG-AA standards
- Verify Lighthouse accessibility score ≥90

### UX-02: Elevate primary CTA buttons
- Identify all primary CTA buttons in the application
- Update styling to:
  - 100% opacity (remove any opacity/transparency)
  - Add hover:scale-105 effect
  - Add ring-2 styling for visual emphasis
- Focus on "Draw a Card", "Begin Reading", and "Deep Dive" buttons

### UX-06: Header typography polish
- Update header typography:
  - H1 (Agatha logo) size to 3rem
  - Subtitle to 1rem
  - Adjust line-height for better readability

### TEST-02: Visual regression snapshots
- Set up Chromatic for visual regression testing
- Integrate with pull request workflow
- Ensure any color/token changes are flagged in PRs

## Implementation Steps
1. Update the theme colors in Tailwind config for better accessibility
2. Enhance button component styling across the application
3. Refine typography system for headers
4. Add testing setup for visual regression

## Success Criteria
- All text and buttons pass WCAG-AA accessibility standards
- Lighthouse accessibility score ≥90
- Clear visual hierarchy on the home screen
- Verified readability on 13-inch laptop at 70% screen brightness 