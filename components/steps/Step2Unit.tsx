"use client";

import type { ClaimData, FilerInfo } from "@/lib/types";

export function Step2Unit({
  claim,
  patch,
}: {
  claim: ClaimData;
  patch: (partial: Partial<ClaimData>) => void;
}) {
  const setFiler = (partial: Partial<FilerInfo>) =>
    patch({ filer: { ...claim.filer, ...partial } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink">Unit &amp; customer</h2>
        <p className="mt-1 text-sm text-muted">
          Details of the RV being serviced and who owns it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="vin" className="field-label">
            VIN
          </label>
          <input
            id="vin"
            className="field-input font-mono uppercase tracking-wide"
            placeholder="17-character VIN"
            value={claim.vin}
            onChange={(e) => patch({ vin: e.target.value.toUpperCase() })}
            autoCapitalize="characters"
          />
        </div>
        <div>
          <label htmlFor="year" className="field-label">
            Year
          </label>
          <input
            id="year"
            className="field-input field-mono"
            inputMode="numeric"
            placeholder="2024"
            value={claim.year}
            onChange={(e) => patch({ year: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="make" className="field-label">
            Make
          </label>
          <input
            id="make"
            className="field-input"
            placeholder="Jayco"
            value={claim.make}
            onChange={(e) => patch({ make: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="model" className="field-label">
            Model
          </label>
          <input
            id="model"
            className="field-input"
            placeholder="Eagle 334DROK"
            value={claim.model}
            onChange={(e) => patch({ model: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="customerName" className="field-label">
            Customer name
          </label>
          <input
            id="customerName"
            className="field-input"
            placeholder="Owner's full name"
            value={claim.customerName}
            onChange={(e) => patch({ customerName: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="serviceDate" className="field-label">
            Service date
          </label>
          <input
            id="serviceDate"
            type="date"
            className="field-input"
            value={claim.serviceDate}
            onChange={(e) => patch({ serviceDate: e.target.value })}
          />
        </div>
      </div>

      <div className="rounded-lg border border-line bg-surface-2 p-4">
        <h3 className="text-sm font-bold text-ink-2">
          Who is this claim from?
        </h3>
        <p className="mb-4 mt-0.5 text-xs text-muted">
          Your shop&apos;s info. We&apos;ll remember this on this device for next
          time — it never leaves your browser.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="businessName" className="field-label">
              Business name
            </label>
            <input
              id="businessName"
              className="field-input"
              placeholder="Your shop"
              value={claim.filer.businessName}
              onChange={(e) => setFiler({ businessName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="technicianName" className="field-label">
              Technician name
            </label>
            <input
              id="technicianName"
              className="field-input"
              placeholder="Your name"
              value={claim.filer.technicianName}
              onChange={(e) => setFiler({ technicianName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="phone" className="field-label">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              className="field-input field-mono"
              inputMode="tel"
              placeholder="(555) 123-4567"
              value={claim.filer.phone}
              onChange={(e) => setFiler({ phone: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="field-input"
              inputMode="email"
              placeholder="shop@example.com"
              value={claim.filer.email}
              onChange={(e) => setFiler({ email: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
