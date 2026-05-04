import { useEffect, useRef } from "react";

import "./App.css";

function App() {
  const featRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = featRef.current;
    if (!root) return;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".feat") as HTMLElement | null;
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
      <nav className="nav">
        <div className="shell nav-inner">
          <div className="brand">
            <div className="brand-icon">d</div>
            <div className="brand-name">DocuChat</div>
            <span className="brand-tag">v0.1 · beta</span>
          </div>
          <div className="nav-links">
            <a className="nav-link" href="#features">
              Features
            </a>
            <a className="nav-link" href="#how">
              How it works
            </a>
            <a className="nav-link" href="#cases">
              Use cases
            </a>
            <a className="nav-link" href="#cta">
              Sign in
            </a>
            <button className="nav-cta">
              Launch app <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="shell">
        {/* HERO */}
        <section className="hero">
          <div>
            <div className="hero-eyebrow">
              <span className="pulse" />
              <span>Retrieval-augmented · semantic search · live</span>
            </div>

            <h1>
              <span className="strike">Read</span> <span className="it">ask</span>
              <br />
              any document.
            </h1>

            <p className="hero-lead">
              DocuChat indexes your files into a vector store and lets you <em>converse</em> with
              them. Source-grounded answers, citations on every line, no hallucinated nonsense —
              built on RAG.
            </p>

            <div className="hero-actions">
              <button className="btn-primary">
                Upload a document <span className="arrow">→</span>
              </button>
              <button className="btn-ghost">
                <span className="kbd">⌘</span>
                <span className="kbd">K</span>
                <span>see a demo</span>
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="num accent">3.2s</div>
                <div className="lab">avg query latency</div>
              </div>
              <div className="hero-stat">
                <div className="num">1536</div>
                <div className="lab">embedding dim</div>
              </div>
              <div className="hero-stat">
                <div className="num mag">100%</div>
                <div className="lab">cited answers</div>
              </div>
            </div>
          </div>

          {/* MOCK */}
          <div className="mock">
            <span className="mock-tag t1">vector-search · enabled</span>
            <span className="mock-tag t2">cited · 3 sources</span>
            <span className="mock-tag t3">claude · sonnet</span>

            <div className="mock-card">
              <div className="mock-bar">
                <span className="mock-dot" />
                <span className="mock-dot" />
                <span className="mock-dot" />
                <div className="mock-doc">
                  <span className="badge">PDF</span>
                  <span>contract_v3.pdf · 84 pages · indexed</span>
                </div>
              </div>

              <div className="mock-body">
                <div className="mock-msg user">
                  <div className="mock-msg-head">
                    <span>2:14 PM</span>
                    <span>You</span>
                    <div className="mock-avatar user">P</div>
                  </div>
                  <div className="mock-bubble">
                    What's the termination clause and how much notice is required?
                  </div>
                </div>

                <div className="mock-msg ai">
                  <div className="mock-msg-head">
                    <div className="mock-avatar ai">d</div>
                    <span>DocuChat · 1.1s</span>
                  </div>
                  <div className="mock-bubble">
                    Either party may terminate with{" "}
                    <span className="mock-cite">
                      30 days' written notice
                      <span className="mock-cite-ref">1</span>
                    </span>
                    , provided no active SOW remains. Material breach allows{" "}
                    <span className="mock-cite">
                      immediate termination
                      <span className="mock-cite-ref">2</span>
                    </span>{" "}
                    after a 14-day cure period.
                  </div>
                </div>
              </div>

              <div className="mock-input">
                <input placeholder="Ask anything about this document…" readOnly />
                <button className="send">SEND →</button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="sec" id="features">
          <div className="sec-eyebrow">
            <span className="num">01</span>
            <span>Capabilities</span>
            <span className="line" />
          </div>
          <h2 className="sec-title">
            Built for <em>understanding</em>, not just searching.
          </h2>
          <p className="sec-sub">
            Five primitives that turn static files into a conversational knowledge base — every
            answer traceable to the page it came from.
          </p>

          <div className="features" ref={featRef}>
            <div className="feat wide">
              <div className="feat-tag">
                <span>◆</span> 01 · ingestion
              </div>
              <h3>Drop a file. We handle the rest.</h3>
              <p>
                PDFs, Word docs, EPUBs, plain text, slide decks, research papers. Extracted,
                chunked, embedded — typically under five seconds for a hundred pages.
              </p>
              <div className="feat-glyph">
                <div className="glyph-files">
                  <div className="file pdf">PDF</div>
                  <div className="file doc">DOC</div>
                  <div className="file epb">EPB</div>
                  <div className="file txt">TXT</div>
                </div>
              </div>
            </div>

            <div className="feat third">
              <div className="feat-tag mg">
                <span>◆</span> 02 · qa
              </div>
              <h3>Plain-English Q&A.</h3>
              <p>
                Ask the way you'd ask a colleague. Five-page memo or five-hundred-page report — same
                interface, same precision.
              </p>
            </div>

            <div className="feat half">
              <div className="feat-tag cy">
                <span>◆</span> 03 · citations
              </div>
              <h3>Every claim, traceable.</h3>
              <p>
                Each sentence carries a footnote pointing to the exact passage. Verifiable.
                Auditable. Hover to see the source.
              </p>
              <div className="feat-glyph">
                <div className="glyph-cite">
                  "Termination requires <span className="hl">thirty days' written notice</span>
                  <span className="ref">¹</span> unless either party is in material breach of the
                  agreement…"
                </div>
              </div>
            </div>

            <div className="feat half">
              <div className="feat-tag am">
                <span>◆</span> 04 · multi-doc
              </div>
              <h3>Query a whole shelf at once.</h3>
              <p>
                Compare reports. Cross-reference contracts. Synthesize research across dozens of
                files in a single conversation.
              </p>
              <div className="feat-glyph">
                <div className="glyph-multi">
                  <div className="doc">
                    <span className="label">Q3.pdf</span>
                    <div className="lines" />
                    <div className="lines" />
                    <div className="lines" style={{ width: "60%" }} />
                  </div>
                  <div className="doc">
                    <span className="label">Q4.pdf</span>
                    <div className="lines" />
                    <div className="lines" style={{ width: "80%" }} />
                    <div className="lines" />
                  </div>
                  <div className="doc">
                    <span className="label">FY-plan.docx</span>
                    <div className="lines" style={{ width: "70%" }} />
                    <div className="lines" />
                    <div className="lines" />
                  </div>
                </div>
              </div>
            </div>

            <div className="feat third">
              <div className="feat-tag">
                <span>◆</span> 05 · memory
              </div>
              <h3>Follow-ups just work.</h3>
              <p>
                Conversation context persists per session. Reference previous answers naturally — no
                re-priming required.
              </p>
              <div className="feat-glyph">
                <div className="glyph-mem">
                  <div className="row">
                    <span className="arrow">→</span>
                    <span>turn 1 · "what is X?"</span>
                  </div>
                  <div className="bar">
                    <span style={{ width: "100%" }} />
                  </div>
                  <div className="row">
                    <span className="arrow">→</span>
                    <span>turn 2 · "expand on it"</span>
                  </div>
                  <div className="bar">
                    <span style={{ width: "84%" }} />
                  </div>
                  <div className="row">
                    <span className="arrow">→</span>
                    <span>turn 3 · "compare to Y"</span>
                  </div>
                  <div className="bar">
                    <span style={{ width: "72%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="sec" id="how">
          <div className="sec-eyebrow">
            <span className="num">02</span>
            <span>The pipeline</span>
            <span className="line" />
          </div>
          <h2 className="sec-title">
            From <em>file</em> to <em>answer</em>, in three moves.
          </h2>
          <p className="sec-sub">
            Retrieval-augmented generation in plain terms — what happens between the moment you drop
            a file and the moment a cited paragraph appears.
          </p>

          <div className="pipeline">
            <div className="step">
              <div className="step-num">i</div>
              <div className="step-tag">Step · ingest</div>
              <h4>Extract & embed.</h4>
              <p>
                Text is pulled, normalized, and split into semantic chunks. Each chunk becomes a
                1536-dimensional vector stored in a database.
              </p>
              <div className="step-tech">
                <span className="chip">unstructured</span>
                <span className="chip lime">openai/embed-3</span>
                <span className="chip">pgvector</span>
              </div>
            </div>

            <div className="step">
              <div className="step-num">ii</div>
              <div className="step-tag">Step · retrieve</div>
              <h4>Find the right passages.</h4>
              <p>
                Your question is embedded the same way. A nearest-neighbor search surfaces the most
                semantically relevant chunks — not just keyword matches.
              </p>
              <div className="step-tech">
                <span className="chip lime">cosine · top-k</span>
                <span className="chip">re-ranker</span>
                <span className="chip">hybrid · bm25</span>
              </div>
            </div>

            <div className="step">
              <div className="step-num">iii</div>
              <div className="step-tag">Step · generate</div>
              <h4>Compose a grounded answer.</h4>
              <p>
                Retrieved passages flow into a language model as context. The response is generated
                with citations bound to the exact source spans.
              </p>
              <div className="step-tech">
                <span className="chip lime">claude-sonnet-4</span>
                <span className="chip">streaming</span>
                <span className="chip">citation-bind</span>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="sec" id="cases">
          <div className="sec-eyebrow">
            <span className="num">03</span>
            <span>Built for</span>
            <span className="line" />
          </div>
          <h2 className="sec-title">
            Anyone who reads more than they have <em>time for</em>.
          </h2>

          <div className="cases">
            <div className="case">
              <div className="case-glyph">[ 01 ]</div>
              <h5>Students</h5>
              <p>
                Interrogate textbooks, lecture notes, and research papers. Ask for summaries,
                definitions, or worked examples — pulled straight from the page.
              </p>
            </div>
            <div className="case">
              <div className="case-glyph">[ 02 ]</div>
              <h5>Professionals</h5>
              <p>
                Review contracts, policies, and reports without scrolling. Find the clause,
                understand the obligation, move on.
              </p>
            </div>
            <div className="case">
              <div className="case-glyph">[ 03 ]</div>
              <h5>Researchers</h5>
              <p>
                Synthesize across dozens of papers. Cross-reference findings, surface
                contradictions, build a literature review in conversation.
              </p>
            </div>
            <div className="case">
              <div className="case-glyph">[ 04 ]</div>
              <h5>Everyone else</h5>
              <p>
                Insurance docs. Manuals. Lease agreements. Whatever PDF is sitting unread in your
                downloads folder.
              </p>
            </div>
          </div>
        </section>

        {/* DIFF */}
        <section className="sec">
          <div className="sec-eyebrow">
            <span className="num">04</span>
            <span>The difference</span>
            <span className="line" />
          </div>

          <div className="diff">
            <div className="diff-side">
              <div className="diff-tag">Traditional search</div>
              <h6>Gives you keywords.</h6>
              <p>
                You type a string, you get a list of matches. Then you skim, scroll, and stitch the
                answer together yourself.
              </p>
              <ul className="diff-list">
                <li>literal string matching</li>
                <li>ranked link list, no synthesis</li>
                <li>no awareness of context or intent</li>
                <li>you do the reading</li>
              </ul>
            </div>

            <div className="diff-side right">
              <div className="diff-tag">DocuChat</div>
              <h6>Gives you understanding.</h6>
              <p>
                Semantic retrieval plus generative AI. It comprehends meaning, not just tokens — and
                delivers the answer you actually asked for.
              </p>
              <ul className="diff-list">
                <li>semantic vector search</li>
                <li>composed answers, grounded in source</li>
                <li>conversational context across turns</li>
                <li>cited, verifiable, auditable</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta" id="cta">
          <div className="cta-inner">
            <div>
              <h2>
                Stop reading. <em>Start asking.</em>
              </h2>
              <p>
                Your first document is on us. Drop a PDF, ask one question, see what "source-backed"
                actually feels like.
              </p>
              <div className="hero-actions" style={{ marginBottom: 0 }}>
                <button className="btn-primary">
                  Open the app <span className="arrow">→</span>
                </button>
                <button className="btn-ghost">
                  <span>read the docs</span>
                </button>
              </div>
            </div>

            <form
              className="cta-form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label>Get early access</label>
              <div className="row">
                <input type="email" placeholder="you@domain.com" required />
                <button type="submit" className="btn-primary">
                  Notify <span className="arrow">→</span>
                </button>
              </div>
              <div className="meta">
                <span>no spam · single confirmation</span>
                <span>~2k on the list</span>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="shell">
        <div className="foot">
          <span className="dot" />
          <span>DOCUCHAT · 2026</span>
          <span className="spacer" />
          <a href="#">github</a>
          <a href="#">privacy</a>
          <a href="#">terms</a>
          <a href="#">contact</a>
        </div>
      </footer>
    </>
  );
}

export default App;
