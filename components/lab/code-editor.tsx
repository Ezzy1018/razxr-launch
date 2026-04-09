"use client";

import { useMemo } from "react";
import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  value: string;
  language: "javascript" | "typescript" | "python";
  onChange: (value: string) => void;
};

export function CodeEditor({ value, language, onChange }: CodeEditorProps) {
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
        height="440px"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          smoothScrolling: true,
        }}
      />
    </div>
  );
}
