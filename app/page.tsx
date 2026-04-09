import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-black/35 px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,197,120,0.22),transparent_35%),radial-gradient(circle_at_86%_84%,rgba(107,124,255,0.16),transparent_28%)]" />
        <div className="relative space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Industry Work Simulator
          </p>
          <h1 className="max-w-5xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Skill credibility for hiring, built from real execution.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Move from claims to proof. Run sprint simulations, debug production-like
            failures, and publish a practical Skill Passport companies can trust.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/assess" className={buttonVariants({ size: "lg" })}>
              Start assessment
            </Link>
            <Link
              href="/hero-space"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              Open Hero Space
            </Link>
            <Link
              href="/company/talent"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Browse talent
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">Core Surfaces</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Space ATS</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Analyze resume fit against real job descriptions and spot ATS rejection risks.
              <div className="mt-3">
                <Link className="text-foreground/90 underline-offset-4 hover:text-foreground hover:underline" href="/hero-space">
                  Run ATS analysis
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sprint Lab</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Work inside preloaded codebases with tickets and AI PR reviews.
              <div className="mt-3">
                <Link className="text-foreground/90 underline-offset-4 hover:text-foreground hover:underline" href="/lab/proj-fintrack">
                  Launch FinTrack
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Debugging Chamber</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Fix production-like bugs and explain root cause with confidence.
              <div className="mt-3">
                <Link className="text-foreground/90 underline-offset-4 hover:text-foreground hover:underline" href="/debug">
                  Open challenges
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Skill Passport</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Publish verified practical outcomes and share with recruiters.
              <div className="mt-3">
                <Link className="text-foreground/90 underline-offset-4 hover:text-foreground hover:underline" href="/dashboard">
                  Generate from dashboard
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-black/25 px-6 py-7 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">For Hiring Teams</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Evaluate practical readiness, not resume theater.
            </h2>
          </div>
          <Link href="/company/talent" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Open company view
          </Link>
        </div>
      </section>
    </div>
  );
}
