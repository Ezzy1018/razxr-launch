import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssessmentQuestion } from "@/types";

type QuestionCardProps = {
  question: AssessmentQuestion;
  answer: string;
  onChange: (value: string) => void;
  explanation: string;
  onExplanationChange: (value: string) => void;
};

export function QuestionCard({
  question,
  answer,
  onChange,
  explanation,
  onExplanationChange,
}: QuestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{question.prompt}</span>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {question.language} • {question.difficulty}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="overflow-auto rounded-md border border-border/70 bg-black/25 p-3 text-xs text-muted-foreground">
          {question.starterCode}
        </pre>
        <textarea
          className="field-dark min-h-40"
          value={answer}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write your solution here..."
        />
        <textarea
          className="field-dark min-h-24"
          value={explanation}
          onChange={(event) => onExplanationChange(event.target.value)}
          placeholder="Explain your approach briefly..."
        />
      </CardContent>
    </Card>
  );
}
