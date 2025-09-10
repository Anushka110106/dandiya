import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface StatusCheckRequest {
  registrationId: string;
}

Deno.serve(async (req: Request) => {
  try {
    console.log('🔍 Check UPI payment status function started');
    
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
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing required environment variables'
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
    const { registrationId }: StatusCheckRequest = await req.json();
    
    console.log('📋 Checking status for registration:', registrationId);

    // Validate input
    if (!registrationId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Query registration status
    const { data: registration, error: dbError } = await supabase
      .from('registrations')
      .select('payment_status, ticket_id, name, email, total_amount, created_at')
      .eq('id', registrationId)
      .single();

    if (dbError || !registration) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ 
          error: 'Registration not found',
          details: dbError?.message 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Registration status retrieved:', {
      id: registrationId,
      status: registration.payment_status,
      ticketId: registration.ticket_id
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        paymentStatus: registration.payment_status,
        ticketId: registration.ticket_id,
        registration: {
          name: registration.name,
          email: registration.email,
          amount: registration.total_amount,
          createdAt: registration.created_at
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error checking payment status:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});