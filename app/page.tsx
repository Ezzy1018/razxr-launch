import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6">
      <section className="space-y-6">
        <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
          Industry Work Simulator
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Your first job, before your first job.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Join sprint simulations, ship ticket fixes in real multi-file codebases,
          and build a public Skill Passport companies can evaluate.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/assess" className={buttonVariants()}>
            Start assessment
          </Link>
          <Link
            href="/hero-space"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Open Hero Space
          </Link>
          <Link
            href="/company/talent"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Browse talent
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Open dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Hero Space ATS</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Analyze resume fit against real job descriptions and spot ATS rejection risks.
            <div className="mt-3">
              <Link className="text-primary underline-offset-4 hover:underline" href="/hero-space">
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
              <Link className="text-primary underline-offset-4 hover:underline" href="/lab/proj-fintrack">
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
              <Link className="text-primary underline-offset-4 hover:underline" href="/debug">
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
              <Link className="text-primary underline-offset-4 hover:underline" href="/dashboard">
                Generate from dashboard
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
