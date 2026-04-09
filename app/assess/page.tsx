"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/assess/question-card";
import { Timer } from "@/components/assess/timer";
import type { AssessmentQuestion } from "@/types";

export default function AssessPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; level: string; feedback: string } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      const response = await fetch("/api/assess", { cache: "no-store" });
      const payload = (await response.json()) as {
        ok: boolean;
        data?: { questions: AssessmentQuestion[] };
      };
      if (payload.ok && payload.data) {
        setQuestions(payload.data.questions);
      }
    }

    loadQuestions();
  }, []);

  const answerCount = useMemo(
    () => Object.values(answers).filter((value) => value.trim().length > 0).length,
    [answers],
  );

  async function submitAssessment() {
    if (submitting || questions.length === 0) {
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/assess", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        answers: questions.map((question) => ({
          questionId: question.id,
          code: answers[question.id] ?? "",
          explanation: explanations[question.id] ?? "",
        })),
      }),
    });

    const payload = (await response.json()) as {
      ok: boolean;
      data?: { score: number; level: string; feedback: string };
    };

    if (payload.ok && payload.data) {
      setResult(payload.data);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    }
    setSubmitting(false);
  }

  return (
    <section className="page-wrap max-w-5xl">
      <header className="page-hero flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="page-kicker">Assessment</p>
          <h1 className="page-title text-3xl">Onboarding Assessment</h1>
          <p className="page-subtitle text-sm">
            Complete 3 coding prompts. We use this to set your starting level.
          </p>
        </div>
        <Timer initialSeconds={1800} onElapsed={submitAssessment} />
      </header>

      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          answer={answers[question.id] ?? ""}
          explanation={explanations[question.id] ?? ""}
          onChange={(value) =>
            setAnswers((prev) => ({
              ...prev,
              [question.id]: value,
            }))
          }
          onExplanationChange={(value) =>
            setExplanations((prev) => ({
              ...prev,
              [question.id]: value,
            }))
          }
        />
      ))}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Answered {answerCount} / {questions.length}</p>
        <Button onClick={submitAssessment} disabled={submitting || questions.length === 0}>
          {submitting ? "Submitting..." : "Submit assessment"}
        </Button>
      </div>

      {result ? (
        <div className="section-block border-primary/40 bg-primary/10 text-sm">
          <p className="font-medium">
            Level: {result.level.toUpperCase()} • Score: {result.score}
          </p>
          <p className="mt-1 text-muted-foreground">{result.feedback}</p>
        </div>
      ) : null}
    </section>
  );
}
