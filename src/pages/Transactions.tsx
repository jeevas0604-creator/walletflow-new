import { useState } from "react";
import TransactionForm from "@/components/transactions/TransactionForm";
import { AllTransactionsList } from "@/components/dashboard/AllTransactionsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetManager from "@/components/budget/BudgetManager";
import { Receipt, Target, List } from "lucide-react";

export default function Transactions() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Receipt className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Expense Management</h1>
        </div>

        <Tabs defaultValue="add-transaction" className="space-y-6">
          <TabsList>
            <TabsTrigger value="add-transaction" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Add Transaction
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Transaction History
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Budget Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add-transaction">
            <div className="max-w-2xl">
              <TransactionForm onSuccess={handleTransactionSuccess} />
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <AllTransactionsList key={refreshKey} />
          </TabsContent>

          <TabsContent value="budgets">
            <BudgetManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}