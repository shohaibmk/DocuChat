import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent, MouseEvent } from "react";
import axios from "axios";
import { requestUploadUrl } from "../lib/axios";
import type { PresignedUrlResponse } from "../lib/axios";
import {
  DEFAULT_ACCEPT,
  DEFAULT_HINT,
  DEFAULT_LABEL,
  EXTENSION_CONTENT_TYPE,
} from "../constants/upload";
import { chatService } from "../services/chatService";
import { useUIStore } from "../store/uiStore";
import type { UploadEntry } from "../types/upload";
import { Trash2, Loader } from "lucide-react";

type UploadZoneProps = {
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  onUploaded?: (file: File, data: PresignedUrlResponse) => void;
  onError?: (file: File, error: unknown) => void;
};

const resolveContentType = (file: File): string => {
  if (file.type) return file.type;
  const dot = file.name.lastIndexOf(".");
  if (dot < 0) return "";
  return EXTENSION_CONTENT_TYPE[file.name.slice(dot).toLowerCase()] ?? "";
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
  const entries = useUIStore((s) => s.uploadEntries);
  const addUploadEntries = useUIStore((s) => s.addUploadEntries);
  const patchUploadEntry = useUIStore((s) => s.patchUploadEntry);
  const removeUploadEntry = useUIStore((s) => s.removeUploadEntry);
  const clearUploadEntries = useUIStore((s) => s.clearUploadEntries);
  const entriesRef = useRef<UploadEntry[]>([]);
  const currentSessionId = useUIStore((s) => s.currentSessionId);
  const setCurrentSessionId = useUIStore((s) => s.setCurrentSessionId);
  const sessionRequestRef = useRef<Promise<string> | null>(null);

  const ensureSessionId = useCallback(async (): Promise<string> => {
    if (currentSessionId) return currentSessionId;
    if (sessionRequestRef.current) return sessionRequestRef.current;
    const req = chatService
      .getNewSession()
      .then((res) => {
        const id = res.data.data.session_id;
        setCurrentSessionId(id);
        return id;
      })
      .finally(() => {
        sessionRequestRef.current = null;
      });
    sessionRequestRef.current = req;
    return req;
  }, [currentSessionId, setCurrentSessionId]);

  useEffect(() => {
    entriesRef.current = entries;
    console.debug(entries);
  }, [entries]);

  useEffect(() => {
    return () => {
      for (const e of entriesRef.current) {
        if (e.status === "requesting" || e.status === "ready") e.controller.abort();
      }
    };
  }, []);

  const updateEntry = useCallback(
    (key: string, patch: Partial<UploadEntry>) => {
      patchUploadEntry(key, patch);
    },
    [patchUploadEntry],
  );

  const startUpload = useCallback(
    async (entry: UploadEntry, sessionId: string) => {
      try {
        const contentType = resolveContentType(entry.file);
        const res = await requestUploadUrl(
          {
            sessionId,
            filename: entry.file.name,
            contentType,
          },
          { signal: entry.controller.signal },
        );
        const { url, fields } = res.data.data;
        updateEntry(entry.key, {
          status: "ready",
          presignedUrl: url,
        });
        const form = new FormData();
        for (const [k, v] of Object.entries(fields)) form.append(k, v);
        form.append("file", entry.file);
        const uploadResponse = await axios.post(url, form, { signal: entry.controller.signal });
        console.debug(`${entry.key} was uploaded: `, uploadResponse);
        updateEntry(entry.key, { status: "uploaded" });
        onUploaded?.(entry.file, res.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          updateEntry(entry.key, { status: "canceled" });
          return;
        }
        const message = axios.isAxiosError(err)
          ? (err.response?.statusText ?? err.message)
          : "Failed to request upload URL";
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

      // Build entries outside the state updater so Strict Mode's double-invocation
      // doesn't create duplicate AbortControllers and duplicate upload requests.
      const seen = new Set(entriesRef.current.map((e) => e.key));
      const fresh: UploadEntry[] = [];
      for (const f of list) {
        const key = fileKey(f);
        if (seen.has(key)) continue;
        fresh.push({ key, file: f, status: "requesting", controller: new AbortController() });
        seen.add(key);
        if (!multiple) break;
      }

      if (fresh.length === 0) return;

      if (!multiple) clearUploadEntries();
      addUploadEntries(fresh);

      void ensureSessionId()
        .then((id) => {
          for (const entry of fresh) void startUpload(entry, id);
        })
        .catch((err) => {
          const message = axios.isAxiosError(err)
            ? (err.response?.statusText ?? err.message)
            : "Failed to create chat session";
          for (const entry of fresh) {
            updateEntry(entry.key, { status: "error", error: message });
            onError?.(entry.file, err);
          }
        });
    },
    [
      addUploadEntries,
      clearUploadEntries,
      ensureSessionId,
      multiple,
      onError,
      startUpload,
      updateEntry,
    ],
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
    const target = entriesRef.current.find((x) => x.key === key);
    if (target && (target.status === "requesting" || target.status === "ready"))
      target.controller.abort();
    removeUploadEntry(key);
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
          onClick={(e) => e.stopPropagation()}
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
                  disabled={e.status === "requesting" || e.status === "ready"}
                  className={cn(
                    "border-line-bright text-fg-mute inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded border bg-transparent text-[12px] leading-none transition-colors",
                    e.status !== "requesting" && e.status !== "ready"
                      ? "hover:bg-lime/10 hover:border-red-500 hover:text-red-500"
                      : "hover:cursor-auto",
                  )}
                >
                  {e.status === "requesting" || e.status === "ready" ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
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
