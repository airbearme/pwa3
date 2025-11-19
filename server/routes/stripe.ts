import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { supabaseAdmin } from '../supabaseClient';

const router = Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Mock stripe client for development/testing
const isMockMode = !STRIPE_SECRET_KEY;
const stripe = isMockMode ? {
  checkout: {
    sessions: {
      create: async () => ({
        id: 'mock_cs_' + Math.random().toString(36).substring(2, 15),
        url: '/mock-success'
      })
    }
  },
  webhooks: {
    constructEvent: () => ({ type: 'checkout.session.completed', data: { object: { amount_total: 1000 } } })
  }
} as unknown as Stripe : new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-08-27.basil' });

if (isMockMode) {
  console.warn('⚠️  Running with mock Stripe client - no real payments will be processed');
}

router.post('/payments/create-checkout-session', async (req, res) => {
const { lineItems, successUrl, cancelUrl, userId, orderId } = req.body;

  if (!Array.isArray(lineItems) || !successUrl || !cancelUrl || !userId) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId }
  });

  if (orderId) {
    await supabaseAdmin.from('orders').update({
      stripe_session_id: session.id,
      status: 'pending'
    }).eq('id', orderId);
  }

  res.json({ id: session.id, url: session.url });
});

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).send('Missing signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const total = session.amount_total ?? 0;

    if (userId && session.id) {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid', total_cents: total, stripe_session_id: session.id })
        .eq('stripe_session_id', session.id);
    }
  }

  res.json({ received: true });
}

export default router;
