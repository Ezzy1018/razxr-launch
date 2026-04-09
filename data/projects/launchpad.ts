import type { ProjectSeed } from "@/types";

export const launchPadProject: ProjectSeed = {
  id: "proj-launchpad",
  title: "LaunchPad API",
  description:
    "Multi-tenant SaaS backend handling organizations, plans, and usage metering.",
  track: "saas",
  difficulty: "hard",
  files: {
    "src/routes/billing.ts": `import type { Request, Response } from \"express\"\n\nexport function getPlan(_req: Request, res: Response) {\n  res.json({ plan: \"starter\", seats: 5 })\n}\n`,
    "src/services/usage.ts": `export type UsageEvent = { orgId: string; units: number }\n\nexport function aggregateUsage(events: UsageEvent[]) {\n  return events.reduce((acc, evt) => acc + evt.units, 0)\n}\n`,
    "src/middleware/rateLimit.ts": `export function isRateLimited(count: number, limit: number) {\n  return count > limit\n}\n`,
  },
  tickets: [
    {
      id: "ticket-launchpad-1",
      title: "Fix inclusive rate-limit bug",
      description:
        "Requests equal to limit should still be allowed. Block only when requests exceed limit.",
      difficulty: "easy",
      testCases: [
        {
          input: "count=100,limit=100",
          expected: "false",
          description: "Boundary should pass.",
        },
      ],
    },
    {
      id: "ticket-launchpad-2",
      title: "Add organization usage bucket",
      description:
        "Return usage totals grouped by orgId instead of one global sum.",
      difficulty: "medium",
      testCases: [
        {
          input: "[{orgId:a,units:3},{orgId:b,units:5},{orgId:a,units:2}]",
          expected: "{a:5,b:5}",
          description: "Grouped accumulation required.",
        },
      ],
    },
    {
      id: "ticket-launchpad-3",
      title: "Add overage pricing preview",
      description:
        "Compute projected monthly overage amount using tiered pricing.",
      difficulty: "hard",
      testCases: [
        {
          input: "included=1000,used=1350,price=0.02",
          expected: "7",
          description: "350 excess units * 0.02.",
        },
      ],
    },
  ],
};
