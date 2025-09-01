import React, { useCallback, useRef, useState } from "react";
import "./Dropzone.scss";

export type DropzoneProps = {
  accept?: string[]; // e.g. ['.yaml', '.yml', '.json']
  onText: (text: string) => void; // called with file contents
  icon?: React.ReactNode;
  label?: string;
  hint?: string;
};

export default function Dropzone({
  accept = [],
  onText,
  icon,
  label,
  hint,
}: DropzoneProps) {
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHover(false);
    const f = e.dataTransfer.files?.[0];
    if (f) readFile(f);
  }, []);

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onText(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  const onBrowse = () => inputRef.current?.click();

  return (
    <div
      className={`dropzone ${hover ? "hover" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={onDrop}
      onClick={onBrowse}
      role="button"
      tabIndex={0}
    >
      <div className="dz-center">
        {icon}
        <div className="dz-label">
          {label ?? "Drag & drop your configuration file here"}
        </div>
        {hint && <div className="dz-hint">{hint}</div>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) readFile(f);
        }}
        hidden
      />
    </div>
  );
}
