type FileTreeProps = {
  files: string[];
  selectedFile: string;
  onSelect: (path: string) => void;
};

export function FileTree({ files, selectedFile, onSelect }: FileTreeProps) {
  return (
    <aside className="space-y-2 rounded-lg border border-border/70 bg-card p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">File tree</p>
      <div className="space-y-1">
        {files.map((file) => (
          <button
            key={file}
            type="button"
            onClick={() => onSelect(file)}
            className={`w-full rounded-md px-2 py-1 text-left text-xs transition ${
              selectedFile === file
                ? "bg-primary/20 text-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {file}
          </button>
        ))}
      </div>
    </aside>
  );
}
