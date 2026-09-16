import { Language } from "@/types/invoice";

export const translations = {
  ro: {
    // App Header & Navigation
    appTitle: "Facturi Freelance MD",
    appSubtitle: "Generator facturi pentru freelanceri și IT specialiști din Moldova",
    invoices: "Facturi",
    newInvoice: "Factură nouă",
    settings: "Setări",
    language: "Limba",
    currency: "MDL",
    backToList: "Înapoi la listă",
    save: "Salvează",
    saved: "Salvat cu succes!",
    exportPdf: "Descarcă PDF",
    generatingPdf: "Se generează PDF...",
    delete: "Șterge",
    duplicate: "Duplică",
    preview: "Previzualizare A4",
    edit: "Editare",
    confirmDelete: "Sigur doriți să ștergeți această factură?",
    cancel: "Anulează",
    statusUpdated: "Statutul a fost actualizat",
    resetToDefault: "Resetează la setări inițiale",
    
    // Statuses
    draft: "Ciornă",
    sent: "Trimisă",
    paid: "Achitată",
    allStatuses: "Toate statutele",
    filterByStatus: "Filtrează după statut",
    searchPlaceholder: "Caută după număr, client sau descriere...",

    // KPI / Summary
    totalInvoiced: "Total facturat",
    totalPaid: "Total încasat",
    pendingPayment: "În așteptare",
    draftsCount: "Ciorne",
    invoicesCount: "facturi în total",

    // Invoice Form & Preview Details
    invoiceTitle: "CONT DE PLATĂ / FACTURĂ",
    invoiceNumber: "Număr factură",
    invoiceSeries: "Seria",
    issueDate: "Data emiterii",
    dueDate: "Data scadenței",
    status: "Statut",
    
    // Parties
    sellerTitle: "PRESTATOR (FURNIZOR)",
    buyerTitle: "BENEFICIAR (CLIENT)",
    companyName: "Denumire / Nume Prenume",
    idno: "Cod Fiscal / IDNO",
    vatCode: "Cod TVA",
    address: "Adresă juridică / sediu",
    phone: "Telefon",
    email: "Email",
    bankName: "Banca beneficiară",
    bankIban: "Cont IBAN (MDL)",
    bankBic: "Cod SWIFT / BIC",

    // Line Items
    itemsTableTitle: "Servicii prestate / Mărfuri livrate",
    addItem: "Adaugă rând",
    itemNr: "Nr.",
    itemDescription: "Denumirea serviciilor / bunurilor",
    itemUnit: "U.M.",
    itemQuantity: "Cant.",
    itemRate: "Preț (MDL)",
    itemAmount: "Suma (MDL)",
    actions: "Acțiuni",

    // Totals & Calculations
    subtotal: "Total fără TVA:",
    vatRate: "Cota TVA (%):",
    vatAmount: "Suma TVA:",
    grandTotal: "TOTAL SPRE PLATĂ:",
    totalInWords: "Total în litere",
    
    // Notes & Conditions
    notes: "Mențiuni / Note",
    notesPlaceholder: "Informații adiționale, referințe contractuale etc.",
    paymentTerms: "Condiții de plată",
    paymentTermsPlaceholder: "ex: Plata se efectuează în termen de 5 zile bancare",
    sellerSignature: "Semnătura prestatorului:",
    buyerSignature: "Semnătura beneficiarului:",
    stampPlace: "L.Ș. (Loc ștampilă)",

    // Settings Page
    settingsTitle: "Configurări profil & facturare",
    settingsDescription: "Datele implicite ale prestatorului și setările de numerotare",
    sellerDefaultsSection: "Datele implicite ale prestatorului",
    numberingSection: "Numerotare & Reguli fiscale",
    invoicePrefix: "Prefix număr factură",
    prefixHelp: "ex: INV-2026-",
    nextSequence: "Următorul număr secvențial",
    sequenceHelp: "Se va incrementa automat la generarea fiecărei facturi noi",
    defaultVat: "Cota TVA implicită (%)",
    defaultVatHelp: "0% pentru neplătitori de TVA, 20% cota standard în R. Moldova",
    defaultPaymentTermsLabel: "Condiții de plată implicite",
    defaultNotesLabel: "Note implicite pe factură",
    saveSettings: "Salvează setările",
    settingsSaved: "Setările au fost salvate cu succes!",
    seedDataButton: "Reîncarcă facturile demonstrative",
    seedDataSuccess: "Facturile demonstrative au fost reîncărcate!",

    // Units
    unitHours: "ore",
    unitServices: "serv.",
    unitPieces: "buc.",
    unitMonths: "luni",
    unitDays: "zile",

    // Empty state
    noInvoices: "Nu a fost găsită nicio factură",
    createFirstInvoice: "Creați prima factură",
  },
  ru: {
    // App Header & Navigation
    appTitle: "Счета для фрилансеров МД",
    appSubtitle: "Генератор счетов для фрилансеров и IT специалистов Молдовы",
    invoices: "Счета",
    newInvoice: "Новый счет",
    settings: "Настройки",
    language: "Язык",
    currency: "MDL",
    backToList: "Назад к списку",
    save: "Сохранить",
    saved: "Успешно сохранено!",
    exportPdf: "Скачать PDF",
    generatingPdf: "Создание PDF...",
    delete: "Удалить",
    duplicate: "Дублировать",
    preview: "Предпросмотр A4",
    edit: "Редактировать",
    confirmDelete: "Вы уверены, что хотите удалить этот счет?",
    cancel: "Отмена",
    statusUpdated: "Статус обновлен",
    resetToDefault: "Сбросить к исходным настройкам",

    // Statuses
    draft: "Черновик",
    sent: "Отправлен",
    paid: "Оплачен",
    allStatuses: "Все статусы",
    filterByStatus: "Фильтр по статусу",
    searchPlaceholder: "Поиск по номеру, клиенту или описанию...",

    // KPI / Summary
    totalInvoiced: "Всего выставлено",
    totalPaid: "Всего получено",
    pendingPayment: "Ожидает оплаты",
    draftsCount: "Черновики",
    invoicesCount: "счетов всего",

    // Invoice Form & Preview Details
    invoiceTitle: "СЧЕТ НА ОПЛАТУ",
    invoiceNumber: "Номер счета",
    invoiceSeries: "Серия",
    issueDate: "Дата выписки",
    dueDate: "Срок оплаты",
    status: "Статус",

    // Parties
    sellerTitle: "ИСПОЛНИТЕЛЬ (ПОСТАВЩИК)",
    buyerTitle: "ЗАКАЗЧИК (ПОКУПАТЕЛЬ)",
    companyName: "Наименование / Ф.И.О.",
    idno: "Фискальный код / IDNO",
    vatCode: "Код НДС",
    address: "Юридический адрес",
    phone: "Телефон",
    email: "Email",
    bankName: "Банк получателя",
    bankIban: "Счет IBAN (MDL)",
    bankBic: "Код SWIFT / BIC",

    // Line Items
    itemsTableTitle: "Оказанные услуги / Поставленные товары",
    addItem: "Добавить строку",
    itemNr: "№",
    itemDescription: "Наименование услуг / товаров",
    itemUnit: "Ед.",
    itemQuantity: "Кол-во",
    itemRate: "Цена (MDL)",
    itemAmount: "Сумма (MDL)",
    actions: "Действия",

    // Totals & Calculations
    subtotal: "Итого без НДС:",
    vatRate: "Ставка НДС (%):",
    vatAmount: "Сумма НДС:",
    grandTotal: "ИТОГО К ОПЛАТЕ:",
    totalInWords: "Сумма прописью",

    // Notes & Conditions
    notes: "Примечание / Особые отметки",
    notesPlaceholder: "Дополнительные сведения, ссылка на договор и т.д.",
    paymentTerms: "Условия оплаты",
    paymentTermsPlaceholder: "напр.: Оплата производится в течение 5 банковских дней",
    sellerSignature: "Подпись исполнителя:",
    buyerSignature: "Подпись заказчика:",
    stampPlace: "М.П. (Место печати)",

    // Settings Page
    settingsTitle: "Настройки профиля и счетов",
    settingsDescription: "Реквизиты исполнителя по умолчанию и нумерация счетов",
    sellerDefaultsSection: "Реквизиты исполнителя по умолчанию",
    numberingSection: "Нумерация и налоговые параметры",
    invoicePrefix: "Префикс номера счета",
    prefixHelp: "напр.: INV-2026-",
    nextSequence: "Следующий порядковый номер",
    sequenceHelp: "Будет автоматически увеличиваться при создании нового счета",
    defaultVat: "Ставка НДС по умолчанию (%)",
    defaultVatHelp: "0% для неплательщиков НДС, 20% стандартная ставка в Молдове",
    defaultPaymentTermsLabel: "Условия оплаты по умолчанию",
    defaultNotesLabel: "Примечания по умолчанию",
    saveSettings: "Сохранить настройки",
    settingsSaved: "Настройки успешно сохранены!",
    seedDataButton: "Перезагрузить демонстрационные счета",
    seedDataSuccess: "Демонстрационные счета перезагружены!",

    // Units
    unitHours: "час.",
    unitServices: "услуга",
    unitPieces: "шт.",
    unitMonths: "мес.",
    unitDays: "дн.",

    // Empty state
    noInvoices: "Счетов не найдено",
    createFirstInvoice: "Создать первый счет",
  },
} as const;

export type TranslationKeys = keyof typeof translations.ro;

export function getTranslation(lang: Language, key: TranslationKeys): string {
  return translations[lang]?.[key] ?? translations.ro[key] ?? key;
}

export function formatCurrencyMDL(amount: number): string {
  return new Intl.NumberFormat('ro-MD', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + " MDL";
}

export function formatDate(dateString: string, lang: Language = 'ro'): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'ro-RO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
}
