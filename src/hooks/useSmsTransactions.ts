import { useEffect, useMemo, useState } from "react";
import { ensureSmsPermission, readRecentMessages } from "@/plugins/smsInbox";
import { categorize, extractMerchant, parseAmount, parseType, type ParsedTransaction } from "@/lib/categorizer";
import { saveEncrypted, getDecrypted } from "@/lib/secureStore";

export function useSmsTransactions() {
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const ok = await ensureSmsPermission();
      if (!ok) {
        setError("SMS permission not granted");
        setLoading(false);
        return;
      }
      const msgs = await readRecentMessages(90, 1200);
      const parsed: ParsedTransaction[] = [];
      for (const m of msgs) {
        const body = m.body || "";
        // Ignore non-transactional
        if (!/(inr|₹|rs\.?)/i.test(body)) continue;
        const type = parseType(body);
        const amount = parseAmount(body);
        if (!type || !amount) continue;
        const merchant = extractMerchant(body);
        const category = categorize(body + " " + (merchant || ""));
        const when = m.date ? new Date(m.date).toISOString() : new Date().toISOString();
        const id = `${when}-${amount}-${merchant ?? ""}`;
        parsed.push({ id, amount, type, merchant, description: body.slice(0, 160), category, occurred_at: when });
      }
      // Sort newest first
      parsed.sort((a, b) => (a.occurred_at < b.occurred_at ? 1 : -1));
      setTransactions(parsed);
      await saveEncrypted("transactions", parsed);
      setLoading(false);
    })();
  }, []);

  const totals = useMemo(() => {
    const monthKey = new Date().toISOString().slice(0, 7);
    const inMonth = transactions.filter(t => t.occurred_at.startsWith(monthKey));
    const expense = inMonth.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
    const income = inMonth.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
    const byCat: Record<string, number> = {};
    for (const t of inMonth) byCat[t.category] = (byCat[t.category] || 0) + (t.type === "debit" ? t.amount : 0);
    const topCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    return { expense, income, topCategory };
  }, [transactions]);

  const restore = async () => {
    const data = await getDecrypted<ParsedTransaction[]>("transactions", []);
    setTransactions(data);
  };

  return { transactions, totals, loading, error, restore };
}
