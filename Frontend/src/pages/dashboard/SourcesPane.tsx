type Source = {
  id: string;
  title: string;
  page: string;
  score: number;
  excerpt: string;
};

type SourcesPaneProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const SOURCES: Source[] = [
  {
    id: "S-01",
    title: "vendor-master-agreement.pdf",
    page: "p. 14",
    score: 0.94,
    excerpt: "TODO — wire excerpt from /chats/:id/citations.",
  },
  {
    id: "S-02",
    title: "compliance-handbook-v4.pdf",
    page: "p. 02",
    score: 0.81,
    excerpt: "Placeholder paragraph from cited chunk.",
  },
  {
    id: "S-03",
    title: "addendum-2026-q1.docx",
    page: "§ 3.2",
    score: 0.67,
    excerpt: "TODO — render highlighted span and click-to-open.",
  },
];

const scoreBar = (s: number) => `${Math.round(s * 100)}%`;

export default function SourcesPane({ collapsed, onToggle }: SourcesPaneProps) {
  // Collapsed rail — 48px strip with vertical "Sources" label and an expand chevron.
  if (collapsed) {
    return (
      <aside className="bg-bg-panel/80 border-line flex h-full w-12 shrink-0 flex-col items-center border-l py-4 backdrop-blur-xl transition-[width] duration-300 ease-out">
        {/* Top expand chevron. */}
        <button
          type="button"
          onClick={onToggle}
          aria-label="Expand sources"
          aria-expanded={false}
          className="border-line-bright text-fg-soft hover:border-lime hover:text-lime grid h-8 w-8 place-items-center rounded-md border transition-colors"
        >
          ‹
        </button>

        {/* Vertical divider — purely decorative gradient rule. */}
        <div className="from-line via-line-bright to-line my-5 h-12 w-px bg-linear-to-b" />

        {/* Vertical label cluster — citation count badge + rotated "Sources" text; the whole block also expands the pane. */}
        <button
          type="button"
          onClick={onToggle}
          className="group relative flex flex-1 flex-col items-center gap-3"
          aria-label="Open sources"
        >
          <span className="bg-lime text-bg shadow-glow grid h-7 w-7 place-items-center rounded-full font-mono text-[10px] font-semibold">
            3
          </span>
          <span
            className="text-fg-mute group-hover:text-lime font-serif text-[16px] tracking-wide italic transition-colors"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Sources
          </span>
          <span
            className="text-fg-dim font-mono text-[8px] tracking-[0.3em] uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            03 cited · TODO
          </span>
        </button>

        {/* Bottom add-source shortcut. */}
        <button
          type="button"
          aria-label="Add source"
          className="border-line-bright text-fg-soft hover:border-lime hover:text-lime grid h-8 w-8 place-items-center rounded-md border transition-colors"
        >
          ＋
        </button>
      </aside>
    );
  }

  // Expanded pane — full citation inspector.
  return (
    <aside className="border-line bg-bg-panel/80 flex h-full w-[360px] shrink-0 flex-col border-l backdrop-blur-xl transition-[width] duration-300 ease-out">
      {/* Header — "Sources" title, cited count, collapse chevron. */}
      <header className="border-line flex items-center justify-between border-b px-5 pt-5 pb-4">
        <div className="leading-tight">
          <div className="text-fg-mute font-mono text-[9px] tracking-mono uppercase">
            Citations · TODO
          </div>
          <h2 className="font-serif text-[20px] tracking-tight italic">
            Sources
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="border-line-bright bg-bg-elev text-fg-soft inline-flex h-6 items-center rounded-full border px-2 font-mono text-[9px] tracking-[0.16em] uppercase">
            03 cited
          </span>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sources"
            aria-expanded={true}
            className="border-line-bright text-fg-soft hover:border-lime hover:text-lime grid h-6 w-6 place-items-center rounded-md border transition-colors"
          >
            ›
          </button>
        </div>
      </header>

      {/* Retrieval metrics — indexed chunks, token budget, last latency. */}
      <section className="border-line border-b px-5 py-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: "Indexed", v: "1,284" },
            { k: "Tokens", v: "412k" },
            { k: "Latency", v: "1.2s" },
          ].map((m) => (
            <div key={m.k} className="border-line bg-bg-elev rounded-md border px-2.5 py-2">
              <div className="text-fg-mute font-mono text-[8px] tracking-[0.2em] uppercase">
                {m.k}
              </div>
              <div className="text-fg mt-0.5 font-mono text-[14px]">{m.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Citation list — one card per retrieved chunk: id/page, score bar, blockquote, open-in-viewer link. */}
      <section className="flex-1 overflow-y-auto px-3 py-3">
        <div className="flex items-center justify-between px-2 pb-2">
          <h3 className="text-fg-mute font-mono text-[9px] tracking-mono uppercase">
            Cited in answer
          </h3>
          <button className="text-fg-soft hover:text-lime font-mono text-[9px] tracking-[0.16em] uppercase transition-colors">
            Sort ↓
          </button>
        </div>

        <ul className="flex flex-col gap-2">
          {SOURCES.map((s) => (
            <li
              key={s.id}
              className="group border-line bg-bg-card hover:border-lime relative overflow-hidden rounded-lg border p-3 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-fg-mute font-mono text-[9px] tracking-[0.14em] uppercase">
                      {s.id}
                    </span>
                    <span className="text-fg-dim font-mono text-[9px]">·</span>
                    <span className="text-fg-mute font-mono text-[9px] tracking-widest uppercase">
                      {s.page}
                    </span>
                  </div>
                  <div className="text-fg mt-1 truncate text-[12.5px] font-medium">{s.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-fg-mute font-mono text-[9px] tracking-[0.14em] uppercase">
                    Score
                  </div>
                  <div className="text-lime font-mono text-[12px]">
                    {scoreBar(s.score)}
                  </div>
                </div>
              </div>

              <div className="bg-bg-input mt-2 h-[2px] w-full overflow-hidden rounded-full">
                <div
                  className="bg-lime h-full shadow-glow-sm"
                  style={{ width: scoreBar(s.score) }}
                />
              </div>

              <p className="border-line-bright text-fg-soft mt-3 border-l-2 pl-3 text-[11.5px] leading-relaxed italic">
                “{s.excerpt}”
              </p>

              <div className="mt-3 flex items-center justify-between">
                <button className="text-fg-mute group-hover:text-lime font-mono text-[9px] tracking-[0.16em] uppercase transition-colors">
                  Open in viewer →
                </button>
                <span className="text-fg-dim font-mono text-[9px] tracking-[0.12em] uppercase">
                  TODO link
                </span>
              </div>
            </li>
          ))}
          <li className="border-line-bright text-fg-mute rounded-lg border border-dashed px-3 py-4 text-center font-mono text-[10px] tracking-[0.14em] uppercase">
            TODO — render remaining retrieved chunks
          </li>
        </ul>
      </section>

      {/* Footer — pin a new document into this thread's source set. */}
      <footer className="border-line border-t px-5 py-4">
        <button
          type="button"
          className="border-line-bright bg-bg-elev text-fg-soft hover:border-lime hover:text-lime flex w-full items-center justify-center gap-2 rounded-md border py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors"
        >
          ＋ Add source · TODO
        </button>
      </footer>
    </aside>
  );
}
