import type { IntegrationContent } from '@/types/content';

export const paymentsIntegration: IntegrationContent = {
  id: 'integration-payments',
  title: 'Payment Integration',
  description: 'Accept payments in JavaScript apps using Stripe and other providers.',
  slug: 'integrations/payments',
  pillar: 'integrations',
  category: 'auth-payments',
  tags: ['payments', 'Stripe', 'checkout', 'billing'],
  difficulty: 'advanced',
  contentType: 'integration',
  summary: 'Learn how to build payment flows with Stripe â from simple one-time payments to subscription billing. We’ll cover checkout sessions, custom payment forms, webhook handling, and best practices.',
  relatedTopics: ['integration-oauth'],
  order: 5,
  updatedAt: '2025-06-01',
  readingTime: 16,
  featured: false,
  keywords: ['Stripe', 'payments', 'checkout', 'subscriptions'],
  requiredLibraries: ['@stripe/stripe-js'],
  setupSteps: ['Create a Stripe account', 'Get publishable and secret keys', 'Install Stripe.js SDK'],
  authNotes: 'Publishable keys are safe to put on the frontend. Secret keys? Keep those on the server only.',
  sections: [
    { type: 'heading', level: 2, text: 'Architecture Overview', id: 'architecture' },
    { type: 'paragraph', text: 'Here\'s the thing about payment processing: you can\'t do it all on the client. You need a server. The basic flow is: frontend collects payment details securely via Stripe Elements, your backend creates a Payment Intent or Checkout Session, and Stripe sends you webhooks to confirm the payment went through. Never, ever trust what the client tells you about payment status. Always verify server-side.' },
    { type: 'table', headers: ['Integration Type', 'Complexity', 'Best For', 'Customization'], rows: [
      ['Stripe Checkout (hosted)', 'Low', 'Quick setup, standard checkout', 'Limited — Stripe-hosted page'],
      ['Stripe Elements', 'Medium', 'Custom checkout UI', 'Full control over payment form'],
      ['Payment Intents API', 'High', 'Complex flows, SCA', 'Maximum flexibility'],
      ['Stripe Billing', 'High', 'Recurring subscriptions', 'Full subscription management'],
    ]},

    { type: 'heading', level: 2, text: 'Stripe Checkout (Hosted)', id: 'checkout-hosted' },
    { type: 'paragraph', text: 'Want the fastest route to accepting payments? Use Stripe\'s hosted checkout page. Stripe handles all the messy stuff — PCI compliance, mobile optimization, localization. You just redirect users to their page, and they handle the rest.' },
    { type: 'code', language: 'typescript', code: `// Frontend: Redirect to Stripe Checkout
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_...');

async function handleCheckout(priceId: string): Promise<void> {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  // Create session on your backend
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId,
      successUrl: \`\${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}\`,
      cancelUrl: \`\${window.location.origin}/pricing\`,
    }),
  });

  const { sessionId } = await res.json();
  const { error } = await stripe.redirectToCheckout({ sessionId });

  if (error) {
    console.error('Checkout redirect failed:', error.message);
  }
}` },

    { type: 'heading', level: 3, text: 'Backend: Creating Checkout Sessions', id: 'create-session' },
    { type: 'code', language: 'typescript', code: `// Edge Function / Server-side
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

async function createCheckoutSession(
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  customerId?: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // or 'subscription' for recurring
    payment_method_types: ['card'],
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...(customerId && { customer: customerId }),
    // Enable automatic tax calculation
    automatic_tax: { enabled: true },
    // Collect billing address
    billing_address_collection: 'required',
  });

  return session.id;
}` },

    { type: 'heading', level: 2, text: 'Payment Intents (Custom UI)', id: 'payment-intents' },
    { type: 'paragraph', text: 'Need full control over your checkout design? Use Stripe Elements with the Payment Intents API. This gives you a custom form while Stripe handles the hard stuff like 3D Secure and Strong Customer Authentication (SCA) automatically.' },
    { type: 'code', language: 'tsx', code: `import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_...');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: \`\${window.location.origin}/payment-complete\`,
      },
    });

    // This point is only reached if there’s an immediate error
    // (e.g., card declined). Successful payments redirect.
    if (submitError) {
      setError(submitError.message ?? 'Payment failed');
    }
    setProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full mt-4 py-2 bg-primary text-primary-foreground rounded"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

// Wrap with Elements provider
function PaymentPage({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
}` },

    { type: 'heading', level: 2, text: 'Webhook Handling', id: 'webhooks' },
    { type: 'paragraph', text: 'Here\'s the critical part: webhooks are your source of truth. Never rely on the client saying "payment succeeded." Stripe sends you webhook events, and you should verify them server-side before actually fulfilling the order.' },
    { type: 'code', language: 'typescript', code: `// Server-side webhook handler
async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<void> {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    throw new Error(\`Webhook signature verification failed: \${err}\`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillOrder(session);
      break;
    }
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent;
      await recordPayment(intent);
      break;
    }
    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      await handleFailedPayment(intent);
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await syncSubscriptionStatus(sub);
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await handleFailedInvoice(invoice);
      break;
    }
    default:
      console.log(\`Unhandled event type: \${event.type}\`);
  }
}` },
    { type: 'callout', variant: 'danger', title: 'Critical Security Rule', text: 'Always verify the webhook signature with stripe.webhooks.constructEvent(). Don\'t skip this step. Attackers can send fake webhook events to your endpoint, and you\'ll fulfill fake orders if you don\'t verify.' },

    { type: 'heading', level: 2, text: 'Subscription Billing', id: 'subscriptions' },
    { type: 'code', language: 'typescript', code: `// Create a subscription with a free trial
async function createSubscription(
  customerId: string,
  priceId: string,
  trialDays: number = 14
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    trial_period_days: trialDays,
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });
}

// Cancel at period end (don’t immediately revoke access)
async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

// Resume a canceled subscription
async function resumeSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}` },

    { type: 'heading', level: 2, text: 'Pricing Table UI Pattern', id: 'pricing-ui' },
    { type: 'code', language: 'tsx', code: `interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  priceId: string;
  popular?: boolean;
}

function PricingCard({ plan, onSelect }: {
  plan: PricingPlan;
  onSelect: (priceId: string) => void;
}) {
  return (
    <div className={\`rounded-xl border p-6 \${
      plan.popular ? 'border-primary shadow-lg ring-2 ring-primary' : ''
    }\`}>
      {plan.popular && (
        <span className="text-xs font-bold uppercase text-primary">Most Popular</span>
      )}
      <h3 className="text-xl font-bold mt-2">{plan.name}</h3>
      <p className="text-3xl font-bold mt-2">
        \${plan.price}<span className="text-sm text-muted-foreground">/{plan.interval}</span>
      </p>
      <ul className="mt-4 space-y-2">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <CheckIcon className="h-4 w-4 text-primary" />
            {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(plan.priceId)}
        className="w-full mt-6 py-2 rounded bg-primary text-primary-foreground"
      >
        Get Started
      </button>
    </div>
  );
}` },

    { type: 'heading', level: 2, text: 'Error Handling', id: 'error-handling' },
    { type: 'table', headers: ['Error Code', 'Meaning', 'User Message'], rows: [
      ['card_declined', 'Card was declined', 'Your card was declined. Please try another payment method.'],
      ['insufficient_funds', 'Not enough funds', 'Insufficient funds. Please try another card.'],
      ['expired_card', 'Card has expired', 'Your card has expired. Please update your payment method.'],
      ['processing_error', 'Processing error', 'An error occurred. Please try again in a moment.'],
      ['incorrect_cvc', 'Wrong CVC', 'The CVC code is incorrect. Please check and try again.'],
    ]},

    { type: 'heading', level: 2, text: 'Security Checklist', id: 'security-checklist' },
    { type: 'list', items: [
      'Never log or store full card numbers — use Stripe Elements/tokens',
      'Verify webhook signatures on every event',
      'Use idempotency keys for creating charges to prevent double-charging',
      'Set up Stripe Radar for fraud detection',
      'Always use HTTPS — Stripe.js will refuse to load on HTTP',
      'Confirm payment status server-side before fulfilling orders',
      'Test with Stripe test cards (4242 4242 4242 4242) before going live',
      'Handle currency correctly — Stripe uses smallest unit (cents, not dollars)',
    ] },
    { type: 'callout', variant: 'tip', title: 'Testing', text: 'Use Stripe test card numbers: 4242424242424242 (success), 4000000000000002 (decline), 4000002500003155 (requires 3D Secure). Always test edge cases before going live.' },
  ],
};
