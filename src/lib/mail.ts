import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirme ton email !",
    html: `<p>Clique <a href="${confirmLink}">ici</a> pour confirmer ton email. </p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Réinitialise ton mot de passe !",
    html: `<p>Clique <a href="${resetLink}">ici</a> pour réinitialiser ton mot de passe. </p>`,
  });
}
