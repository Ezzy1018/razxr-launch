import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectCardProps = {
  projectId: string;
  score: number | null;
  submittedAt: string | null;
};

export function ProjectCard({ projectId, score, submittedAt }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{projectId}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        <p>Score: {score ?? "--"}</p>
        <p>Submitted: {submittedAt ? new Date(submittedAt).toLocaleString() : "Pending"}</p>
      </CardContent>
    </Card>
  );
}
