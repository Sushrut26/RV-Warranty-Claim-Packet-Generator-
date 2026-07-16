import { ClaimWizard } from "@/components/ClaimWizard";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6 sm:py-9">
      <header className="mb-7">
        <div className="flex items-center gap-3.5">
          {/* Instrument plate mark */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-brand text-2xl text-[var(--on-brand)] shadow-card">
            <span className="relative z-10">🔧</span>
            <span className="absolute -bottom-1 left-0 right-0 h-2 bg-accent" />
          </div>
          <div className="min-w-0">
            <p className="eyebrow">Warranty Claim Packet</p>
            <h1 className="font-display text-2xl font-bold leading-none tracking-tight text-ink sm:text-[1.75rem]">
              RV Claim Builder
            </h1>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-xs text-muted">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 text-good"
            aria-hidden="true"
          >
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <span>
            Runs entirely in your browser — no account, no upload. Your entries
            and photos only go into the PDF you download.
          </span>
        </div>
      </header>

      <ClaimWizard />

      <footer className="mt-10 border-t border-line pt-5 text-center text-xs text-muted">
        Prepares the document only — you review and submit it to the
        manufacturer yourself.
      </footer>
    </main>
  );
}
