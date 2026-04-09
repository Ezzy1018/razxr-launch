import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-[0.2em] text-foreground/95">
          RAZXR.
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-muted-foreground/90 md:flex">
          <Link className="nav-link transition-colors hover:text-foreground" href="/assess">
            Assess
          </Link>
          <Link className="nav-link transition-colors hover:text-foreground" href="/dashboard">
            Dashboard
          </Link>
          <Link className="nav-link transition-colors hover:text-foreground" href="/debug">
            Debug
          </Link>
          <Link className="nav-link transition-colors hover:text-foreground" href="/hero-space">
            Hero Space
          </Link>
          <Link className="nav-link transition-colors hover:text-foreground" href="/company">
            Company
          </Link>
          <Link className="nav-link transition-colors hover:text-foreground" href="/company/talent">
            Talent
          </Link>
        </nav>
        <Link
          href="/hero-space"
          className="nav-link text-xs font-medium tracking-[0.14em] text-muted-foreground/90 transition-colors hover:text-foreground md:hidden"
        >
          HERO SPACE
        </Link>
      </div>
    </header>
  );
}
