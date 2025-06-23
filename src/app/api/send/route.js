import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

// Template HTML pour l'email envoyé à l'admin
const emailHtmlTemplate = ({ subject, message, senderEmail }) => `
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #1E1E2F;
    color: #E0E0FF;
    padding: 30px;
    border-radius: 12px;
    max-width: 650px;
    margin: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  ">
    <header style="
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 15px;
      margin-bottom: 25px;
      text-align: center;
    ">
      <h1 style="
        color: #8B80F9;
        font-weight: 900;
        font-size: 28px;
        margin: 0;
      ">Nouveau message reçu via le portfolio</h1>
      <p style="color:#BBB; font-size: 14px; margin-top: 5px;">
        Sujet : <strong>${subject}</strong>
      </p>
    </header>
    <section style="font-size: 17px; line-height: 1.6; color: #CFCFFF;">
      <p>👋 Hello!,</p>
      <p>Vous avez reçu un nouveau message via votre site portfolio. Voici les détails :</p>
      <blockquote style="
        background-color: #35356B;
        border-left: 6px solid #8B80F9;
        padding: 15px 20px;
        margin: 20px 0;
        font-style: italic;
        border-radius: 6px;
        color: #D1D3FF;
      ">
        ${message}
      </blockquote>
      <p><strong>Envoyé par :</strong> <a href="mailto:${senderEmail}" style="color:#A9A9FF; text-decoration:none;">${senderEmail}</a></p>
    </section>
    <footer style="
      margin-top: 40px;
      border-top: 2px solid #4f46e5;
      padding-top: 15px;
      font-size: 13px;
      color: #888ABB;
      text-align: center;
    ">
      <p>Ceci est un email automatique envoyé depuis votre portfolio.</p>
    </footer>
  </div>
`;

const userConfirmHtmlTemplate = ({ subject, message }) => `
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #F5F7FF;
    color: #2F2F4F;
    padding: 30px;
    border-radius: 12px;
    max-width: 650px;
    margin: auto;
    box-shadow: 0 4px 25px rgba(100, 100, 140, 0.15);
  ">
    <header style="
      border-bottom: 3px solid #5A67F2;
      padding-bottom: 15px;
      margin-bottom: 25px;
      text-align: center;
    ">
      <h1 style="
        color: #4C51BF;
        font-weight: 900;
        font-size: 28px;
        margin: 0;
      ">Merci pour votre message !</h1>
      <p style="color:#6B7280; font-size: 15px; margin-top: 6px;">
        Sujet : <strong>${subject}</strong>
      </p>
    </header>
    <section style="font-size: 16px; line-height: 1.7; color: #4B5563;">
      <p>Bonjour,</p>
      <p>Merci de m'avoir contacté. Je reviendrai vers vous dès que possible.</p>
      <p>Voici un résumé de votre message :</p>
      <blockquote style="
        background-color: #E0E7FF;
        border-left: 6px solid #5A67F2;
        padding: 15px 20px;
        margin: 20px 0;
        font-style: italic;
        border-radius: 6px;
        color: #4338CA;
      ">
        ${message}
      </blockquote>
      <p>Je vous souhaite une excellente journée !</p>
    </section>
    <footer style="
      margin-top: 40px;
      border-top: 2px solid #5A67F2;
      padding-top: 15px;
      font-size: 13px;
      color: #9CA3AF;
      text-align: center;
    ">
      <p>Ceci est un email automatique envoyé depuis mon portfolio.</p>
      <p style="margin-top: 10px; font-size: 14px; color: #4C51BF;">
  <a href="https://davidrenemetomo.com" style="color: #4C51BF; text-decoration: none;">Visitez mon site</a><br/>
  <a href="https://wa.me/237656156546" style="color: #4C51BF; text-decoration: none;" target="_blank" rel="noopener noreferrer">WhatsApp +237 656 156 546</a><br/>
  <a href="https://wa.me/237679413963" style="color: #4C51BF; text-decoration: none;" target="_blank" rel="noopener noreferrer">WhatsApp +237 679 413 963</a>
</p>

    </footer>
  </div>
`;

export async function POST(req) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Champs manquants." },
        { status: 400 }
      );
    }

    // Envoi à l'admin
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.GMAIL_USER, // ton email admin
      subject: `Nouveau message : ${subject}`,
      html: emailHtmlTemplate({ subject, message, senderEmail: email }),
    });

    // Email de confirmation à l'utilisateur
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `Merci pour votre message : ${subject}`,
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
