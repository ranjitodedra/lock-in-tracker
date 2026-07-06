"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  ApplicationsTable,
  type SortDir,
  type SortKey,
} from "@/components/dashboard/applications-table";
import {
  ApplicationsToolbar,
  type DashboardFilters,
} from "@/components/dashboard/applications-toolbar";
import { useDashboardShortcuts } from "@/hooks/use-dashboard-shortcuts";
import {
  patchApplication,
  type PatchApplicationInput,
} from "@/lib/applications/actions";
import type { ApplicationRow } from "@/types/application";

const DEFAULT_FILTERS: DashboardFilters = {
  search: "",
  status: "all",
  workMode: "all",
  deadlineFrom: "",
  deadlineTo: "",
};

type ApplicationsDashboardProps = {
  applications: ApplicationRow[];
};

function matchesSearch(app: ApplicationRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if (app.company?.toLowerCase().includes(q)) return true;
  if (app.job_title?.toLowerCase().includes(q)) return true;
  if (app.skills?.some((skill) => skill.toLowerCase().includes(q))) return true;

  return false;
}

function matchesDeadlineRange(
  app: ApplicationRow,
  from: string,
  to: string,
): boolean {
  if (!from && !to) return true;
  if (!app.application_deadline) return false;

  const deadline = new Date(app.application_deadline);

  if (from) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);
    if (deadline < start) return false;
  }

  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    if (deadline > end) return false;
  }

  return true;
}

function compareValues(
  a: ApplicationRow,
  b: ApplicationRow,
  key: SortKey,
): number {
  const av = a[key];
  const bv = b[key];

  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;

  if (key === "created_at") {
    return new Date(av as string).getTime() - new Date(bv as string).getTime();
  }

  if (key === "follow_up_date") {
    return new Date(av as string).getTime() - new Date(bv as string).getTime();
  }

  return String(av).localeCompare(String(bv));
}

function hasActiveFilters(filters: DashboardFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.workMode !== "all" ||
    filters.deadlineFrom !== "" ||
    filters.deadlineTo !== ""
  );
}

export function ApplicationsDashboard({
  applications: initialApplications,
}: ApplicationsDashboardProps) {
  const router = useRouter();
  const [applications, setApplications] = useState(initialApplications);
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [patchingId, setPatchingId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useDashboardShortcuts(searchInputRef);

  const handlePatch = useCallback(
    async (id: string, patch: PatchApplicationInput) => {
      setPatchingId(id);
      const result = await patchApplication(id, patch);
      setPatchingId(null);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? result.application : app,
        ),
      );
    },
    [],
  );

  const filtered = useMemo(() => {
    let result = applications.filter(
      (app) =>
        matchesSearch(app, filters.search) &&
        (filters.status === "all" || app.status === filters.status) &&
        (filters.workMode === "all" || app.work_mode === filters.workMode) &&
        matchesDeadlineRange(app, filters.deadlineFrom, filters.deadlineTo),
    );

    result = [...result].sort((a, b) => {
      const cmp = compareValues(a, b, sortKey);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [applications, filters, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  function handleSelect(application: ApplicationRow) {
    router.push(`/applications/${application.id}`);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  const activeFilters = hasActiveFilters(filters);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <ApplicationsToolbar
        filters={filters}
        totalCount={applications.length}
        filteredCount={filtered.length}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={activeFilters}
        searchInputRef={searchInputRef}
      />

      <div className="min-h-0 flex-1 overflow-auto">
        <ApplicationsTable
          applications={filtered}
          totalCount={applications.length}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          onSelect={handleSelect}
          onPatch={handlePatch}
          patchingId={patchingId}
          hasActiveFilters={activeFilters}
          onClearFilters={clearFilters}
        />
      </div>
      </div>
    </div>
  );
}
