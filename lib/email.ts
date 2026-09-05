import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  try {
    const from =
      process.env.EMAIL_FROM || "StudySync <support@mail.studysync.website>";
    return await resend.emails.send({
      from,
      to,
      subject,
      text: text || "",
      ...(html ? { html } : {}),
    });
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    throw error;
  }
}
