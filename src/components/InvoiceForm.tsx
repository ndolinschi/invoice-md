"use client";

import React, { useCallback } from "react";
import { Invoice, LineItem, Party } from "@/types/invoice";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { formatCurrencyMDL } from "@/lib/i18n";

interface InvoiceFormProps {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
}

function PartySection({
  party,
  onChange,
  title,
}: {
  party: Party;
  onChange: (p: Party) => void;
  title: string;
}) {
  const { t } = useApp();
  const field = (
    label: string,
    key: keyof Party,
    opts?: { type?: string; full?: boolean }
  ) => (
    <div className={opts?.full ? "col-span-2" : ""}>
      <Label className="mb-1 block text-xs">{label}</Label>
      <Input
        type={opts?.type ?? "text"}
        value={party[key] ?? ""}
        onChange={(e) => onChange({ ...party, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {field(t("companyName"), "name", { full: true })}
        {field(t("idno"), "idno")}
        {field(t("vatCode"), "vatCode")}
        {field(t("address"), "address", { full: true })}
        {field(t("phone"), "phone")}
        {field(t("email"), "email")}
        {field(t("bankName"), "bankName", { full: true })}
        {field(t("bankIban"), "bankIban")}
        {field(t("bankBic"), "bankBic")}
      </CardContent>
    </Card>
  );
}

function calcItemAmount(item: LineItem): number {
  return Math.round(item.quantity * item.rate * 100) / 100;
}

export function InvoiceForm({ invoice, onChange }: InvoiceFormProps) {
  const { t, language } = useApp();

  const updateField = useCallback(
    <K extends keyof Invoice>(key: K, value: Invoice[K]) => {
      onChange({ ...invoice, [key]: value });
    },
    [invoice, onChange]
  );

  const updateSeller = useCallback(
    (seller: Party) => {
      const updated = { ...invoice, seller };
      recalcTotals(updated);
      onChange(updated);
    },
    [invoice, onChange]
  );

  const updateBuyer = useCallback(
    (buyer: Party) => {
      onChange({ ...invoice, buyer });
    },
    [invoice, onChange]
  );

  const recalcTotals = (inv: Invoice) => {
    const subtotal = inv.items.reduce((s, i) => s + i.amount, 0);
    inv.subtotal = Math.round(subtotal * 100) / 100;
    inv.vatAmount =
      Math.round((inv.subtotal * inv.vatRate) / 100 * 100) / 100;
    inv.total = Math.round((inv.subtotal + inv.vatAmount) * 100) / 100;
  };

  const updateItem = useCallback(
    (index: number, field: keyof LineItem, value: string | number) => {
      const items = [...invoice.items];
      const item = { ...items[index] };
      if (field === "quantity" || field === "rate") {
        item[field] = Number(value);
        item.amount = calcItemAmount(item);
      } else if (field === "description" || field === "unit" || field === "id") {
        item[field] = value as string;
      }
      items[index] = item;
      const updated = { ...invoice, items };
      recalcTotals(updated);
      onChange(updated);
    },
    [invoice, onChange]
  );

  const addItem = useCallback(() => {
    const newItem: LineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: "",
      unit: t("unitServices"),
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    onChange({ ...invoice, items: [...invoice.items, newItem] });
  }, [invoice, onChange, t]);

  const removeItem = useCallback(
    (index: number) => {
      const items = invoice.items.filter((_, i) => i !== index);
      const updated = { ...invoice, items };
      recalcTotals(updated);
      onChange(updated);
    },
    [invoice, onChange]
  );

  const units = [
    { value: t("unitHours"), label: t("unitHours") },
    { value: t("unitServices"), label: t("unitServices") },
    { value: t("unitPieces"), label: t("unitPieces") },
    { value: t("unitMonths"), label: t("unitMonths") },
    { value: t("unitDays"), label: t("unitDays") },
  ];

  return (
    <div className="space-y-6">
      {/* Meta */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base">
            {t("invoiceTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div>
            <Label className="mb-1 block text-xs">{t("invoiceNumber")}</Label>
            <Input
              value={invoice.number}
              onChange={(e) => updateField("number", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("invoiceSeries")}</Label>
            <Input
              value={invoice.series ?? ""}
              onChange={(e) => updateField("series", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("issueDate")}</Label>
            <Input
              type="date"
              value={invoice.issueDate}
              onChange={(e) => updateField("issueDate", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("dueDate")}</Label>
            <Input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("status")}</Label>
            <Select
              value={invoice.status}
              onValueChange={(v) =>
                updateField("status", v as Invoice["status"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{t("draft")}</SelectItem>
                <SelectItem value="sent">{t("sent")}</SelectItem>
                <SelectItem value="paid">{t("paid")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parties */}
      <div className="grid gap-6 md:grid-cols-2">
        <PartySection
          party={invoice.seller}
          onChange={updateSeller}
          title={t("sellerTitle")}
        />
        <PartySection
          party={invoice.buyer}
          onChange={updateBuyer}
          title={t("buyerTitle")}
        />
      </div>

      {/* Line Items */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-base">
              {t("itemsTableTitle")}
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={addItem}
              className="gap-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              {t("addItem")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Header */}
            <div className="hidden grid-cols-[2.5rem_1fr_5rem_5rem_6rem_7rem_2.5rem] gap-2 border-b pb-2 text-xs font-medium text-muted-foreground md:grid">
              <span>{t("itemNr")}</span>
              <span>{t("itemDescription")}</span>
              <span>{t("itemUnit")}</span>
              <span>{t("itemQuantity")}</span>
              <span>{t("itemRate")}</span>
              <span className="text-right">{t("itemAmount")}</span>
              <span />
            </div>

            {invoice.items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 gap-2 border-b pb-3 md:grid-cols-[2.5rem_1fr_5rem_5rem_6rem_7rem_2.5rem] md:items-center"
              >
                <span className="hidden text-sm text-muted-foreground md:block">
                  {index + 1}
                </span>
                <Input
                  placeholder={t("itemDescription")}
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                />
                <Select
                  value={item.unit}
                  onValueChange={(v) => updateItem(index, "unit", v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateItem(index, "rate", e.target.value)}
                />
                <div className="text-right text-sm font-medium">
                  {formatCurrencyMDL(item.amount)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {invoice.items.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t("noInvoices")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="flex justify-end p-6">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t("subtotal")}</span>
              <span className="font-medium">
                {formatCurrencyMDL(invoice.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>{t("vatRate")}</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  className="h-8 w-20 text-right"
                  value={invoice.vatRate}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    updateField("vatRate", v);
                    const updated = { ...invoice, vatRate: v };
                    recalcTotals(updated);
                    onChange(updated);
                  }}
                />
                <span className="text-sm">%</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t("vatAmount")}</span>
              <span className="font-medium">
                {formatCurrencyMDL(invoice.vatAmount)}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold font-serif text-lg">
                <span>{t("grandTotal")}</span>
                <span>{formatCurrencyMDL(invoice.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label className="mb-1 block text-sm font-medium">{t("notes")}</Label>
          <Textarea
            rows={4}
            placeholder={t("notesPlaceholder")}
            value={invoice.notes ?? ""}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1 block text-sm font-medium">
            {t("paymentTerms")}
          </Label>
          <Textarea
            rows={4}
            placeholder={t("paymentTermsPlaceholder")}
            value={invoice.paymentTerms ?? ""}
            onChange={(e) => updateField("paymentTerms", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
