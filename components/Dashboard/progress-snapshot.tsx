import * as React from "react";
import Link from "next/link";
import { BarChart3, Flame, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressSnapshotData } from "@/lib/data/dashboard";

interface ProgressSnapshotProps {
  progress: ProgressSnapshotData;
}

export function ProgressSnapshot({ progress }: ProgressSnapshotProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Your Progress</CardTitle>
              <CardDescription className="text-xs">
                Weekly student model snapshot
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
            <Flame className="w-4 h-4 fill-current" />
            {progress.streakDays}-day streak
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Time Studied
            </span>
            <p className="text-xl font-black text-foreground mt-1">
              {progress.hoursStudiedThisWeek} hrs
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">
              {progress.hoursDiffNotice}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Mastery Gain
            </span>
            <p className="text-xl font-black text-foreground mt-1">
              +{progress.masteryGainPercent}%
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">
              {progress.overallMasteryPercent}% overall mastery
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Quiz Accuracy
            </span>
            <p className="text-xl font-black text-foreground mt-1">
              {progress.quizAccuracyPercent}%
            </p>
            <span className="text-[10px] text-muted-foreground">
              {progress.questionsAnsweredCount} questions answered
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">
              Cards Reviewed
            </span>
            <p className="text-xl font-black text-foreground mt-1">
              {progress.cardsReviewedCount}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">
              {progress.retentionPercent}% retention rate
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/40">
        <Button asChild variant="outline" className="w-full rounded-xl font-bold gap-2">
          <Link href="/dashboard/progress">
            <TrendingUp className="w-4 h-4" />
            View Detailed Progress
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
