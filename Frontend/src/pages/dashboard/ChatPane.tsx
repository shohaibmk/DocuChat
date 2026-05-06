type Bubble = {
  id: string;
  role: "user" | "assistant";
  body: string;
  meta?: string;
};

const TRANSCRIPT: Bubble[] = [
  {
    id: "m1",
    role: "user",
    body: "TODO — wire transcript from /chats/:id/messages.",
  },
  {
    id: "m2",
    role: "assistant",
    body: "Placeholder reply. Streaming, citations, and source highlighting are still TODO.",
    meta: "answered with 3 sources · 1.2s",
  },
];

export default function ChatPane() {
  return (
    <main className="bg-bg relative flex h-full min-w-0 flex-1 flex-col">
      {/* Ambient gradient backdrop — non-interactive, sits behind every section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(700px circle at 30% -10%, rgba(198,244,50,0.06), transparent 60%), radial-gradient(600px circle at 90% 110%, rgba(255,46,136,0.05), transparent 60%)",
        }}
      />

      {/* Thread header — title, indexed status pill, and per-thread actions (share/export/more). */}
      <header className="border-line bg-bg-panel/60 relative z-10 flex items-center justify-between border-b px-8 py-5 backdrop-blur-md">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="tracking-mono text-fg-mute font-mono text-[10px] uppercase">
            Thread / 02
          </span>
          <h1 className="text-fg truncate font-serif text-[28px] leading-none tracking-tight italic">
            Vendor Master Agreement
          </h1>
          <span
            className="border-line-bright bg-bg-elev text-fg-soft inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] uppercase"
            title="TODO — live status from socket"
          >
            <span className="bg-lime shadow-glow-sm h-1.5 w-1.5 rounded-full" />
            indexed
          </span>
        </div>
        <div className="flex items-center gap-2">
          {["Share", "Export", "···"].map((b) => (
            <button
              key={b}
              type="button"
              className="border-line-bright bg-bg-elev text-fg-soft hover:border-lime hover:text-lime rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors"
            >
              {b}
            </button>
          ))}
        </div>
      </header>

      {/* Transcript — scrollable message column, user bubbles right-aligned, assistant left. */}
      <section className="relative z-10 flex-1 overflow-y-auto px-8 py-10">
        <div className="mx-auto flex max-w-[760px] flex-col gap-8">
          {/* Day separator. */}
          <div className="flex items-center gap-4">
            <div className="bg-line h-px flex-1" />
            <span className="tracking-mono text-fg-mute font-mono text-[9px] uppercase">
              Today · TODO transcript
            </span>
            <div className="bg-line h-px flex-1" />
          </div>

          {TRANSCRIPT.map((m) => (
            <article
              key={m.id}
              className={
                m.role === "user"
                  ? "border-line-bright bg-bg-card ml-auto max-w-[78%] rounded-2xl rounded-br-sm border px-5 py-3.5"
                  : "mr-auto max-w-[88%]"
              }
            >
              {m.role === "assistant" && (
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-lime text-bg grid h-6 w-6 place-items-center rounded-md text-[10px] font-semibold">
                    DC
                  </span>
                  <span className="text-fg-mute font-mono text-[9px] tracking-[0.18em] uppercase">
                    DocuChat · assistant
                  </span>
                </div>
              )}
              <p className="text-fg text-[14px] leading-relaxed">{m.body}</p>
              {m.meta && (
                <div className="text-fg-mute mt-2 font-mono text-[9px] tracking-[0.14em] uppercase">
                  {m.meta}
                </div>
              )}
            </article>
          ))}

          {/* Typing indicator — pulsing dots; replace with the live token stream. */}
          <div className="border-line-bright text-fg-mute mr-auto flex max-w-[88%] items-center gap-2 rounded-md border border-dashed px-4 py-3 font-mono text-[10px] tracking-[0.14em] uppercase">
            <span className="inline-flex gap-1">
              <span className="bg-lime h-1.5 w-1.5 animate-pulse rounded-full" />
              <span
                className="bg-lime h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="bg-lime h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ animationDelay: "240ms" }}
              />
            </span>
            TODO — streaming tokens go here
          </div>
        </div>
      </section>

      {/* Composer — sticky bottom: textarea, action chips, send button, token meter. */}
      <footer className="border-line bg-bg-panel/70 relative z-10 border-t px-8 py-5 backdrop-blur-md">
        <div className="mx-auto flex max-w-[760px] flex-col gap-2.5">
          {/* Input shell — focus ring uses lime; chips trigger attach/source/command. */}
          <div className="group border-line-bright bg-bg-input focus-within:border-lime relative rounded-xl border px-4 py-3 transition-colors focus-within:shadow-[0_0_0_2px_rgba(198,244,50,0.12)]">
            <textarea
              rows={2}
              placeholder="Ask anything about your sources… (TODO — submit handler)"
              className="text-fg placeholder:text-fg-dim block w-full resize-none bg-transparent text-[14px] leading-relaxed focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {["＋ attach", "@ source", "/ command"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="text-fg-mute hover:bg-bg-card hover:text-fg-soft rounded-md px-2 py-1 font-mono text-[9px] tracking-[0.14em] uppercase transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="bg-lime text-bg shadow-glow hover:bg-lime-bright inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-[12px] font-semibold transition-transform hover:-translate-y-px"
              >
                Send
                <span className="font-mono text-[9px] tracking-[0.14em] opacity-70">⏎</span>
              </button>
            </div>
          </div>
          {/* Meta line — model + token usage; updates live once wired. */}
          <div className="text-fg-dim flex items-center justify-between font-mono text-[9px] tracking-[0.16em] uppercase">
            <span>Model · gpt-rag-large · TODO</span>
            <span>0 / 4000 tokens</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
