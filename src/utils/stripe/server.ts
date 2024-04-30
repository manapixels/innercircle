'use server';

import Stripe from 'stripe';
import { stripe } from './config';
import { createClient } from '../supabase/server';
import { createOrRetrieveCustomer } from '../supabase/admin';
import { Tables } from '@/types/definitions';
import { getErrorRedirect, getURL } from '@/helpers/misc';

type CheckoutResponse = {
  // errorRedirect?: string;
  errorMessage?: string;
  sessionId?: string;
};

type Event = Tables<'events'>;

export async function checkoutWithStripe(
  price: Event['price_stripe_id'],
  quantity: number = 1,
  // currentPath: string = '/',
  redirectPath: string = '/account'
): Promise<CheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error('Could not get user session.');
    }

    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      customer,
      customer_email: user.email,
      customer_update: {
        address: 'auto'
      },
      mode: 'payment',
      line_items: [
        {
          price: price || undefined,
          quantity
        }
      ],
      payment_intent_data: {
        receipt_email: user.email
      },
      cancel_url: getURL(),
      success_url: getURL(redirectPath)
    };

    // Create a checkout session in Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error('Unable to create checkout session.');
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { sessionId: session.id };
    } else {
      throw new Error('Unable to create checkout session.');
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorMessage: error.message
      };
      // return {
      //   errorRedirect: getErrorRedirect(
      //     currentPath,
      //     error.message,
      //   )
      // };
    } else {
      return {
        errorMessage: 'An unknown error occurred.'
      };
      // return {
      //   errorRedirect: getErrorRedirect(
      //     currentPath,
      //     'An unknown error occurred.',
      //   )
      // };
    }
  }
}

export async function createStripePortal(currentPath: string) {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error('Could not get user session.');
    }

    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    if (!customer) {
      throw new Error('Could not get customer.');
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account')
      });
      if (!url) {
        throw new Error('Could not create billing portal');
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error('Could not create billing portal');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message
      );
    } else {
      return getErrorRedirect(
        currentPath,
        'An unknown error occurred.'
      );
    }
  }
}