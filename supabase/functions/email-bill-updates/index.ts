import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailWebhook {
  subject?: string;
  body?: string;
  text?: string;
  from?: string;
  // Mailgun format
  'body-plain'?: string;
  Subject?: string;
  From?: string;
}

// Parse bill information from email
function parseBillFromEmail(subject: string, body: string): { type: string; number: string; congress: number } | null {
  try {
    // Congress.gov email subjects typically contain bill numbers like "H.R. 1234" or "S. 567"
    const billRegex = /(H\.R\.|S\.|H\.J\.Res\.|S\.J\.Res\.|H\.Con\.Res\.|S\.Con\.Res\.|H\.Res\.|S\.Res\.)\s*(\d+)/i;
    
    const subjectMatch = subject.match(billRegex);
    const bodyMatch = body.match(billRegex);
    
    const match = subjectMatch || bodyMatch;
    
    if (!match) {
      console.log('No bill number found in email');
      return null;
    }

    let billType = match[1].replace(/\./g, '').toUpperCase();
    const billNumber = match[2];
    
    // Normalize bill type to match Congress API format
    const typeMap: Record<string, string> = {
      'HR': 'HR',
      'S': 'S',
      'HJRES': 'HJRES',
      'SJRES': 'SJRES',
      'HCONRES': 'HCONRES',
      'SCONRES': 'SCONRES',
      'HRES': 'HRES',
      'SRES': 'SRES'
    };
    
    billType = typeMap[billType] || billType;
    
    // Currently tracking 119th Congress
    const congress = 119;
    
    console.log(`Parsed bill: ${billType} ${billNumber} (Congress ${congress})`);
    return { type: billType, number: billNumber, congress };
  } catch (error) {
    console.error('Error parsing bill from email:', error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Received email webhook');

    // Parse webhook payload (supports multiple formats)
    const contentType = req.headers.get('content-type') || '';
    let payload: EmailWebhook;

    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      payload = Object.fromEntries(formData.entries()) as EmailWebhook;
    } else {
      payload = await req.json(); // Default to JSON
    }

    console.log('Webhook payload keys:', Object.keys(payload));

    // Extract subject and body from various webhook formats
    const subject = payload.subject || payload.Subject || '';
    const body = payload.body || payload.text || payload['body-plain'] || '';

    console.log('Email subject:', subject);

    if (!subject && !body) {
      console.error('No subject or body in webhook payload');
      return new Response(
        JSON.stringify({ error: 'No email content found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Parse bill information
    const billInfo = parseBillFromEmail(subject, body);

    if (!billInfo) {
      console.log('No bill information found in email, skipping');
      return new Response(
        JSON.stringify({ message: 'No bill information found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Mark bill as having an email update
    const { error: updateError } = await supabase
      .from('congress_bill_statuses')
      .update({
        has_email_update: true,
        email_updated_at: new Date().toISOString()
      })
      .eq('congress', billInfo.congress)
      .eq('bill_type', billInfo.type)
      .eq('bill_number', billInfo.number);

    if (updateError) {
      console.error('Error updating bill status:', updateError);
      
      // If bill doesn't exist in database yet, create a placeholder
      const { error: insertError } = await supabase
        .from('congress_bill_statuses')
        .insert({
          congress: billInfo.congress,
          bill_type: billInfo.type,
          bill_number: billInfo.number,
          current_stage: 'Unknown',
          stages: ['Introduced', 'Passed House', 'Passed Senate', 'To President', 'Became Law'],
          has_email_update: true,
          email_updated_at: new Date().toISOString(),
          scraped_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error inserting bill status:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to update database' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }
    }

    console.log(`✓ Marked ${billInfo.type} ${billInfo.number} as updated via email`);

    return new Response(
      JSON.stringify({ 
        success: true,
        bill: `${billInfo.type} ${billInfo.number}`,
        message: 'Bill marked as updated'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
