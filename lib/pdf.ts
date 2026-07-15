import type { ClaimData } from "@/lib/types";
import type { DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";

/** Build a filesystem-safe file name for the downloaded packet. */
export function claimFileName(claim: ClaimData): string {
  const parts = [
    claim.manufacturer || "RV",
    "Warranty-Claim",
    claim.vin ? claim.vin.slice(-6) : claim.customerName || "",
  ]
    .filter(Boolean)
    .join("_");

  const safe = parts.replace(/[^a-z0-9_\-]+/gi, "-").replace(/-+/g, "-");
  return `${safe || "RV-Warranty-Claim"}.pdf`;
}

/**
 * Render the claim to a PDF Blob and trigger a browser download.
 *
 * @react-pdf/renderer and the PDF component are imported lazily here so the
 * (fairly large, browser-oriented) renderer never gets pulled into server-side
 * rendering — it only loads in the browser when the user actually generates.
 * Runs fully client-side; the Blob never leaves the machine.
 */
export async function generateAndDownloadPdf(claim: ClaimData): Promise<void> {
  const { pdf } = await import("@react-pdf/renderer");
  const { createElement } = await import("react");
  const { ClaimPdf } = await import("@/components/ClaimPdf");

  // ClaimPdf renders a <Document>; react-pdf types the entry point as a
  // Document element, so present it as one.
  const element = createElement(ClaimPdf, { claim }) as ReactElement<
    DocumentProps
  >;
  const blob = await pdf(element).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = claimFileName(claim);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
