import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  tickets: number;
  totalAmount: number;
}

Deno.serve(async (req: Request) => {
  try {
    console.log('🚀 Process UPI payment function started');
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    console.log('🔍 Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    }
    )
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing required environment variables',
          details: {
            supabaseUrl: !!supabaseUrl,
            serviceKey: !!supabaseServiceKey
          }
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    console.log('📝 Parsing request body...');
    const registrationData: RegistrationData = await req.json();
    const { name, email, phone, tickets, totalAmount } = registrationData;
    
    console.log('📋 Registration data received:', { name, email, phone, tickets, totalAmount });

    // Validate input
    if (!name || !email || !phone || !tickets || !totalAmount) {
      console.error('❌ Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert registration into database
    console.log('💾 Inserting registration into database...');
    const { data: registration, error: dbError } = await supabase
      .from('registrations')
      .insert({
        name,
        email,
        phone,
        tickets,
        total_amount: totalAmount,
        payment_status: 'pending',
        stripe_payment_intent_id: null, // Not used for UPI
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to save registration',
          details: dbError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Registration saved successfully:', registration.id);

    // Generate UPI deep link
    const upiId = '9911302895@ptyes';
    const merchantName = 'Team Welcome';
    const transactionNote = `Dandiya Event 2025 - ${registration.ticket_id}`;
    
    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${encodeURIComponent(registration.ticket_id)}`;
    
    console.log('🔗 UPI link generated:', upiLink);
    
    return new Response(
      JSON.stringify({
        success: true,
        upiLink: upiLink,
        registrationId: registration.id,
        ticketId: registration.ticket_id,
        amount: totalAmount,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing UPI payment:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        type: error.name
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});