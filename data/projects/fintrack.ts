import type { ProjectSeed } from "@/types";

export const finTrackProject: ProjectSeed = {
  id: "proj-fintrack",
  title: "FinTrack Dashboard",
  description:
    "Portfolio and cashflow analytics dashboard for a small fintech product team.",
  track: "fintech",
  difficulty: "medium",
  files: {
    "src/services/cashflow.ts": `export type MonthlyCashflow = { month: string; inflow: number; outflow: number }\n\nexport function computeNet(row: MonthlyCashflow) {\n  return row.inflow - row.outflow\n}\n`,
    "src/components/KpiCard.tsx": `type KpiCardProps = { title: string; value: string }\n\nexport function KpiCard({ title, value }: KpiCardProps) {\n  return (\n    <article className=\"kpi-card\">\n      <h3>{title}</h3>\n      <p>{value}</p>\n    </article>\n  )\n}\n`,
    "src/pages/dashboard.tsx": `import { KpiCard } from \"../components/KpiCard\"\n\nexport default function Dashboard() {\n  return (\n    <section>\n      <KpiCard title=\"MRR\" value=\"$12,430\" />\n      <KpiCard title=\"Runway\" value=\"14 months\" />\n    </section>\n  )\n}\n`,
  },
  tickets: [
    {
      id: "ticket-fintrack-1",
      title: "Fix KPI precision drift",
      description:
        "The net cashflow widget rounds too early. Return two-decimal precision for display.",
      difficulty: "easy",
      testCases: [
        {
          input: "inflow=103.125,outflow=3.1",
          expected: "100.03",
          description: "Preserve precision to 2 decimals.",
        },
      ],
    },
    {
      id: "ticket-fintrack-2",
      title: "Add monthly burn trend",
      description:
        "Create helper that returns rolling 3-month burn average used by dashboard chart.",
      difficulty: "medium",
      testCases: [
        {
          input: "[3000,2800,3100,3300]",
          expected: "[2966.67,3066.67]",
          description: "Compute windowed averages.",
        },
      ],
    },
    {
      id: "ticket-fintrack-3",
      title: "Guard against negative runway",
      description:
        "Runway must clamp at 0 when monthly burn is zero or company is profitable.",
      difficulty: "medium",
      testCases: [
        {
          input: "cash=40000,burn=-500",
          expected: "0",
          description: "No negative runway values.",
        },
      ],
    },
  ],
};
