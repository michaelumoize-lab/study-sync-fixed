// app/terms-of-service/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Download, FileText, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | StudySync",
  description:
    "Read StudySync's terms of service - the agreement governing your use of our study application",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 text-sm inline-flex items-center gap-1 mb-6 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                StudySync — Student Study App
              </p>
            </div>

            {/* Download PDF Button */}
            <a
              href="/terms-of-service.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Last updated: 25 January 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <Section title="1. Acceptance of Terms">
            <p>
              By creating an account and using StudySync (&quot;the App&quot;,
              &quot;the Service&quot;), you agree to be bound by these Terms of
              Service (&quot;Terms&quot;). If you do not agree, do not use the
              App. These Terms constitute a binding agreement between you and
              StudySync.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              StudySync is a free, web-based application designed to help
              students organise their study materials. The App allows you to:
            </p>
            <ul>
              <li>Create, edit, and organise notes</li>
              <li>Create and review flashcard decks</li>
              <li>Manage a personal study schedule</li>
              <li>Use AI-powered tools to format and summarise content</li>
              <li>Track study streaks and progress</li>
            </ul>
          </Section>

          <Section title="3. Eligibility">
            <p>
              You must be at least <strong>16 years of age</strong> to use
              StudySync. By using the App, you confirm that you meet this
              requirement.
            </p>
          </Section>

          <Section title="4. Account Registration">
            <p>
              To use the App, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate and complete registration information</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>
                Notify us immediately if you suspect unauthorised access to your
                account
              </li>
              <li>Accept responsibility for all activity under your account</li>
            </ul>
            <div className="bg-secondary/20 border-l-4 border-primary p-4 my-4 rounded-r-lg">
              <p className="text-sm text-muted-foreground m-0">
                <strong>Important:</strong> We reserve the right to suspend or
                terminate accounts that provide false information or violate
                these Terms.
              </p>
            </div>
          </Section>

          <Section title="5. Acceptable Use">
            <p>
              You agree to use StudySync only for lawful purposes and in
              accordance with these Terms. <strong>You must not:</strong>
            </p>
            <ul>
              <li>
                Upload, store, or share any content that is illegal, harmful,
                defamatory, obscene, or that infringes third-party intellectual
                property rights
              </li>
              <li>
                Attempt to gain unauthorised access to the App, its servers, or
                other users&apos; accounts
              </li>
              <li>
                Use automated tools, bots, or scrapers to access or extract data
                from the App
              </li>
              <li>Use the App to send spam or unsolicited communications</li>
              <li>
                Reverse engineer, decompile, or otherwise attempt to derive the
                source code of the App
              </li>
              <li>
                Use the App in any way that could damage, disable, or impair its
                operation
              </li>
            </ul>
          </Section>

          <Section title="6. Your Content">
            <Subsection title="6.1 Ownership">
              <p>
                You retain <strong>full ownership</strong> of all content you
                create within StudySync, including your notes, flashcards, and
                study materials (&quot;Your Content&quot;).
              </p>
            </Subsection>

            <Subsection title="6.2 Licence to Us">
              <p>
                By using the App, you grant us a limited, non-exclusive,
                royalty-free licence to store and process Your Content solely
                for the purpose of providing the Service to you. We do not claim
                ownership of Your Content and will not use it for any other
                purpose.
              </p>
            </Subsection>

            <Subsection title="6.3 Responsibility">
              <p>
                You are solely responsible for Your Content. We do not review
                content you create and do not endorse any opinions or
                information it contains.
              </p>
            </Subsection>
          </Section>

          <Section title="7. AI Features">
            <p>
              The App includes AI-powered features (PDF formatting, flashcard
              generation, and study chat) powered by Groq. By using these
              features:
            </p>
            <ul>
              <li>
                You acknowledge that your note content will be transmitted to
                Groq&apos;s servers for processing
              </li>
              <li>
                You agree not to submit any sensitive personal data,
                confidential information, or third-party proprietary content to
                AI features
              </li>
              <li>
                AI-generated output is provided for informational purposes only
                and may contain errors
              </li>
            </ul>
            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 my-4 rounded-r-lg">
              <p className="text-sm m-0">
                <strong>⚠️ Important:</strong> AI-generated content may not
                always be accurate. Always verify important information.
              </p>
            </div>
          </Section>

          <Section title="8. Free Service & No Warranties">
            <p>
              StudySync is provided <strong>free of charge</strong> on an
              &quot;as is&quot; and &quot;as available&quot; basis. To the
              fullest extent permitted by law, we disclaim all warranties,
              express or implied, including warranties of merchantability,
              fitness for a particular purpose, and non-infringement.
            </p>
            <p>We do not warrant that:</p>
            <ul>
              <li>The App will meet your specific requirements</li>
              <li>
                The App will be uninterrupted, timely, secure, or error-free
              </li>
              <li>Any errors in the App will be corrected</li>
              <li>
                The results obtained from using the App will be accurate or
                reliable
              </li>
            </ul>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, StudySync shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including without limitation,
              loss of profits, data, use, goodwill, or other intangible losses,
              resulting from:
            </p>
            <ul>
              <li>Your use or inability to use the App</li>
              <li>Any conduct or content of any third party on the App</li>
              <li>
                Unauthorised access, use, or alteration of your transmissions or
                content
              </li>
            </ul>
          </Section>

          <Section title="10. Data Deletion & Account Termination">
            <h3 className="text-lg font-semibold mt-4 mb-2">
              10.1 Account Deletion
            </h3>
            <p>
              You may delete your account at any time through the App settings.
              Upon deletion:
            </p>
            <ul>
              <li>
                All your personal data, notes, flashcards, and study sessions
                are permanently and immediately deleted
              </li>
              <li>
                This action is <strong>irreversible</strong>
              </li>
              <li>Profile pictures are removed from storage</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">
              10.2 Termination by Us
            </h3>
            <p>
              We reserve the right to suspend or terminate your account
              immediately without prior notice if you violate these Terms.
            </p>
          </Section>

          <Section title="11. Changes to These Terms">
            <p>
              We may update these Terms from time to time. We will notify you of
              material changes by:
            </p>
            <ul>
              <li>Displaying a notice within the App</li>
              <li>
                Sending an email to your registered address (for significant
                changes)
              </li>
            </ul>
            <p>
              Your continued use of the App after changes constitutes acceptance
              of the updated Terms.
            </p>
          </Section>

          <Section title="12. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the Netherlands (EU), without regard to its conflict
              of law provisions.
            </p>
          </Section>

          <Section title="13. Contact Information">
            <p>For any questions about these Terms, please contact us at:</p>
            <div className="bg-secondary/20 rounded-lg p-4 my-4">
              <p className="m-0">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@studysync.app"
                  className="text-primary hover:underline"
                >
                  support@studysync.app
                </a>
                <br />
                <strong>Legal:</strong>{" "}
                <a
                  href="mailto:legal@studysync.app"
                  className="text-primary hover:underline"
                >
                  legal@studysync.app
                </a>
              </p>
            </div>
          </Section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            By using StudySync, you acknowledge that you have read, understood,
            and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="mt-8 first:mt-0 scroll-mt-20"
      id={title.toLowerCase().replace(/\s+/g, "-")}
    >
      <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border">
        {title}
      </h2>
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
