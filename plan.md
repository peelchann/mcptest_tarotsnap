# Sprint 1 – Stabilise & Show the Cards

## Issues Identified
1. Missing card images - 404 errors for image files (e.g., `/images/tarot/the-moon.jpg`)
2. Runtime error toasts appearing to users
3. No loading states or placeholders for images
4. No star-canvas fallback during loading
5. No testing for the TarotCard component
6. README needs updating for smoother onboarding

## Implementation Plan

### Stage 1: Fix Image Loading Issues
- Add a skeleton placeholder for card images
- Fix file naming/path inconsistency between card data and actual files
- Implement proper error handling for missing images

### Stage 2: Add Loading States and Fallbacks
- Create loading states for all components
- Implement star-canvas background fallback
- Remove runtime error toast notifications

### Stage 3: Testing
- Set up Jest + React Testing Library
- Create smoke test for TarotCard component

### Stage 4: Documentation Update
- Update README with clear installation instructions
- Document project structure and usage

## Immediate Actions
1. Create a skeleton component for image loading
2. Fix image paths in cards.ts to match actual file naming convention
3. Enhance CardImage component with better error handling 