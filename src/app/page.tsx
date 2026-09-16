"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { generateNextInvoiceData } from "@/lib/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  FileText,
  Trash2,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatDate, formatCurrencyMDL } from "@/lib/i18n";
import { InvoiceStatus } from "@/types/invoice";

const statusVariant: Record<InvoiceStatus, "draft" | "sent" | "paid"> = {
  draft: "draft",
  sent: "sent",
  paid: "paid",
};

export default function InvoiceListPage() {
  const { invoices, t, settings, language, removeInvoice, isHydrated } =
    useApp();
  const router = useRouter();

  const stats = useMemo(() => {
    const total = invoices.reduce((s, i) => s + i.total, 0);
    const paid = invoices
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + i.total, 0);
    const pending = invoices
      .filter((i) => i.status === "sent")
      .reduce((s, i) => s + i.total, 0);
    const drafts = invoices.filter((i) => i.status === "draft").length;
    return { total, paid, pending, drafts };
  }, [invoices]);

  const handleCreate = () => {
    const data = generateNextInvoiceData(settings);
    const now = new Date().toISOString();
    router.push(
      `/invoice/${data.id}?new=1&number=${encodeURIComponent(data.number)}&seq=${data.sequenceNumber}`
    );
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm(t("confirmDelete"))) {
      removeInvoice(id);
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("totalInvoiced")}
                </p>
                <p className="text-lg font-bold">{formatCurrencyMDL(stats.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("totalPaid")}</p>
                <p className="text-lg font-bold text-emerald-600">
                  {formatCurrencyMDL(stats.pending)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {t("pendingPayment")}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrencyMDL(stats.pending)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-500/10 text-slate-600">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("draftsCount")}</p>
                <p className="text-lg font-bold">
                  {stats.drafts}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    {t("invoicesCount")}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header & Create */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold tracking-tight">
          {t("invoices")}
        </h1>
        <Button onClick={handleCreate} className="gap-1.5 shadow-sm">
          <PlusCircle className="h-4 w-4" />
          {t("newInvoice")}
        </Button>
      </div>

      {/* Empty state */}
      {invoices.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="mb-4 text-lg text-muted-foreground">
              {t("noInvoices")}
            </p>
            <Button onClick={handleCreate} className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              {t("createFirstInvoice")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Invoice list */}
      <div className="space-y-3">
        {invoices.map((inv) => (
          <Card
            key={inv.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => router.push(`/invoice/${inv.id}`)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-serif text-sm font-bold text-muted-foreground">
                {inv.sequenceNumber}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">{inv.number}</span>
                  <Badge variant={statusVariant[inv.status]}>
                    {t(inv.status)}
                  </Badge>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {inv.buyer.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(inv.issueDate, language)} →{" "}
                  {formatDate(inv.dueDate, language)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold font-serif">
                  {formatCurrencyMDL(inv.total)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => handleDelete(e, inv.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
