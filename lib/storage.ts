import type { FilerInfo } from "@/lib/types";

// We remember ONLY the filer/business block, and ONLY in localStorage on this
// device. It is never transmitted anywhere. Customer data, VINs, and photos are
// intentionally NOT persisted.

const KEY = "rv-claim-filer-v1";

export function loadFiler(): FilerInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FilerInfo>;
    return {
      businessName: parsed.businessName ?? "",
      technicianName: parsed.technicianName ?? "",
      phone: parsed.phone ?? "",
      email: parsed.email ?? "",
    };
  } catch {
    return null;
  }
}

export function saveFiler(filer: FilerInfo): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(filer));
  } catch {
    // Storage can be unavailable (private mode, quota). Non-fatal — just skip.
  }
}

export function clearFiler(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
