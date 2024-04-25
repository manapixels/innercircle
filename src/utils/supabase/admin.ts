import { stripe } from '../stripe/config';
import { Database } from '@/types/definitions';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const upsertProductRecord = async (product: Stripe.Product) => {

    const { error: upsertError } = await supabaseAdmin
        .from('events')
        .upsert({
            stripe_id: product.id,
            name: product.name,
            description: product.description ?? null,
            image_thumbnail_url: product.images?.[0] ?? null,
            metadata: product.metadata,
            created_by: "your_value_here",
            location_address: "your_value_here",
            location_country: "your_value_here",
            location_name: "your_value_here",
            slug: "your_value_here",
        });
    if (upsertError)
        throw new Error(`Product insert/update failed: ${upsertError.message}`);
    console.log(`Product inserted/updated: ${product.id}`);
};

const updatePriceRecord = async (
    price: Stripe.Price,
    retryCount = 0,
    maxRetries = 3
) => {

    const { error: upsertError } = await supabaseAdmin
        .from('events')
        .update({
            price_stripe_id: price.id,
            price_currency: price.currency,
            price: price.unit_amount
        })
        .match({ price_stripe_id: price.id });

    if (upsertError?.message.includes('foreign key constraint')) {
        if (retryCount < maxRetries) {
            console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await updatePriceRecord(price, retryCount + 1, maxRetries);
        } else {
            throw new Error(
                `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
            );
        }
    } else if (upsertError) {
        throw new Error(`Price insert/update failed: ${upsertError.message}`);
    } else {
        console.log(`Price inserted/updated: ${price.id}`);
    }
};

const deleteProductRecord = async (product: Stripe.Product) => {
    const { error: deletionError } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', product.id);
    if (deletionError)
        throw new Error(`Product deletion failed: ${deletionError.message}`);
    console.log(`Product deleted: ${product.id}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
    const { error: upsertError } = await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', uuid);

    if (upsertError)
        throw new Error(`Supabase customer record creation failed: ${upsertError.message}`);

    return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
    const customerData = { metadata: { supabaseUUID: uuid }, email: email };
    const newCustomer = await stripe.customers.create(customerData);
    if (!newCustomer) throw new Error('Stripe customer creation failed.');

    return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
    email,
    uuid
}: {
    email: string;
    uuid: string;
}) => {
    
    // Check if the customer already exists in Supabase
    const { data: existingSupabaseCustomer, error: queryError } =
        await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', uuid)
            .maybeSingle();

    if (queryError) {
        throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
    }

    // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
    let stripeCustomerId: string | undefined;
    if (existingSupabaseCustomer?.stripe_customer_id) {
        const existingStripeCustomer = await stripe.customers.retrieve(
            existingSupabaseCustomer.stripe_customer_id
        );
        stripeCustomerId = existingStripeCustomer.id;
    } else {
        // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
        const stripeCustomers = await stripe.customers.list({ email: email });
        stripeCustomerId =
            stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
    }

    // If still no stripeCustomerId, create a new customer in Stripe
    const stripeIdToInsert = stripeCustomerId
        ? stripeCustomerId
        : await createCustomerInStripe(uuid, email);
    if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

    if (existingSupabaseCustomer && stripeCustomerId) {
        // If Supabase has a record but doesn't match Stripe, update Supabase record
        if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
            const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({ stripe_customer_id: stripeCustomerId })
                .eq('id', uuid);

            if (updateError)
                throw new Error(
                    `Supabase customer record update failed: ${updateError.message}`
                );
            console.warn(
                `Supabase customer record mismatched Stripe ID. Supabase record updated.`
            );
        }
        // If Supabase has a record and matches Stripe, return Stripe customer ID
        return stripeCustomerId;
    } else {
        console.warn(
            `Supabase customer record was missing. A new record was created.`
        );

        // If Supabase has no record, create a new record and return Stripe customer ID
        const upsertedStripeCustomer = await upsertCustomerToSupabase(
            uuid,
            stripeIdToInsert
        );
        if (!upsertedStripeCustomer)
            throw new Error('Supabase customer record creation failed.');

        return upsertedStripeCustomer;
    }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
    uuid: string,
    payment_method: Stripe.PaymentMethod
) => {
    //Todo: check this assertion
    const customer = payment_method.customer as string;
    const { name, phone, address } = payment_method.billing_details;
    if (!name || !phone || !address) return;
    //@ts-ignore
    await stripe.customers.update(customer, { name, phone, address });
    const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
            billing_address: { ...address },
            payment_method: { ...payment_method[payment_method.type] }
        })
        .eq('id', uuid);
    if (updateError) throw new Error(`Customer update failed: ${updateError.message}`);
};

export {
    upsertProductRecord,
    updatePriceRecord,
    deleteProductRecord,
    createOrRetrieveCustomer,
    copyBillingDetailsToCustomer
};