"use client";

import { useMemo, useState } from "react";
import type { ClaimData, LaborCode, LaborLine, PartRow } from "@/lib/types";
import laborCodesData from "@/data/labor-codes.json";

const LABOR_CODES = laborCodesData as LaborCode[];

function newId(): string {
  // Not security-sensitive; just a stable React key + row identity.
  return `id-${Math.random().toString(36).slice(2, 10)}`;
}

export function Step3Work({
  claim,
  patch,
}: {
  claim: ClaimData;
  patch: (partial: Partial<ClaimData>) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-ink">What did you do?</h2>
        <p className="mt-1 text-sm text-muted">
          Add the labor operations, any parts, and a description of the work.
        </p>
      </div>

      <LaborSection claim={claim} patch={patch} />
      <PartsSection claim={claim} patch={patch} />

      <div>
        <label htmlFor="workDescription" className="field-label">
          Description of work
        </label>
        <textarea
          id="workDescription"
          className="field-input min-h-[120px] resize-y"
          placeholder="Describe the failure, diagnosis, and repair performed…"
          value={claim.workDescription}
          onChange={(e) => patch({ workDescription: e.target.value })}
        />
      </div>
    </div>
  );
}

/* ----------------------------- Labor ----------------------------- */

function LaborSection({
  claim,
  patch,
}: {
  claim: ClaimData;
  patch: (partial: Partial<ClaimData>) => void;
}) {
  const [query, setQuery] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customDesc, setCustomDesc] = useState("");
  const [customHours, setCustomHours] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LABOR_CODES.slice(0, 6);
    return LABOR_CODES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const addLine = (line: LaborLine) => patch({ labor: [...claim.labor, line] });

  const removeLine = (index: number) =>
    patch({ labor: claim.labor.filter((_, i) => i !== index) });

  const addFromCode = (c: LaborCode) => {
    addLine({
      code: c.code,
      description: c.description,
      hours: c.hours,
      custom: false,
    });
    setQuery("");
  };

  const addCustom = () => {
    const hours = Number(customHours);
    if (!customDesc.trim() || !Number.isFinite(hours) || hours <= 0) return;
    addLine({ code: "", description: customDesc.trim(), hours, custom: true });
    setCustomDesc("");
    setCustomHours("");
    setShowCustom(false);
  };

  const totalHours = claim.labor.reduce((s, l) => s + l.hours, 0);

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-text">
          Labor operations
        </h3>
        {claim.labor.length > 0 && (
          <span className="text-sm text-muted">
            {totalHours.toFixed(2)} hrs total
          </span>
        )}
      </div>

      {/* Existing lines */}
      {claim.labor.length > 0 && (
        <ul className="mb-3 space-y-2">
          {claim.labor.map((line, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {line.description}
                </p>
                <p className="text-xs text-muted">
                  {line.custom ? "Custom" : line.code} · {line.hours.toFixed(2)}{" "}
                  hrs
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeLine(i)}
                className="rounded-md p-2 text-muted hover:bg-surface-2 hover:text-bad"
                aria-label="Remove labor line"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Searchable picker */}
      {!showCustom && (
        <div>
          <input
            className="field-input"
            placeholder="Search labor codes or operations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {(query || results.length > 0) && (
            <ul className="mt-2 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
              {results.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onClick={() => addFromCode(c)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-2"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">
                        {c.description}
                      </span>
                      <span className="text-xs text-muted">{c.code}</span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-ink-2">
                      {c.hours.toFixed(1)}h
                    </span>
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-4 py-3 text-sm text-muted">
                  No matching codes. Use a custom entry below.
                </li>
              )}
            </ul>
          )}
          <button
            type="button"
            onClick={() => setShowCustom(true)}
            className="mt-2 text-sm font-semibold text-accent hover:text-accent-strong"
          >
            + Add custom labor operation
          </button>
        </div>
      )}

      {/* Custom entry */}
      {showCustom && (
        <div className="rounded-lg border border-accent bg-accent-tint p-4">
          <label className="field-label">Custom operation description</label>
          <input
            className="field-input"
            placeholder="Describe the operation performed"
            value={customDesc}
            onChange={(e) => setCustomDesc(e.target.value)}
            autoFocus
          />
          <div className="mt-3 flex items-end gap-3">
            <div className="w-32">
              <label className="field-label">Hours</label>
              <input
                className="field-input field-mono"
                inputMode="decimal"
                placeholder="1.5"
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
              />
            </div>
            <button type="button" className="btn-accent" onClick={addCustom}>
              Add
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowCustom(false);
                setCustomDesc("");
                setCustomHours("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ----------------------------- Parts ----------------------------- */

function PartsSection({
  claim,
  patch,
}: {
  claim: ClaimData;
  patch: (partial: Partial<ClaimData>) => void;
}) {
  const addRow = () =>
    patch({
      parts: [
        ...claim.parts,
        { id: newId(), name: "", partNumber: "", qty: 1, unitCost: 0 },
      ],
    });

  const updateRow = (id: string, partial: Partial<PartRow>) =>
    patch({
      parts: claim.parts.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    });

  const removeRow = (id: string) =>
    patch({ parts: claim.parts.filter((p) => p.id !== id) });

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-brand-text">
          Parts used{" "}
          <span className="font-normal normal-case text-muted">
            (optional)
          </span>
        </h3>
      </div>

      {claim.parts.length > 0 && (
        <div className="space-y-3">
          {claim.parts.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-line bg-surface p-3"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-12">
                <div className="col-span-2 sm:col-span-5">
                  <label className="field-label">Part name</label>
                  <input
                    className="field-input"
                    placeholder="Water heater"
                    value={p.name}
                    onChange={(e) => updateRow(p.id, { name: e.target.value })}
                  />
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <label className="field-label">Part #</label>
                  <input
                    className="field-input field-mono"
                    placeholder="GC6AA-10"
                    value={p.partNumber}
                    onChange={(e) =>
                      updateRow(p.id, { partNumber: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label">Qty</label>
                  <input
                    className="field-input field-mono"
                    inputMode="numeric"
                    value={p.qty}
                    onChange={(e) =>
                      updateRow(p.id, {
                        qty: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label">Unit $</label>
                  <input
                    className="field-input field-mono"
                    inputMode="decimal"
                    value={p.unitCost}
                    onChange={(e) =>
                      updateRow(p.id, {
                        unitCost: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted">
                  Line total: ${(p.qty * p.unitCost).toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => removeRow(p.id)}
                  className="text-sm font-medium text-muted hover:text-bad"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addRow}
        className="mt-3 text-sm font-semibold text-accent hover:text-accent-strong"
      >
        + Add a part
      </button>
    </section>
  );
}
