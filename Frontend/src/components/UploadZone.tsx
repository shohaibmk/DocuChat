import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent, MouseEvent } from "react";
import axios from "axios";
import { uploadDocument } from "../lib/axios";
import { DEFAULT_ACCEPT, DEFAULT_HINT, DEFAULT_LABEL } from "../constants/upload";
import { Trash2 } from "lucide-react";

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

  // Drop zone — dashed lime-on-dark surface; hover trails a soft lime radial under the cursor.
  const zoneClasses = cn(
    "group relative cursor-pointer overflow-hidden rounded-xl p-5 text-center",
    "border border-dashed bg-bg-elev border-line-bright",
    "transition-[border-color,background,box-shadow,transform] duration-[250ms]",
    "focus-visible:border-lime focus-visible:shadow-[0_0_0_2px_rgba(198,244,50,0.18)] focus-visible:outline-none",
    "before:pointer-events-none before:absolute before:inset-0 before:opacity-0",
    "before:bg-[radial-gradient(circle_120px_at_var(--ux,50%)_var(--uy,50%),rgba(198,244,50,0.22),transparent_70%)]",
    "before:transition-opacity before:duration-[250ms]",
    drag
      ? "-translate-y-px border-solid border-lime bg-lime/10 shadow-[0_0_0_2px_rgba(198,244,50,0.2),0_0_32px_var(--lime-glow)]"
      : "hover:border-lime hover:bg-lime/[0.04] hover:before:opacity-100",
  );

  // Plus glyph — flips on drag-active for a tactile cue.
  const iconClasses = cn(
    "mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full",
    "bg-lime text-[18px] font-semibold text-bg",
    "shadow-glow-lg",
    "transition-transform duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]",
    drag && "rotate-180 scale-105",
  );

  return (
    <div className="w-full">
      {/* Drop zone — click/keyboard/drag entry point; opens the native file picker. */}
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
        <div className="text-fg mb-1 font-serif text-[18px] tracking-tight italic">
          {drag ? "Drop to ingest" : label}
        </div>
        <div className="text-fg-mute font-mono text-[9px] tracking-[0.18em] uppercase">{hint}</div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          className="sr-only"
        />
      </div>

      {/* Upload list — one row per file: name, size, cancel/remove, progress bar, status. */}
      {entries.length > 0 && (
        <ul className="mt-3 flex list-none flex-col gap-1.5 p-0">
          {entries.map((e) => (
            <li
              key={e.key}
              className="border-line bg-bg-card text-fg-soft rounded-md border px-2.5 py-2 font-mono text-[12px]"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4">
                <span className="truncate" title={e.file.name}>
                  {e.file.name}
                </span>
                <span className="text-fg-mute">{formatSize(e.file.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${e.file.name}`}
                  onClick={(ev) => removeEntry(ev, e.key)}
                  className="border-line-bright text-fg-mute hover:bg-lime/10 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded border bg-transparent text-[12px] leading-none transition-colors hover:border-red-500 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {/* <div className="mt-1.5 flex items-center gap-2">
                <div className="bg-bg-input h-[3px] flex-1 overflow-hidden rounded-full">
                  <div
                    className={cn(
                      "h-full transition-[width] duration-200 ease-out",
                      barColor(e.status),
                    )}
                    style={{ width: `${e.status === "done" ? 100 : e.progress}%` }}
                  />
                </div>
                <span className={cn("shrink-0 tracking-[0.16em] uppercase", statusColor(e.status))}>
                  {statusLabel(e)}
                </span>
              </div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
