import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpacedReviewData } from "@/lib/data/dashboard";

interface SpacedReviewSummaryProps {
  review: SpacedReviewData;
}

export function SpacedReviewSummary({ review }: SpacedReviewSummaryProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Spaced Repetition Review</CardTitle>
              <CardDescription className="text-xs">
                FSRS memory retention queue
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold">
            {review.cardsDue} Cards Due
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-foreground">
              {review.cardsDue} Cards
            </p>
            <span className="text-xs text-muted-foreground">
              Across {review.conceptsDue} concepts
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">
              ~{review.estimatedMinutes} min
            </p>
            <span className="text-xs text-muted-foreground">Est. completion</span>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          {review.breakdown.map((item) => (
            <div key={item.name} className="flex justify-between">
              <span>{item.name}</span>
              <span className="font-semibold text-foreground">
                {item.cardsCount} cards
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-border/40">
        <Button asChild className="w-full rounded-xl font-bold gap-2">
          <Link href="/dashboard/flashcards">
            <RotateCcw className="w-4 h-4" />
            Start Review Session
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
