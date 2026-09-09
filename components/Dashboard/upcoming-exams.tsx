import * as React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UpcomingExamData } from "@/lib/data/dashboard";

interface UpcomingExamsProps {
  exams: UpcomingExamData[];
}

export function UpcomingExams({ exams }: UpcomingExamsProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Upcoming Exams</CardTitle>
              <CardDescription className="text-xs">
                Goalposts driving your daily recommendation weights
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-medium">
            {exams.length} Tracked
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 flex-1">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="p-3.5 rounded-2xl bg-card border border-border/70 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    exam.daysRemaining <= 14
                      ? "bg-red-500"
                      : exam.daysRemaining <= 30
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <span className="font-bold text-sm text-foreground">
                  {exam.name}
                </span>
              </div>
              <Badge variant={exam.badgeVariant} className="text-[10px] font-bold">
                {exam.statusBadge}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Exam Readiness</span>
                <span className="font-semibold text-foreground">
                  {exam.readinessScore}%
                </span>
              </div>
              <Progress value={exam.readinessScore} className="h-2" />
            </div>

            <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
              <span>Date: {exam.examDateFormatted}</span>
              <Link
                href="/dashboard/study"
                className="font-semibold text-primary hover:underline"
              >
                Prepare now →
              </Link>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Based on syllabus coverage
        </span>
        <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-primary">
          <Link href="/dashboard/courses">Manage exams →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
