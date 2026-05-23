import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const emailHtmlTemplate = ({ subject, message, senderEmail, phone }) => `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #1E1E2F; color: #E0E0FF; padding: 30px; border-radius: 12px; max-width: 650px; margin: auto;">
    <h1 style="color: #8B80F9; font-size: 24px;">Nouveau message — portfolio</h1>
    <p style="color:#BBB;">Sujet : <strong>${subject}</strong></p>
    <blockquote style="background:#35356B; border-left: 4px solid #8B80F9; padding: 16px; margin: 20px 0; color: #D1D3FF;">
      ${message}
    </blockquote>
    <p><strong>Email :</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
    <p><strong>Téléphone :</strong> ${phone || "—"}</p>
  </div>
`;

const userConfirmHtmlTemplate = ({ subject, message }) => `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #F5F7FF; color: #2F2F4F; padding: 30px; border-radius: 12px; max-width: 650px; margin: auto;">
    <h1 style="color: #4C51BF;">Merci pour votre message</h1>
    <p>Sujet : <strong>${subject}</strong></p>
    <blockquote style="background:#E0E7FF; border-left: 4px solid #5A67F2; padding: 16px; margin: 20px 0;">
      ${message}
    </blockquote>
    <p>Je vous répondrai dès que possible. Pour une réponse plus rapide : WhatsApp +237 656 156 546.</p>
  </div>
`;

export async function POST(req) {
  try {
    const { email, phone, subject, message, turnstileToken } = await req.json();

    if (!email || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip");

    const turnstileOk = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileOk) {
      return NextResponse.json(
        { success: false, error: "Vérification anti-spam échouée. Réessayez." },
        { status: 403 }
      );
    }

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.GMAIL_USER,
      subject: `Portfolio — ${subject}`,
      html: emailHtmlTemplate({ subject, message, senderEmail: email, phone }),
    });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Reçu : ${subject}`,
      html: userConfirmHtmlTemplate({ subject, message }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi email:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
