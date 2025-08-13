import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { RefreshCw, Settings, Plus, Target, Download, Upload, MessageSquare } from "lucide-react";
import { ensureSmsPermission, readRecentMessages } from "@/plugins/smsInbox";
import { saveEncrypted } from "@/lib/secureStore";

interface QuickActionsProps {
  onRefreshTransactions: () => void;
  onNavigateToSettings: () => void;
  budget?: { amount: number; month_year: string };
  onBudgetUpdate: (budget: { amount: number; month_year: string }) => void;
}

export function QuickActions({ 
  onRefreshTransactions, 
  onNavigateToSettings, 
  budget, 
  onBudgetUpdate 
}: QuickActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(budget?.amount?.toString() || "");
  const [budgetMonth, setBudgetMonth] = useState(budget?.month_year || new Date().toISOString().slice(0, 7));

  const handleRefreshSMS = async () => {
    setLoading(true);
    try {
      const hasPermission = await ensureSmsPermission();
      if (!hasPermission) {
        toast({
          title: "Permission required",
          description: "SMS reading permission is needed to scan transactions.",
          variant: "destructive"
        });
        return;
      }

      await readRecentMessages(90, 1000);
      onRefreshTransactions();
      
      toast({
        title: "SMS scan complete",
        description: "Successfully refreshed transaction data from SMS messages."
      });
    } catch (error) {
      toast({
        title: "SMS scan failed",
        description: "Unable to read SMS messages. Check permissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async () => {
    if (!budgetAmount || !budgetMonth) {
      toast({
        title: "Missing information",
        description: "Please enter both amount and month.",
        variant: "destructive"
      });
      return;
    }

    const newBudget = {
      amount: Number(budgetAmount),
      month_year: budgetMonth
    };

    try {
      await saveEncrypted("budget", newBudget);
      onBudgetUpdate(newBudget);
      setShowBudgetDialog(false);
      
      toast({
        title: "Budget updated",
        description: `Monthly budget set to ₹${Number(budgetAmount).toLocaleString("en-IN")}`
      });
    } catch (error) {
      toast({
        title: "Failed to save budget",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const exportData = () => {
    // This would export transaction data
    toast({
      title: "Export feature",
      description: "Data export functionality coming soon!"
    });
  };

  const importData = () => {
    // This would import transaction data
    toast({
      title: "Import feature", 
      description: "Data import functionality coming soon!"
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Refresh SMS */}
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3 gap-2"
              onClick={handleRefreshSMS}
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs">Refresh SMS</span>
            </Button>

            {/* Set Budget */}
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3 gap-2"
              onClick={() => setShowBudgetDialog(true)}
            >
              <Target className="h-5 w-5" />
              <span className="text-xs">Set Budget</span>
            </Button>

            {/* Export Data */}
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3 gap-2"
              onClick={exportData}
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">Export</span>
            </Button>

            {/* Import Data */}
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-3 gap-2"
              onClick={importData}
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs">Import</span>
            </Button>
          </div>

          {/* Current Budget Display */}
          {budget && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Budget</span>
                <Badge variant="secondary">
                  {budget.month_year}
                </Badge>
              </div>
              <div className="text-lg font-bold text-primary">
                ₹{budget.amount.toLocaleString("en-IN")}
              </div>
            </div>
          )}

          {/* Settings Link */}
          <Button 
            variant="ghost" 
            className="w-full mt-3"
            onClick={onNavigateToSettings}
          >
            <Settings className="h-4 w-4 mr-2" />
            Open Settings
          </Button>
        </CardContent>
      </Card>

      {/* Budget Dialog */}
      <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Monthly Budget</DialogTitle>
            <DialogDescription>
              Set your spending budget to track your financial progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget-amount">Budget Amount (₹)</Label>
              <Input
                id="budget-amount"
                type="number"
                min="0"
                step="100"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="e.g. 25000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget-month">Month</Label>
              <Input
                id="budget-month"
                type="month"
                value={budgetMonth}
                onChange={(e) => setBudgetMonth(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBudgetDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetBudget}>
              Set Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}