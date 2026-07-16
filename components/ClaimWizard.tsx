"use client";

import { useEffect, useState } from "react";
import { emptyClaim, type ClaimData } from "@/lib/types";
import { loadFiler, saveFiler } from "@/lib/storage";
import { generateAndDownloadPdf } from "@/lib/pdf";
import { Stepper } from "@/components/Stepper";
import { Step1Manufacturer } from "@/components/steps/Step1Manufacturer";
import { Step2Unit } from "@/components/steps/Step2Unit";
import { Step3Work } from "@/components/steps/Step3Work";
import { Step4Evidence } from "@/components/steps/Step4Evidence";
import { Step5Review } from "@/components/steps/Step5Review";

const LAST_STEP = 4;

export function ClaimWizard() {
  const [claim, setClaim] = useState<ClaimData>(emptyClaim);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // On first mount, hydrate the filer block from this device's localStorage.
  useEffect(() => {
    const saved = loadFiler();
    if (saved) {
      setClaim((c) => ({ ...c, filer: saved }));
    }
  }, []);

  const patch = (partial: Partial<ClaimData>) =>
    setClaim((c) => ({ ...c, ...partial }));

  const goTo = (i: number) => {
    setStep(Math.max(0, Math.min(LAST_STEP, i)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  // Light gating: you can't leave step 1 without picking who you're filing with.
  const canAdvance = step === 0 ? claim.manufacturer.trim() !== "" : true;

  const next = () => {
    if (!canAdvance) return;
    goTo(step + 1);
  };
  const back = () => goTo(step - 1);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      // Persist just the filer block for next time (local only).
      saveFiler(claim.filer);
      await generateAndDownloadPdf(claim);
      setDone(true);
    } catch (err) {
      setGenError(
        (err as Error).message || "Something went wrong generating the PDF."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <Stepper current={step} onJump={goTo} />

      <div className="card p-5 sm:p-7">
        {step === 0 && <Step1Manufacturer claim={claim} patch={patch} />}
        {step === 1 && <Step2Unit claim={claim} patch={patch} />}
        {step === 2 && <Step3Work claim={claim} patch={patch} />}
        {step === 3 && <Step4Evidence claim={claim} patch={patch} />}
        {step === 4 && <Step5Review claim={claim} />}

        {genError && (
          <p className="mt-4 rounded-md border border-bad bg-bad-tint px-4 py-2 text-sm text-bad">
            {genError}
          </p>
        )}

        {done && step === LAST_STEP && (
          <div className="mt-4 rounded-md border border-good bg-good-tint px-4 py-3 text-sm text-good">
            <p className="font-display font-bold uppercase tracking-wide">
              Claim PDF downloaded ✓
            </p>
            <p className="mt-0.5">
              Check your downloads folder. Refresh the page to start a fresh
              claim — nothing is saved except your shop info on this device.
            </p>
          </div>
        )}

        {/* Nav */}
        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={back}
            disabled={step === 0}
          >
            ← Back
          </button>

          {step < LAST_STEP ? (
            <button
              type="button"
              className="btn-primary"
              onClick={next}
              disabled={!canAdvance}
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              className="btn-accent"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? "Generating…" : "Generate Claim PDF"}
            </button>
          )}
        </div>
      </div>

      {step === 0 && !canAdvance && (
        <p className="mt-3 text-center text-sm text-muted">
          Select a manufacturer or supplier to continue.
        </p>
      )}
    </div>
  );
}
