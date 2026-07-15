// Shared data shapes for the claim packet. Kept deliberately small and readable
// so it's easy to extend later.

/** One entry from the seedable flat-rate labor chart (data/labor-codes.json). */
export interface LaborCode {
  /** Manufacturer/flat-rate code, e.g. "SLD-100". */
  code: string;
  /** Human-readable operation description. */
  description: string;
  /** Flat-rate hours the manufacturer allows for this operation. */
  hours: number;
  /**
   * Optional tag so a code can be filtered by manufacturer/supplier later.
   * Omit to make a code apply to everyone.
   */
  manufacturer?: string;
}

/** A single labor line on the claim (either from the chart or a custom entry). */
export interface LaborLine {
  code: string;
  description: string;
  hours: number;
  /** true when the tech typed this in by hand instead of picking from the chart. */
  custom: boolean;
}

/** A repeatable parts row. */
export interface PartRow {
  id: string;
  name: string;
  partNumber: string;
  qty: number;
  unitCost: number;
}

/** A photo the user attached, held only in memory as a data URL. */
export interface EvidencePhoto {
  id: string;
  /** Original file name, shown as a caption in the PDF. */
  name: string;
  /** JPEG data URL (already downscaled/compressed client-side). */
  dataUrl: string;
}

/** The pieces of the form we're willing to remember between sessions. */
export interface FilerInfo {
  businessName: string;
  technicianName: string;
  phone: string;
  email: string;
}

/** The full claim as captured by the form. */
export interface ClaimData {
  // Step 1
  manufacturer: string;

  // Step 2 — unit & customer
  vin: string;
  year: string;
  make: string;
  model: string;
  customerName: string;
  serviceDate: string;

  // Step 2 — filer
  filer: FilerInfo;

  // Step 3 — work
  labor: LaborLine[];
  parts: PartRow[];
  workDescription: string;

  // Step 4 — evidence
  photos: EvidencePhoto[];
}

export const MANUFACTURERS: string[] = [
  "Thor Industries",
  "Forest River",
  "Jayco",
  "Grand Design",
  "Lippert",
  "Dometic",
];

export function emptyClaim(): ClaimData {
  return {
    manufacturer: "",
    vin: "",
    year: "",
    make: "",
    model: "",
    customerName: "",
    serviceDate: "",
    filer: {
      businessName: "",
      technicianName: "",
      phone: "",
      email: "",
    },
    labor: [],
    parts: [],
    workDescription: "",
    photos: [],
  };
}
