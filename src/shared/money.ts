export type SupportedCurrency = "DKK" | "SYP";

const currencyLabel: Record<SupportedCurrency, string> = {
  DKK: "kr.",
  SYP: "ل.س",
};

function safeInt(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount);
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const value = safeInt(amount);

  if (currency === "SYP") {
    // Prefer Arabic locale formatting for Syria. Intl currency formatting often varies
    // by environment, so we format number + append a stable symbol.
    const num = new Intl.NumberFormat("ar-SY", {
      maximumFractionDigits: 0,
    }).format(value);
    return `${num} ${currencyLabel[currency]}`;
  }

  const num = new Intl.NumberFormat("da-DK", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${num} ${currencyLabel[currency]}`;
}

export function currencyCodeLabel(currency: SupportedCurrency): string {
  return currencyLabel[currency];
}
