import type { IntegrationContent } from '@/types/content';

export const stripeIntegration: IntegrationContent = {
  id: 'integration-stripe',
  title: 'Stripe Payments',
  description: 'Integrate Stripe payment processing into your JavaScript applications with secure, production-ready payment handling.',
  slug: 'integrations/stripe',
  pillar: 'integrations',
  category: 'payments',
  tags: ['stripe', 'payments', 'billing', 'e-commerce', 'webhooks'],
  difficulty: 'intermediate',
  contentType: 'integration',
  summary: 'Learn to integrate Stripe for payment processing, from setting up Stripe.js to handling webhooks, managing subscriptions, and implementing secure PCI-compliant checkout flows.',
  relatedTopics: ['integration-rest-apis', 'integration-auth-flows'],
  order: 2,
  updatedAt: '2025-06-01',
  readingTime: 20,
  featured: true,
  keywords: ['Stripe', 'payments', 'payment intent', 'webhooks', 'subscriptions', 'billing'],
  requiredLibraries: ['@stripe/stripe-js', '@stripe/react-stripe-js', 'stripe (server-side)'],
  setupSteps: ['Install Stripe packages', 'Add Stripe publishable key to environment', 'Set up webhook endpoint', 'Create payment intent on server'],
  authNotes: 'Never expose Stripe secret key on frontend. Always create payment intents server-side and pass the client secret to frontend.',
  sections: [
    {
      type: 'heading',
      level: 2,
      text: 'Setting Up Stripe.js',
      id: 'setup-stripe-js',
    },
    {
      type: 'paragraph',
      text: 'Stripe.js is a JavaScript library that creates secure payment elements without exposing sensitive data. Load it from Stripe\'s CDN and initialize it with your publishable key.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (do this once at app startup)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// In your React component
import { Elements } from '@stripe/react-stripe-js';

function App() {
  return (
    <Elements stripe={stripePromise}>
      <YourCheckoutComponent />
    </Elements>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Creating Payment Intents',
      id: 'payment-intents',
    },
    {
      type: 'paragraph',
      text: 'A Payment Intent is a Stripe object that represents your intent to collect payment from a customer. Always create this server-side to ensure security. The server sends the client secret to your frontend.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Server-side (Node.js + Express)
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', customerId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      customer: customerId,
      // Return URL for 3D Secure redirects
      return_url: 'https://yoursite.com/checkout/success',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Building Checkout UI with Payment Element',
      id: 'payment-element',
    },
    {
      type: 'paragraph',
      text: 'The Payment Element automatically handles multiple payment methods (card, Apple Pay, Google Pay, bank transfers, etc.) adapting to what your customer prefers and what\'s available in their region.',
    },
    {
      type: 'code',
      language: 'tsx',
      code: `import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || 'Payment failed');
      setIsLoading(false);
      return;
    }

    // Confirm payment with stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment successful!', paymentIntent);
      // Handle success - redirect or update UI
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <PaymentElement />
      <button
        disabled={isLoading || !stripe}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Pay now'}
      </button>
      {errorMessage && <div className="text-red-600">{errorMessage}</div>}
    </form>
  );
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Handling Webhooks for Async Confirmation',
      id: 'webhooks',
    },
    {
      type: 'paragraph',
      text: 'Webhooks are essential for reliable payment handling. Stripe sends webhooks to your server when payment status changes (succeeded, failed, requires action). Never rely only on client-side callbacks.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `import { Request, Response } from 'express';

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(\`Webhook Error: \${(err as Error).message}\`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        // Update order status in database
        await db.orders.update(
          { stripePaymentId: paymentIntent.id },
          { status: 'paid' }
        );
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.last_payment_error);
        // Send failure notification to customer
        break;
      }

      case 'payment_intent.requires_action': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Customer needs to complete 3D Secure
        console.log('3D Secure required for:', paymentIntent.id);
        break;
      }

      default:
        console.log(\`Unhandled event type: \${event.type}\`);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Managing Subscriptions',
      id: 'subscriptions',
    },
    {
      type: 'paragraph',
      text: 'Stripe Billing handles recurring charges automatically. Create a subscription and Stripe manages renewal, retries on failure, and dunning workflows.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `// Create a subscription
app.post('/api/subscriptions/create', async (req, res) => {
  try {
    const { customerId, priceId } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Handle subscription lifecycle events
case 'customer.subscription.created':
case 'customer.subscription.updated': {
  const subscription = event.data.object as Stripe.Subscription;
  await db.subscriptions.upsert({
    stripeId: subscription.id,
    customerId: subscription.customer as string,
    status: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  });
  break;
}

case 'customer.subscription.deleted': {
  const subscription = event.data.object as Stripe.Subscription;
  await db.subscriptions.update(
    { stripeId: subscription.id },
    { status: 'canceled' }
  );
  break;
}`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Error Handling & Retry Logic',
      id: 'error-handling',
    },
    {
      type: 'paragraph',
      text: 'Payment failures are common and temporary. Implement exponential backoff for retries and provide clear user messaging.',
    },
    {
      type: 'code',
      language: 'typescript',
      code: `class StripeError extends Error {
  constructor(
    public code: string,
    public type: 'card_error' | 'rate_limit_error' | 'api_connection_error' | 'unknown',
    message: string
  ) {
    super(message);
  }
}

async function withStripeRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on card errors
      if (error instanceof Error && error.message.includes('card_error')) {
        throw new StripeError('card_declined', 'card_error', 'Your card was declined');
      }

      // Exponential backoff
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Usage
const result = await withStripeRetry(() =>
  stripe.paymentIntents.confirm(clientSecret)
);`,
    },
    {
      type: 'heading',
      level: 2,
      text: 'Security Best Practices',
      id: 'security',
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Never Log Sensitive Data',
      text: 'Never log full card numbers, CVC codes, or complete payment intents. Log only the last 4 digits and payment intent IDs for debugging.',
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Use PCI Compliance',
      text: 'By using Stripe Elements or Payment Element, you avoid direct card handling and remain PCI DSS compliant. Stripe handles the security burden.',
    },
    {
      type: 'callout',
      variant: 'danger',
      title: 'Environment Variables',
      text: 'Store STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in environment variables. Never commit them to version control.',
    },
    {
      type: 'table',
      headers: ['Practice', 'Why It Matters', 'Implementation'],
      rows: [
        ['HTTPS only', 'Prevents man-in-the-middle attacks', 'Enforce HTTPS on all payment endpoints'],
        ['Server-side intent creation', 'Prevents tampering with payment amounts', 'Always create PaymentIntent on backend'],
        ['Webhook signature verification', 'Ensures webhook authenticity', 'Use stripe.webhooks.constructEvent()'],
        ['Idempotency keys', 'Prevents duplicate charges', 'Send unique idempotencyKey per request'],
      ],
    },
  ],
};
