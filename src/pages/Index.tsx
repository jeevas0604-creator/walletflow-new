import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
const setSeo = () => {
  document.title = "Walletflow – Dashboard";
  const desc = "Your Walletflow dashboard: budgets, transactions, and insights.";
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.appendChild(meta);
  }
  meta.content = desc;
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = window.location.href;
};

const Index = () => {
  const [showPermission, setShowPermission] = useState(false);
  const [ackSimSms, setAckSimSms] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  useEffect(() => {
    setSeo();
    const guest = localStorage.getItem("guest_active") === "true";
    if (!guest) return;
    const needsPerm = localStorage.getItem("onboarding_needs_permission") === "true";
    const needsBudget = localStorage.getItem("onboarding_needs_budget") === "true";
    if (needsPerm) setShowPermission(true);
    else if (needsBudget) setShowBudget(true);
  }, []);
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <section className="text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-4">Walletflow Dashboard</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </section>

      <Dialog open={showPermission} onOpenChange={setShowPermission}>
        <DialogContent className="animate-enter">
          <DialogHeader>
            <DialogTitle>Permissions</DialogTitle>
            <DialogDescription>
              To auto-categorize expenses from messages, we need access. Browsers can’t read SMS, so we’ll simulate this for now.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input id="sms-sim" type="checkbox" checked={ackSimSms} onChange={(e) => setAckSimSms(e.target.checked)} />
              <Label htmlFor="sms-sim">I understand and allow simulated SMS read</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowPermission(false)}>Skip</Button>
            <Button disabled={!ackSimSms} onClick={async () => {
              try { if ("Notification" in window) { await Notification.requestPermission(); } } catch {}
              localStorage.setItem("onboarding_needs_permission", "false");
              if (localStorage.getItem("onboarding_needs_budget") === "true") {
                setShowPermission(false);
                setShowBudget(true);
              } else {
                setShowPermission(false);
                toast({ title: "Permissions set", description: "Thanks! You're all set." });
              }
            }}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBudget} onOpenChange={setShowBudget}>
        <DialogContent className="animate-enter">
          <DialogHeader>
            <DialogTitle>Set up your first budget</DialogTitle>
            <DialogDescription>Define a monthly limit to track your spending.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            if (!amount || !month) {
              toast({ title: "Missing info", description: "Enter amount and month.", variant: "destructive" });
              return;
            }
            localStorage.setItem("guest_budget", JSON.stringify({ amount: Number(amount), month_year: month }));
            localStorage.setItem("onboarding_needs_budget", "false");
            setShowBudget(false);
            toast({ title: "Budget saved", description: "You can change this later." });
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
              <Button type="button" variant="ghost" onClick={() => setShowBudget(false)}>Cancel</Button>
              <Button type="submit" className="hover-scale">Save budget</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Index;
