import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly';
  spent: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const EXPENSE_CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Healthcare", "Education", "Travel", "Other"];

export default function BudgetManager() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const { toast } = useToast();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // For demo purposes, we'll create mock budget data since we don't have a budgets table
      // In a real app, you'd create a budgets table and query it here
      const mockBudgets: Budget[] = [
        {
          id: '1',
          category: 'Food',
          amount: 15000,
          period: 'monthly',
          spent: 8500,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          category: 'Transport',
          amount: 5000,
          period: 'monthly',
          spent: 6200,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setBudgets(mockBudgets);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch budgets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async () => {
    if (!category || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, you'd insert into a budgets table
      const newBudget: Budget = {
        id: Date.now().toString(),
        category,
        amount: parseFloat(amount),
        period,
        spent: 0,
        user_id: 'user-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setBudgets([...budgets, newBudget]);
      
      toast({
        title: "Success",
        description: "Budget created successfully",
      });

      setCategory("");
      setAmount("");
      setPeriod('monthly');
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create budget",
        variant: "destructive",
      });
    }
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'destructive' };
    if (percentage >= 80) return { status: 'warning', color: 'warning' };
    return { status: 'good', color: 'default' };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Budget Management
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Budget Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10000"
                />
              </div>
              <div>
                <Label htmlFor="period">Period</Label>
                <Select value={period} onValueChange={(value: 'monthly' | 'weekly') => setPeriod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createBudget} className="w-full">
                Create Budget
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first budget to start tracking your spending goals
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((budget) => {
            const { status, color } = getBudgetStatus(budget);
            const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
            
            return (
              <Card key={budget.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{budget.category}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {budget.period} budget
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {status === 'exceeded' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                      {status === 'good' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      <Badge variant={color as any}>
                        {status === 'exceeded' ? 'Over Budget' : 
                         status === 'warning' ? 'Close to Limit' : 'On Track'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent: ₹{budget.spent.toLocaleString()}</span>
                      <span>Budget: ₹{budget.amount.toLocaleString()}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span>₹{(budget.amount - budget.spent).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}