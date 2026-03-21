// app/maintenance/page.tsx
import { BookOpen, Clock, Mail } from "lucide-react";

export default function MaintenancePage() {
  const maintenanceMessage = process.env.MAINTENANCE_MESSAGE || 
    "We're currently performing scheduled maintenance. We'll be back shortly!";
  
  const estimatedTime = process.env.MAINTENANCE_ESTIMATED_TIME;
  const contactEmail = process.env.MAINTENANCE_CONTACT_EMAIL || "support@mail.studysync.website";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl text-center">
          {/* Logo with StudySync text */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-primary p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              StudySync
            </span>
          </div>
          
          {/* Maintenance Icon */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-primary animate-pulse" />
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-black text-foreground mb-2">
            Under Maintenance
          </h1>
          
          {/* Custom Message from ENV */}
          <p className="text-muted-foreground mb-4">
            {maintenanceMessage}
          </p>
          
          {/* Estimated Time (optional) */}
          {estimatedTime && (
            <p className="text-sm text-muted-foreground mb-6">
              ⏱️ Estimated completion: {estimatedTime}
            </p>
          )}
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Maintenance in progress</span>
          </div>
          
          {/* Contact */}
          <div className="border-t border-border pt-6">
            <a 
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Mail className="w-4 h-4" />
              {contactEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}