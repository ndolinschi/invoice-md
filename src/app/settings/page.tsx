"use client";

import React, { useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { Settings } from "@/types/invoice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Save, RefreshCw, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { t, settings, updateSettings, resetToSampleData, setLanguage } =
    useApp();
  const [local, setLocal] = useState<Settings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const updateField = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setLocal((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateSellerField = useCallback(
    (field: keyof Settings["sellerDefaults"], value: string) => {
      setLocal((prev) => ({
        ...prev,
        sellerDefaults: { ...prev.sellerDefaults, [field]: value },
      }));
    },
    []
  );

  const handleSave = useCallback(() => {
    updateSettings(local);
    setLanguage(local.language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [local, updateSettings, setLanguage]);

  const handleSeed = useCallback(() => {
    resetToSampleData();
    setSeeded(true);
    setTimeout(() => setSeeded(false), 2000);
  }, [resetToSampleData]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight">
          {t("settingsTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("settingsDescription")}
        </p>
      </div>

      {/* Language */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base">{t("language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={local.language}
            onValueChange={(v) =>
              updateField("language", v as Settings["language"])
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ro">🇲🇩 Română</SelectItem>
              <SelectItem value="ru">🇷🇺 Русский</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Seller Defaults */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base">
            {t("sellerDefaultsSection")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="mb-1 block text-xs">{t("companyName")}</Label>
            <Input
              value={local.sellerDefaults.name}
              onChange={(e) => updateSellerField("name", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("idno")}</Label>
            <Input
              value={local.sellerDefaults.idno}
              onChange={(e) => updateSellerField("idno", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("vatCode")}</Label>
            <Input
              value={local.sellerDefaults.vatCode ?? ""}
              onChange={(e) => updateSellerField("vatCode", e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label className="mb-1 block text-xs">{t("address")}</Label>
            <Input
              value={local.sellerDefaults.address}
              onChange={(e) => updateSellerField("address", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("phone")}</Label>
            <Input
              value={local.sellerDefaults.phone ?? ""}
              onChange={(e) => updateSellerField("phone", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("email")}</Label>
            <Input
              value={local.sellerDefaults.email ?? ""}
              onChange={(e) => updateSellerField("email", e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label className="mb-1 block text-xs">{t("bankName")}</Label>
            <Input
              value={local.sellerDefaults.bankName}
              onChange={(e) => updateSellerField("bankName", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("bankIban")}</Label>
            <Input
              value={local.sellerDefaults.bankIban}
              onChange={(e) => updateSellerField("bankIban", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("bankBic")}</Label>
            <Input
              value={local.sellerDefaults.bankBic ?? ""}
              onChange={(e) => updateSellerField("bankBic", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Numbering */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base">
            {t("numberingSection")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-1 block text-xs">
              {t("invoicePrefix")}
            </Label>
            <Input
              value={local.invoicePrefix}
              onChange={(e) => updateField("invoicePrefix", e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {t("prefixHelp")}
            </p>
          </div>
          <div>
            <Label className="mb-1 block text-xs">
              {t("nextSequence")}
            </Label>
            <Input
              type="number"
              min="1"
              value={local.nextSequence}
              onChange={(e) =>
                updateField("nextSequence", Number(e.target.value))
              }
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {t("sequenceHelp")}
            </p>
          </div>
          <div>
            <Label className="mb-1 block text-xs">
              {t("defaultVat")}
            </Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={local.defaultVatRate}
              onChange={(e) =>
                updateField("defaultVatRate", Number(e.target.value))
              }
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {t("defaultVatHelp")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base">
            {t("defaultPaymentTermsLabel")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-1 block text-xs">RO</Label>
            <Textarea
              rows={3}
              value={local.defaultPaymentTerms.ro}
              onChange={(e) =>
                updateField("defaultPaymentTerms", {
                  ...local.defaultPaymentTerms,
                  ro: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">RU</Label>
            <Textarea
              rows={3}
              value={local.defaultPaymentTerms.ru}
              onChange={(e) =>
                updateField("defaultPaymentTerms", {
                  ...local.defaultPaymentTerms,
                  ru: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base">
            {t("defaultNotesLabel")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-1 block text-xs">RO</Label>
            <Textarea
              rows={3}
              value={local.defaultNotes.ro}
              onChange={(e) =>
                updateField("defaultNotes", {
                  ...local.defaultNotes,
                  ro: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">RU</Label>
            <Textarea
              rows={3}
              value={local.defaultNotes.ru}
              onChange={(e) =>
                updateField("defaultNotes", {
                  ...local.defaultNotes,
                  ru: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pb-8">
        <Button onClick={handleSave} className="gap-1.5">
          {saved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? t("settingsSaved") : t("saveSettings")}
        </Button>
        <Button variant="outline" onClick={handleSeed} className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          {seeded ? t("seedDataSuccess") : t("seedDataButton")}
        </Button>
      </div>
    </div>
  );
}
