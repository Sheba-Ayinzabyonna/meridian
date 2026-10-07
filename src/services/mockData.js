/**
 * Mock Data Service for Testing
 * Provides realistic test data without requiring n8n webhook
 * Only available in development mode
 */

export function getMockPlan(intakeData) {
  // Simulate a realistic delay (like API response)
  return new Promise((resolve) => {
    setTimeout(() => {
      const plan = generatePersonalizedPlan(intakeData);
      resolve(plan);
    }, 2500); // 2.5 second delay
  });
}

function generatePersonalizedPlan(intake) {
  const background = intake.professional.background || 'professional';
  const win = intake.goal.ninetyDayWin || 'achieve your career goals';
  const priorities = intake.nextStep.priorities || [];
  const feel = intake.transition.feeling || 'hopeful';
  const timeAvailable = intake.energy.availableTime || 'medium';

  // Generate context-aware messages
  const priorityText = priorities.slice(0, 2).join(' and ') || 'growth';
  const energyText = timeAvailable === 'high' ? 'full-time' : 'part-time';

  return {
    preview: {
      title: "Here's a glimpse of your first 30 days...",
      message: `Your full 90-day plan is ready — including daily check-ins, milestones, and personalized guidance tailored to your focus on ${priorityText}.`,
      actions: [
        {
          title: '📝 Clarify Your Next Move',
          description: `Spend 30 minutes writing down what energizes you and what doesn't. This clarity becomes your north star.`,
        },
        {
          title: '🤝 Reconnect With Your Network',
          description: `Identify 3 people you trust. Send each a personal message (not a mass email). You're not asking for a job—just reconnecting.`,
        },
        {
          title: '💪 Build Your Story',
          description: `Create a short elevator pitch that connects your past wins to what's next. Make it human, not robotic.`,
        },
        {
          title: '🎯 Set Your First Milestone',
          description: `By day 30, define one concrete achievement. This gives you something to aim for.`,
        },
        {
          title: '✨ Create Your Success Ritual',
          description: `What small daily action will keep you grounded? (Coffee, journaling, a walk?) Make it non-negotiable.`,
        },
      ],
    },
    thirtyDays: {
      title: 'Days 1–30: Stabilize & Clarify',
      description:
        'Your first month is about grounding yourself, getting clear on what matters, and building momentum.',
      items: [
        'Day 1–3: Emotional landing. Take time to process, rest, and breathe without pressure to "do."',
        'Day 4–7: Assess and inventory. Write down your skills, wins, and what brought you joy in past roles.',
        'Day 8–14: Clarify direction. Narrow down 2–3 paths that align with your priorities.',
        'Day 15–21: Build your story. Create a narrative that connects your background to what\'s next.',
        'Day 22–30: Take one action. Send networking messages, explore an opportunity, or start learning something new.',
      ],
    },
    sixtyDays: {
      title: 'Days 31–60: Build & Connect',
      description:
        'Month two is about visibility, relationships, and options. You\'re building momentum and proving to yourself that movement is possible.',
      items: [
        'Week 5–6: Deepen your network. Meet with 2–3 people per week (coffee, calls, or coffee meetings).',
        `Week 7–8: Create visibility. Start a small project, contribute to something, or share your thinking on ${priorityText}.`,
        'Week 9–10: Explore opportunities. Apply for roles, pitch consulting projects, or take a skills course.',
        'Week 11–12: Evaluate progress. Look at what\'s working. Double down on what energizes you.',
      ],
    },
    ninetyDays: {
      title: 'Days 61–90: Accelerate & Decide',
      description:
        'By month three, you have clarity, momentum, and options. Now you decide your next move with confidence.',
      items: [
        'Week 13–14: Evaluate your progress. Count your wins. Celebrate what\'s different.',
        'Week 15–16: Make your decision. Choose the path that aligns with your goals and values.',
        'Week 17–18: Close loops. Finalize your next role, project, or commitment.',
        'Week 19–21: Transition and setup. Take time to prepare for your next chapter. You\'ve earned it.',
      ],
    },
    dailyCheckins: {
      affirmations: [

        "You're braver than you believe. Every step forward counts.",
        "Uncertainty is just opportunity in disguise.",
        "Your career is a marathon. Today matters, but so does tomorrow.",
        "You have overcome harder things. This is your moment.",
        "Progress over perfection. Small wins compound.",
        "The right opportunity recognizes your value.",
        "You're not starting from zero. You're starting with everything you've learned.",
        "This transition is reshaping you into someone stronger.",
        "Your instincts got you this far. Trust them now.",
        "The path appears as you walk it. One step at a time.",
        "You deserve a career that fills your cup, not drains it.",
        "Rejection is redirection. Something better is coming.",
        "Rest is not laziness. It's preparation.",
        "Your voice matters. Your perspective is valuable.",
        "This chapter is temporary. Your next one will be amazing.",
      ],
      focusAreas: [
        "Send one thoughtful message to a former colleague you trust.",
        "Identify one skill you want to develop in the next 90 days.",
        "Write down three things you're grateful for about your transition so far.",
        "Take a 20-minute walk and let your mind wander.",
        "Research one company or role that intrigues you.",
        'Draft a short paragraph about what "success" looks like to you.',
        "Reach out to someone in a role you admire. Ask them one genuine question.",
        "Review your priorities. Are they still aligned with what matters?",
        "Create a one-sentence version of your story. Practice saying it.",
        "Celebrate one small win from today.",
        "Journal about one thing you're learning about yourself.",
        "Connect with someone outside your industry. Hear their story.",
        "Update your professional profiles with your latest thinking.",
        "Block 30 minutes this week for one strategic conversation.",
        "Write a thank-you note to someone who believed in you during a tough time.",
      ],
    },
  };
}

/**
 * Determine if mock data should be used
 * Set VITE_USE_MOCK_DATA=true in .env to enable
 */
export function shouldUseMockData() {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.DEV;
}
