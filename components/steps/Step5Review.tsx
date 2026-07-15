"use client";

import type { ClaimData } from "@/lib/types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-0.5 text-sm">
      <span className="w-28 shrink-0 font-medium text-slate-500">{label}</span>
      <span className="text-slate-800">{value || "—"}</span>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-brand">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Step5Review({ claim }: { claim: ClaimData }) {
  const totalHours = claim.labor.reduce((s, l) => s + l.hours, 0);
  const partsTotal = claim.parts.reduce(
    (s, p) => s + p.qty * p.unitCost,
    0
  );
  const vehicle = [claim.year, claim.make, claim.model]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Review your packet</h2>
        <p className="mt-1 text-sm text-slate-500">
          This is exactly what goes into the PDF. Jump back to any step to fix
          something.
        </p>
      </div>

      <div className="rounded-lg bg-brand px-4 py-3 text-white">
        <p className="text-xs uppercase tracking-wide text-blue-200">
          Warranty claim to
        </p>
        <p className="text-lg font-bold">{claim.manufacturer || "—"}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card title="Submitted by">
          <Field label="Business" value={claim.filer.businessName} />
          <Field label="Technician" value={claim.filer.technicianName} />
          <Field label="Phone" value={claim.filer.phone} />
          <Field label="Email" value={claim.filer.email} />
        </Card>
        <Card title="Unit & customer">
          <Field label="VIN" value={claim.vin} />
          <Field label="Vehicle" value={vehicle} />
          <Field label="Customer" value={claim.customerName} />
          <Field label="Service date" value={claim.serviceDate} />
        </Card>
      </div>

      <Card title={`Labor — ${totalHours.toFixed(2)} hrs`}>
        {claim.labor.length === 0 ? (
          <p className="text-sm text-slate-400">No labor lines.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {claim.labor.map((l, i) => (
              <li key={i} className="flex justify-between gap-3 py-1.5 text-sm">
                <span className="min-w-0">
                  <span className="text-slate-800">{l.description}</span>{" "}
                  <span className="text-slate-400">
                    ({l.custom ? "custom" : l.code})
                  </span>
                </span>
                <span className="shrink-0 font-medium text-slate-600">
                  {l.hours.toFixed(2)}h
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {claim.parts.length > 0 && (
        <Card title={`Parts — $${partsTotal.toFixed(2)}`}>
          <ul className="divide-y divide-slate-100">
            {claim.parts.map((p) => (
              <li key={p.id} className="flex justify-between gap-3 py-1.5 text-sm">
                <span className="min-w-0 truncate text-slate-800">
                  {p.name || "(unnamed)"}{" "}
                  {p.partNumber && (
                    <span className="text-slate-400">#{p.partNumber}</span>
                  )}
                </span>
                <span className="shrink-0 font-medium text-slate-600">
                  {p.qty} × ${p.unitCost.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="Description of work">
        <p className="whitespace-pre-wrap text-sm text-slate-800">
          {claim.workDescription || "—"}
        </p>
      </Card>

      {claim.photos.length > 0 && (
        <Card title={`Photos — ${claim.photos.length}`}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {claim.photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.dataUrl}
                alt={photo.name}
                className="h-20 w-full rounded object-cover"
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
