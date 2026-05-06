import type { ReactNode } from "react";

type ChatStub = {
  id: string;
  title: string;
  preview: string;
  stamp: string;
  tone: "lime" | "magenta" | "cyan" | "amber";
};

const RECENT: ChatStub[] = [
  {
    id: "01",
    title: "Q3 Compliance Audit",
    preview: "TODO — wire to chat history endpoint.",
    stamp: "14:22",
    tone: "lime",
  },
  {
    id: "02",
    title: "Vendor Master Agreement",
    preview: "TODO — surface last assistant message.",
    stamp: "11:08",
    tone: "magenta",
  },
  {
    id: "03",
    title: "Onboarding Handbook v4",
    preview: "TODO — pull from /chats?limit=20.",
    stamp: "Yesterday",
    tone: "cyan",
  },
  {
    id: "04",
    title: "Series B Diligence Pack",
    preview: "TODO — group by day.",
    stamp: "Mon",
    tone: "amber",
  },
];

const TONE_RING: Record<ChatStub["tone"], string> = {
  lime: "before:bg-lime",
  magenta: "before:bg-magenta",
  cyan: "before:bg-cyan",
  amber: "before:bg-amber",
};

const SHORTCUTS: Array<{ label: string; combo: string; node?: ReactNode }> = [
  { label: "New chat", combo: "⌘ N" },
  { label: "Search docs", combo: "⌘ K" },
  { label: "Toggle sources", combo: "⌘ ." },
  { label: "Account", combo: "⌘ ," },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-r border-line bg-bg-panel/80 backdrop-blur-xl">
      {/* Brand header — logo mark, workspace label, and the new-chat trigger. */}
      <header className="flex items-center justify-between border-b border-line px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-8 w-8 place-items-center rounded-md bg-lime text-[15px] font-semibold text-bg shadow-glow-lg">
            ◆
            <span className="absolute -inset-px rounded-md ring-1 ring-lime-bright/40" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-[18px] tracking-tight italic">
              DocuChat
            </div>
            <div className="font-mono text-[9px] tracking-[0.18em] text-fg-mute uppercase">
              workspace · alpha
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-label="New chat"
          className="grid h-8 w-8 place-items-center rounded-md border border-line-bright bg-bg-elev text-fg-soft transition-colors hover:border-lime hover:text-lime"
        >
          ＋
        </button>
      </header>

      {/* Search — filters the recent-chats list, ⌘K shortcut hint on the right. */}
      <div className="px-5 pt-4 pb-2">
        <label className="group relative block">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[12px] text-fg-mute">
            ⌕
          </span>
          <input
            type="search"
            placeholder="Filter conversations…"
            className="w-full rounded-md border border-line bg-bg-input py-2 pr-3 pl-8 font-mono text-[11px] text-fg placeholder:text-fg-dim focus:border-lime focus:shadow-[0_0_0_2px_rgba(198,244,50,0.12)] focus:outline-none"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border border-line-bright px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-fg-mute uppercase">
            ⌘ K
          </span>
        </label>
      </div>

      {/* Recent chats — scrollable list, tone-coded accent bar reveals on hover. */}
      <section className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="flex items-center justify-between px-2 pt-3 pb-2">
          <h2 className="font-mono text-[9px] tracking-mono text-fg-mute uppercase">
            Recent — TODO
          </h2>
          <span className="font-mono text-[9px] text-fg-dim">
            04 / 20
          </span>
        </div>

        <ul className="flex flex-col gap-1">
          {RECENT.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={`group relative flex w-full items-start gap-3 overflow-hidden rounded-md border border-transparent bg-transparent px-3 py-2.5 text-left transition-all duration-200 before:absolute before:top-3 before:bottom-3 before:left-0 before:w-[3px] before:rounded-r-full before:opacity-0 before:transition-opacity hover:border-line hover:bg-bg-card hover:before:opacity-100 ${TONE_RING[c.tone]}`}
              >
                <span className="mt-0.5 font-mono text-[9px] tracking-[0.1em] text-fg-dim">
                  {c.id}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-fg">
                    {c.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-fg-mute">
                    {c.preview}
                  </span>
                </span>
                <span className="font-mono text-[9px] tracking-[0.08em] text-fg-dim uppercase">
                  {c.stamp}
                </span>
              </button>
            </li>
          ))}
          <li className="mt-2 rounded-md border border-dashed border-line-bright px-3 py-3 text-center font-mono text-[10px] tracking-[0.14em] text-fg-mute uppercase">
            TODO — paginate older chats
          </li>
        </ul>
      </section>

      {/* Keyboard shortcuts — quick-access actions with their key combos. */}
      <section className="border-t border-line px-3 py-3">
        <h2 className="px-2 pb-2 font-mono text-[9px] tracking-mono text-fg-mute uppercase">
          Shortcuts
        </h2>
        <ul className="flex flex-col gap-0.5">
          {SHORTCUTS.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[12px] text-fg-soft transition-colors hover:bg-bg-card hover:text-fg"
              >
                <span>{s.label}</span>
                <span className="font-mono text-[9px] tracking-[0.12em] text-fg-dim uppercase">
                  {s.combo}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Account footer — avatar, plan/usage line, settings cog. */}
      <footer className="flex items-center justify-between gap-3 border-t border-line bg-bg-elev/50 px-5 py-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lime to-cyan text-[12px] font-semibold text-bg">
            SM
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[12px] font-medium text-fg">
              TODO — user.name
            </div>
            <div className="truncate font-mono text-[9px] tracking-[0.1em] text-fg-mute uppercase">
              free plan · 23/100 docs
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-label="Settings"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line-bright text-fg-soft transition-colors hover:border-lime hover:text-lime"
        >
          ⚙
        </button>
      </footer>
    </aside>
  );
}
