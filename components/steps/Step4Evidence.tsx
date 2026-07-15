"use client";

import { useRef, useState } from "react";
import type { ClaimData, EvidencePhoto } from "@/lib/types";
import { fileToCompressedDataUrl } from "@/lib/image";

function newId(): string {
  return `photo-${Math.random().toString(36).slice(2, 10)}`;
}

export function Step4Evidence({
  claim,
  patch,
}: {
  claim: ClaimData;
  patch: (partial: Partial<ClaimData>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    setError(null);

    const added: EvidencePhoto[] = [];
    for (const file of Array.from(fileList)) {
      try {
        const dataUrl = await fileToCompressedDataUrl(file);
        added.push({ id: newId(), name: file.name, dataUrl });
      } catch (err) {
        setError((err as Error).message);
      }
    }

    if (added.length > 0) {
      patch({ photos: [...claim.photos, ...added] });
    }
    setBusy(false);
    // Reset so selecting the same file again still fires onChange.
    if (inputRef.current) inputRef.current.value = "";
  };

  const removePhoto = (id: string) =>
    patch({ photos: claim.photos.filter((p) => p.id !== id) });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Evidence</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add photos of the failure and repair. They&apos;re processed on your
          device and embedded straight into the PDF — never uploaded anywhere.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center transition hover:border-brand hover:bg-slate-50 disabled:opacity-60"
      >
        <span className="text-3xl">📷</span>
        <span className="font-semibold text-slate-700">
          {busy ? "Processing…" : "Tap to add photos"}
        </span>
        <span className="text-xs text-slate-500">
          Take a photo or choose from your library
        </span>
      </button>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {claim.photos.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-slate-600">
            {claim.photos.length} photo{claim.photos.length > 1 ? "s" : ""} attached
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {claim.photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.dataUrl}
                  alt={photo.name}
                  className="h-32 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-sm text-white opacity-100 transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label={`Remove ${photo.name}`}
                >
                  ✕
                </button>
                <p className="truncate px-2 py-1 text-[11px] text-slate-500">
                  {photo.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
