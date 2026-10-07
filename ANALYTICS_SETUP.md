# Analytics & Tracking Setup

This guide helps you understand user behavior and optimize Meridian.

## 📊 Analytics Tools

### Option 1: Posthog (Recommended)

**Why:** Product-focused, privacy-first, good free tier

**Setup:**
```bash
npm install posthog-js
```

**In App.jsx:**
```javascript
import posthog from 'posthog-js';

// Initialize after app loads
useEffect(() => {
  if (import.meta.env.VITE_POSTHOG_KEY) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: 'https://app.posthog.com',
    });
  }
}, []);
```

**Environment variables:**
```
VITE_POSTHOG_KEY=phc_xxxxxxxxxxxx
```

**Track events:**
```javascript
import { usePostHog } from 'posthog-js/react';

const posthog = usePostHog();

// Track form completion
posthog.capture('intake_section_completed', {
  section: 1,
  duration_seconds: 45,
});

// Track plan generation
posthog.capture('plan_generated', {
  api_response_time_ms: 2500,
});
```

### Option 2: Mixpanel

**Why:** Robust, good funnel analysis

**Setup:**
```bash
npm install mixpanel-browser
```

### Option 3: Google Analytics 4

**Why:** Free, integrates with other Google tools

**Setup:**
```bash
npm install @react-ga/core @react-ga/page-view
```

---

## 📈 Key Metrics to Track

### Funnel Metrics
- [ ] Welcome page views
- [ ] Intake start (clicked "Let's go")
- [ ] Intake completion rate (by section)
- [ ] Plan generation success rate
- [ ] Email capture rate
- [ ] Full plan view rate
- [ ] Daily check-in completion rate

**Tracking code example:**
```javascript
// In each page component
useEffect(() => {
  analytics.track('page_view', {
    page: 'intake_section_1',
  });
}, []);
```

### Conversion Events
- [ ] Intake completed
- [ ] Plan generated successfully
- [ ] Email captured
- [ ] Pro upgrade clicked
- [ ] Daily check-in completed

### Engagement Metrics
- [ ] Average time spent per section
- [ ] Back button usage (indicates confusion)
- [ ] Retry rate on API failures
- [ ] Time to completion

### User Cohorts
- [ ] New vs. returning users (by sessionStorage key)
- [ ] Users by transition reason
- [ ] Users by professional level
- [ ] Completion rate by cohort

---

## 🎯 Analytics Implementation

```javascript
// services/analytics.js
export const analytics = {
  track: (event, properties = {}) => {
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${event}`, properties);
    }
    
    // Send to Posthog, Mixpanel, etc.
    if (window.posthog) {
      window.posthog.capture(event, properties);
    }
  },

  identify: (userId, properties = {}) => {
    if (window.posthog) {
      window.posthog.identify(userId, properties);
    }
  },

  pageView: (page) => {
    if (window.gtag) {
      window.gtag('event', 'page_view', { page });
    }
  },
};
```

**Usage in components:**
```javascript
import { analytics } from '../services/analytics';

export function IntakeSection1Page() {
  useEffect(() => {
    analytics.track('intake_section_1_viewed');
  }, []);

  const handleNext = () => {
    analytics.track('intake_section_1_completed', {
      transition_reason: state.intake.transition.reason,
      feeling: state.intake.transition.feeling,
    });
    setStage(ONBOARDING_STAGES.INTAKE_2);
  };

  // ...
}
```

---

## 📊 Dashboard Insights

### What to Monitor Weekly

1. **Conversion Funnel**
   - Welcome → Intake 1: ___% converted
   - Intake 1 → Intake 2: ___% converted
   - Plan preview → Email capture: ___% converted
   - Overall completion rate: ____%

2. **Friction Points**
   - Where do users drop off most?
   - Which sections have highest back-button usage?
   - What's average time per section?

3. **API Performance**
   - Plan generation success rate: ____%
   - Average response time: ___ms
   - Error rate: ____%
   - Timeout incidents: ____

4. **User Feedback**
   - Email quality and content relevance
   - Plan usefulness ratings (could add survey)
   - Most common transition reasons
   - Most common desired priorities

---

## 🔄 Feedback Loop

### Collect Feedback
Add optional post-completion survey:
```javascript
// After daily check-in
export function FeedbackSurvey() {
  return (
    <div className="mt-8 p-6 bg-meridian-cream rounded-xl">
      <p className="font-semibold mb-3">Quick feedback</p>
      <label>
        <input type="radio" name="helpful" value="yes" />
        This plan is helpful
      </label>
      <label>
        <input type="radio" name="helpful" value="no" />
        I'd like improvements
      </label>
      <textarea placeholder="What would help most?" />
      <Button onClick={submitFeedback}>Send feedback</Button>
    </div>
  );
}
```

### Analyze & Iterate
1. Review analytics weekly
2. Identify top issues
3. Update plan generation prompts
4. Test changes
5. Measure impact
6. Repeat

---

## 🔐 Privacy Considerations

- **No PII in events:** Don't track full responses in analytics
- **Anonymous sessions:** Default, opt-in for identified users
- **Compliance:** GDPR, CCPA ready (Posthog handles this)
- **Data retention:** Delete old data per privacy policy

**Privacy policy reminder for email:**
```
"We use analytics to understand how Meridian is used and improve it. 
Your data is never sold or shared with third parties."
```

---

## 📞 Next Steps

When ready:
1. Choose analytics tool (Posthog recommended)
2. Install SDK
3. Add tracking to key events
4. Set up dashboard
5. Review weekly
6. Iterate based on data

For MVP: Focus on funnel completion rate and API success rate.
