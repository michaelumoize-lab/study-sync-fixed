"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIStudyModal } from "@/components/Dashboard/ai-study-modal";

export function HeaderActions() {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="rounded-xl gap-2 font-medium bg-secondary/50 hover:bg-secondary border-border cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>What should I study?</span>
        </Button>
        <Button
          asChild
          size="sm"
          className="rounded-xl gap-2 font-semibold shadow-xs"
        >
          <Link href="/dashboard/study">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Session</span>
          </Link>
        </Button>
      </div>

      <AIStudyModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
