import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ClaimData } from "@/lib/types";

// A restrained, document-like palette — this needs to read as paperwork a
// warranty department would trust, not a marketing page.
const COLORS = {
  ink: "#0f172a",
  muted: "#475569",
  faint: "#94a3b8",
  line: "#cbd5e1",
  headerBg: "#1e3a5f",
  zebra: "#f1f5f9",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 10,
    color: COLORS.ink,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },

  header: {
    backgroundColor: COLORS.headerBg,
    color: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  headerTitle: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  headerSub: { fontSize: 10, marginTop: 2, color: "#dbeafe" },

  twoCol: { flexDirection: "row", gap: 12, marginBottom: 14 },
  block: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 4,
    padding: 10,
  },
  blockTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.headerBg,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  row: { flexDirection: "row", marginBottom: 2 },
  label: { width: 78, color: COLORS.muted, fontFamily: "Helvetica-Bold" },
  value: { flex: 1 },

  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLORS.headerBg,
    marginBottom: 6,
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    paddingBottom: 3,
  },
  section: { marginBottom: 14 },

  table: { borderWidth: 1, borderColor: COLORS.line, borderRadius: 3 },
  tHead: {
    flexDirection: "row",
    backgroundColor: COLORS.headerBg,
  },
  th: {
    color: "#ffffff",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  td: { paddingVertical: 5, paddingHorizontal: 6, fontSize: 9 },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    backgroundColor: COLORS.zebra,
  },

  notesBox: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 3,
    padding: 10,
    minHeight: 48,
  },

  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoItem: { width: "47%" },
  photo: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 3,
  },
  photoCaption: {
    fontSize: 8,
    color: COLORS.faint,
    marginTop: 3,
  },

  signRow: { flexDirection: "row", gap: 30, marginTop: 30 },
  signCol: { flex: 1 },
  signLine: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ink,
    height: 26,
  },
  signLabel: { fontSize: 8, color: COLORS.muted, marginTop: 3 },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.faint,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingTop: 6,
  },
});

function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "—"}</Text>
    </View>
  );
}

export function ClaimPdf({ claim }: { claim: ClaimData }) {
  const totalHours = claim.labor.reduce((sum, l) => sum + (l.hours || 0), 0);
  const partsTotal = claim.parts.reduce(
    (sum, p) => sum + (p.qty || 0) * (p.unitCost || 0),
    0
  );

  const vehicle = [claim.year, claim.make, claim.model]
    .filter(Boolean)
    .join(" ");

  return (
    <Document
      title={`Warranty Claim — ${claim.manufacturer || "RV"}`}
      author={claim.filer.businessName || "RV Service"}
    >
      <Page size="LETTER" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {claim.manufacturer || "RV Manufacturer"} — Warranty Claim
          </Text>
          <Text style={styles.headerSub}>
            Prepared {new Date().toLocaleDateString("en-US")} · Submitted by{" "}
            {claim.filer.businessName || "service provider"}
          </Text>
        </View>

        {/* Filer + Unit/Customer blocks */}
        <View style={styles.twoCol}>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Submitted By</Text>
            <InfoRow label="Business" value={claim.filer.businessName} />
            <InfoRow label="Technician" value={claim.filer.technicianName} />
            <InfoRow label="Phone" value={claim.filer.phone} />
            <InfoRow label="Email" value={claim.filer.email} />
          </View>
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Unit &amp; Customer</Text>
            <InfoRow label="VIN" value={claim.vin} />
            <InfoRow label="Vehicle" value={vehicle} />
            <InfoRow label="Customer" value={claim.customerName} />
            <InfoRow label="Service Date" value={claim.serviceDate} />
          </View>
        </View>

        {/* Labor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labor Performed</Text>
          {claim.labor.length === 0 ? (
            <Text style={{ color: COLORS.faint }}>No labor lines entered.</Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tHead}>
                <Text style={[styles.th, { width: 90 }]}>Code</Text>
                <Text style={[styles.th, { flex: 1 }]}>Operation</Text>
                <Text style={[styles.th, { width: 60, textAlign: "right" }]}>
                  Hours
                </Text>
              </View>
              {claim.labor.map((l, i) => (
                <View
                  key={i}
                  style={[
                    styles.tRow,
                    i % 2 === 1 ? { backgroundColor: COLORS.zebra } : {},
                  ]}
                >
                  <Text style={[styles.td, { width: 90 }]}>
                    {l.custom ? "CUSTOM" : l.code || "—"}
                  </Text>
                  <Text style={[styles.td, { flex: 1 }]}>{l.description}</Text>
                  <Text style={[styles.td, { width: 60, textAlign: "right" }]}>
                    {l.hours.toFixed(2)}
                  </Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text
                  style={[
                    styles.td,
                    { flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  Total Hours
                </Text>
                <Text
                  style={[
                    styles.td,
                    {
                      width: 60,
                      textAlign: "right",
                      fontFamily: "Helvetica-Bold",
                    },
                  ]}
                >
                  {totalHours.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Parts */}
        {claim.parts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parts Used</Text>
            <View style={styles.table}>
              <View style={styles.tHead}>
                <Text style={[styles.th, { flex: 1 }]}>Part</Text>
                <Text style={[styles.th, { width: 90 }]}>Part #</Text>
                <Text style={[styles.th, { width: 34, textAlign: "right" }]}>
                  Qty
                </Text>
                <Text style={[styles.th, { width: 64, textAlign: "right" }]}>
                  Unit
                </Text>
                <Text style={[styles.th, { width: 70, textAlign: "right" }]}>
                  Line
                </Text>
              </View>
              {claim.parts.map((p, i) => (
                <View
                  key={p.id}
                  style={[
                    styles.tRow,
                    i % 2 === 1 ? { backgroundColor: COLORS.zebra } : {},
                  ]}
                >
                  <Text style={[styles.td, { flex: 1 }]}>{p.name}</Text>
                  <Text style={[styles.td, { width: 90 }]}>
                    {p.partNumber || "—"}
                  </Text>
                  <Text style={[styles.td, { width: 34, textAlign: "right" }]}>
                    {p.qty}
                  </Text>
                  <Text style={[styles.td, { width: 64, textAlign: "right" }]}>
                    {money(p.unitCost)}
                  </Text>
                  <Text style={[styles.td, { width: 70, textAlign: "right" }]}>
                    {money((p.qty || 0) * (p.unitCost || 0))}
                  </Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text
                  style={[
                    styles.td,
                    { flex: 1, textAlign: "right", fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  Parts Total
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: 70, textAlign: "right", fontFamily: "Helvetica-Bold" },
                  ]}
                >
                  {money(partsTotal)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Description of work */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description of Work</Text>
          <View style={styles.notesBox}>
            <Text>{claim.workDescription || "—"}</Text>
          </View>
        </View>

        {/* Photos */}
        {claim.photos.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.sectionTitle}>Photo Evidence</Text>
            <View style={styles.photoGrid}>
              {claim.photos.map((photo) => (
                <View key={photo.id} style={styles.photoItem} wrap={false}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={photo.dataUrl} style={styles.photo} />
                  <Text style={styles.photoCaption}>{photo.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signRow} wrap={false}>
          <View style={styles.signCol}>
            <View style={styles.signLine} />
            <Text style={styles.signLabel}>
              Authorized Signature (Technician / Service Manager)
            </Text>
          </View>
          <View style={{ width: 130 }}>
            <View style={styles.signLine} />
            <Text style={styles.signLabel}>Date</Text>
          </View>
        </View>

        {/* Footer with page numbers */}
        <View style={styles.footer} fixed>
          <Text>
            {claim.manufacturer || "RV"} Warranty Claim ·{" "}
            {claim.filer.businessName || ""}
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
