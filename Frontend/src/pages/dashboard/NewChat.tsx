import { useEffect } from "react";
import UploadZone from "../../components/UploadZone";
import { useUIStore } from "../../store/uiStore";

type NewChatProps = {
  onStart?: (prompt: string) => void;
};

export default function NewChat({ onStart }: NewChatProps) {
  const setCurrentSessionId = useUIStore((s) => s.setCurrentSessionId);
  const uploadEntries = useUIStore((s) => s.uploadEntries);
  const clearUploadEntries = useUIStore((s) => s.clearUploadEntries);

  const allUploaded =
    uploadEntries.length > 0 && uploadEntries.every((e) => e.status === "uploaded");

  useEffect(() => {
    setCurrentSessionId(null);
    clearUploadEntries();
  }, []);

  return (
    <main className="bg-bg relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
      {/* Ambient gradient mesh — lime/magenta/cyan radials wash the empty state. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(900px circle at 18% 12%, rgba(198,244,50,0.10), transparent 55%), radial-gradient(700px circle at 82% 88%, rgba(255,46,136,0.08), transparent 55%), radial-gradient(500px circle at 60% 40%, rgba(0,229,255,0.04), transparent 60%)",
        }}
      />
      {/* Decorative dashed rule — left edge accent. */}
      <div
        aria-hidden
        className="border-line-bright pointer-events-none absolute top-1/2 -left-px h-[60%] w-px -translate-y-1/2 border-l border-dashed opacity-40"
      />
      {/* Ornament — slow-spinning concentric rings with a glowing lime core (lg+ only). */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 right-10 hidden h-32 w-32 lg:block"
      >
        <div className="border-line-bright animate-spin-slow h-full w-full rounded-full border opacity-40" />
        <div className="border-lime/30 absolute inset-3 rounded-full border opacity-50" />
        <div className="bg-lime shadow-glow absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      {/* Header — thread breadcrumb, awaiting-prompt status, source-scope picker, discard button. */}
      <header className="border-line bg-bg-panel/60 relative z-10 flex items-center justify-between border-b px-8 py-5 backdrop-blur-md">
        <div className="flex items-baseline gap-3">
          <span className="text-fg-mute tracking-mono font-mono text-[10px] uppercase">
            Thread / new
          </span>
          <span className="bg-lime animate-pulse-soft shadow-glow-sm inline-block h-1.5 w-1.5 rounded-full" />
          <span className="text-fg-soft font-mono text-[10px] tracking-[0.18em] uppercase">
            Awaiting first prompt
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="border-line-bright bg-bg-elev text-fg-soft inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase">
            <span className="bg-cyan h-1.5 w-1.5 rounded-full" />
            All sources · TODO
          </span>
          <button
            type="button"
            className="border-line-bright bg-bg-elev text-fg-soft hover:border-lime hover:text-lime rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors"
          >
            Discard
          </button>
        </div>
      </header>

      {/* Hero body — scrollable column with staggered slide-up reveals (delay cascades by ~50–80ms). */}
      <section className="relative z-10 flex flex-1 items-start overflow-y-auto px-8 py-12">
        <div className="mx-auto w-full max-w-[820px]">
          {/* Eyebrow — date stamp + "New conversation" label. */}
          <div className="text-fg-mute animate-slide-up tracking-mono mb-5 flex items-center gap-3 font-mono text-[10px] uppercase [animation-delay:50ms]">
            <span className="bg-line-bright h-px w-8" />
            New conversation
            <span className="text-fg-dim">·</span>
            <span className="text-fg-dim">2026-05-06</span>
          </div>

          {/* Headline — Instrument Serif italic; verb "read" gets a skewed lime under-stroke. */}
          <h1 className="text-fg animate-slide-up font-serif text-[64px] leading-[1.02] tracking-[-0.02em] italic [animation-delay:100ms] sm:text-[78px] lg:text-[96px]">
            What shall we
            <br />
            <span className="relative inline-block">
              read
              <span className="bg-lime/70 shadow-glow absolute -bottom-1 left-0 h-[6px] w-full -skew-x-6 rounded-sm" />
            </span>{" "}
            <span className="text-fg-soft">today?</span>
          </h1>

          {/* Subtitle — explains the RAG flow in one sentence. */}
          <p className="text-fg-soft animate-slide-up mt-4 max-w-[560px] text-[15px] leading-relaxed [animation-delay:200ms]">
            Drop a question, paste a clause, or pick from below. DocuChat will retrieve the relevant
            passages from your library and cite every line.
          </p>

          {/* Upload zone — drag/drop or click to ingest; new docs feed the same RAG store. */}
          <div className="animate-slide-up mt-8 [animation-delay:250ms]">
            {/* Eyebrow — matches dashboard section labels (Geist Mono, uppercase, wide tracking). */}
            <div className="text-fg-mute tracking-mono mb-2 flex items-center gap-2 font-mono text-[9px] uppercase">
              <span className="bg-lime shadow-glow-sm h-1.5 w-1.5 rounded-full" />
              Ingest
              <span className="bg-line-bright ml-2 h-px flex-1" />
              <span className="text-fg-dim">drag · drop · pick</span>
            </div>
            <UploadZone />
          </div>

          {/* Composer form — submits via onStart; Enter sends, Shift+Enter inserts newline.
              Composer stays disabled until at least one document has finished uploading. */}
          <form
            className="animate-slide-up mt-10 [animation-delay:300ms]"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const prompt = String(data.get("prompt") ?? "").trim();
              if (prompt) onStart?.(prompt);
            }}
          >
            <fieldset
              disabled={!allUploaded}
              className="contents disabled:[&_*]:cursor-not-allowed"
            >
              <div className="text-fg-mute tracking-mono mb-2 flex items-center gap-2 font-mono text-[9px] uppercase">
                <span className="bg-lime shadow-glow-sm h-1.5 w-1.5 rounded-full" />
                Compose
                <span className="bg-line-bright ml-2 h-px flex-1" />
                <span className="text-fg-dim">⏎ to send · ⇧⏎ newline</span>
              </div>
              <div className="border-line-bright bg-bg-input focus-within:border-lime group relative rounded-2xl border px-5 py-4 transition-all focus-within:shadow-[0_0_0_2px_rgba(198,244,50,0.14)] has-disabled:opacity-60">
                <textarea
                  name="prompt"
                  rows={3}
                  autoFocus
                  placeholder="Ask anything across your library…"
                  className="text-fg placeholder:text-fg-dim block w-full resize-none bg-transparent text-[18px] leading-relaxed focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[
                      { icon: "📎", label: "Attach" },
                      { icon: "@", label: "Source" },
                      { icon: "/", label: "Command" },
                      { icon: "✦", label: "Tone" },
                    ].map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        className="text-fg-mute hover:bg-bg-card hover:text-fg-soft inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors"
                      >
                        <span className="text-fg-soft text-[12px]">{c.icon}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={!allUploaded}
                    className="bg-lime text-bg hover:bg-lime-bright disabled:bg-bg-card disabled:text-fg-mute shadow-glow-lg inline-flex items-center gap-2 rounded-md px-4 py-2 text-[13px] font-semibold transition-transform hover:-translate-y-px disabled:shadow-none disabled:hover:translate-y-0"
                  >
                    Begin
                    <span className="font-mono text-[10px] tracking-[0.16em] opacity-70">⏎</span>
                  </button>
                </div>
              </div>
            </fieldset>
          </form>

          {/* Suggestion grid — 2×2 of tone-coded prompt templates; click to seed onStart. */}
          {/* <div className="mt-12">
            <div
              className="text-fg-mute mb-4 flex items-center gap-3 font-mono text-[10px] tracking-mono uppercase opacity-0"
              style={{ animation: "slide-up 0.5s ease-out 0.42s forwards" }}
            >
              <span>Or start with</span>
              <span className="bg-line-bright h-px flex-1" />
              <span className="text-fg-dim">04 templates · TODO</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onStart?.(s.prompt)}
                  className="group border-line bg-bg-card/70 hover:border-line-bright hover:bg-bg-card relative overflow-hidden rounded-xl border p-4 text-left opacity-0 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                  style={{
                    animation: `slide-up 0.5s ease-out ${0.5 + i * 0.06}s forwards`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${ACCENT_DOT[s.accent]} shadow-[0_0_8px_currentColor] ${ACCENT_TEXT[s.accent]}`}
                      />
                      <span
                        className={`font-mono text-[9px] tracking-mono uppercase ${ACCENT_TEXT[s.accent]}`}
                      >
                        {s.tag}
                      </span>
                    </div>
                    <span className="text-fg-dim font-mono text-[9px] tracking-[0.14em]">
                      {s.id}
                    </span>
                  </div>

                  <p className="text-fg mt-3 font-serif text-[20px] leading-snug tracking-tight italic">
                    “{s.prompt}”
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-fg-mute font-mono text-[9px] tracking-[0.16em] uppercase">
                      {s.hint}
                    </span>
                    <span className="text-fg-mute group-hover:text-lime font-mono text-[10px] tracking-[0.18em] uppercase transition-colors">
                      Use →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div> */}

          {/* Telemetry strip — index/token/sync stats and active model badge. */}
          {/* <div
            className="text-fg-dim mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] tracking-mono uppercase opacity-0"
            style={{ animation: "slide-up 0.5s ease-out 0.78s forwards" }}
          >
            <span className="flex items-center gap-2">
              <span className="bg-lime h-1.5 w-1.5 rounded-full" />
              23 docs indexed
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-cyan h-1.5 w-1.5 rounded-full" />
              412k tokens · TODO
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-magenta h-1.5 w-1.5 rounded-full" />
              Last sync · 2m ago
            </span>
            <span className="ml-auto">model · gpt-rag-large</span>
          </div> */}
        </div>
      </section>
    </main>
  );
}
