/**
 * Pro Upgrade Integration Guide
 * Prepare for payment processing
 */

export const PRO_FEATURES = [
  {
    title: '180-Day Roadmap',
    description: 'Extended guidance beyond 90 days for sustained growth',
    icon: '📅',
  },
  {
    title: 'AI Resume Rewrite',
    description: 'Personalized resume tailored to your next role',
    icon: '📝',
  },
  {
    title: 'Recruiter Triage',
    description: 'Weekly email summaries of relevant opportunities',
    icon: '📧',
  },
  {
    title: 'Networking Intelligence',
    description: 'AI-matched connection recommendations',
    icon: '🤝',
  },
  {
    title: 'Daily Personalization',
    description: 'Deeper affirmations and tailored guidance',
    icon: '✨',
  },
  {
    title: 'Priority Support',
    description: 'Direct support from career coaches',
    icon: '💬',
  },
];

export const PRICING = {
  MONTHLY: {
    amount: 799, // cents
    interval: 'month',
    label: '$7.99/month',
    description: 'Billed monthly. Cancel anytime.',
  },
  ANNUAL: {
    amount: 6999, // cents (saves $9.89)
    interval: 'year',
    label: '$69.99/year',
    description: 'Billed annually. Save 27%.',
  },
};

/**
 * Stripe Integration Example
 * 
 * Backend Endpoint POST /api/create-checkout-session
 * 
 * import Stripe from 'stripe';
 * const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 * 
 * app.post('/api/create-checkout-session', async (req, res) => {
 *   const { email, planType, priceId } = req.body;
 * 
 *   try {
 *     const session = await stripe.checkout.sessions.create({
 *       mode: 'subscription',
 *       payment_method_types: ['card'],
 *       line_items: [{ price: priceId, quantity: 1 }],
 *       success_url: 'https://meridian.app/upgrade/success',
 *       cancel_url: 'https://meridian.app/upgrade/cancel',
 *       customer_email: email,
 *       metadata: { planType },
 *     });
 * 
 *     res.json({ sessionId: session.id });
 *   } catch (error) {
 *     res.status(500).json({ error: error.message });
 *   }
 * });
 */

/**
 * Frontend Upgrade Flow
 */
export async function startProUpgrade(email, planType = 'monthly') {
  try {
    // Call backend to create Stripe checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, planType }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    await stripe.redirectToCheckout({ sessionId });
  } catch (error) {
    console.error('Upgrade flow error:', error);
    throw error;
  }
}

/**
 * Webhook Handler for Stripe Events
 * 
 * POST /api/stripe-webhook
 * 
 * This receives events from Stripe when subscriptions are created, updated, canceled
 */
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
};

/**
 * Environment Variables for Stripe
 * 
 * VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxx (frontend)
 * STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx (backend only)
 * STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx (backend only)
 */

export const UPGRADE_MESSAGING = {
  FREE: {
    title: 'Meridian',
    subtitle: 'Essential',
    benefits: ['30/60/90 day plan', 'Daily check-ins', 'Email support'],
  },
  PRO: {
    title: 'Meridian Pro',
    subtitle: 'Premium',
    benefits: PRO_FEATURES.map((f) => f.title),
    color: '#C9A84C',
  },
};
