# Testing Guide for CodSoft Projects

## Quick Test Checklist

### Task 1 - Portfolio
**Desktop View:**
- [ ] Navigation links work and scroll smoothly to sections
- [ ] Hero buttons ("View Projects", "Download Resume") work
- [ ] All sections visible: About, Skills, Projects, Resume, Contact
- [ ] Skill cards and project cards have hover effects
- [ ] Footer links work

**Mobile View (resize browser < 768px):**
- [ ] Hamburger menu appears
- [ ] Hamburger menu opens/closes on click
- [ ] Menu items close menu when clicked
- [ ] All content stacks vertically
- [ ] Text remains readable

**Test Actions:**
1. Click navigation links - should scroll to sections
2. Click hamburger menu (mobile) - should open/close
3. Hover over skill cards - should lift up
4. Hover over project cards - should lift up
5. Scroll down - navbar should remain fixed at top

---

### Task 2 - Landing Page
**Desktop View:**
- [ ] Fixed navbar with "Get Started" button
- [ ] Hero section with animated floating cards
- [ ] Solution cards (4 cards in grid)
- [ ] How It Works section with 3 steps and arrows
- [ ] Why FINTECH AI section with stats
- [ ] CTA section with button
- [ ] Footer with 4 columns

**Mobile View:**
- [ ] Hamburger menu appears
- [ ] All sections stack vertically
- [ ] Floating cards hidden on mobile (design choice)
- [ ] Arrows in "How It Works" rotate vertically
- [ ] Footer columns stack

**Test Actions:**
1. Scroll page - navbar stays fixed
2. Click navigation links - smooth scroll to sections
3. Hover over solution cards - should lift up
4. Check mobile responsiveness (< 768px)
5. All buttons should be clickable

---

### Task 3 - Calculator
**Basic Operations:**
- [ ] Click numbers 0-9 - should display
- [ ] Click decimal point - should add (only one per number)
- [ ] Click AC - should clear display
- [ ] Click backspace (⌫) - should delete last digit
- [ ] Click operators (+, −, ×, ÷) - should highlight
- [ ] Click equals (=) - should calculate result

**Test Calculations:**
1. **Addition:** 5 + 3 = (should show 8)
2. **Subtraction:** 10 - 4 = (should show 6)
3. **Multiplication:** 7 × 8 = (should show 56)
4. **Division:** 20 ÷ 4 = (should show 5)
5. **Decimal:** 5.5 + 2.5 = (should show 8)
6. **Percentage:** 50 then click % (should show 0.5)
7. **Division by zero:** 5 ÷ 0 = (should show error and shake)
8. **Chained:** 2 + 3 + 4 = (should show 9)

**Keyboard Support:**
- [ ] Type numbers with keyboard
- [ ] Type operators (+, -, *, /)
- [ ] Press Enter to calculate
- [ ] Press Backspace to delete
- [ ] Press Escape to clear
- [ ] Press % for percentage

**Mobile View:**
- [ ] Calculator remains centered
- [ ] Buttons are touch-friendly
- [ ] Display text scales appropriately

---

## Browser Compatibility

**Test in these browsers if possible:**
- ✓ Google Chrome
- ✓ Microsoft Edge
- ✓ Firefox
- ✓ Safari (if on Mac)

---

## Responsive Breakpoints

**Test these screen widths:**
- 1920px - Large desktop
- 1366px - Standard laptop
- 1024px - Tablet landscape
- 768px - Tablet portrait (hamburger menu appears)
- 480px - Mobile landscape
- 360px - Mobile portrait

**How to test:**
1. Press F12 in browser (DevTools)
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Select different device sizes from dropdown
4. Or manually drag to resize

---

## Known Behaviors (Not Bugs)

**Portfolio:**
- Resume download link shows note to add PDF (expected)
- Profile image is SVG placeholder (replace with your photo)
- Contact links are placeholders (update with your info)

**Landing Page:**
- All links scroll to sections or are placeholders (no external pages needed)
- Floating cards animation is subtle (intentional)

**Calculator:**
- Very large numbers shown in exponential notation (correct)
- Division by zero shows error and auto-clears (safety feature)
- Multiple decimal points prevented (correct behavior)

---

## Quick Browser Console Check

**Press F12 and check Console tab:**
- ✓ Should see NO red errors
- ✓ Should see NO warnings about missing files
- ✓ All CSS and JS files should load successfully

---

## Performance Check

All projects should:
- Load instantly (no external dependencies)
- Be smooth when scrolling
- Have no lag on button clicks
- Animations should be smooth at 60fps

---

## Final Verification

Before uploading to GitHub, verify:
1. All three projects open without errors
2. No broken images (except placeholders you need to replace)
3. All buttons and links work as expected
4. Mobile menu works on all projects
5. Calculator performs all operations correctly
6. All pages look professional and polished

---

**If you find any issues, let me know and I'll fix them immediately!**
