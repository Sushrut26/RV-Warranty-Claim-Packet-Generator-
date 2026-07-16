"use client";

import type { ClaimData } from "@/lib/types";

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-2 py-0.5 text-sm">
      <span className="w-24 shrink-0 text-muted">{label}</span>
      <span className={mono ? "font-mono text-ink-2" : "text-ink-2"}>
        {value || "—"}
      </span>
    </div>
  );
}

function Card({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-4">
      <div className="mb-2.5 flex items-baseline justify-between border-b border-line pb-2">
        <h3 className="eyebrow">{title}</h3>
        {meta && (
          <span className="tabnum font-mono text-xs text-muted">{meta}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export function Step5Review({ claim }: { claim: ClaimData }) {
  const totalHours = claim.labor.reduce((s, l) => s + l.hours, 0);
  const partsTotal = claim.parts.reduce((s, p) => s + p.qty * p.unitCost, 0);
  const vehicle = [claim.year, claim.make, claim.model]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-ink">
          Review your packet
        </h2>
        <p className="mt-1 text-sm text-muted">
          This is exactly what goes into the PDF. Tap any step above to fix
          something.
        </p>
      </div>

      {/* Ticket header — the claim's destination, stated plainly. */}
      <div className="relative overflow-hidden rounded-card bg-brand px-4 py-3.5 text-[var(--on-brand)]">
        <span className="absolute bottom-0 left-0 top-0 w-1 bg-accent" />
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--on-brand)] opacity-70">
          Warranty claim to
        </p>
        <p className="font-display text-xl font-bold leading-tight">
          {claim.manufacturer || "—"}
        </p>
      </div>

      {/* Summary strip — the numbers first, at a glance. */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Labor hrs" value={totalHours.toFixed(2)} />
        <Stat label="Parts" value={`$${partsTotal.toFixed(2)}`} />
        <Stat label="Photos" value={String(claim.photos.length)} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card title="Submitted by">
          <Field label="Business" value={claim.filer.businessName} />
          <Field label="Technician" value={claim.filer.technicianName} />
          <Field label="Phone" value={claim.filer.phone} mono />
          <Field label="Email" value={claim.filer.email} />
        </Card>
        <Card title="Unit & customer">
          <Field label="VIN" value={claim.vin} mono />
          <Field label="Vehicle" value={vehicle} />
          <Field label="Customer" value={claim.customerName} />
          <Field label="Service date" value={claim.serviceDate} mono />
        </Card>
      </div>

      <Card title="Labor" meta={`${totalHours.toFixed(2)} hrs`}>
        {claim.labor.length === 0 ? (
          <p className="text-sm text-muted">No labor lines.</p>
        ) : (
          <ul className="divide-y divide-line">
            {claim.labor.map((l, i) => (
              <li key={i} className="flex justify-between gap-3 py-1.5 text-sm">
                <span className="min-w-0">
                  <span className="text-ink-2">{l.description}</span>{" "}
                  <span className="font-mono text-xs text-muted">
                    {l.custom ? "CUSTOM" : l.code}
                  </span>
                </span>
                <span className="tabnum shrink-0 font-mono font-medium text-ink">
                  {l.hours.toFixed(2)}h
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {claim.parts.length > 0 && (
        <Card title="Parts" meta={`$${partsTotal.toFixed(2)}`}>
          <ul className="divide-y divide-line">
            {claim.parts.map((p) => (
              <li key={p.id} className="flex justify-between gap-3 py-1.5 text-sm">
                <span className="min-w-0 truncate text-ink-2">
                  {p.name || "(unnamed)"}{" "}
                  {p.partNumber && (
                    <span className="font-mono text-xs text-muted">
                      #{p.partNumber}
                    </span>
                  )}
                </span>
                <span className="tabnum shrink-0 font-mono font-medium text-ink">
                  {p.qty}×${p.unitCost.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="Description of work">
        <p className="whitespace-pre-wrap text-sm text-ink-2">
          {claim.workDescription || "—"}
        </p>
      </Card>

      {claim.photos.length > 0 && (
        <Card title="Photos" meta={String(claim.photos.length)}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {claim.photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.dataUrl}
                alt={photo.name}
                className="h-20 w-full rounded-md border border-line object-cover"
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-3 py-2.5">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <p className="tabnum mt-0.5 font-mono text-lg font-medium leading-none text-ink">
        {value}
      </p>
    </div>
  );
}
