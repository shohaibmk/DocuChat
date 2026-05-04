import { useEffect, useRef } from "react";

import "./Home.css";

const SHELL = "relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8";

function Home() {
  const featRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = featRef.current;
    if (!root) return;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".feat-card") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      target.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    root.addEventListener("mousemove", handler);
    return () => root.removeEventListener("mousemove", handler);
  }, []);

  return (
    <>
      <nav className="border-line bg-bg/55 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className={`${SHELL} flex items-center gap-7 py-4`}>
          <div className="flex items-center gap-3">
            <div
              className="bg-lime text-bg flex size-8 cursor-pointer items-center justify-center rounded-[7px] font-serif text-xl italic shadow-[0_0_28px_var(--lime-glow)]"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              dc
            </div>
            <div
              className="cursor-pointer font-serif text-2xl tracking-[-0.01em] italic"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              DocuChat
            </div>
            <span className="border-line-bright text-fg-mute ml-1 rounded-full border px-2 py-[3px] font-mono text-[9px] tracking-[0.18em] uppercase">
              v0.1 · beta
            </span>
          </div>
          <div className="ml-auto hidden items-center gap-7 sm:flex">
            <a
              className="text-fg-mute hover:text-lime font-mono text-[11px] tracking-[0.12em] uppercase transition-colors"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-fg-mute hover:text-lime font-mono text-[11px] tracking-[0.12em] uppercase transition-colors"
              href="#how"
            >
              How it works
            </a>
            <a
              className="text-fg-mute hover:text-lime font-mono text-[11px] tracking-[0.12em] uppercase transition-colors"
              href="#cases"
            >
              Use cases
            </a>
            <a
              className="text-fg-mute hover:text-lime font-mono text-[11px] tracking-[0.12em] uppercase transition-colors"
              href="#cta"
            >
              Sign in
            </a>
            <button className="bg-lime text-bg hover:bg-lime-bright inline-flex cursor-pointer items-center gap-2 rounded-lg px-[18px] py-[10px] font-sans text-[13px] font-semibold transition-all hover:-translate-y-px hover:shadow-[0_0_28px_var(--lime-glow)]">
              Launch app <span className="font-mono">→</span>
            </button>
          </div>
        </div>
      </nav>

      <main className={SHELL}>
        {/* HERO */}
        <section className="relative grid grid-cols-1 items-center gap-12 pt-16 pb-20 min-[1080px]:grid-cols-[1.05fr_0.95fr] min-[1080px]:gap-16 min-[1080px]:pt-24">
          <div>
            <div className="border-line-bright bg-bg-elev text-fg-soft mb-7 inline-flex items-center gap-2.5 rounded-full border py-1.5 pr-3 pl-2 font-mono text-[10px] tracking-[0.18em] uppercase">
              <span className="animate-pulse-soft bg-lime block size-[7px] rounded-full shadow-[0_0_12px_var(--color-lime)]" />
              <span>Retrieval-augmented · semantic search · live</span>
            </div>

            <h1 className="mb-7 font-serif text-[clamp(54px,7.2vw,96px)] leading-[0.96] font-normal tracking-[-0.025em]">
              <span className="h1-strike">Read</span>{" "}
              <span className="text-lime italic [text-shadow:0_0_38px_rgba(198,244,50,0.35)]">
                ask
              </span>
              <br />
              any document.
            </h1>

            <p className="text-fg-soft mb-9 max-w-[520px] text-lg leading-relaxed">
              DocuChat indexes your files into a vector store and lets you{" "}
              <em className="text-fg font-medium not-italic">converse</em> with them.
              Source-grounded answers, citations on every line, no hallucinated nonsense — built on
              RAG.
            </p>

            <div className="mb-11 flex items-center gap-3.5">
              <button className="bg-lime text-bg hover:bg-lime-bright inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] px-[22px] py-[14px] font-sans text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-[0_0_32px_var(--lime-glow)]">
                Upload a document <span className="font-mono text-base">→</span>
              </button>
              <button className="border-line-bright text-fg hover:border-lime hover:bg-lime/10 hover:text-lime inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] border bg-transparent px-5 py-[14px] font-mono text-xs tracking-[0.08em] transition-all">
                <span className="border-line bg-bg-elev text-fg-soft rounded border px-1.5 font-mono text-[10px]">
                  ⌘
                </span>
                <span className="border-line bg-bg-elev text-fg-soft rounded border px-1.5 font-mono text-[10px]">
                  K
                </span>
                <span>see a demo</span>
              </button>
            </div>

            <div className="border-line grid grid-cols-[repeat(3,max-content)] gap-5 border-t pt-7 sm:gap-9">
              <div className="font-mono">
                <div className="text-lime text-[22px] font-semibold">3.2s</div>
                <div className="text-fg-mute mt-1 text-[9px] tracking-[0.15em] uppercase">
                  avg query latency
                </div>
              </div>
              <div className="font-mono">
                <div className="text-fg text-[22px] font-semibold">1536</div>
                <div className="text-fg-mute mt-1 text-[9px] tracking-[0.15em] uppercase">
                  embedding dim
                </div>
              </div>
              <div className="font-mono">
                <div className="text-magenta text-[22px] font-semibold">100%</div>
                <div className="text-fg-mute mt-1 text-[9px] tracking-[0.15em] uppercase">
                  cited answers
                </div>
              </div>
            </div>
          </div>

          {/* MOCK */}
          <div className="group relative [perspective:1600px]">
            <span className="border-lime/35 bg-bg-panel text-lime absolute -top-3.5 -left-4 hidden rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase shadow-[0_6px_24px_rgba(0,0,0,0.4)] sm:inline-block">
              vector-search · enabled
            </span>
            <span className="border-magenta/35 bg-bg-panel text-magenta absolute bottom-6 -left-7 hidden rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase shadow-[0_6px_24px_rgba(0,0,0,0.4)] sm:inline-block">
              cited · 3 sources
            </span>
            <span className="border-cyan/35 bg-bg-panel text-cyan absolute top-[38%] -right-5 hidden rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] uppercase shadow-[0_6px_24px_rgba(0,0,0,0.4)] sm:inline-block">
              claude · sonnet
            </span>

            <div className="border-line-bright bg-bg-panel [transform:rotateY(-6deg)_rotateX(2deg)] overflow-hidden rounded-[14px] border shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(198,244,50,0.06)] transition-transform duration-[600ms] ease-out group-hover:[transform:rotateY(-2deg)_rotateX(0deg)]">
              <div className="border-line bg-bg-elev flex items-center gap-2 border-b px-4 py-3">
                <span className="bg-magenta size-[9px] rounded-full" />
                <span className="bg-amber size-[9px] rounded-full" />
                <span className="bg-lime size-[9px] rounded-full" />
                <div className="text-fg-soft ml-3.5 flex items-center gap-2 font-mono text-[11px]">
                  <span className="border-lime/30 bg-lime/10 text-lime rounded-[3px] border px-1.5 py-px text-[9px] tracking-[0.08em]">
                    PDF
                  </span>
                  <span>contract_v3.pdf · 84 pages · indexed</span>
                </div>
              </div>

              <div className="flex flex-col gap-[18px] px-6 pt-[22px] pb-[18px]">
                <div
                  className="animate-slide-up flex flex-col gap-2"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="text-fg-mute flex items-center justify-end gap-2.5 font-mono text-[10px] tracking-[0.05em]">
                    <span>2:14 PM</span>
                    <span>You</span>
                    <div className="border-magenta/30 bg-magenta/[0.12] text-magenta flex size-[22px] items-center justify-center rounded-[5px] border text-[10px] font-semibold">
                      P
                    </div>
                  </div>
                  <div className="border-line-bright bg-bg-input text-fg max-w-[80%] self-end rounded-tl-[10px] rounded-tr-[10px] rounded-br-[3px] rounded-bl-[10px] border px-3.5 py-3 text-[13px]">
                    What's the termination clause and how much notice is required?
                  </div>
                </div>

                <div
                  className="animate-slide-up flex flex-col gap-2"
                  style={{ animationDelay: "0.9s" }}
                >
                  <div className="text-fg-mute flex items-center gap-2.5 font-mono text-[10px] tracking-[0.05em]">
                    <div className="border-lime/35 bg-lime/10 text-lime flex size-[22px] items-center justify-center rounded-[5px] border text-[10px] font-semibold">
                      d
                    </div>
                    <span>DocuChat · 1.1s</span>
                  </div>
                  <div className="text-fg pl-8 text-[13.5px] leading-[1.65]">
                    Either party may terminate with{" "}
                    <span className="mock-cite-link">
                      30 days' written notice
                      <span className="bg-lime/10 text-lime ml-px rounded-[3px] px-1 align-super font-mono text-[9px] font-semibold">
                        1
                      </span>
                    </span>
                    , provided no active SOW remains. Material breach allows{" "}
                    <span className="mock-cite-link">
                      immediate termination
                      <span className="bg-lime/10 text-lime ml-px rounded-[3px] px-1 align-super font-mono text-[9px] font-semibold">
                        2
                      </span>
                    </span>{" "}
                    after a 14-day cure period.
                  </div>
                </div>
              </div>

              <div className="border-line-bright bg-bg-card mx-4 mb-4 flex items-center gap-2.5 rounded-[10px] border py-2 pr-2 pl-3.5">
                <input
                  className="text-fg placeholder:text-fg-mute flex-1 border-none bg-transparent py-2 font-sans text-[13px] outline-none"
                  placeholder="Ask anything about this document…"
                  readOnly
                />
                <button className="bg-lime text-bg cursor-pointer rounded-[7px] border-none px-3 py-1.5 font-mono text-[11px] font-semibold">
                  SEND →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="relative py-24" id="features">
          <div className="text-fg-mute mb-[18px] flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-lime font-semibold">01</span>
            <span>Capabilities</span>
            <span className="bg-line h-px flex-1" />
          </div>
          <h2 className="mb-[18px] max-w-[820px] font-serif text-[clamp(38px,4.6vw,60px)] leading-[1.02] font-normal tracking-[-0.02em]">
            Built for <em className="text-lime italic">understanding</em>, not just searching.
          </h2>
          <p className="text-fg-soft mb-14 max-w-[620px] text-base leading-relaxed">
            Five primitives that turn static files into a conversational knowledge base — every
            answer traceable to the page it came from.
          </p>

          <div
            ref={featRef}
            className="grid grid-cols-1 gap-5 min-[1080px]:grid-cols-6 sm:grid-cols-4"
          >
            <article className="feat-card border-line bg-bg-card hover:border-line-bright col-span-1 rounded-[14px] border p-7 hover:-translate-y-0.5 sm:col-span-4">
              <div className="relative z-10">
                <div className="text-lime mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase">
                  <span>◆</span> 01 · ingestion
                </div>
                <h3 className="mb-3 font-serif text-[30px] leading-[1.1] font-normal tracking-[-0.015em]">
                  Drop a file. We handle the rest.
                </h3>
                <p className="text-fg-soft text-sm leading-relaxed">
                  PDFs, Word docs, EPUBs, plain text, slide decks, research papers. Extracted,
                  chunked, embedded — typically under five seconds for a hundred pages.
                </p>
                <div className="border-line-bright bg-bg-elev mt-6 h-[120px] overflow-hidden rounded-[10px] border">
                  <div className="flex h-full items-end justify-around p-3.5">
                    <div className="glyph-file border-lime/30 bg-bg-card text-lime flex h-[50px] w-[38px] items-end justify-center rounded-tl-sm rounded-tr-sm rounded-br-[2px] rounded-bl-[2px] border pb-1.5 font-mono text-[8px] tracking-[0.08em] transition-transform duration-300 group-hover:-translate-y-1">
                      PDF
                    </div>
                    <div className="glyph-file border-cyan/30 bg-bg-card text-cyan flex h-[56px] w-[38px] items-end justify-center rounded-tl-sm rounded-tr-sm rounded-br-[2px] rounded-bl-[2px] border pb-1.5 font-mono text-[8px] tracking-[0.08em]">
                      DOC
                    </div>
                    <div className="glyph-file border-magenta/30 bg-bg-card text-magenta flex h-[46px] w-[38px] items-end justify-center rounded-tl-sm rounded-tr-sm rounded-br-[2px] rounded-bl-[2px] border pb-1.5 font-mono text-[8px] tracking-[0.08em]">
                      EPB
                    </div>
                    <div className="glyph-file border-amber/30 bg-bg-card text-amber flex h-[42px] w-[38px] items-end justify-center rounded-tl-sm rounded-tr-sm rounded-br-[2px] rounded-bl-[2px] border pb-1.5 font-mono text-[8px] tracking-[0.08em]">
                      TXT
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="feat-card border-line bg-bg-card hover:border-line-bright col-span-1 rounded-[14px] border p-7 hover:-translate-y-0.5 sm:col-span-2">
              <div className="relative z-10">
                <div className="text-magenta mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase">
                  <span>◆</span> 02 · qa
                </div>
                <h3 className="mb-3 font-serif text-[30px] leading-[1.1] font-normal tracking-[-0.015em]">
                  Plain-English Q&A.
                </h3>
                <p className="text-fg-soft text-sm leading-relaxed">
                  Ask the way you'd ask a colleague. Five-page memo or five-hundred-page report —
                  same interface, same precision.
                </p>
              </div>
            </article>

            <article className="feat-card border-line bg-bg-card hover:border-line-bright col-span-1 rounded-[14px] border p-7 hover:-translate-y-0.5 min-[1080px]:col-span-3 sm:col-span-2">
              <div className="relative z-10">
                <div className="text-cyan mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase">
                  <span>◆</span> 03 · citations
                </div>
                <h3 className="mb-3 font-serif text-[30px] leading-[1.1] font-normal tracking-[-0.015em]">
                  Every claim, traceable.
                </h3>
                <p className="text-fg-soft text-sm leading-relaxed">
                  Each sentence carries a footnote pointing to the exact passage. Verifiable.
                  Auditable. Hover to see the source.
                </p>
                <div className="border-line-bright bg-bg-elev text-fg-soft mt-6 overflow-hidden rounded-[10px] border p-4 font-mono text-[11px] leading-[1.65]">
                  "Termination requires <span className="cite-hl">thirty days' written notice</span>
                  <span className="text-lime align-super text-[9px]">¹</span> unless either party is
                  in material breach of the agreement…"
                </div>
              </div>
            </article>

            <article className="feat-card border-line bg-bg-card hover:border-line-bright col-span-1 rounded-[14px] border p-7 hover:-translate-y-0.5 min-[1080px]:col-span-3 sm:col-span-2">
              <div className="relative z-10">
                <div className="text-amber mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase">
                  <span>◆</span> 04 · multi-doc
                </div>
                <h3 className="mb-3 font-serif text-[30px] leading-[1.1] font-normal tracking-[-0.015em]">
                  Query a whole shelf at once.
                </h3>
                <p className="text-fg-soft text-sm leading-relaxed">
                  Compare reports. Cross-reference contracts. Synthesize research across dozens of
                  files in a single conversation.
                </p>
                <div className="border-line-bright bg-bg-elev mt-6 overflow-hidden rounded-[10px] border">
                  <div className="grid grid-cols-3 gap-2 p-4">
                    {[
                      { label: "Q3.pdf", widths: ["100%", "100%", "60%"] },
                      { label: "Q4.pdf", widths: ["100%", "80%", "100%"] },
                      { label: "FY-plan.docx", widths: ["70%", "100%", "100%"] },
                    ].map((d) => (
                      <div
                        key={d.label}
                        className="border-line-bright bg-bg-card text-fg-mute flex flex-col gap-1 rounded-md border p-2 font-mono text-[9px]"
                      >
                        <span className="text-cyan font-semibold">{d.label}</span>
                        {d.widths.map((w, i) => (
                          <div
                            key={i}
                            className="bg-line h-[2px] rounded-[1px]"
                            style={{ width: w }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="feat-card border-line bg-bg-card hover:border-line-bright col-span-1 rounded-[14px] border p-7 hover:-translate-y-0.5 sm:col-span-2">
              <div className="relative z-10">
                <div className="text-lime mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase">
                  <span>◆</span> 05 · memory
                </div>
                <h3 className="mb-3 font-serif text-[30px] leading-[1.1] font-normal tracking-[-0.015em]">
                  Follow-ups just work.
                </h3>
                <p className="text-fg-soft text-sm leading-relaxed">
                  Conversation context persists per session. Reference previous answers naturally —
                  no re-priming required.
                </p>
                <div className="border-line-bright bg-bg-elev mt-6 overflow-hidden rounded-[10px] border">
                  <div className="flex flex-col gap-1.5 p-4">
                    {[
                      { text: 'turn 1 · "what is X?"', w: "100%" },
                      { text: 'turn 2 · "expand on it"', w: "84%" },
                      { text: 'turn 3 · "compare to Y"', w: "72%" },
                    ].map((r) => (
                      <div key={r.text}>
                        <div className="text-fg-mute flex gap-1.5 font-mono text-[10px]">
                          <span className="text-lime">→</span>
                          <span>{r.text}</span>
                        </div>
                        <div className="bg-bg-card h-1 overflow-hidden rounded-[2px]">
                          <span
                            className="bg-lime block h-full shadow-[0_0_8px_var(--lime-glow)]"
                            style={{ width: r.w }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative py-24" id="how">
          <div className="text-fg-mute mb-[18px] flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-lime font-semibold">02</span>
            <span>The pipeline</span>
            <span className="bg-line h-px flex-1" />
          </div>
          <h2 className="mb-[18px] max-w-[820px] font-serif text-[clamp(38px,4.6vw,60px)] leading-[1.02] font-normal tracking-[-0.02em]">
            From <em className="text-lime italic">file</em> to{" "}
            <em className="text-lime italic">answer</em>, in three moves.
          </h2>
          <p className="text-fg-soft mb-14 max-w-[620px] text-base leading-relaxed">
            Retrieval-augmented generation in plain terms — what happens between the moment you drop
            a file and the moment a cited paragraph appears.
          </p>

          <div className="pipeline-grid grid grid-cols-1 gap-6 min-[1080px]:grid-cols-3">
            {[
              {
                num: "i",
                tag: "Step · ingest",
                title: "Extract & embed.",
                body: "Text is pulled, normalized, and split into semantic chunks. Each chunk becomes a 1536-dimensional vector stored in a database.",
                chips: [
                  { t: "unstructured", lime: false },
                  { t: "openai/embed-3", lime: true },
                  { t: "pgvector", lime: false },
                ],
              },
              {
                num: "ii",
                tag: "Step · retrieve",
                title: "Find the right passages.",
                body: "Your question is embedded the same way. A nearest-neighbor search surfaces the most semantically relevant chunks — not just keyword matches.",
                chips: [
                  { t: "cosine · top-k", lime: true },
                  { t: "re-ranker", lime: false },
                  { t: "hybrid · bm25", lime: false },
                ],
              },
              {
                num: "iii",
                tag: "Step · generate",
                title: "Compose a grounded answer.",
                body: "Retrieved passages flow into a language model as context. The response is generated with citations bound to the exact source spans.",
                chips: [
                  { t: "claude-sonnet-4", lime: true },
                  { t: "streaming", lime: false },
                  { t: "citation-bind", lime: false },
                ],
              },
            ].map((s) => (
              <div
                key={s.num}
                className="border-line bg-bg-panel relative z-10 rounded-[14px] border p-7"
              >
                <div className="border-line-bright bg-bg-card text-lime mb-[22px] flex size-14 items-center justify-center rounded-[14px] border font-serif text-[30px] italic shadow-[0_0_24px_rgba(198,244,50,0.18)]">
                  {s.num}
                </div>
                <div className="text-fg-mute mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
                  {s.tag}
                </div>
                <h4 className="mb-2.5 font-serif text-[26px] font-normal tracking-[-0.01em]">
                  {s.title}
                </h4>
                <p className="text-fg-soft mb-[18px] text-sm leading-relaxed">{s.body}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.chips.map((c) => (
                    <span
                      key={c.t}
                      className={`bg-bg-elev rounded border px-2 py-0.5 font-mono text-[10px] tracking-[0.05em] ${
                        c.lime ? "border-lime/30 text-lime" : "border-line text-fg-soft"
                      }`}
                    >
                      {c.t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* USE CASES */}
        <section className="relative py-24" id="cases">
          <div className="text-fg-mute mb-[18px] flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-lime font-semibold">03</span>
            <span>Built for</span>
            <span className="bg-line h-px flex-1" />
          </div>
          <h2 className="mb-14 max-w-[820px] font-serif text-[clamp(38px,4.6vw,60px)] leading-[1.02] font-normal tracking-[-0.02em]">
            Anyone who reads more than they have <em className="text-lime italic">time for</em>.
          </h2>

          <div className="grid grid-cols-1 gap-4 min-[1080px]:grid-cols-4 sm:grid-cols-2">
            {[
              {
                n: "01",
                t: "Students",
                p: "Interrogate textbooks, lecture notes, and research papers. Ask for summaries, definitions, or worked examples — pulled straight from the page.",
              },
              {
                n: "02",
                t: "Professionals",
                p: "Review contracts, policies, and reports without scrolling. Find the clause, understand the obligation, move on.",
              },
              {
                n: "03",
                t: "Researchers",
                p: "Synthesize across dozens of papers. Cross-reference findings, surface contradictions, build a literature review in conversation.",
              },
              {
                n: "04",
                t: "Everyone else",
                p: "Insurance docs. Manuals. Lease agreements. Whatever PDF is sitting unread in your downloads folder.",
              },
            ].map((c) => (
              <div
                key={c.n}
                className="case-card border-line bg-bg-card hover:border-line-bright cursor-default rounded-xl border p-6 hover:-translate-y-[3px]"
              >
                <div className="text-lime mb-4 font-mono text-[11px] tracking-[0.08em]">
                  [ {c.n} ]
                </div>
                <h5 className="mb-2 font-serif text-[22px] font-normal tracking-[-0.01em]">
                  {c.t}
                </h5>
                <p className="text-fg-soft text-[13px] leading-relaxed">{c.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DIFF */}
        <section className="relative py-24">
          <div className="text-fg-mute mb-[18px] flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-lime font-semibold">04</span>
            <span>The difference</span>
            <span className="bg-line h-px flex-1" />
          </div>

          <div className="border-line-bright bg-line grid grid-cols-1 gap-px overflow-hidden rounded-[14px] border min-[1080px]:grid-cols-2">
            <div className="bg-bg-panel px-8 py-9">
              <div className="text-fg-mute mb-[18px] font-mono text-[10px] tracking-[0.18em] uppercase">
                Traditional search
              </div>
              <h6 className="mb-3.5 font-serif text-[28px] leading-[1.15] font-normal tracking-[-0.01em]">
                Gives you keywords.
              </h6>
              <p className="text-fg-soft mb-5 text-sm leading-[1.7]">
                You type a string, you get a list of matches. Then you skim, scroll, and stitch the
                answer together yourself.
              </p>
              <ul className="flex list-none flex-col gap-2.5">
                {[
                  "literal string matching",
                  "ranked link list, no synthesis",
                  "no awareness of context or intent",
                  "you do the reading",
                ].map((li) => (
                  <li key={li} className="diff-marker text-fg-soft font-mono text-xs">
                    {li}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-bg-panel px-8 py-9 [background:linear-gradient(180deg,rgba(198,244,50,0.04),transparent),var(--color-bg-panel)]">
              <div className="text-lime mb-[18px] font-mono text-[10px] tracking-[0.18em] uppercase">
                DocuChat
              </div>
              <h6 className="mb-3.5 font-serif text-[28px] leading-[1.15] font-normal tracking-[-0.01em]">
                Gives you understanding.
              </h6>
              <p className="text-fg-soft mb-5 text-sm leading-[1.7]">
                Semantic retrieval plus generative AI. It comprehends meaning, not just tokens — and
                delivers the answer you actually asked for.
              </p>
              <ul className="flex list-none flex-col gap-2.5">
                {[
                  "semantic vector search",
                  "composed answers, grounded in source",
                  "conversational context across turns",
                  "cited, verifiable, auditable",
                ].map((li) => (
                  <li key={li} className="diff-marker-arrow text-fg-soft font-mono text-xs">
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="cta-card border-line-bright my-12 mb-24 rounded-[18px] border px-7 py-12 [background:radial-gradient(800px_circle_at_80%_20%,rgba(198,244,50,0.1),transparent_55%),radial-gradient(600px_circle_at_10%_90%,rgba(255,46,136,0.08),transparent_55%),var(--color-bg-panel)] sm:px-16 sm:py-[72px]"
        >
          <div className="relative grid grid-cols-1 items-center gap-12 min-[1080px]:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 className="mb-[18px] font-serif text-[clamp(40px,4.4vw,56px)] leading-[1.05] font-normal tracking-[-0.02em]">
                Stop reading. <em className="text-lime italic">Start asking.</em>
              </h2>
              <p className="text-fg-soft mb-7 max-w-[520px] text-base leading-relaxed">
                Your first document is on us. Drop a PDF, ask one question, see what "source-backed"
                actually feels like.
              </p>
              <div className="flex items-center gap-3.5">
                <button className="bg-lime text-bg hover:bg-lime-bright inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] px-[22px] py-[14px] font-sans text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-[0_0_32px_var(--lime-glow)]">
                  Open the app <span className="font-mono text-base">→</span>
                </button>
                <button className="border-line-bright text-fg hover:border-lime hover:bg-lime/10 hover:text-lime inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] border bg-transparent px-5 py-[14px] font-mono text-xs tracking-[0.08em] transition-all">
                  <span>read the docs</span>
                </button>
              </div>
            </div>

            <form
              className="border-line-bright bg-bg-card flex flex-col gap-3 rounded-xl border p-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label className="text-fg-mute font-mono text-[10px] tracking-[0.15em] uppercase">
                Get early access
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="you@domain.com"
                  required
                  className="border-line-bright bg-bg-input text-fg focus:border-lime focus:shadow-lime/10 flex-1 rounded-lg border px-3.5 py-3 font-sans text-[13px] transition-all outline-none focus:shadow-[0_0_0_3px]"
                />
                <button
                  type="submit"
                  className="bg-lime text-bg hover:bg-lime-bright inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] px-[22px] py-[14px] font-sans text-sm font-semibold transition-all hover:-translate-y-px hover:shadow-[0_0_32px_var(--lime-glow)]"
                >
                  Notify <span className="font-mono text-base">→</span>
                </button>
              </div>
              <div className="text-fg-mute flex justify-between px-1 font-mono text-[10px] tracking-[0.05em]">
                <span>no spam · single confirmation</span>
                <span>~2k on the list</span>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className={SHELL}>
        <div className="border-line text-fg-mute flex items-center gap-6 border-t py-9 pb-12 font-mono text-[11px] tracking-[0.08em]">
          <span className="bg-lime size-1.5 rounded-full shadow-[0_0_10px_var(--color-lime)]" />
          <span>DOCUCHAT · 2026</span>
          <span className="flex-1" />
          <a href="#" className="text-fg-soft hover:text-lime no-underline transition-colors">
            github
          </a>
          <a href="#" className="text-fg-soft hover:text-lime no-underline transition-colors">
            privacy
          </a>
          <a href="#" className="text-fg-soft hover:text-lime no-underline transition-colors">
            terms
          </a>
          <a href="#" className="text-fg-soft hover:text-lime no-underline transition-colors">
            contact
          </a>
        </div>
      </footer>
    </>
  );
}

export default Home;
