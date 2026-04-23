// Edge Function: send-report-email
// Sends a generated PDF report via Resend (through the Lovable connector gateway).
//
// Body: {
//   recipients: string[],          // list of destination emails
//   subject: string,               // email subject
//   message?: string,              // optional plain message body
//   pdfBase64: string,             // base64-encoded PDF (no data: prefix)
//   pdfFileName: string,           // file name to attach, e.g. "reporte-2026-04-23.pdf"
//   fromName?: string,             // optional sender display name
// }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

interface SendReportEmailBody {
  recipients: string[];
  subject: string;
  message?: string;
  pdfBase64: string;
  pdfFileName: string;
  fromName?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY no está configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY no está configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const raw = (await req.json()) as Partial<SendReportEmailBody>;

    // Basic validation
    if (!raw || typeof raw !== "object") {
      return new Response(JSON.stringify({ error: "Body inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const recipients = Array.isArray(raw.recipients)
      ? raw.recipients
          .map((r) => (typeof r === "string" ? r.trim() : ""))
          .filter((r) => r.length > 0 && isValidEmail(r))
      : [];

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Se requiere al menos un destinatario válido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (recipients.length > 50) {
      return new Response(
        JSON.stringify({ error: "Máximo 50 destinatarios por envío" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const subject =
      typeof raw.subject === "string" && raw.subject.trim().length > 0
        ? raw.subject.trim().slice(0, 200)
        : "Reporte regulatorio LawMeter";

    const message =
      typeof raw.message === "string" ? raw.message.slice(0, 5000) : "";

    const pdfBase64 = typeof raw.pdfBase64 === "string" ? raw.pdfBase64 : "";
    const pdfFileName =
      typeof raw.pdfFileName === "string" && raw.pdfFileName.trim().length > 0
        ? raw.pdfFileName.trim().slice(0, 200)
        : "reporte-lawmeter.pdf";

    if (!pdfBase64 || pdfBase64.length < 100) {
      return new Response(
        JSON.stringify({ error: "PDF inválido o vacío" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const fromName =
      typeof raw.fromName === "string" && raw.fromName.trim().length > 0
        ? raw.fromName.trim().slice(0, 80)
        : "LawMeter";

    // Resend test sender — works without verifying a custom domain.
    // To send from your own domain, replace with a verified address in Resend.
    const fromAddress = `${fromName} <onboarding@resend.dev>`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; color: #1f2937;">
        <h2 style="color: #0f172a; margin-bottom: 12px;">${subject}</h2>
        ${
          message
            ? `<p style="line-height: 1.6; white-space: pre-wrap;">${message
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")}</p>`
            : `<p style="line-height: 1.6;">Se adjunta el reporte regulatorio generado por LawMeter.</p>`
        }
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #6b7280;">
          Este correo fue enviado automáticamente desde LawMeter. Si no esperabas
          recibirlo, puedes ignorarlo.
        </p>
      </div>
    `;

    const resendPayload = {
      from: fromAddress,
      to: recipients,
      subject,
      html: htmlBody,
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBase64,
        },
      ],
    };

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify(resendPayload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Resend gateway error", response.status, data);
      return new Response(
        JSON.stringify({
          error: "El proveedor de correo rechazó el envío",
          status: response.status,
          details: data,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        recipients_count: recipients.length,
        provider_id: data?.id ?? null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-report-email error", err);
    const errorMessage = err instanceof Error ? err.message : "Error desconocido";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
