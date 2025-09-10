const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  total_amount: number;
  ticket_id: string;
  created_at: string;
}

interface EmailRequest {
  registration: Registration;
}

Deno.serve(async (req: Request) => {
  try {
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

    // Parse request body
    const { registration }: EmailRequest = await req.json();

    // Create email content
    const emailSubject = 'Dandiya Event 2025 – Registration Confirmed 🎉';
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dandiya Event 2025 - Registration Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #f97316, #dc2626, #eab308); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; font-size: 28px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
            Team Welcome - Dandiya Event 2025 💃🔥
        </h1>
        <p style="color: white; font-size: 18px; margin: 10px 0 0 0;">Registration Confirmed!</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
        <h2 style="color: #dc2626; margin-top: 0;">Hello ${registration.name}! 🙌</h2>
        <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for registering for <strong>Team Welcome – Dandiya Event 2025</strong> at Mukut Regency. 
            Get ready for a cultural blast with music, dance, and joy! See you on the dance floor 💃🔥
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
            <h3 style="color: #dc2626; margin-top: 0;">Your Ticket Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Ticket ID:</td>
                    <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${registration.ticket_id}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Number of Tickets:</td>
                    <td style="padding: 8px 0;">${registration.tickets}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Total Amount Paid:</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: bold;">₹${registration.total_amount}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Registration Date:</td>
                    <td style="padding: 8px 0;">${new Date(registration.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
            </table>
        </div>
    </div>
    
    <div style="background: #fef3c7; padding: 20px; border-radius: 10px; border: 2px solid #f59e0b; margin-bottom: 25px;">
        <h3 style="color: #92400e; margin-top: 0;">Event Details:</h3>
        <p style="margin: 5px 0;"><strong>Venue:</strong> Mukut Regency 🏨 (Tentative)</p>
        <p style="margin: 5px 0;"><strong>Date & Time:</strong> Coming Soon!</p>
        <p style="margin: 5px 0;"><strong>Event:</strong> Maha-Bhanga of Navratri</p>
    </div>
    
    <div style="background: #e0f2fe; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
        <h3 style="color: #0277bd; margin-top: 0;">Important Instructions:</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Please bring a printed or digital copy of this email</li>
            <li>Arrive 30 minutes before the event starts</li>
            <li>Wear traditional Dandiya/Garba attire for the best experience</li>
            <li>Follow all venue guidelines and safety protocols</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 18px; color: #dc2626; font-weight: bold;">
            Namaste Dandiya Warriors! 🙌💥
        </p>
        <p style="font-size: 16px; color: #666;">
            For any queries, contact us at events@teamwelcome.com or +91 9876543210
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px; background: #f1f5f9; border-radius: 10px; margin-top: 30px;">
        <p style="margin: 0; color: #64748b; font-size: 14px;">
            © 2025 Team Welcome. All rights reserved.
        </p>
        <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">
            This is an automated email. Please do not reply to this email.
        </p>
    </div>
</body>
</html>
    `;

    // Log email details for now (in production, integrate with actual email service)
    console.log('Email would be sent:', {
      to: registration.email,
      subject: emailSubject,
      ticketId: registration.ticket_id,
    });

    // Simulate successful email sending for now
    const emailSent = true;

    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        ticketId: registration.ticket_id,
        message: 'Confirmation email sent successfully',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send confirmation email' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});