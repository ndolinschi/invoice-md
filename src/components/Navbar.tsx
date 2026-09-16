"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Settings as SettingsIcon, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-foreground">
                  Invoice <span className="text-primary font-black">MD</span>
                </span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Moldova
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {language === "ro" ? "Facturi pentru freelanceri" : "Счета для фрилансеров"}
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === "/" ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              <FileText className="h-4 w-4" />
              {t("invoices")}
            </Link>
            <Link
              href="/settings"
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === "/settings" ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground"
              )}
            >
              <SettingsIcon className="h-4 w-4" />
              {t("settings")}
            </Link>
          </nav>
        </div>

        {/* Right Actions: Language Switcher & New Invoice button */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center rounded-lg border bg-muted/40 p-0.5">
            <button
              type="button"
              onClick={() => setLanguage("ro")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                language === "ro"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>🇲🇩 RO</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage("ru")}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                language === "ru"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>RU</span>
            </button>
          </div>

          <Link href="/settings" className="md:hidden">
            <Button variant="outline" size="icon" title={t("settings")}>
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/invoice/new">
            <Button className="flex items-center gap-1.5 shadow-sm font-medium">
              <PlusCircle className="h-4 w-4" />
              <span>{t("newInvoice")}</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
