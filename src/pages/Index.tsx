import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSmsTransactions } from "@/hooks/useSmsTransactions";
import { getDecrypted, saveEncrypted } from "@/lib/secureStore";

const setSeo = () => {
  document.title = "Walletflow – Dashboard";
  const desc = "Your Walletflow dashboard: budgets, transactions, and insights.";
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.content = desc;
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
  canonical.href = window.location.href;
};

export default function Index() {
  const { transactions, totals, loading: smsLoading, error } = useSmsTransactions();
  const [showBudget, setShowBudget] = useState(false);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [budgetAmt, setBudgetAmt] = useState<number | null>(null);

  useEffect(() => { setSeo(); }, []);
  useEffect(() => {
    (async () => {
      const b = await getDecrypted<{ amount: number; month_year: string }>("budget", { amount: 0, month_year: "" });
      if (b.amount > 0) setBudgetAmt(b.amount);
    })();
  }, []);

  const progress = useMemo(() => {
    if (!budgetAmt) return 0;
    return Math.min(100, Math.round((totals.expense / budgetAmt) * 100));
  }, [budgetAmt, totals.expense]);

  return (
    <main className="min-h-screen bg-background">
      <section className="container py-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader><CardTitle>Total Spent (This Month)</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">₹{totals.expense.toLocaleString("en-IN")}</CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardHeader><CardTitle>Total Income</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">₹{totals.income.toLocaleString("en-IN")}</CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader><CardTitle>Budget Progress</CardTitle></CardHeader>
          <CardContent>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-3 bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{progress}% used {budgetAmt ? `(₹${budgetAmt.toLocaleString("en-IN")})` : "— set in Settings"}</div>
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardHeader><CardTitle>Top Category</CardTitle></CardHeader>
          <CardContent className="text-lg">{totals.topCategory}</CardContent>
        </Card>
      </section>

      <section className="container pb-8">
        {smsLoading ? (
          <div className="text-center text-muted-foreground">Scanning SMS…</div>
        ) : error ? (
          <div className="text-center text-destructive">{error}</div>
        ) : (
          <div className="grid gap-3">
            {transactions.slice(0, 20).map(t => (
              <Card key={t.id} className="hover:shadow-sm transition">
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t.merchant || t.category}</div>
                    <div className="text-xs text-muted-foreground">{new Date(t.occurred_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
                  </div>
                  <div className={t.type === "debit" ? "text-destructive font-bold" : "text-emerald-600 font-bold"}>
                    {t.type === "debit" ? "-" : "+"}₹{t.amount.toLocaleString("en-IN")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Dialog open={showBudget} onOpenChange={setShowBudget}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set monthly budget</DialogTitle>
            <DialogDescription>Linking dashboard progress to this amount.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            if (!amount || !month) return;
            const data = { amount: Number(amount), month_year: month };
            await saveEncrypted("budget", data);
            setBudgetAmt(data.amount);
            setShowBudget(false);
          }}>
            <div className="space-y-2">
              <Label htmlFor="budget-amount">Amount</Label>
              <Input id="budget-amount" type="number" min={0} step={1} value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-month">Month</Label>
              <Input id="budget-month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} required />
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 right-6">
        <Button onClick={() => setShowBudget(true)} variant="secondary">Set Budget</Button>
      </div>
    </main>
  );
}
