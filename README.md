# Meridian — AI Career Transition Co-Pilot

An intelligent, compassionate web application designed to support women during the first 90 days after a major career change. Whether navigating a layoff, burnout exit, career pivot, or organizational restructure, Meridian provides personalized guidance, structure, and emotional support.

## 🧭 Product Overview

**Core Promise:** "Find your next point of reference."

Meridian transforms uncertainty into structured action by:

1. Collecting personal career context through a warm, conversational intake
2. Generating a personalized 30/60/90-day action plan via AI
3. Previewing key insights before email capture
4. Delivering the full roadmap with daily check-in support
5. Offering premium coaching and extended roadmaps via subscription

The experience is designed to feel warm, calm, premium, and encouraging—never clinical or corporate.

## 🎯 Problem & Target User

**Problem:** After a career transition, women often experience:
- Emotional overwhelm and uncertainty
- Lack of structured guidance
- Fear of "wasting time"
- Isolation and self-doubt

**Target User:** Professional women (IC, manager, or executive level) experiencing career transitions who want:
- Clarity on what to do next
- Structured, realistic guidance
- Emotional intelligence and warmth
- Actionable first steps within hours, not days

## 🚀 Core User Journey

```
Welcome Screen
    ↓
5-Section Progressive Intake (What happened? Who are you? What's next? Energy check? One more thing?)
    ↓
Building Plan (Animated loading with rotating messages)
    ↓
Aha Preview (30-day highlights without email required)
    ↓
Email Capture (Natural progression to full plan)
    ↓
Full 30/60/90 Plan + Pro Upgrade
    ↓
Daily Check-In Support
```

## ✨ Key Features (MVP)

### Welcome Screen
- Warm, welcoming introduction
- Elegant serif wordmark ("Meridian")
- Tagline: "Find your next point of reference"
- Subtle compass rose watermark
- CTA to begin

### Progressive Intake (5 Sections)
1. **What happened?** — Transition reason, timing, emotional state
2. **Who are you professionally?** — Background, industry, level
3. **What do you want next?** — Career paths, priorities (max 3), constraints
4. **Energy check** — Available time, networking comfort, job search focus
5. **One more thing** — 90-day win definition, additional context

**Design:** One section at a time, progress indicator, back button preserves all answers, conversational microcopy.

### Plan Generation
- 180-second timeout with AbortController
- Animated compass rose (respects `prefers-reduced-motion`)
- Rotating loading messages
- Graceful error handling with retry (preserves intake data)

### Aha Moment (Plan Preview)
- 3–5 personalized action items from first 30 days
- Beautiful card layout
- Email capture with validation
- Privacy notice
- Shows preview before asking for contact info

### Full 30/60/90 Plan
- Organized into three phases:
  - **Days 1–30:** Stabilize & Clarify
  - **Days 31–60:** Build & Connect
  - **Days 61–90:** Accelerate & Decide
- Actionable items and milestones for each phase
- Email confirmation banner
- Pro upgrade invitation card ($7.99/month)

### Daily Check-In
- One-question-at-a-time interaction
- Feeling scale (😔 Struggling → 🔥 Great)
- Personalized affirmation based on feeling
- Today's focus task pulled from 90-day plan
- Day X of 90 progress indicator

## 💻 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Routing** | React Router v6 (if needed) |
| **State Management** | React Context + useReducer |
| **Data Persistence** | sessionStorage (client-side) |
| **API Communication** | Native Fetch API |
| **AI/Backend Workflow** | n8n (webhook-based) |
| **Styling** | Tailwind CSS + custom components |
| **Hosting** | Render (static site or Node server) |

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Chip.jsx
│   ├── CompassRose.jsx
│   ├── ErrorState.jsx
│   ├── FormSection.jsx
│   ├── MeridianLogo.jsx
│   ├── ProgressBar.jsx
│   ├── TextArea.jsx
│   ├── TextInput.jsx
│   └── index.js
│
├── context/              # State management
│   └── OnboardingContext.jsx
│
├── pages/                # Full-screen page components
│   ├── BuildingPlanPage.jsx
│   ├── DailyCheckInPage.jsx
│   ├── FullPlanPage.jsx
│   ├── IntakeSection1Page.jsx
│   ├── IntakeSection2Page.jsx
│   ├── IntakeSection3Page.jsx
│   ├── IntakeSection4Page.jsx
│   ├── IntakeSection5Page.jsx
│   ├── PlanPreviewPage.jsx
│   ├── WelcomePage.jsx
│   └── index.js
│
├── services/             # External API integration
│   └── meridianApi.js
│
├── constants/            # Constants and config
│   └── config.js
│
├── App.jsx               # Main routing and layout
├── main.jsx              # React entry point
└── index.css             # Global styles + Tailwind

Root files:
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🎨 Design System

### Colors
- **Primary Teal:** `#0D4F5C` (deep, calming)
- **Accent Gold:** `#C9A84C` (warm, hopeful)
- **Background Cream:** `#F8F4EC` (soft, welcoming)
- **Alert Coral:** `#E8A9A1` (soft, not jarring)
- **Text:** `#FFFFFF` on teal, `#1F2937` on light backgrounds

### Typography
- **Headings:** Playfair Display (elegant serif)
- **Body/UI:** Inter or DM Sans (clean sans-serif)
- **Font scale:** 14px (body), 16px (labels), 20px (section titles), 32px+ (main headings)

### Visual Motif
- **Compass Rose:** Subtle watermark, loading animation, progress indicator
- Avoid: overuse, harsh lines, corporate imagery

### Spacing & Layout
- Mobile-first (375px–430px baseline)
- Generous whitespace
- Rounded corners (12px cards, pill buttons)
- Subtle shadows, soft transitions

## 🚀 Local Installation

### Prerequisites
- Node.js 16+ and npm (or yarn)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd meridian
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure API endpoint**
   Edit `.env` and add your n8n webhook URL:
   ```
   VITE_MERIDIAN_PLAN_WEBHOOK_URL=https://your-n8n-instance.com/webhook/meridian-plan-generator
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   The app opens at `http://localhost:5173`

## 📋 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_MERIDIAN_PLAN_WEBHOOK_URL` | n8n webhook for plan generation | `https://n8n.example.com/webhook/plan` |

Never commit `.env` with real credentials. Use `.env.example` as a template.

## 🔌 n8n Integration

### Webhook Endpoint

The frontend sends a POST request to your n8n webhook with the following payload:

```json
{
  "transition": {
    "reason": ["Layoff", "Career pivot"],
    "timeSince": "recently",
    "feeling": "hopeful"
  },
  "professional": {
    "background": "Enterprise architect, 20 years in tech",
    "industries": ["Technology", "Consulting"],
    "level": "Director/Senior Director"
  },
  "nextStep": {
    "openTo": ["Full-time role (new field)", "Consulting/Fractional"],
    "priorities": ["Flexibility/remote", "Learning something new", "Mission/impact"],
    "avoid": "No toxic cultures"
  },
  "energy": {
    "availableTime": "high",
    "networkingComfort": "medium",
    "focus": "searching"
  },
  "goal": {
    "ninetyDayWin": "Land a role that excites me",
    "additionalContext": "Open to adjacent industries"
  },
  "timestamp": "2026-10-07T14:32:00.000Z"
}
```

### Expected Response

The n8n workflow should return a normalized plan structure:

```json
{
  "preview": {
    "title": "Here's a glimpse of your first 30 days...",
    "message": "Your full 90-day plan is ready...",
    "actions": [
      {
        "title": "Clarify Your Next Move",
        "description": "Spend 30 minutes writing what energizes you..."
      }
    ]
  },
  "thirtyDays": {
    "title": "Days 1–30: Stabilize & Clarify",
    "description": "Stabilize, reflect, clarify, and establish momentum.",
    "items": ["Action 1", "Action 2"]
  },
  "sixtyDays": {
    "title": "Days 31–60: Build & Connect",
    "description": "...",
    "items": []
  },
  "ninetyDays": {
    "title": "Days 61–90: Accelerate & Decide",
    "description": "...",
    "items": []
  },
  "dailyCheckins": {
    "affirmations": [],
    "focusAreas": []
  }
}
```

The `meridianApi.js` service normalizes this response. If fields are missing, defaults are provided.

## 🛠️ Running Locally

### Development

```bash
npm run dev
```

Starts Vite dev server at `http://localhost:5173` with hot module reloading.

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally at `http://localhost:4173`.

## 🌐 Render Deployment

### Setup

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Create a new **Static Site** service
   - Connect your GitHub repository
   - Set Build Command: `npm run build`
   - Set Publish Directory: `dist`
   - Add environment variable: `VITE_MERIDIAN_PLAN_WEBHOOK_URL`

3. **Deploy**
   - Render auto-deploys on every push to main
   - Monitor deployment logs

### Environment Variables on Render

Add in Render dashboard:

```
VITE_MERIDIAN_PLAN_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...
```

## 🧪 Testing Checklist

- [ ] Mobile responsiveness (375px, 768px, 1440px widths)
- [ ] Back navigation preserves all intake answers
- [ ] Form validation and error states
- [ ] API timeout at 180 seconds with error handling
- [ ] Retry without re-entering data
- [ ] Keyboard navigation and focus states
- [ ] `prefers-reduced-motion` respected (compass doesn't spin)
- [ ] Accessibility (ARIA labels, semantic HTML, color contrast)
- [ ] Email validation and privacy notice
- [ ] State persistence across page refresh (during onboarding)
- [ ] Slow network simulation (DevTools)
- [ ] API failure scenarios

## 🔒 Security & Privacy

- **No hardcoded secrets:** API URLs in environment variables only
- **Input validation:** Email and text inputs sanitized
- **No dangerous HTML:** Plan content rendered safely (no `dangerouslySetInnerHTML`)
- **Session-based:** No persistent user accounts in MVP (uses sessionStorage)
- **Privacy-first:** Minimal data collection, privacy notice on email capture
- **HTTPS-ready:** Fetch requests compatible with HTTPS

## 📈 Known MVP Limitations

- **No user accounts:** Data resets on browser close (uses sessionStorage)
- **No email backend:** Plan not actually sent via email in MVP (would require backend)
- **No payment processing:** Pro upgrade is a placeholder
- **No resume rewriting:** That's a Pro feature
- **No recruiter triage:** Day 3 of challenge build
- **No networking recommendations:** Day 4 of challenge build
- **No Analytics:** Usage tracking not implemented

## 🚀 Future Roadmap

### Phase 2: Accounts & Persistence
- User authentication (email/password or OAuth)
- Database storage of plans and check-ins
- Plan editing and version history

### Phase 3: Premium Features
- 180-day extended roadmap
- AI-powered resume rewriting
- Recruiter email triage
- Networking recommendations

### Phase 4: Engagement
- Daily SMS/email reminders
- Personalized AI coaching via chat
- Application tracking system
- Saved opportunities feed
- LinkedIn optimization

### Phase 5: Community
- Peer support network (beta users)
- Expert interviews and resources
- Progress celebrations and milestones

## 📞 Support & Questions

For issues or feedback, contact the product team or open a GitHub issue.

## 📄 License

Meridian is proprietary. All rights reserved.

---

**Built with ❤️ for women navigating career transitions.**

*"Career shifts open doors you didn't know existed. Time to breathe. Space to build. Permission to finally do the thing."*
