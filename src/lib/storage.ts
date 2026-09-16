import { Invoice, Settings, Party, LineItem } from "@/types/invoice";

const STORAGE_KEY_INVOICES = "invoicemd_invoices";
const STORAGE_KEY_SETTINGS = "invoicemd_settings";

export const DEFAULT_SELLER: Party = {
  name: "Andrei Cebotari (Freelance IT Specialist)",
  idno: "2001004561234",
  vatCode: "",
  address: "mun. Chișinău, str. A. Pușkin 22, ap. 15, MD-2012",
  phone: "+373 69 123 456",
  email: "andrei.dev@codekraft.md",
  bankName: "BC Moldova Agroindbank SA (maib)",
  bankIban: "MD24AG000000022518465001",
  bankBic: "AGRNMD2X",
};

export const DEFAULT_SETTINGS: Settings = {
  sellerDefaults: DEFAULT_SELLER,
  invoicePrefix: "INV-2026-",
  nextSequence: 3,
  defaultVatRate: 0,
  defaultPaymentTerms: {
    ro: "Plata se efectuează prin virament bancar în termen de 14 zile calendaristice de la data emiterii contului.",
    ru: "Оплата производится банковским переводом в течение 14 календарных дней со дня выставления счета.",
  },
  defaultNotes: {
    ro: "Serviciile au fost prestate în conformitate cu cerințele tehnice și contractul semnat.",
    ru: "Услуги оказаны в полном соответствии с техническими требованиями и договором.",
  },
  language: "ro",
  currency: "MDL",
};

export const SAMPLE_INVOICES: Invoice[] = [
  {
    id: "inv-2026-0001",
    number: "INV-2026-0001",
    series: "MD",
    sequenceNumber: 1,
    issueDate: "2026-09-01",
    dueDate: "2026-09-15",
    status: "paid",
    seller: { ...DEFAULT_SELLER },
    buyer: {
      name: 'SRL "Digital Growth Solutions"',
      idno: "1018600025412",
      vatCode: "0601248",
      address: "mun. Chișinău, bd. Dacia 30/1, bir. 504",
      phone: "+373 22 889 900",
      email: "finance@digitalgrowth.md",
      bankName: "BC Victoriabank SA",
      bankIban: "MD15VI000000022519874001",
      bankBic: "VICBMD2X",
    },
    items: [
      {
        id: "item-1-1",
        description: "Dezvoltare frontend aplicație web (Next.js & Tailwind CSS)",
        unit: "ore",
        quantity: 80,
        rate: 450,
        amount: 36000,
      },
      {
        id: "item-1-2",
        description: "Integrare API de plăți și webhooks de notificare",
        unit: "ore",
        quantity: 20,
        rate: 500,
        amount: 10000,
      },
      {
        id: "item-1-3",
        description: "Configurare CI/CD pipeline și deployment cloud",
        unit: "serv.",
        quantity: 1,
        rate: 4000,
        amount: 4000,
      },
    ],
    subtotal: 50000,
    vatRate: 0,
    vatAmount: 0,
    total: 50000,
    currency: "MDL",
    notes: "Serviciile au fost prestate conform contractului de prestări servicii nr. 14/2026 din 10.08.2026.",
    paymentTerms: "Plata se efectuează prin virament bancar în termen de 14 zile calendaristice de la data emiterii contului.",
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "inv-2026-0002",
    number: "INV-2026-0002",
    series: "MD",
    sequenceNumber: 2,
    issueDate: "2026-09-10",
    dueDate: "2026-09-24",
    status: "sent",
    seller: { ...DEFAULT_SELLER },
    buyer: {
      name: 'Î.C.S. "Fintech Global Lab" S.R.L.',
      idno: "1015600047891",
      vatCode: "0509874",
      address: "mun. Chișinău, str. Calea Ieșilor 10, et. 3",
      phone: "+373 22 990 011",
      email: "accounts@fintechlab.md",
      bankName: "BC Moldindconbank SA",
      bankIban: "MD33ML000000022513412001",
      bankBic: "MLDCMD2X",
    },
    items: [
      {
        id: "item-2-1",
        description: "Mentenanță lunară sistem și optimizare baze de date PostgreSQL",
        unit: "luni",
        quantity: 1,
        rate: 25000,
        amount: 25000,
      },
      {
        id: "item-2-2",
        description: "Audit de securitate cod și remediere vulnerabilități critice",
        unit: "ore",
        quantity: 15,
        rate: 600,
        amount: 9000,
      },
    ],
    subtotal: 34000,
    vatRate: 0,
    vatAmount: 0,
    total: 34000,
    currency: "MDL",
    notes: "Actul de primire-predare a serviciilor nr. 09 se anexează la prezentul cont.",
    paymentTerms: "Achitare prin virament bancar în termen de 14 zile calendaristice.",
    createdAt: "2026-09-10T10:00:00.000Z",
    updatedAt: "2026-09-10T10:00:00.000Z",
  },
];

export function getStoredSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error("Error reading settings from localStorage", e);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving settings to localStorage", e);
  }
}

export function getStoredInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVOICES);
    if (!raw) {
      // Seed 2 sample invoices on first load
      localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(SAMPLE_INVOICES));
      return SAMPLE_INVOICES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading invoices from localStorage", e);
    return SAMPLE_INVOICES;
  }
}

export function getStoredInvoiceById(id: string): Invoice | undefined {
  const invoices = getStoredInvoices();
  return invoices.find((inv) => inv.id === id);
}

export function saveStoredInvoice(invoice: Invoice): void {
  if (typeof window === "undefined") return;
  const invoices = getStoredInvoices();
  const existingIndex = invoices.findIndex((inv) => inv.id === invoice.id);
  
  if (existingIndex >= 0) {
    invoices[existingIndex] = { ...invoice, updatedAt: new Date().toISOString() };
  } else {
    invoices.unshift({ ...invoice, updatedAt: new Date().toISOString() });
    // If it's a new invoice, update sequence in settings if needed
    const settings = getStoredSettings();
    if (invoice.sequenceNumber >= settings.nextSequence) {
      saveStoredSettings({ ...settings, nextSequence: invoice.sequenceNumber + 1 });
    }
  }
  
  localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(invoices));
}

export function deleteStoredInvoice(id: string): void {
  if (typeof window === "undefined") return;
  const invoices = getStoredInvoices();
  const filtered = invoices.filter((inv) => inv.id !== id);
  localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(filtered));
}

export function seedSampleInvoices(force: boolean = false): Invoice[] {
  if (typeof window === "undefined") return SAMPLE_INVOICES;
  if (force || !localStorage.getItem(STORAGE_KEY_INVOICES)) {
    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(SAMPLE_INVOICES));
    const settings = getStoredSettings();
    saveStoredSettings({ ...settings, nextSequence: 3 });
    return SAMPLE_INVOICES;
  }
  return getStoredInvoices();
}

export function generateNextInvoiceData(settings: Settings): {
  id: string;
  number: string;
  sequenceNumber: number;
} {
  const seq = settings.nextSequence || 1;
  const seqStr = String(seq).padStart(4, "0");
  const number = `${settings.invoicePrefix || "INV-2026-"}${seqStr}`;
  const id = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  return { id, number, sequenceNumber: seq };
}
