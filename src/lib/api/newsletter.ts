// src/lib/api/newsletter.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function subscribeToNewsletter(email: string) {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { 
        email,
        is_active: true,
        metadata: { subscribed_at: new Date().toISOString() }
      },
      { onConflict: 'email' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unsubscribeFromNewsletter(email: string) {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({ 
      is_active: false,
      unsubscribed_at: new Date().toISOString()
    })
    .eq('email', email)
    .select()
    .single();

  if (error) throw error;
  return data;
}