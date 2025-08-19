import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSmsTransactions } from "@/hooks/useSmsTransactions";
import { getDecrypted } from "@/lib/secureStore";
import { FinancialSummary } from "@/components/dashboard/FinancialSummary";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PermissionSetup } from "@/components/onboarding/PermissionSetup";
import { toast } from "@/components/ui/use-toast";
import { Settings, Menu, User, LogOut, TrendingUp, Users } from "lucide-react";
import { SavingsGoals } from "@/components/dashboard/SavingsGoals";
import { supabase } from "@/integrations/supabase/client";

const setSeo = () => {
  document.title = "WalletFlow – Smart Expense Tracker";
  const desc = "Track your expenses automatically with AI-powered SMS transaction analysis. Budgets, insights, and financial control.";
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

export default function Index() {
  const navigate = useNavigate();
  const { transactions, totals, loading: smsLoading, error, restore } = useSmsTransactions();
  const [budget, setBudget] = useState<{ amount: number; month_year: string } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setSeo();

    // Load user profile
    const guestProfile = localStorage.getItem('guest_profile');
    if (guestProfile) {
      setUserProfile(JSON.parse(guestProfile));
    }

    // Load budget and start transaction scanning
    loadBudget();
    restore();
  }, []);

  const loadBudget = async () => {
    try {
      const budgetData = await getDecrypted<{ amount: number; month_year: string }>("budget", null);
      if (budgetData?.amount) {
        setBudget(budgetData);
      }
    } catch (error) {
      console.warn("Failed to load budget:", error);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.removeItem('onboarding_needs_permission');
    
    // Trigger SMS scan after permission is granted
    restore();
    
    toast({
      title: "Welcome to WalletFlow!",
      description: "Your transaction tracking is now set up."
    });
  };

  const handleRefreshTransactions = () => {
    restore();
  };

  const handleBudgetUpdate = (newBudget: { amount: number; month_year: string }) => {
    setBudget(newBudget);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      localStorage.removeItem('guest_active');
      localStorage.removeItem('guest_profile');
      navigate('/auth');
    }
  };

  const handleGuestLogout = () => {
    localStorage.removeItem('guest_active');
    localStorage.removeItem('guest_profile');
    navigate('/auth');
  };


  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">WalletFlow</h1>
              <p className="text-sm text-muted-foreground">Smart Expense Tracker</p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {userProfile && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{userProfile.name}</span>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/insights')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Insights
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/sharing')}
              >
                <Users className="h-4 w-4 mr-2" />
                Sharing
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={userProfile ? handleGuestLogout : handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {userProfile ? 'Exit Guest' : 'Logout'}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pt-4 border-t space-y-2">
              {userProfile && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{userProfile.name}</span>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/insights');
                  setShowMobileMenu(false);
                }}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Insights
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/sharing');
                  setShowMobileMenu(false);
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Sharing
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/settings');
                  setShowMobileMenu(false);
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  userProfile ? handleGuestLogout() : handleLogout();
                  setShowMobileMenu(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {userProfile ? 'Exit Guest Mode' : 'Logout'}
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Financial Summary */}
        <FinancialSummary transactions={transactions} budget={budget || undefined} />

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <TransactionList transactions={transactions} loading={smsLoading} />
            <SavingsGoals />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions 
              onRefreshTransactions={handleRefreshTransactions}
              onNavigateToSettings={() => navigate('/settings')}
              budget={budget || undefined}
              onBudgetUpdate={handleBudgetUpdate}
            />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Transactions</span>
                  <Badge variant="secondary">{transactions.length}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <Badge variant="secondary">
                    {transactions.filter(t => 
                      t.occurred_at.startsWith(new Date().toISOString().slice(0, 7))
                    ).length}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Categories</span>
                  <Badge variant="secondary">
                    {new Set(transactions.map(t => t.category)).size}
                  </Badge>
                </div>

                {totals.topCategory !== "None" && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Top Category</span>
                    <Badge variant="outline">{totals.topCategory}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Explore</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate('/insights')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Financial Insights
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate('/sharing')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Account Sharing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <Card className="border-destructive">
            <CardContent className="pt-4">
              <p className="text-sm text-destructive">{error}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 w-full"
                onClick={handleRefreshTransactions}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
