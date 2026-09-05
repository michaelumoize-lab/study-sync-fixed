"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DailyTask } from "@/lib/data/dashboard";

interface TodaysPlanProps {
  initialTasks: DailyTask[];
}

export function TodaysPlan({ initialTasks }: TodaysPlanProps) {
  const [tasks, setTasks] = React.useState<DailyTask[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalPlannedMinutes = tasks.reduce((sum, t) => sum + t.minutes, 0);

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Today&apos;s Plan</CardTitle>
              <CardDescription className="text-xs">
                {completedCount} of {tasks.length} completed ({totalPlannedMinutes} min total)
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-[11px] font-semibold">
            {completedCount === tasks.length ? "Done for today! 🎉" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5 flex-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
              task.completed
                ? "bg-secondary/20 border-border/40 text-muted-foreground"
                : "bg-card border-border hover:border-primary/40 hover:bg-secondary/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  task.completed
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/40 bg-background"
                }`}
              >
                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold transition-all ${
                    task.completed ? "line-through opacity-70" : "text-foreground"
                  }`}
                >
                  {task.title}
                </p>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {task.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground">
                {task.minutes}m
              </span>
              <Link
                href={task.href}
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Planned by StudySync intelligence
        </span>
        <Link
          href="/dashboard/workspace"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View Workspace →
        </Link>
      </CardFooter>
    </Card>
  );
}
