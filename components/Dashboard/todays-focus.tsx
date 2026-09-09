import * as React from "react";
import Link from "next/link";
import { Target, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TodaysFocusData } from "@/lib/data/dashboard";

interface TodaysFocusProps {
  focus: TodaysFocusData;
}

export function TodaysFocus({ focus }: TodaysFocusProps) {
  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card shadow-sm">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="default"
              className="gap-1.5 rounded-lg py-0.5 px-2.5 bg-primary text-primary-foreground font-semibold"
            >
              <Target className="w-3 h-3" />
              TODAY&apos;S FOCUS
            </Badge>
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Exam in {focus.examDaysRemaining} days
            </span>
          </div>
          <Badge variant="outline" className="text-xs border-primary/20 text-primary">
            AI Recommendation
          </Badge>
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-black mt-2 text-foreground flex items-center gap-2.5">
          <span>🧠 {focus.courseName}: {focus.conceptName}</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl leading-relaxed">
          {focus.rationale}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1 pb-4">
        <div className="p-4 rounded-2xl bg-background/70 border border-border/60 max-w-xl">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
              Concept Mastery
            </span>
            <span className="text-red-500 font-bold">{focus.masteryScore}% (Needs Attention)</span>
          </div>
          <Progress value={focus.masteryScore} className="h-2.5 bg-muted" />
          <p className="text-xs text-muted-foreground mt-2">
            💡 <strong>Recent mistake pattern:</strong> {focus.errorPattern}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-3 pt-0">
        <Button asChild className="rounded-xl font-bold gap-2">
          <Link href={focus.studyHref}>
            Continue Studying
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl font-semibold">
          <Link href={focus.quizHref}>
            Take Diagnostic Quiz (8 Qs)
          </Link>
        </Button>
        <Button asChild variant="ghost" className="rounded-xl text-xs text-muted-foreground hover:text-foreground">
          <Link href="/dashboard/courses">
            View Course Syllabus
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
