# TarotSnap Development TODO

**Last Updated:** December 2024  
**Current Phase:** Post Sprint 2 - Enhancement & Polish  
**Repository:** [peelchann/mcptest_tarotsnap](https://github.com/peelchann/mcptest_tarotsnap)

---

## 🔥 IMMEDIATE PRIORITY (Week 1)

### 🎨 **P1: Main Page Title Color Enhancement** 
**Issue:** Main page title color lacks sufficient contrast and distinction
- **File:** `app/page.tsx` (lines 106-110)
- **Current:** `bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`
- **Problem:** Title blends too much with background, lacks visual hierarchy
- **Solution:** 
  - Replace gradient text with solid gold color: `text-gold-400`
  - Add text shadow for depth: `drop-shadow-[0_2px_8px_rgba(200,173,127,0.5)]`
  - Consider adding glow effect: `shadow-xl shadow-gold-400/20`
- **Impact:** High - Improves first impression and readability
- **Scale:** Small (single file edit)

### 🧪 **P1: Visual Regression Testing Setup**
- **Status:** Chromatic configured but needs active monitoring
- **Tasks:**
  - Set up automated visual regression tests for title changes
  - Create baseline screenshots for main page variants
  - Configure CI/CD pipeline alerts for visual changes
- **Files:** `.github/workflows/`, `chromatic.config.js`

---

## 🎯 HIGH PRIORITY (Week 2-3)

### 🖥️ **P2: Responsive Design Audit**
- **Mobile Layout Issues:**
  - Main page title sizing on small screens (`text-5xl md:text-7xl` may be too large)
  - Feature cards spacing on tablet breakpoints
  - Question form width on mobile devices
- **Files:** `app/page.tsx`, `app/globals.css`
- **Testing:** Verify on 320px, 768px, 1024px, 1440px viewports

### 🎨 **P2: Color System Standardization**
- **Current Issue:** Multiple color systems in use (mystical, agatha, gold)
- **Tasks:**
  - Audit all color usage across components
  - Consolidate to primary navy/gold theme
  - Update CSS custom properties for consistency
  - Create color palette documentation
- **Files:** `tailwind.config.js`, `app/globals.css`, component files

### ♿ **P2: Accessibility Compliance (WCAG AA)**
- **Current Issues:**
  - Focus states missing on custom components
  - Color contrast ratios need verification
  - Screen reader support for animations
- **Files:** All component files, especially UI components
- **Tools:** Lighthouse audit, axe-core testing

---

## 🚀 MEDIUM PRIORITY (Week 4-6)

### 🗂️ **P3: Component Library Enhancement**
- **Current State:** Basic UI components exist but incomplete
- **Tasks:**
  - Complete Shadcn/UI component implementation
  - Add missing components: Badge, Dialog, Popover, Tooltip
  - Document component props and usage examples
  - Create Storybook setup for component development
- **Files:** `app/components/ui/`, `docs/components/`

### 🎮 **P3: Reading Experience Improvements**
- **Single Card Reading:**
  - Add card selection animation improvements
  - Implement card shuffle effect before draw
  - Add sound effects (optional toggle)
  - Improve loading states and transitions
- **Three Card Reading:** Create new reading type
- **Witch's Cross Spread:** Implement complex spread layout
- **Files:** `app/reading/`, `app/components/`

### 📊 **P3: Performance Optimization**
- **Current Issues:**
  - Large animation bundle size
  - Image loading optimization needed
  - Reduce unused CSS
- **Tasks:**
  - Implement next/image optimization
  - Code splitting for animation components
  - Lazy loading for non-critical components
  - Bundle size analysis and optimization

---

## 🔧 TECHNICAL DEBT (Ongoing)

### 📁 **File Organization & Cleanup**
- **Current Issues:**
  - Multiple Tailwind configs (`.js` and `.ts`)
  - Inconsistent import paths
  - Unused components and files
- **Tasks:**
  - Standardize on TypeScript config
  - Implement path aliases (`@/` mapping)
  - Remove unused exports and dependencies
  - Organize components into feature folders

### 🧪 **Testing Coverage Expansion**
- **Current State:** Basic smoke tests only
- **Needed:**
  - Unit tests for utility functions
  - Integration tests for reading flow
  - Component interaction tests
  - Animation performance tests
- **Target:** 80%+ test coverage

### 📚 **Documentation Updates**
- **Missing Documentation:**
  - API documentation for components
  - Development setup guide improvements
  - Deployment instructions
  - Contributing guidelines
- **Files:** `docs/`, `README.md`

---

## 🌟 FEATURE ENHANCEMENTS (Future Sprints)

### 🤖 **AI Integration**
- **Reading Interpretation AI:** Enhance card meaning generation
- **Chat Interface:** Real-time conversation with mystical AI
- **Personalization:** User reading history and preferences

### 💾 **Data & State Management**
- **User Accounts:** Optional registration for saving readings
- **Reading History:** Local storage and cloud sync
- **Preferences:** Theme selection, animation settings

### 🎨 **Advanced Theming**
- **Multiple Themes:** Classic, Dark, Light, Mystical variants
- **Custom Color Schemes:** User-defined color palettes
- **Seasonal Themes:** Halloween, solstice, etc.

### 🔧 **Developer Experience**
- **Hot Reload Improvements:** Better development server performance
- **Debug Tools:** Reading state inspector, animation debugger
- **Build Optimization:** Faster builds and deploys

---

## 📋 SPRINT PLANNING NOTES

### **Current Architecture Quality:** B+
- ✅ Strong animation system with Framer Motion
- ✅ Consistent component structure
- ✅ Good TypeScript coverage
- ⚠️ Color system needs consolidation
- ⚠️ Missing comprehensive testing
- ❌ Documentation gaps

### **Next Sprint Focus Areas:**
1. **Visual Polish:** Title colors, responsive design
2. **User Experience:** Accessibility, performance
3. **Code Quality:** Testing, documentation
4. **Foundation:** Component library completion

### **Risk Areas:**
- **Performance:** Animation complexity could impact mobile
- **Maintenance:** Multiple color systems create confusion
- **Accessibility:** Custom animations may not be screen reader friendly

---

## 📊 COMPLETION TRACKING

### Sprint 2 Status: **85% Complete**
- ✅ Core UI revamp (navy/gold theme)
- ✅ Animation system implementation  
- ✅ Component library foundation
- 🔄 Title color enhancement (in progress)
- ❌ Responsive design audit (pending)
- ❌ Accessibility compliance (pending)

### Development Velocity: **Medium-High**
- Average: 3-4 tasks per week
- Blockers: Image asset management, testing setup
- Accelerators: Good component architecture, clear documentation

---

**Development Guidelines Reference:** @coding-rule.mdc  
**Change Scale Legend:** Small (1 file), Medium (2-5 files), Large (6+ files or architectural) 