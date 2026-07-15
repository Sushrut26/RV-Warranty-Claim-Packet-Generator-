import { ClaimWizard } from "@/components/ClaimWizard";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6 sm:py-10">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-xl">
            🛠️
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight text-slate-900 sm:text-xl">
              RV Warranty Claim Packet Generator
            </h1>
            <p className="text-sm text-slate-500">
              A clean, submit-ready PDF in a few minutes.
            </p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
          🔒 Everything stays in your browser. No account, no upload — your
          entries and photos only ever go into the PDF you download.
        </p>
      </header>

      <ClaimWizard />

      <footer className="mt-10 text-center text-xs text-slate-400">
        Prepares the document only — you review and submit it to the
        manufacturer yourself.
      </footer>
    </main>
  );
}
