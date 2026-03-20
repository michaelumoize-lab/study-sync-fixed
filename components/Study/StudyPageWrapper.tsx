// components/Study/StudyPageWrapper.tsx
"use client";
import { useSidebar } from "@/context/SidebarContext";
import { StudyClient } from "./StudyClient";

interface UserNote {
  id: string;
  title: string;
}

interface ChatSession {
  id: string;
  title: string | null;
  noteId: string | null;
  noteTitle: string | null;
  messageCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface StudyPageWrapperProps {
  initialSessions: ChatSession[];
  userNotes: UserNote[];
}

export function StudyPageWrapper({
  initialSessions,
  userNotes,
}: StudyPageWrapperProps) {
  const { isCollapsed } = useSidebar();
  return (
    <StudyClient
      initialSessions={initialSessions}
      userNotes={userNotes}
      sidebarCollapsed={isCollapsed}
    />
  );
}
