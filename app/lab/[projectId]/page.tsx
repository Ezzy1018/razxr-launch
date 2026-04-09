"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTree } from "@/components/lab/file-tree";
import { TicketBoard } from "@/components/lab/ticket-board";
import { CodeEditor } from "@/components/lab/code-editor";
import { AiFeedbackPanel } from "@/components/lab/ai-feedback-panel";
import type { ProjectSeed, ProjectSessionRecord } from "@/types";

type LabResponse = {
  project: ProjectSeed;
  session: ProjectSessionRecord;
};

function inferLanguage(path: string): "javascript" | "typescript" | "python" {
  if (path.endsWith(".py")) {
    return "python";
  }
  if (path.endsWith(".ts") || path.endsWith(".tsx")) {
    return "typescript";
  }
  return "javascript";
}

export default function LabProjectPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;
  const [data, setData] = useState<LabResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [activeTicketId, setActiveTicketId] = useState<string>("");
  const [note, setNote] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    async function loadProject() {
      setLoading(true);
      const response = await fetch(`/api/lab/${projectId}`, { cache: "no-store" });
      const payload = (await response.json()) as { ok: boolean; data?: LabResponse };
      if (payload.ok && payload.data) {
        setData(payload.data);
        const firstFile = Object.keys(payload.data.session.files)[0] ?? "";
        setSelectedFile(firstFile);
        setActiveTicketId(payload.data.project.tickets[0]?.id ?? "");
        setScore(payload.data.session.score);
        setFeedback(payload.data.session.aiFeedback);
      }
      setLoading(false);
    }

    loadProject();
  }, [projectId]);

  const currentCode = selectedFile && data ? data.session.files[selectedFile] ?? "" : "";

  const language = useMemo(() => inferLanguage(selectedFile), [selectedFile]);

  if (loading) {
    return <section className="page-wrap">Loading sprint lab...</section>;
  }

  if (!data) {
    return <section className="page-wrap">Project not found.</section>;
  }

  async function submitWork() {
    if (!selectedFile || !activeTicketId || !projectId) {
      return;
    }

    const response = await fetch("/api/lab/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectId,
        ticketId: activeTicketId,
        files: {
          [selectedFile]: currentCode,
        },
        notes: note,
      }),
    });

    const payload = (await response.json()) as {
      ok: boolean;
      data?: { score: number; feedback: string; session: ProjectSessionRecord };
    };

    if (payload.ok && payload.data) {
      setScore(payload.data.score);
      setFeedback(payload.data.feedback);
      setData((prev) =>
        prev
          ? {
              ...prev,
              session: payload.data!.session,
            }
          : prev,
      );
    }
  }

  return (
    <section className="page-wrap max-w-[1200px]">
      <header className="page-hero space-y-1">
        <p className="page-kicker">Sprint Lab</p>
        <h1 className="page-title text-3xl">{data.project.title}</h1>
        <p className="page-subtitle text-sm">{data.project.description}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr_320px]">
        <FileTree
          files={Object.keys(data.session.files)}
          selectedFile={selectedFile}
          onSelect={setSelectedFile}
        />

        <div className="space-y-3">
          <CodeEditor
            value={currentCode}
            language={language}
            onChange={(value) => {
              if (!selectedFile) {
                return;
              }
              setData((prev) => {
                if (!prev) {
                  return prev;
                }
                return {
                  ...prev,
                  session: {
                    ...prev.session,
                    files: {
                      ...prev.session.files,
                      [selectedFile]: value,
                    },
                  },
                };
              });
            }}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">PR notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                className="field-dark min-h-24"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Summarize what you changed and why..."
              />
              <Button onClick={submitWork}>Submit PR for review</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <TicketBoard
            tickets={data.project.tickets}
            activeTicketId={activeTicketId}
            onSelect={setActiveTicketId}
          />
          <AiFeedbackPanel score={score} feedback={feedback} />
        </div>
      </div>
    </section>
  );
}
