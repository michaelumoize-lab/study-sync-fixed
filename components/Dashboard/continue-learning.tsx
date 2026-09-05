import * as React from "react";
import Link from "next/link";
import { BookOpen, Play } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ContinueLearningItem } from "@/lib/data/dashboard";

interface ContinueLearningProps {
  items: ContinueLearningItem[];
}

export function ContinueLearning({ items }: ContinueLearningProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-base font-bold text-foreground">Continue Learning</h3>
        </div>
        <Link
          href="/dashboard/courses"
          className="text-xs font-semibold text-primary hover:underline"
        >
          All Courses →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="hover:border-primary/40 hover:shadow-xs transition-all cursor-pointer"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px]">
                  Course {item.courseCode}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {item.lastActivityTime}
                </span>
              </div>
              <CardTitle className="text-base font-bold mt-1">
                {item.courseName}
              </CardTitle>
              <CardDescription className="text-xs">
                {item.unitTitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Unit Progress</span>
                  <span className="font-semibold text-foreground">
                    {item.progressPercent}%
                  </span>
                </div>
                <Progress value={item.progressPercent} className="h-1.5" />
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="w-full text-xs font-bold rounded-xl gap-1.5"
              >
                <Link href={item.resumeHref}>
                  <Play className="w-3 h-3 fill-current" /> {item.actionLabel}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
