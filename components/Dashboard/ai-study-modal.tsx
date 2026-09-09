"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AIStudyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIStudyModal({ open, onOpenChange }: AIStudyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Personalized Study Recommendation
          </DialogTitle>
          <DialogDescription className="text-sm">
            StudySync analyzed your upcoming exams, FSRS memory decay, and recent quiz mistakes.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-3 my-2">
          <p className="text-sm font-bold text-foreground">
            Suggested 35-Minute Power Session:
          </p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="font-bold text-foreground">1.</span>
              <span>
                <strong>Review 6 flashcards</strong> on Process Scheduling (10 min)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-foreground">2.</span>
              <span>
                <strong>Practice 8 questions</strong> on Memory Management (15 min)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-foreground">3.</span>
              <span>
                <strong>Quick recap</strong> on Page Replacement algorithms (10 min)
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            🎯 <strong>Why this?</strong> Addresses your lowest mastery topic (42%) where an exam is in 12 days.
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-medium"
          >
            Maybe Later
          </Button>
          <Button
            asChild
            className="rounded-xl font-bold gap-2"
            onClick={() => onOpenChange(false)}
          >
            <Link href="/dashboard/study">
              Start This Session
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
