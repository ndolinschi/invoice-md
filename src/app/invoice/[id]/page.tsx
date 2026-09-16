"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  getStoredInvoiceById,
  saveStoredInvoice,
  DEFAULT_SETTINGS,
} from "@/lib/storage";
import { Invoice, Party } from "@/types/invoice";
import { InvoiceForm } from "@/components/InvoiceForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Trash2,
  Download,
  Loader2,
} from "lucide-react";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function futureDateStr(days = 14) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const { t, settings, language, addOrUpdateInvoice, removeInvoice } = useApp();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      const number = searchParams.get("number") ?? "";
      const seq = Number(searchParams.get("seq") ?? "1");
      const defaultParty: Party = { ...DEFAULT_SETTINGS.sellerDefaults };
      const now = new Date().toISOString();
      const newInvoice: Invoice = {
        id,
        number,
        series: settings.invoicePrefix.replace(/\d/g, "").replace(/-$/, "") || "MD",
        sequenceNumber: seq,
        issueDate: todayStr(),
        dueDate: futureDateStr(),
        status: "draft",
        seller: defaultParty,
        buyer: {
          name: "",
          idno: "",
          vatCode: "",
          address: "",
          phone: "",
          email: "",
          bankName: "",
          bankIban: "",
          bankBic: "",
        },
        items: [],
        subtotal: 0,
        vatRate: settings.defaultVatRate,
        vatAmount: 0,
        total: 0,
        currency: "MDL",
        notes: settings.defaultNotes[language] ?? "",
        paymentTerms: settings.defaultPaymentTerms[language] ?? "",
        createdAt: now,
        updatedAt: now,
      };
      setInvoice(newInvoice);
      // Remove query params so refresh doesn't recreate
      router.replace(`/invoice/${id}`, { scroll: false });
    } else {
      const existing = getStoredInvoiceById(id);
      if (existing) {
        setInvoice(existing);
      }
    }
  }, [id, searchParams, router, settings, language]);

  const handleSave = useCallback(() => {
    if (!invoice) return;
    setSaving(true);
    addOrUpdateInvoice(invoice);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 300);
  }, [invoice, addOrUpdateInvoice]);

  const handleDelete = useCallback(() => {
    if (!invoice) return;
    if (window.confirm(t("confirmDelete"))) {
      removeInvoice(invoice.id);
      router.push("/");
    }
  }, [invoice, removeInvoice, router, t]);

  const handlePdf = useCallback(async () => {
    if (!invoice) return;
    setPdfLoading(true);
    try {
      const { exportInvoicePdf } = await import("@/lib/pdf");
      await exportInvoicePdf(invoice, language);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setPdfLoading(false);
    }
  }, [invoice, language]);

  if (!invoice) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="no-print sticky top-16 z-30 flex flex-wrap items-center gap-2 border-b bg-background/95 py-3 backdrop-blur">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToList")}
        </Button>

        <Badge
          variant={
            invoice.status === "paid"
              ? "paid"
              : invoice.status === "sent"
              ? "sent"
              : "draft"
          }
          className="ml-1"
        >
          {t(invoice.status)}
        </Badge>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={handlePdf}
          disabled={pdfLoading}
          className="gap-1"
        >
          {pdfLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {pdfLoading ? t("generatingPdf") : t("exportPdf")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="gap-1 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          {t("delete")}
        </Button>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className="gap-1"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? t("saved") : t("save")}
        </Button>
      </div>

      {/* Form */}
      <InvoiceForm invoice={invoice} onChange={setInvoice} />
    </div>
  );
}
