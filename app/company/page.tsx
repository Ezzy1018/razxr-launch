import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CompanyPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Hire from verified practical skill</h1>
      <p className="max-w-3xl text-muted-foreground">
        Razxr candidates are evaluated through sprint delivery and debugging outcomes, not resume
        keywords. Browse public skill passports and filter by level, score, and track.
      </p>
      <div>
        <Link href="/company/talent" className={cn(buttonVariants())}>
          Browse talent
        </Link>
      </div>
    </section>
  );
}
