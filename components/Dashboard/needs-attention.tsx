import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NeedsAttentionTopic } from "@/lib/data/dashboard";

interface NeedsAttentionProps {
  topics: NeedsAttentionTopic[];
}

export function NeedsAttention({ topics }: NeedsAttentionProps) {
  return (
    <Card className="border-amber-500/20 bg-amber-500/[0.02]">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">⚠️ Needs Attention</CardTitle>
              <CardDescription className="text-xs">
                Topics where recent question attempts or reviews dipped below mastery thresholds
              </CardDescription>
            </div>
          </div>
          <Button asChild size="sm" className="rounded-xl font-bold bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/dashboard/study/quizzes">
              Practice Weak Topics
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 rounded-2xl bg-card border border-border space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    {topic.conceptName}
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    {topic.courseName}
                  </span>
                </div>
                <span
                  className={`text-xs font-black ${
                    topic.masteryScore < 50 ? "text-red-500" : "text-amber-500"
                  }`}
                >
                  {topic.masteryScore}%
                </span>
              </div>

              <Progress value={topic.masteryScore} className="h-1.5 bg-muted" />

              <p className="text-xs text-muted-foreground leading-relaxed">
                {topic.recentStats} {topic.commonMistake}
              </p>

              <Link
                href={topic.actionHref}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
              >
                {topic.actionLabel} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
