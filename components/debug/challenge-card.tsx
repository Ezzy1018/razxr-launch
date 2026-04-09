import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DebugChallenge } from "@/types";

type ChallengeCardProps = {
  challenge: DebugChallenge;
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{challenge.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          {challenge.language} • {challenge.difficulty}
        </p>
        <p>{challenge.hint}</p>
        <Link
          href={`/debug/${challenge.id}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Open challenge
        </Link>
      </CardContent>
    </Card>
  );
}
