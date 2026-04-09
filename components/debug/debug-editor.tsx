"use client";

import { useMemo } from "react";
import Editor from "@monaco-editor/react";

type DebugEditorProps = {
  language: "javascript" | "typescript" | "python";
  value: string;
  onChange: (value: string) => void;
};

export function DebugEditor({ language, value, onChange }: DebugEditorProps) {
  const monacoLanguage = useMemo(() => {
    if (language === "python") {
      return "python";
    }
    if (language === "typescript") {
      return "typescript";
    }
    return "javascript";
  }, [language]);

  return (
    <div className="overflow-hidden rounded-lg border border-border/70">
      <Editor
        value={value}
        onChange={(next) => onChange(next ?? "")}
        language={monacoLanguage}
        theme="vs-dark"
        height="420px"
        options={{ minimap: { enabled: false }, fontSize: 13 }}
      />
    </div>
  );
}
