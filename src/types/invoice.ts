export type InvoiceStatus = 'draft' | 'sent' | 'paid';

export type Language = 'ro' | 'ru';

export interface Party {
  name: string;
  idno: string; // Cod fiscal / IDNO
  vatCode?: string; // Cod TVA
  address: string;
  phone?: string;
  email?: string;
  bankName: string;
  bankIban: string;
  bankBic?: string; // SWIFT / BIC
}

export interface LineItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number; // in MDL
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  series?: string;
  sequenceNumber: number;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: InvoiceStatus;
  seller: Party;
  buyer: Party;
  items: LineItem[];
  subtotal: number;
  vatRate: number; // percentage, e.g. 0 or 20
  vatAmount: number;
  total: number;
  currency: string; // "MDL"
  notes?: string;
  paymentTerms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  sellerDefaults: Party;
  invoicePrefix: string;
  nextSequence: number;
  defaultVatRate: number;
  defaultPaymentTerms: {
    ro: string;
    ru: string;
  };
  defaultNotes: {
    ro: string;
    ru: string;
  };
  language: Language;
  currency: string;
}
