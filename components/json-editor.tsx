import Editor from "@monaco-editor/react";
import { useCallback } from "react";

interface JsonEditorProps {
  value: Record<string, string>;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export function JsonEditor({ value, onChange, height = "200px", readOnly = false }: JsonEditorProps) {
  const jsonValue = JSON.stringify(value, null, 2);

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      onChange(newValue || "");
    },
    [onChange]
  );

  return (
    <div className="rounded-lg overflow-hidden border border-border/50 bg-[#1e1e1e]">
      <Editor
        height={height}
        language="json"
        value={jsonValue}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "none",
          scrollbar: {
            vertical: "auto",
            horizontal: "hidden",
            verticalScrollbarSize: 8,
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          guides: {
            indentation: false,
          },
        }}
      />
    </div>
  );
}
