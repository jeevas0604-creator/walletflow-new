import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, TrendingDown, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  category: string;
  merchant?: string;
  occurred_at: string;
  description?: string;
  account?: string;
  tags?: string[];
}

export function AllTransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('occurred_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(transactions.map(t => t.category))].filter(Boolean);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
    
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      "Food": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Transport": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Shopping": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Entertainment": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "Bills": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Healthcare": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "Salary": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      "Other": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    };
    return colors[category as keyof typeof colors] || colors["Other"];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Loading Transactions...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-24 animate-pulse" />
                </div>
                <div className="h-5 bg-muted rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          All Transactions ({transactions.length})
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="debit">Expenses</SelectItem>
              <SelectItem value="credit">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {transactions.length === 0 
                ? "No transactions found. Add your first transaction using the form above." 
                : "No transactions match your filters."}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setTypeFilter("all");
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions.map(transaction => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${transaction.type === 'debit' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'}`}>
                    {transaction.type === 'debit' ? 
                      <TrendingDown className="h-4 w-4" /> : 
                      <TrendingUp className="h-4 w-4" />
                    }
                  </div>
                  
                  <div>
                    <div className="font-semibold">
                      {transaction.merchant || transaction.description || transaction.category}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(transaction.occurred_at).toLocaleString("en-IN", { 
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Kolkata"
                      })}
                    </div>
                    {transaction.account && (
                      <div className="text-xs text-muted-foreground">
                        Account: {transaction.account}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="secondary" 
                      className={getCategoryColor(transaction.category)}
                    >
                      {transaction.category}
                    </Badge>
                    {transaction.tags && transaction.tags.length > 0 && (
                      <div className="flex gap-1">
                        {transaction.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`font-bold text-lg ${
                    transaction.type === "debit" 
                      ? "text-red-600 dark:text-red-400" 
                      : "text-green-600 dark:text-green-400"
                  }`}>
                    {transaction.type === "debit" ? "-" : "+"}₹{transaction.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}