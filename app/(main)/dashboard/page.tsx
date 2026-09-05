import { getServerSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/data/dashboard";
import { DashboardHeader } from "@/components/Dashboard/dashboard-header";
import { TodaysFocus } from "@/components/Dashboard/todays-focus";
import { TodaysPlan } from "@/components/Dashboard/todays-plan";
import { UpcomingExams } from "@/components/Dashboard/upcoming-exams";
import { NeedsAttention } from "@/components/Dashboard/needs-attention";
import { ContinueLearning } from "@/components/Dashboard/continue-learning";
import { SpacedReviewSummary } from "@/components/Dashboard/spaced-review-summary";
import { ProgressSnapshot } from "@/components/Dashboard/progress-snapshot";

export const metadata = {
  title: "Command Center | StudySync",
};

export default async function DashboardPage() {
  const session = await getServerSession();
  const data = await getDashboardData(session.user);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-16 pt-2">
      <DashboardHeader user={data.user} />
      <TodaysFocus focus={data.focus} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysPlan initialTasks={data.plan} />
        <UpcomingExams exams={data.upcomingExams} />
      </div>
      <NeedsAttention topics={data.needsAttention} />
      <ContinueLearning items={data.continueLearning} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpacedReviewSummary review={data.spacedReview} />
        <ProgressSnapshot progress={data.progressSnapshot} />
      </div>
    </div>
  );
}
