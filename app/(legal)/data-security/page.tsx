// app/data-security/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Shield,
  Lock,
  Server,
  Cloud,
  Cpu,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Security Policy | StudySync",
  description:
    "Learn how StudySync protects your personal data with enterprise-grade security measures, encryption, and access controls.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function DataSecurityPage() {
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
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Data Security Policy
                </h1>
              </div>
              <p className="text-muted-foreground">
                StudySync — Student Study App
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Last updated: 25 January 2025
          </p>
        </div>

        {/* Security Overview Card */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-6 mb-8 border border-primary/20">
          <div className="flex items-start gap-4">
            <Lock className="w-10 h-10 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Your Data is Protected
              </h2>
              <p className="text-muted-foreground text-sm">
                StudySync implements enterprise-grade security measures to
                protect your personal data. We follow industry best practices
                and comply with GDPR Article 32 requirements for data
                protection.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <Section title="1. Overview">
            <p>
              StudySync takes the security of your personal data seriously. This
              document describes the technical and organisational security
              measures we implement to protect user data, in accordance with
              Article 32 of the GDPR.
            </p>
          </Section>

          <Section title="2. Data in Transit">
            <p>
              All communications between your browser and StudySync servers are
              protected by:
            </p>
            <SecurityList
              items={[
                "TLS 1.2 / TLS 1.3 encryption for all HTTP connections (HTTPS enforced)",
                "Secure, HttpOnly session cookies to prevent client-side script access",
                "HSTS (HTTP Strict Transport Security) headers to prevent downgrade attacks",
              ]}
            />
          </Section>

          <Section title="3. Data at Rest">
            <p>
              Your data is stored in a Neon PostgreSQL database with the
              following protections:
            </p>
            <SecurityList
              items={[
                "Database access is restricted to application-level credentials only — no public access",
                "All database connections require authentication via secure connection strings stored as environment variables",
                "Passwords are never stored in plain text; they are hashed using a strong cryptographic algorithm (bcrypt)",
                "Profile pictures are stored in Vercel Blob with access-controlled public URLs",
              ]}
            />
          </Section>

          <Section title="4. Access Controls">
            <p>Access to your data is strictly controlled:</p>
            <SecurityList
              items={[
                "All API routes require authentication — unauthenticated requests are rejected with a 401 response",
                "Every database query is scoped to the authenticated user's ID — users cannot access each other's data",
                "Administrative access to the database is limited to authorised personnel only",
                "Foreign key constraints at the database level ensure data integrity and prevent orphaned records",
              ]}
            />
          </Section>

          <Section title="5. Account & Authentication Security">
            <p>We implement the following authentication security measures:</p>
            <SecurityList
              items={[
                "Session tokens are cryptographically signed and stored securely",
                "Google OAuth sign-in delegates authentication to Google's security infrastructure",
                "Email/password accounts use hashed and salted password storage",
                "Sessions are invalidated upon sign-out",
                "Account deletion immediately and permanently removes all associated data via database cascade",
              ]}
            />
          </Section>

          <Section title="6. Third-Party Security">
            <p>
              We only use reputable third-party providers with strong security
              postures:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              <SecurityCard
                icon={<Server className="w-5 h-5" />}
                name="Neon"
                description="SOC 2 Type II certified database provider"
                link="https://neon.tech/security"
              />
              <SecurityCard
                icon={<Cloud className="w-5 h-5" />}
                name="Vercel"
                description="SOC 2 Type II certified hosting provider"
                link="https://vercel.com/security"
              />
              <SecurityCard
                icon={<Cpu className="w-5 h-5" />}
                name="Groq"
                description="AI processing with enterprise-grade security"
                link="https://groq.com/security"
              />
            </div>
            <p className="mt-2">
              Each provider acts as a data processor under a Data Processing
              Agreement (DPA) and is obligated to maintain appropriate security
              measures.
            </p>
          </Section>

          <Section title="7. AI Feature Security">
            <p>When you use AI-powered features:</p>
            <SecurityList
              items={[
                "Only the specific note content required for the feature is transmitted — never your full account data",
                "Transmissions are encrypted via TLS",
                "Groq does not retain submitted content for model training",
                "Input validation and sanitisation is applied to all AI-generated HTML content before storage",
              ]}
            />
          </Section>

          <Section title="8. Input Validation & Application Security">
            <p>
              The App implements the following application-level security
              controls:
            </p>
            <SecurityList
              items={[
                "All user inputs are validated server-side before processing or storage",
                "AI-generated HTML is sanitised using an allowlist-based sanitiser to prevent XSS",
                "SQL injection is prevented through the use of parameterised queries via Drizzle ORM",
                "File uploads (profile pictures) are validated for type and size before storage",
                "Rate limiting and request validation are enforced on all API endpoints",
              ]}
            />
          </Section>

          <Section title="9. Incident Response">
            <p>In the event of a security incident or data breach:</p>
            <ul>
              <li>We will investigate and contain the incident immediately</li>
              <li>
                Affected users will be notified within 72 hours as required by
                GDPR
              </li>
              <li>Relevant supervisory authorities will be informed</li>
              <li>We will implement measures to prevent recurrence</li>
            </ul>
            <p>
              To report a security vulnerability, please contact us at{" "}
              <Link
                href="mailto:support@studysync.app"
                className="text-primary hover:underline"
              >
                support@studysync.app
              </Link>
              .
            </p>
          </Section>

          <Section title="10. Regular Security Reviews">
            <p>We maintain security through:</p>
            <ul>
              <li>Regular dependency updates and vulnerability scanning</li>
              <li>Automated security testing in CI/CD pipeline</li>
              <li>Periodic manual security reviews of critical components</li>
              <li>Monitoring of security advisories for all dependencies</li>
            </ul>
          </Section>

          <Section title="11. Data Retention & Deletion">
            <p>In accordance with GDPR requirements:</p>
            <ul>
              <li>Data is retained only as long as your account is active</li>
              <li>
                Account deletion triggers immediate and complete data removal
              </li>
              <li>
                Backups are retained for a maximum of 7 days and are also
                deleted upon account removal
              </li>
              <li>
                No data is kept for marketing or analytical purposes beyond
                basic usage metrics
              </li>
            </ul>
          </Section>

          <Section title="12. Compliance & Certifications">
            <p>StudySync is designed to comply with:</p>
            <ul>
              <li>General Data Protection Regulation (GDPR)</li>
              <li>EU data protection standards</li>
              <li>Security best practices from OWASP and industry standards</li>
            </ul>
            <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 p-4 my-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm m-0">
                  <strong>Our Commitment:</strong> We are committed to
                  maintaining the highest standards of data security and
                  privacy. If you have any security concerns or questions,
                  please contact us at{" "}
                  <a
                    href="mailto:security@studysync.app"
                    className="text-primary hover:underline"
                  >
                    security@studysync.app
                  </a>
                  .
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            StudySync is committed to protecting your data with enterprise-grade
            security measures. This policy is reviewed and updated regularly to
            ensure ongoing compliance and protection.
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

function SecurityList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SecurityCard({
  icon,
  name,
  description,
  link,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  link: string;
}) {
  return (
    <div className="bg-secondary/10 rounded-lg p-4 border border-border hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-semibold text-foreground">{name}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-primary hover:underline"
      >
        Security Documentation →
      </a>
    </div>
  );
}
