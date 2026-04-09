import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatBadgeProps = {
  label: string;
  value: string | number;
};

export function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
