import { Invoice, Language } from "@/types/invoice";
import { translations } from "@/lib/i18n";

let jsPDFClass: any = null;

async function loadJsPDF() {
  if (!jsPDFClass) {
    const mod = await import("jspdf");
    jsPDFClass = mod.default;
  }
  return jsPDFClass;
}

function t(lang: Language, key: string): string {
  const dict = translations[lang] as Record<string, string>;
  return dict?.[key] ?? (translations.ro as Record<string, string>)?.[key] ?? key;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("ro-MD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_L = 18;
const MARGIN_R = 18;
const MARGIN_T = 20;
const MARGIN_B = 20;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;

export async function exportInvoicePdf(
  invoice: Invoice,
  lang: Language = "ro"
): Promise<void> {
  const jsPDF = await loadJsPDF();
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const FONT_SANS = "helvetica";
  const FONT_SERIF = "times";

  let y = MARGIN_T;

  const setFont = (family: string, style: string = "normal", size: number = 10) => {
    doc.setFont(family, style);
    doc.setFontSize(size);
  };

  const checkPageBreak = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN_B) {
      doc.addPage();
      y = MARGIN_T;
    }
  };

  // HEADER
  setFont(FONT_SERIF, "bold", 18);
  doc.setTextColor(30, 41, 59);
  doc.text(t(lang, "invoiceTitle"), PAGE_W / 2, y + 2, { align: "center" });
  y += 10;

  setFont(FONT_SANS, "normal", 10);
  doc.setTextColor(100, 100, 100);
  doc.text(t(lang, "invoiceNumber") + ": " + invoice.number, MARGIN_L, y);
  doc.text(t(lang, "invoiceSeries") + ": " + (invoice.series || "-"), PAGE_W / 2, y, { align: "center" });
  doc.text(t(lang, "issueDate") + ": " + invoice.issueDate, PAGE_W - MARGIN_R, y, { align: "right" });
  y += 5;
  doc.text(t(lang, "dueDate") + ": " + invoice.dueDate, MARGIN_L, y);
  y += 8;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
  y += 6;

  // PARTIES
  const colW = CONTENT_W / 2 - 4;
  const drawParty = (title: string, party: Invoice["seller"], x: number) => {
    setFont(FONT_SANS, "bold", 8);
    doc.setTextColor(100, 100, 100);
    doc.text(title, x, y);
    let py = y + 4;

    setFont(FONT_SANS, "normal", 9);
    doc.setTextColor(30, 41, 59);
    doc.text(party.name || "-", x, py);
    py += 4;
    if (party.idno) {
      doc.text(t(lang, "idno") + ": " + party.idno, x, py);
      py += 4;
    }
    if (party.vatCode) {
      doc.text(t(lang, "vatCode") + ": " + party.vatCode, x, py);
      py += 4;
    }
    const addrLines = doc.splitTextToSize(party.address || "-", colW);
    doc.text(addrLines, x, py);
    py += addrLines.length * 3.5;
    if (party.phone) {
      doc.text(t(lang, "phone") + ": " + party.phone, x, py);
      py += 3.5;
    }
    if (party.email) {
      doc.text(t(lang, "email") + ": " + party.email, x, py);
      py += 3.5;
    }
    setFont(FONT_SANS, "normal", 8);
    doc.setTextColor(80, 80, 80);
    if (party.bankName) {
      doc.text(t(lang, "bankName") + ": " + party.bankName, x, py);
      py += 3.5;
    }
    if (party.bankIban) {
      doc.text(t(lang, "bankIban") + ": " + party.bankIban, x, py);
      py += 3.5;
    }
    if (party.bankBic) {
      doc.text(t(lang, "bankBic") + ": " + party.bankBic, x, py);
      py += 3.5;
    }
    return py;
  };

  const leftEnd = drawParty(t(lang, "sellerTitle"), invoice.seller, MARGIN_L);
  const rightEnd = drawParty(t(lang, "buyerTitle"), invoice.buyer, MARGIN_L + colW + 8);
  y = Math.max(leftEnd, rightEnd) + 6;

  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
  y += 6;

  // LINE ITEMS TABLE
  setFont(FONT_SANS, "bold", 8);
  doc.setTextColor(100, 100, 100);
  doc.text(t(lang, "itemsTableTitle"), MARGIN_L, y);
  y += 5;

  const cols = [
    { label: t(lang, "itemNr"), w: 10, align: "center" as const },
    { label: t(lang, "itemDescription"), w: 72, align: "left" as const },
    { label: t(lang, "itemUnit"), w: 14, align: "center" as const },
    { label: t(lang, "itemQuantity"), w: 16, align: "right" as const },
    { label: t(lang, "itemRate"), w: 28, align: "right" as const },
    { label: t(lang, "itemAmount"), w: 30, align: "right" as const },
  ];

  // Header row background
  doc.setFillColor(241, 245, 249);
  doc.rect(MARGIN_L, y - 4, CONTENT_W, 7, "F");

  setFont(FONT_SANS, "bold", 7);
  doc.setTextColor(71, 85, 105);
  let x = MARGIN_L;
  cols.forEach((col) => {
    const tx = col.align === "right" ? x + col.w - 1 : col.align === "center" ? x + col.w / 2 : x + 1;
    doc.text(col.label, tx, y, { align: col.align });
    x += col.w;
  });
  y += 5;

  // Separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
  y += 2;

  // Data rows
  setFont(FONT_SANS, "normal", 8);
  doc.setTextColor(30, 41, 59);
  invoice.items.forEach((item, idx) => {
    checkPageBreak(12);
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(MARGIN_L, y - 3, CONTENT_W, 6, "F");
    }
    x = MARGIN_L;
    const rowData = [
      String(idx + 1),
      item.description,
      item.unit,
      String(item.quantity),
      fmt(item.rate),
      fmt(item.amount),
    ];
    rowData.forEach((val, ci) => {
      const col = cols[ci];
      const tx = col.align === "right" ? x + col.w - 1 : col.align === "center" ? x + col.w / 2 : x + 1;
      if (ci === 1) {
        const lines = doc.splitTextToSize(val, col.w - 2);
        doc.text(lines.slice(0, 2), tx, y);
      } else {
        doc.text(val, tx, y, { align: col.align });
      }
      x += col.w;
    });
    y += 6;
  });

  // Bottom line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
  y += 6;

  // TOTALS
  checkPageBreak(40);
  const totalsX = PAGE_W - MARGIN_R - 70;

  const drawTotalLine = (label: string, value: string, bold: boolean = false) => {
    setFont(FONT_SANS, bold ? "bold" : "normal", bold ? 10 : 9);
    doc.setTextColor(30, 41, 59);
    doc.text(label, totalsX, y, { align: "left" });
    doc.text(value, PAGE_W - MARGIN_R, y, { align: "right" });
    y += bold ? 6 : 5;
  };

  drawTotalLine(t(lang, "subtotal"), fmt(invoice.subtotal));
  drawTotalLine(t(lang, "vatRate") + " " + invoice.vatRate + "%", fmt(invoice.vatAmount));

  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.4);
  doc.line(totalsX, y - 2, PAGE_W - MARGIN_R, y - 2);

  setFont(FONT_SERIF, "bold", 12);
  doc.setTextColor(30, 41, 59);
  doc.text(t(lang, "grandTotal"), totalsX, y + 2, { align: "left" });
  doc.text(fmt(invoice.total) + " MDL", PAGE_W - MARGIN_R, y + 2, { align: "right" });
  y += 10;

  // NOTES & TERMS
  if (invoice.paymentTerms || invoice.notes) {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
    y += 5;

    if (invoice.paymentTerms) {
      setFont(FONT_SANS, "bold", 8);
      doc.setTextColor(100, 100, 100);
      doc.text(t(lang, "paymentTerms"), MARGIN_L, y);
      y += 4;
      setFont(FONT_SANS, "normal", 8);
      doc.setTextColor(30, 41, 59);
      const termLines = doc.splitTextToSize(invoice.paymentTerms, CONTENT_W);
      doc.text(termLines, MARGIN_L, y);
      y += termLines.length * 3.5 + 3;
    }

    if (invoice.notes) {
      setFont(FONT_SANS, "bold", 8);
      doc.setTextColor(100, 100, 100);
      doc.text(t(lang, "notes"), MARGIN_L, y);
      y += 4;
      setFont(FONT_SANS, "normal", 8);
      doc.setTextColor(30, 41, 59);
      const noteLines = doc.splitTextToSize(invoice.notes, CONTENT_W);
      doc.text(noteLines, MARGIN_L, y);
      y += noteLines.length * 3.5 + 3;
    }
  }

  // SIGNATURES
  checkPageBreak(30);
  y += 8;
  setFont(FONT_SANS, "normal", 8);
  doc.setTextColor(30, 41, 59);
  doc.text(t(lang, "sellerSignature"), MARGIN_L, y);
  doc.text(t(lang, "buyerSignature"), PAGE_W - MARGIN_R, y, { align: "right" });
  y += 6;
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_L, y, MARGIN_L + 50, y);
  doc.line(PAGE_W - MARGIN_R - 50, y, PAGE_W - MARGIN_R, y);
  y += 5;
  setFont(FONT_SANS, "normal", 7);
  doc.setTextColor(100, 100, 100);
  doc.text(t(lang, "stampPlace"), MARGIN_L, y);
  doc.text(t(lang, "stampPlace"), PAGE_W - MARGIN_R, y, { align: "right" });

  // Footer
  setFont(FONT_SANS, "normal", 7);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Generated by Invoice MD — " + new Date().toLocaleDateString(),
    PAGE_W / 2,
    PAGE_H - 10,
    { align: "center" }
  );

  doc.save(invoice.number + ".pdf");
}
