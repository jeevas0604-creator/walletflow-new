import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, Target, PieChart, Calendar } from "lucide-react";

interface Transaction {
  amount: number;
  type: "debit" | "credit";
  category: string;
  occurred_at: string;
}

interface FinancialSummaryProps {
  transactions: Transaction[];
  budget?: { amount: number; month_year: string };
}

export function FinancialSummary({ transactions, budget }: FinancialSummaryProps) {
  const summary = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthTransactions = transactions.filter(t => 
      t.occurred_at.startsWith(currentMonth)
    );

    const totalExpense = currentMonthTransactions
      .filter(t => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = currentMonthTransactions
      .filter(t => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals = currentMonthTransactions
      .filter(t => t.type === "debit")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "None";

    const netAmount = totalIncome - totalExpense;
    
    const averageDaily = totalExpense / new Date().getDate();

    const budgetProgress = budget?.amount ? (totalExpense / budget.amount) * 100 : 0;
    const projectedMonthly = averageDaily * new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    return {
      totalExpense,
      totalIncome,
      netAmount,
      topCategory,
      categoryTotals,
      averageDaily,
      budgetProgress,
      projectedMonthly,
      transactionCount: currentMonthTransactions.length
    };
  }, [transactions, budget]);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(summary.totalExpense)}
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: {formatCurrency(summary.averageDaily)}/day
          </p>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(summary.totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.transactionCount} transactions
          </p>
        </CardContent>
      </Card>

      {/* Net Amount */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
          <Wallet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${
            summary.netAmount >= 0 
              ? "text-green-600 dark:text-green-400" 
              : "text-red-600 dark:text-red-400"
          }`}>
            {summary.netAmount >= 0 ? "+" : ""}{formatCurrency(summary.netAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.netAmount >= 0 ? "Surplus" : "Deficit"} this month
          </p>
        </CardContent>
      </Card>

      {/* Budget Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
          <Target className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          {budget?.amount ? (
            <>
              <div className="text-2xl font-bold">
                {Math.round(summary.budgetProgress)}%
              </div>
              <Progress 
                value={Math.min(summary.budgetProgress, 100)} 
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(budget.amount - summary.totalExpense)} remaining
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-muted-foreground">--</div>
              <p className="text-xs text-muted-foreground">No budget set</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Top Spending Category */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Spending Categories</CardTitle>
          <PieChart className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(summary.categoryTotals)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <Badge variant="outline">{category}</Badge>
                  <span className="font-semibold">{formatCurrency(amount)}</span>
                </div>
              ))
            }
          </div>
          {Object.keys(summary.categoryTotals).length === 0 && (
            <p className="text-sm text-muted-foreground">No expenses categorized yet</p>
          )}
        </CardContent>
      </Card>

      {/* Monthly Projection */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Projection</CardTitle>
          <Calendar className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {formatCurrency(summary.projectedMonthly)}
          </div>
          <p className="text-xs text-muted-foreground">
            Based on current spending pattern
          </p>
          {budget?.amount && (
            <div className="mt-2">
              <Badge 
                variant={summary.projectedMonthly > budget.amount ? "destructive" : "secondary"}
              >
                {summary.projectedMonthly > budget.amount 
                  ? `${formatCurrency(summary.projectedMonthly - budget.amount)} over budget`
                  : `${formatCurrency(budget.amount - summary.projectedMonthly)} under budget`
                }
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}