"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, Settings, Invoice } from "@/types/invoice";
import {
  DEFAULT_SETTINGS,
  getStoredSettings,
  saveStoredSettings,
  getStoredInvoices,
  saveStoredInvoice,
  deleteStoredInvoice,
  seedSampleInvoices,
} from "@/lib/storage";
import { translations, TranslationKeys } from "@/lib/i18n";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  invoices: Invoice[];
  refreshInvoices: () => void;
  addOrUpdateInvoice: (invoice: Invoice) => void;
  removeInvoice: (id: string) => void;
  resetToSampleData: () => void;
  isHydrated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [language, setLanguageState] = useState<Language>("ro");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    // Read from localStorage on mount
    const loadedSettings = getStoredSettings();
    setSettings(loadedSettings);
    setLanguageState(loadedSettings.language || "ro");

    const loadedInvoices = getStoredInvoices();
    setInvoices(loadedInvoices);
    setIsHydrated(true);
  }, []);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    const updatedSettings = { ...settings, language: newLang };
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const refreshInvoices = () => {
    const list = getStoredInvoices();
    setInvoices(list);
  };

  const addOrUpdateInvoice = (invoice: Invoice) => {
    saveStoredInvoice(invoice);
    refreshInvoices();
  };

  const removeInvoice = (id: string) => {
    deleteStoredInvoice(id);
    refreshInvoices();
  };

  const resetToSampleData = () => {
    const seeded = seedSampleInvoices(true);
    setInvoices(seeded);
  };

  const t = (key: TranslationKeys): string => {
    return (translations[language] && translations[language][key]) || translations.ro[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        settings,
        updateSettings,
        invoices,
        refreshInvoices,
        addOrUpdateInvoice,
        removeInvoice,
        resetToSampleData,
        isHydrated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
