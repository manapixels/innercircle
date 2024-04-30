import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import {
  // upsertProductRecord,
  // deleteProductRecord,
  confirmReservation,
} from '@/utils/supabase/admin';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  console.log('hihi', sig, webhookSecret)
  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        // case 'product.created':
        // case 'product.updated':
        //   await upsertProductRecord(event.data.object as Stripe.Product);
        //   break;
        // case 'product.deleted':
        //   await deleteProductRecord(event.data.object as Stripe.Product);
        //   break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          const paymentIntent = checkoutSession.payment_intent as Stripe.PaymentIntent;
          if (checkoutSession?.id && paymentIntent) {
            await confirmReservation(
              checkoutSession?.id, 
              paymentIntent.id, 
              paymentIntent.amount, 
              paymentIntent.currency
            );
          } else {
            console.log('No stripe session id found in checkout session metadata. Reservation status not updated.');
          }
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.log(error);
      return new Response(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400
        }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400
    });
  }
  return new Response(JSON.stringify({ received: true }));
}