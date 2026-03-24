// app/privacy-policy/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | StudySync",
  description:
    "StudySync's privacy policy - how we collect, use, and protect your data",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 text-sm inline-flex items-center gap-1 mb-6"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            StudySync — Student Study App
            <br />
            Last updated: 25 January 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <Section title="1. Introduction">
            <p>
              StudySync is committed to protecting your personal data. This
              Privacy Policy explains how we collect, use, store, and protect
              information about you when you use our free student note-taking
              and study application (&quot;the App&quot;), in accordance with
              the General Data Protection Regulation (GDPR) and applicable EU
              data protection law.
            </p>
            <p>
              By using StudySync, you confirm that you have read and understood
              this policy.
            </p>
          </Section>

          <Section title="2. Who We Are (Data Controller)">
            <p>
              StudySync is the data controller for personal data processed
              through this App. You can contact us at:
            </p>
            <ul>
              <li>
                Email:{" "}
                <a href="mailto:support@studysync.app" className="text-primary">
                  support@studysync.app
                </a>
              </li>
            </ul>
          </Section>

          <Section title="3. Data We Collect">
            <Subsection title="3.1 Account Information">
              <p>When you register or sign in, we collect:</p>
              <ul>
                <li>Full name</li>
                <li>Email address</li>
                <li>
                  Profile picture (if you sign in via Google OAuth or upload
                  one)
                </li>
                <li>
                  Authentication credentials (hashed passwords for
                  email/password accounts)
                </li>
              </ul>
            </Subsection>

            <Subsection title="3.2 App Content You Create">
              <p>
                We store the content you create and manage within the App,
                including:
              </p>
              <ul>
                <li>Notes and note content</li>
                <li>Flashcards and flashcard decks</li>
                <li>Study session history and messages</li>
                <li>Schedule events</li>
                <li>Subject and semester classifications</li>
                <li>Tags and labels</li>
              </ul>
            </Subsection>

            <Subsection title="3.3 App Usage Data">
              <p>
                We collect limited usage data necessary to provide the service:
              </p>
              <ul>
                <li>Study streak count and last active date</li>
                <li>
                  App preferences and settings (theme, editor font, auto-save
                  interval)
                </li>
              </ul>
            </Subsection>
          </Section>

          <Section title="4. Legal Basis for Processing (GDPR Article 6)">
            <p>We process your personal data on the following legal bases:</p>
            <ul>
              <li>
                <strong>Performance of a contract (Article 6(1)(b)):</strong> To
                provide you with the StudySync service you have registered for,
                including storing your notes and study data.
              </li>
              <li>
                <strong>Legitimate interests (Article 6(1)(f)):</strong> To
                maintain the security and integrity of the App and prevent
                abuse.
              </li>
              <li>
                <strong>Consent (Article 6(1)(a)):</strong> Where you have given
                explicit consent, such as uploading a profile picture.
              </li>
            </ul>
          </Section>

          <Section title="5. How We Use Your Data">
            <p>We use your personal data exclusively to:</p>
            <ul>
              <li>Create and manage your StudySync account</li>
              <li>
                Store, display, and sync your notes, flashcards, and study
                content
              </li>
              <li>
                Provide AI-assisted study features (content is processed by Groq
                AI; see Section 6)
              </li>
              <li>Maintain your study streak and personalised settings</li>
              <li>Ensure the security and availability of the App</li>
            </ul>
            <p>
              We do not use your data for advertising, profiling, or any
              commercial purpose beyond providing the App.
            </p>
          </Section>

          <Section title="6. Third-Party Services">
            <p>
              We use the following third-party service providers. Each acts as a
              data processor on our behalf:
            </p>

            <div className="mt-4 space-y-4">
              <ServiceCard
                name="Neon (Database)"
                description="Your account and all app data are stored in a PostgreSQL database hosted by Neon, Inc. Neon operates data centres in the EU/EEA."
                privacyLink="https://neon.tech/privacy-policy"
              />

              <ServiceCard
                name="Vercel (Hosting & File Storage)"
                description="The App is hosted on Vercel infrastructure. Profile pictures you upload are stored in Vercel Blob storage."
                privacyLink="https://vercel.com/legal/privacy-policy"
              />

              <ServiceCard
                name="Groq (AI Processing)"
                description="When you use AI-powered features (such as PDF formatting or flashcard generation), the relevant note content is sent to Groq, Inc. for processing. Groq does not retain your data for training."
                privacyLink="https://groq.com/privacy-policy"
              />
            </div>

            <p className="mt-4">
              We do not sell, rent, or share your data with any other third
              parties.
            </p>
          </Section>

          <Section title="7. Data Retention">
            <p>
              We retain your personal data for as long as your account is
              active. If you delete your account:
            </p>
            <ul>
              <li>
                All your personal data, notes, flashcards, study sessions, and
                settings are permanently and immediately deleted from our
                database.
              </li>
              <li>
                Profile pictures stored in Vercel Blob are deleted upon account
                deletion or when you remove your profile picture.
              </li>
              <li>
                We do not retain backups of your personal data beyond standard
                database backup cycles (maximum 7 days).
              </li>
            </ul>
          </Section>

          <Section title="8. Your Rights Under GDPR">
            <p>As an EU resident, you have the following rights:</p>
            <ul>
              <li>
                <strong>Right of access (Article 15):</strong> Request a copy of
                the personal data we hold about you.
              </li>
              <li>
                <strong>Right to rectification (Article 16):</strong> Request
                correction of inaccurate personal data.
              </li>
              <li>
                <strong>Right to erasure (Article 17):</strong> Request deletion
                of your personal data (&apos;right to be forgotten&apos;). You
                can also delete your account directly within the App.
              </li>
              <li>
                <strong>
                  Right to restriction of processing (Article 18):
                </strong>{" "}
                Request that we restrict how we process your data.
              </li>
              <li>
                <strong>Right to data portability (Article 20):</strong> Request
                your data in a structured, machine-readable format.
              </li>
              <li>
                <strong>Right to object (Article 21):</strong> Object to
                processing based on legitimate interests.
              </li>
              <li>
                <strong>Right to withdraw consent:</strong> Where processing is
                based on consent, you may withdraw it at any time.
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@studysync.app" className="text-primary">
                support@studysync.app
              </a>
              . We will respond within 30 days.
            </p>
            <p>
              You also have the right to lodge a complaint with your local data
              protection supervisory authority.
            </p>
          </Section>

          <Section title="9. Data Security">
            <p>
              We implement appropriate technical and organisational measures to
              protect your personal data, including:
            </p>
            <ul>
              <li>Encrypted connections (HTTPS/TLS) for all data in transit</li>
              <li>Database-level access controls and authentication</li>
              <li>
                Foreign key constraints ensuring data is fully deleted upon
                account removal
              </li>
              <li>No storage of plain-text passwords (hashed and salted)</li>
            </ul>
          </Section>

          <Section title="10. Cookies">
            <p>
              StudySync uses a single session cookie to keep you logged in. This
              cookie is strictly necessary for the App to function and does not
              track you across other websites. No analytics or advertising
              cookies are used.
            </p>
          </Section>

          <Section title="11. Children's Data">
            <p>
              StudySync is intended for users aged 16 and over. We do not
              knowingly collect data from children under 16. If you believe a
              child has provided us with personal data, please contact us and we
              will delete it promptly.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by displaying a notice within the
              App. The &apos;last updated&apos; date at the top of this document
              will always reflect the most recent revision.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              For any questions or concerns about this Privacy Policy, contact
              us at:{" "}
              <a href="mailto:support@studysync.app" className="text-primary">
                support@studysync.app
              </a>
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

// Helper components
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ServiceCard({
  name,
  description,
  privacyLink,
}: {
  name: string;
  description: string;
  privacyLink: string;
}) {
  return (
    <div className="bg-secondary/20 rounded-lg p-4 border border-border">
      <h4 className="font-semibold text-foreground mb-1">{name}</h4>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <a
        href={privacyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:text-primary/80"
      >
        Privacy Policy →
      </a>
    </div>
  );
}
