import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ManualConfirmRequest {
  registrationId: string;
  ticketId: string;
}

Deno.serve(async (req: Request) => {
  try {
    console.log('✅ Manual payment confirmation function started');
    
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
    const { registrationId, ticketId }: ManualConfirmRequest = await req.json();
    
    console.log('📋 Manual confirmation for:', { registrationId, ticketId });

    // Validate input
    if (!registrationId || !ticketId) {
      return new Response(
        JSON.stringify({ error: 'Registration ID and Ticket ID are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update registration status to completed
    const { data: registration, error: updateError } = await supabase
      .from('registrations')
      .update({ 
        payment_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', registrationId)
      .eq('ticket_id', ticketId)
      .select()
      .single();

    if (updateError || !registration) {
      console.error('Failed to update registration:', updateError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to confirm payment - registration not found or already processed',
          details: updateError?.message 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('✅ Payment confirmed manually for:', registration.ticket_id);

    // Trigger email sending
    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-confirmation-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration: registration,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send confirmation email');
      } else {
        console.log('✅ Confirmation email sent successfully');
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the confirmation if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment confirmed successfully',
        registration: registration,
        ticketId: registration.ticket_id,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error confirming payment manually:', error);
    
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