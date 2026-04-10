import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO = process.env.CONTACT_TO_EMAIL || 'kavish@nexusvantagegroup.com';
const FROM = process.env.CONTACT_FROM_EMAIL || 'Nexus Vantage <onboarding@resend.dev>';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INTENT_LABELS = {
    general: 'General Inquiry',
    strategy: 'Strategy Call Request',
    conversation: 'Project Conversation',
};

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phone, intent, message, _hp } = body;

        if (_hp) {
            return Response.json({ ok: true });
        }

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return Response.json({ error: 'Name, email, and message are required.' }, { status: 400 });
        }

        if (name.length > 120 || email.length > 254 || message.length > 3000) {
            return Response.json({ error: 'One or more fields exceed the maximum length.' }, { status: 400 });
        }

        if (!EMAIL_RE.test(email)) {
            return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 });
        }

        const intentLabel = INTENT_LABELS[intent] || 'General Inquiry';
        const phoneLine = phone?.trim() ? `<p><strong>Phone:</strong> ${phone.trim()}</p>` : '';

        const { error } = await resend.emails.send({
            from: FROM,
            to: TO,
            replyTo: email.trim(),
            subject: `[NVG] ${intentLabel} — ${name.trim()}`,
            html: `
                <h2>${intentLabel}</h2>
                <p><strong>Name:</strong> ${name.trim()}</p>
                <p><strong>Email:</strong> ${email.trim()}</p>
                ${phoneLine}
                <hr />
                <p style="white-space:pre-wrap">${message.trim()}</p>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return Response.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
        }

        return Response.json({ ok: true });
    } catch (err) {
        console.error('Contact API error:', err);
        return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
}
