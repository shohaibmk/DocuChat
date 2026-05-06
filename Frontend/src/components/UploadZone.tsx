import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent, MouseEvent } from "react";
import axios from "axios";
import { uploadDocument } from "../lib/axios";
import { DEFAULT_ACCEPT, DEFAULT_HINT, DEFAULT_LABEL } from "../constants/upload";

type UploadStatus = "uploading" | "done" | "error" | "canceled";

type UploadEntry = {
  key: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  controller: AbortController;
};

type UploadZoneProps = {
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  onUploaded?: (file: File, data: unknown) => void;
  onError?: (file: File, error: unknown) => void;
};

const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const fileKey = (f: File): string => `${f.name}:${f.size}:${f.lastModified}`;

const statusLabel = (e: UploadEntry): string => {
  switch (e.status) {
    case "uploading":
      return `Uploading ${e.progress}%`;
    case "done":
      return "Uploaded";
    case "canceled":
      return "Canceled";
    case "error":
      return e.error ?? "Failed";
  }
};

export default function UploadZone({
  accept = DEFAULT_ACCEPT,
  multiple = true,
  label = DEFAULT_LABEL,
  hint = DEFAULT_HINT,
  onUploaded,
  onError,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [drag, setDrag] = useState(false);
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const entriesRef = useRef<UploadEntry[]>([]);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    return () => {
      for (const e of entriesRef.current) {
        if (e.status === "uploading") e.controller.abort();
      }
    };
  }, []);

  const updateEntry = useCallback((key: string, patch: Partial<UploadEntry>) => {
    setEntries((prev) => prev.map((e) => (e.key === key ? { ...e, ...patch } : e)));
  }, []);

  const startUpload = useCallback(
    async (entry: UploadEntry) => {
      try {
        const res = await uploadDocument(entry.file, {
          signal: entry.controller.signal,
          onProgress: ({ loaded, total }) => {
            const pct = total ? Math.round((loaded / total) * 100) : 0;
            updateEntry(entry.key, { progress: pct });
          },
        });
        updateEntry(entry.key, { status: "done", progress: 100 });
        onUploaded?.(entry.file, res.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          updateEntry(entry.key, { status: "canceled" });
          return;
        }
        const message = axios.isAxiosError(err)
          ? (err.response?.statusText ?? err.message)
          : "Upload failed";
        updateEntry(entry.key, { status: "error", error: message });
        onError?.(entry.file, err);
      }
    },
    [onError, onUploaded, updateEntry],
  );

  const addFiles = useCallback(
    (incoming: FileList | File[] | null) => {
      if (!incoming) return;
      const list = Array.from(incoming);
      if (list.length === 0) return;

      const fresh: UploadEntry[] = [];
      setEntries((prev) => {
        const seen = new Set(prev.map((e) => e.key));
        const base = multiple ? [...prev] : [];
        for (const f of list) {
          const key = fileKey(f);
          if (seen.has(key)) continue;
          const entry: UploadEntry = {
            key,
            file: f,
            status: "uploading",
            progress: 0,
            controller: new AbortController(),
          };
          base.push(entry);
          fresh.push(entry);
          seen.add(key);
          if (!multiple) break;
        }
        return base;
      });

      for (const entry of fresh) void startUpload(entry);
    },
    [multiple, startUpload],
  );

  const openPicker = () => inputRef.current?.click();

  const onPointerMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--ux", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--uy", `${e.clientY - rect.top}px`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current += 1;
    setDrag(true);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDrag(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepth.current = 0;
    setDrag(false);
    addFiles(e.dataTransfer?.files ?? null);
  };

  const removeEntry = (e: MouseEvent<HTMLButtonElement>, key: string) => {
    e.stopPropagation();
    setEntries((prev) => {
      const target = prev.find((x) => x.key === key);
      if (target && target.status === "uploading") target.controller.abort();
      return prev.filter((x) => x.key !== key);
    });
  };

  const zoneClasses = cn(
    "group relative mt-auto cursor-pointer overflow-hidden rounded-lg p-[18px] text-center",
    "border border-dashed bg-[var(--bg-elev)] border-[var(--line-bright)]",
    "transition-[border-color,background,box-shadow,transform] duration-[250ms]",
    "focus-visible:border-[var(--lime)] focus-visible:shadow-[0_0_0_2px_var(--lime-soft)] focus-visible:outline-none",
    "before:pointer-events-none before:absolute before:inset-0 before:opacity-0",
    "before:bg-[radial-gradient(120px_80px_at_var(--ux,50%)_var(--uy,50%),var(--lime-soft),transparent_70%)]",
    "before:transition-opacity before:duration-[250ms]",
    drag
      ? "-translate-y-px border-solid border-[var(--lime)] bg-[var(--lime-soft)] shadow-[0_0_0_2px_var(--lime-soft),0_0_28px_var(--lime-glow)]"
      : "hover:border-[var(--lime)] hover:bg-[var(--lime-soft)] hover:before:opacity-100",
  );

  const iconClasses = cn(
    "mx-auto mb-2.5 flex h-8 w-8 items-center justify-center rounded-full",
    "bg-[var(--lime)] text-[18px] font-medium text-[var(--bg)]",
    "shadow-[0_0_20px_var(--lime-glow)]",
    "transition-transform duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
    drag && "rotate-180 scale-105",
  );

  const statusColor = (s: UploadStatus): string => {
    if (s === "done") return "text-[var(--lime)]";
    if (s === "error") return "text-[#ff6b6b]";
    if (s === "canceled") return "text-[var(--text-mute)]";
    return "text-[var(--text-soft)]";
  };

  const barColor = (s: UploadStatus): string => {
    if (s === "error") return "bg-[#ff6b6b]";
    if (s === "canceled") return "bg-[var(--text-mute)]";
    return "bg-[var(--lime)]";
  };

  return (
    <div>
      <div
        className={zoneClasses}
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={openPicker}
        onKeyDown={onKeyDown}
        onMouseMove={onPointerMove}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className={iconClasses}>+</div>
        <div className="mb-1 text-[12px] font-medium text-[var(--text)]">
          {drag ? "Drop to ingest" : label}
        </div>
        <div className="font-['Geist_Mono',monospace] text-[9px] tracking-[0.1em] text-[var(--text-mute)] uppercase">
          {hint}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          className="sr-only"
        />
      </div>

      {entries.length > 0 && (
        <ul className="mt-2.5 flex list-none flex-col gap-1 p-0">
          {entries.map((e) => (
            <li
              key={e.key}
              className="rounded-md border border-[var(--line)] bg-[var(--bg-card)] px-2 py-1.5 font-['Geist_Mono',monospace] text-[10px] text-[var(--text-soft)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  title={e.file.name}
                >
                  {e.file.name}
                </span>
                <span className="flex-shrink-0 text-[var(--text-mute)]">
                  {formatSize(e.file.size)}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${e.file.name}`}
                  onClick={(ev) => removeEntry(ev, e.key)}
                  className="inline-flex h-4 w-4 flex-shrink-0 cursor-pointer items-center justify-center rounded border border-[var(--line-bright)] bg-transparent text-[12px] leading-none text-[var(--text-mute)] transition-colors hover:border-[var(--lime)] hover:bg-[var(--lime-soft)] hover:text-[var(--lime)]"
                >
                  ×
                </button>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--bg-input)]">
                  <div
                    className={cn(
                      "h-full transition-[width] duration-[200ms] ease-out",
                      barColor(e.status),
                    )}
                    style={{ width: `${e.status === "done" ? 100 : e.progress}%` }}
                  />
                </div>
                <span
                  className={cn("flex-shrink-0 tracking-[0.1em] uppercase", statusColor(e.status))}
                >
                  {statusLabel(e)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
