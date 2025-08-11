export type TxType = "credit" | "debit";

export interface ParsedTransaction {
  id: string;
  amount: number;
  merchant?: string;
  bank?: string;
  type: TxType;
  occurred_at: string; // ISO
  description: string;
  category: string;
}

const rules: { pattern: RegExp; category: string }[] = [
  { pattern: /(swiggy|zomato|eat|restaurant|diner|food)/i, category: "Food" },
  { pattern: /(uber|ola|rapido|fuel|petrol|diesel|metro|train|bus|flight|airlines)/i, category: "Travel" },
  { pattern: /(amazon|flipkart|myntra|ajio|tata cliq|snapdeal|shopping)/i, category: "Shopping" },
  { pattern: /(electricity|water bill|gas bill|broadband|wifi|mobile bill|recharge|dth|postpaid|prepaid)/i, category: "Bills" },
  { pattern: /(rent|maintenance|society|emi|loan|insurance)/i, category: "Home" },
  { pattern: /(salary|credit|interest|refund|cashback)/i, category: "Income" },
  { pattern: /(upi|gpay|phonepe|paytm|bhim|imps|neft|rtgs)/i, category: "Transfers" },
];

export function categorize(text: string): string {
  for (const r of rules) {
    if (r.pattern.test(text)) return r.category;
  }
  return "Other";
}

export function parseAmount(text: string): number | null {
  const match = text.match(/(?:inr|rs\.?|₹)\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (!match) return null;
  return Number(match[1].replace(/,/g, ""));
}

export function parseType(text: string): TxType | null {
  if (/debit|debited|spent|purchase|pos|withdrawn/i.test(text)) return "debit";
  if (/credit|credited|received|refund|cashback/i.test(text)) return "credit";
  return null;
}

export function extractMerchant(text: string): string | undefined {
  const m = text.match(/at\s+([A-Za-z0-9 &._-]{2,})/i) || text.match(/to\s+([A-Za-z0-9 &._-]{2,})/i);
  return m?.[1]?.trim();
}
