import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SprintCardProps = {
  id: string;
  title: string;
  track: string;
  difficulty: string;
  ticketCount: number;
};

export function SprintCard({ id, title, track, difficulty, ticketCount }: SprintCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          {track} • {difficulty} • {ticketCount} tickets
        </p>
        <Link href={`/lab/${id}`} className={cn(buttonVariants({ size: "sm" }))}>
          Open sprint lab
        </Link>
      </CardContent>
    </Card>
  );
}
