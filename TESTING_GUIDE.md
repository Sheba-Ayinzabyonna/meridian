# Testing Guide — Meridian Full User Journey

This guide walks you through testing the complete Meridian experience end-to-end.

## 🧪 Quick Start Testing

### Option 1: Test with Mock Data (Recommended for Quick Testing)

1. **Create `.env` file** in project root:
   ```
   VITE_USE_MOCK_DATA=true
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Open app** at http://localhost:5173/

4. **Complete the full journey:**
   - Welcome screen → Click "Let's go"
   - Section 1: Select any transition reason, time, and feeling
   - Section 2: Enter a professional background, select industries and level
   - Section 3: Select options, priorities, and avoid text
   - Section 4: Select time available, networking comfort, focus
   - Section 5: Enter a 90-day win statement
   - Click "Build my plan"
   - **You'll see the animated loading screen** (2.5 second mock delay)
   - **View personalized preview** with actions
   - Enter email and submit
   - **See full 30/60/90 plan** with Pro offer
   - Click "Start my first check-in" for daily check-in page

### Option 2: Test with Real n8n Webhook

1. **Follow [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md)** to configure n8n workflow

2. **Create `.env` file** with your webhook URL:
   ```
   VITE_MERIDIAN_PLAN_WEBHOOK_URL=https://your-n8n-instance.com/webhook/meridian-plan-generator
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Test the full intake → plan generation flow**

---

## 📋 Test Cases

### ✅ Form Navigation & Data Persistence

- [ ] **Back Button:** Navigate backward through sections. Verify all answers are preserved.
  - Complete Section 1, go to Section 2
  - Click Back
  - Verify Section 1 data is still there
  - Go to Section 2 again — verify data persists

- [ ] **Page Refresh:** During intake, refresh browser (F5).
  - If you're on Section 3 and refresh, you should still be on Section 3 with your data
  - Verify sessionStorage is working

- [ ] **Validation:** Skip required fields and try to submit.
  - Section 1: Try clicking Next without selecting reason
  - Should see a validation message
  - Required fields (with red asterisk) cannot be left empty

### ✅ Form Interactions

- [ ] **Multi-select Chips:** In Section 3 (priorities), select 3 items.
  - Verify you can select up to 3
  - Try selecting a 4th — it should be disabled
  - Message should show "Max reached"
  - Click to deselect an item — 4th becomes available again

- [ ] **Radio Buttons:** In Section 1 (time since), select one option.
  - Only one can be selected at a time
  - Selecting another deselects the previous

- [ ] **Text Inputs:** Type in professional background and avoid text.
  - Should accept free text without restrictions
  - Should persist when navigating back

### ✅ Plan Generation Flow

- [ ] **Loading Animation:**
  - Messages should rotate every 8 seconds
  - Compass rose should rotate (unless you have `prefers-reduced-motion` enabled)
  - After 60 seconds, final message should appear ("Good plans take a minute...")

- [ ] **Plan Preview (Aha Moment):**
  - Should show 3–5 action cards with emoji and description
  - Email capture form should be visible
  - "Maybe later" button should work (skip email)

- [ ] **Email Validation:**
  - Enter invalid email (e.g., "notanemail")
  - Click "Send my full plan"
  - Should show error: "Please enter a valid email address"
  - Enter valid email (e.g., "test@example.com")
  - Should accept and proceed

### ✅ Full Plan Display

- [ ] **30/60/90 Structure:** Verify three phases are displayed:
  - Days 1–30: Stabilize & Clarify
  - Days 31–60: Build & Connect
  - Days 61–90: Accelerate & Decide

- [ ] **Pro Card:** Verify premium offer is displayed:
  - Title: "Want to see the full picture?"
  - Price: $7.99/month
  - Two buttons: "Upgrade now" and "Maybe later"

### ✅ Daily Check-In

- [ ] **Feeling Scale:** Select each feeling (Struggling → Great).
  - Each should reveal an affirmation
  - Affirmations should change based on feeling selected

- [ ] **Progress Bar:** Verify "Day X of 90" and visual progress bar.
  - Progress bar should fill as you move through days

- [ ] **Today's Focus:** Verify task is displayed under "Today's Focus"

### ✅ Mobile Responsiveness

Test on mobile screen sizes (DevTools → Toggle Device Toolbar):

- [ ] **iPhone 12 (390px):**
  - Layout should be single-column
  - Buttons should be full-width
  - Text should be readable (16px+ for inputs)
  - Chips should wrap nicely

- [ ] **iPad (768px):**
  - Layout should adapt nicely
  - Content should not be too wide

- [ ] **Desktop (1440px):**
  - Content should be centered with max-width
  - Should not stretch full screen

### ✅ Accessibility

- [ ] **Keyboard Navigation:** Using only keyboard (Tab, Enter, Spacebar):
  - Tab through all form fields
  - Enter to select/submit
  - Shift+Tab to go backward
  - All interactive elements should be reachable

- [ ] **Focus States:** Tab through buttons.
  - Should see clear outline/highlight
  - Focus ring should be visible on form inputs

- [ ] **Color Contrast:** Use browser DevTools.
  - Right-click element → Inspect → Accessibility tab
  - Check contrast ratio (should be 4.5:1 minimum for text)

- [ ] **Reduced Motion:** DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion:
  - Compass rose should NOT spin
  - Transitions should be minimal/instant
  - Page should still be fully functional

### ✅ Error Scenarios

- [ ] **API Timeout (180 seconds):**
  - Mock: Wait 3 seconds (mock delay)
  - Real: If n8n is slow, should show timeout error after 180s
  - Should show "Something got tangled on our side" message
  - "Try again" button should be available
  - Clicking "Try again" should resubmit WITHOUT requiring intake to be filled again

- [ ] **Network Error:**
  - In DevTools, go to Network tab
  - Right-click any request → Block request URL
  - Try to complete intake
  - Should show graceful error message

### ✅ State Management

- [ ] **Cross-Screen State:** Complete full journey.
  - Verify email from Section 3 appears in Full Plan screen
  - Verify plan data from API appears correctly formatted

- [ ] **Reset:** After completing journey, click browser back or navigate to root.
  - Should show Welcome screen again
  - Previous session data should be cleared (or provide reset button)

---

## 🧪 Mock Data Test Scenarios

When using `VITE_USE_MOCK_DATA=true`, the mock service generates different plans based on intake. Try these scenarios:

### Scenario 1: Fresh Career Pivot

- Transition reason: Career pivot
- Time since: Recently
- Feeling: Curious
- Background: "Marketing manager, 8 years"
- Industries: Technology, Consulting
- Level: Manager/Team lead
- Open to: Full-time role (new field), Starting something of my own
- Priorities: Learning something new, Flexibility/remote, Mission/impact
- 90-day win: "Learn data science fundamentals and land a junior analytics role"

**Expected:** Plan focuses on skill-building, learning resources, and confidence-building

### Scenario 2: Recent Layoff, Stability Focused

- Transition reason: Layoff
- Time since: Just happened
- Feeling: Overwhelmed
- Background: "Senior architect, 20 years tech"
- Industries: Technology
- Level: Director/Senior Director
- Open to: Full-time role (same field), Consulting/Fractional
- Priorities: Income, Stability, Flexibility/remote
- 90-day win: "Secure a stable contract or full-time role with good compensation"

**Expected:** Plan emphasizes quick action, leveraging network, and stability-focused opportunities

### Scenario 3: Burnout Exit, Exploration Mode

- Transition reason: Burnout exit
- Time since: A little while ago
- Feeling: Relieved
- Background: "Operations director, 12 years"
- Industries: Healthcare, Consulting
- Level: Director/Senior Director
- Open to: All of the above, Taking a beat before deciding
- Priorities: Work-life balance, Mission/impact, Leadership opportunity
- 90-day win: "Define what matters most and find a role that honors my values"

**Expected:** Plan emphasizes reflection, self-care, and values clarification

---

## 🐛 Known Issues to Watch For

- **Chip multi-select:** Verify max 3 in Section 3
- **Email validation:** Should accept standard email formats
- **Loading messages:** Should cycle properly and change at 60-second mark
- **Plan display:** Check that all three phases have content
- **sessionStorage:** Open DevTools → Application → Session Storage → see meridian_intake_data

---

## ✅ Complete Test Checklist

- [ ] Welcome screen displays and "Let's go" works
- [ ] All 5 intake sections complete without errors
- [ ] Back navigation preserves all data
- [ ] Form validation shows errors
- [ ] Loading screen animates (with compass if not reduced-motion)
- [ ] Plan preview displays with personalized actions
- [ ] Email validation works
- [ ] Full plan displays 30/60/90 phases
- [ ] Pro card displays
- [ ] Daily check-in works
- [ ] Mobile layout looks good (tested at 390px)
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] No console errors
- [ ] sessionStorage working (refresh page, data persists)

---

## 🚀 Ready to Deploy!

Once all tests pass, you're ready to:
1. Deploy to Render (see [README.md](./README.md#-render-deployment))
2. Configure production n8n webhook
3. Launch to users

---

## 📞 Debugging Tips

**Check browser console:**
```javascript
// View current onboarding state
sessionStorage.getItem('meridian_intake_data')

// View stored email
sessionStorage.getItem('meridian_email')
```

**Test mock data in console:**
```javascript
import { getMockPlan } from './src/services/mockData.js';
const testIntake = {
  transition: { reason: ['Layoff'], timeSince: 'recently', feeling: 'hopeful' },
  professional: { background: 'Test', industries: ['Tech'], level: 'IC' },
  nextStep: { openTo: ['Full-time'], priorities: ['Income', 'Flexibility'], avoid: '' },
  energy: { availableTime: 'high', networkingComfort: 'medium', focus: 'searching' },
  goal: { ninetyDayWin: 'Land a great role', additionalContext: '' },
};
getMockPlan(testIntake).then(plan => console.log(plan));
```
