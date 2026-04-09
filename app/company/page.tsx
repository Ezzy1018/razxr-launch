import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CompanyPage() {
  return (
    <section className="page-wrap">
      <header className="page-hero">
        <p className="page-kicker">Company</p>
        <h1 className="page-title text-4xl">Hire from verified practical skill</h1>
        <p className="page-subtitle max-w-3xl">
        Razxr candidates are evaluated through sprint delivery and debugging outcomes, not resume
        keywords. Browse public skill passports and filter by level, score, and track.
        </p>
      </header>
      <div>
        <Link href="/company/talent" className={cn(buttonVariants())}>
          Browse talent
        </Link>
      </div>
    </section>
  );
}
