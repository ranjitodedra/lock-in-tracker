import { ApplicationsDashboard } from "@/components/dashboard/applications-dashboard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { listApplications } from "@/lib/applications/queries";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await requireUser();
  const applications = await listApplications();

  return (
    <DashboardShell
      title="Dashboard"
      description="Track every application in one place."
      showNewAction={false}
      hideTitle
      user={user}
    >
      <ApplicationsDashboard applications={applications} />
    </DashboardShell>
  );
}
