"use client";

import { MANUFACTURERS, type ClaimData } from "@/lib/types";
import { useState } from "react";

export function Step1Manufacturer({
  claim,
  patch,
}: {
  claim: ClaimData;
  patch: (partial: Partial<ClaimData>) => void;
}) {
  // "Other" is selected when the current value isn't one of the known names.
  const isKnown = MANUFACTURERS.includes(claim.manufacturer);
  const [other, setOther] = useState(isKnown ? false : claim.manufacturer !== "");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Who are you filing with?
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Pick the manufacturer or component supplier this claim goes to.
        </p>
      </div>

      <div>
        <label htmlFor="manufacturer" className="field-label">
          Manufacturer / Supplier
        </label>
        <select
          id="manufacturer"
          className="field-input appearance-none"
          value={other ? "Other" : claim.manufacturer}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "Other") {
              setOther(true);
              patch({ manufacturer: "" });
            } else {
              setOther(false);
              patch({ manufacturer: v });
            }
          }}
        >
          <option value="" disabled>
            Select one…
          </option>
          {MANUFACTURERS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
          <option value="Other">Other (type it in)</option>
        </select>
      </div>

      {other && (
        <div>
          <label htmlFor="manufacturer-other" className="field-label">
            Manufacturer / supplier name
          </label>
          <input
            id="manufacturer-other"
            className="field-input"
            placeholder="e.g. Winnebago, Furrion, Suburban…"
            value={claim.manufacturer}
            onChange={(e) => patch({ manufacturer: e.target.value })}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
