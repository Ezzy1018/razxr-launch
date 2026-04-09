import { Badge } from "@/components/ui/badge";

type LevelBadgeProps = {
  level: string | null;
};

export function LevelBadge({ level }: LevelBadgeProps) {
  const value = (level ?? "unassessed").toUpperCase();
  return <Badge variant="outline">{value}</Badge>;
}
