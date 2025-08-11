import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setPin, hasPin, saveEncrypted, getDecrypted } from "@/lib/secureStore";

export default function Settings() {
  const [pin, setPinInput] = useState("");
  const [pinSet, setPinSet] = useState(false);
  const [budget, setBudget] = useState("");

  useEffect(() => {
    (async () => { setPinSet(await hasPin()); const b = await getDecrypted<any>("budget", null); if (b?.amount) setBudget(String(b.amount)); })();
  }, []);

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>App Lock (4-digit PIN)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input id="pin" type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0,4))} />
            </div>
            <Button disabled={pin.length!==4} onClick={async () => { await setPin(pin); setPinSet(true); }}>Set PIN</Button>
            <div className="text-sm text-muted-foreground">{pinSet ? "PIN set. Your data is encrypted locally." : "Set a 4-digit PIN to encrypt local data."}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Monthly Budget</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="budget">Amount (₹)</Label>
              <Input id="budget" type="number" min={0} step={1} value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <Button onClick={async () => { const amt = Number(budget||0); await saveEncrypted("budget", { amount: amt, month_year: new Date().toISOString().slice(0,7) }); }}>Save</Button>
            <div className="text-sm text-muted-foreground">Dashboard progress will reflect instantly.</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
