import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AiFeedbackPanelProps = {
  score: number | null;
  feedback: string | null;
};

export function AiFeedbackPanel({ score, feedback }: AiFeedbackPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI PR Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground">
          Score: <span className="font-medium text-foreground">{score ?? "--"}</span>
        </p>
        <p className="whitespace-pre-wrap text-muted-foreground">
          {feedback ?? "Submit your ticket implementation to receive feedback."}
        </p>
      </CardContent>
    </Card>
  );
}
