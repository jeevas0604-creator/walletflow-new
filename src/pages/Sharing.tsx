import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Check, X, UserCheck, UserX, Share2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SharedAccount {
  id: string;
  owner_id: string;
  shared_with_id: string;
  permission_level: 'view' | 'edit';
  shared_at: string;
  accepted_at?: string;
  status: 'pending' | 'accepted' | 'declined';
  profiles?: {
    display_name?: string;
  };
}

export default function Sharing() {
  const [sharedAccounts, setSharedAccounts] = useState<SharedAccount[]>([]);
  const [receivedShares, setReceivedShares] = useState<SharedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const { toast } = useToast();

  useEffect(() => {
    fetchSharedAccounts();
  }, []);

  const fetchSharedAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch accounts shared by current user
      const { data: sharedByMe, error: sharedError } = await supabase
        .from('shared_accounts')
        .select('*')
        .eq('owner_id', user.id)
        .order('shared_at', { ascending: false });

      if (sharedError) throw sharedError;

      // Fetch accounts shared with current user
      const { data: sharedWithMe, error: receivedError } = await supabase
        .from('shared_accounts')
        .select('*')
        .eq('shared_with_id', user.id)
        .order('shared_at', { ascending: false });

      if (receivedError) throw receivedError;

      setSharedAccounts(sharedByMe as SharedAccount[] || []);
      setReceivedShares(sharedWithMe as SharedAccount[] || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch shared accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const shareAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First, find the user by email (in a real app, you'd have a proper user search)
      // For now, we'll use a simple email validation
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // In a real implementation, you'd look up the user by email
      // For demo purposes, we'll create a placeholder entry
      const shareData = {
        owner_id: user.id,
        shared_with_id: 'placeholder-user-id', // In real app, get from user lookup
        permission_level: permission,
        status: 'pending' as const
      };

      const { error } = await supabase
        .from('shared_accounts')
        .insert([shareData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Account shared with ${email}`,
      });

      setEmail("");
      setPermission('view');
      setOpen(false);
      fetchSharedAccounts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to share account",
        variant: "destructive",
      });
    }
  };

  const respondToShare = async (shareId: string, action: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('shared_accounts')
        .update({ 
          status: action,
          accepted_at: action === 'accepted' ? new Date().toISOString() : null
        })
        .eq('id', shareId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Share request ${action}`,
      });

      fetchSharedAccounts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to respond to share request",
        variant: "destructive",
      });
    }
  };

  const revokeShare = async (shareId: string) => {
    try {
      const { error } = await supabase
        .from('shared_accounts')
        .delete()
        .eq('id', shareId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Share access revoked",
      });

      fetchSharedAccounts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke share access",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Account Sharing</h1>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Account Sharing
          </h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Share Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="friend@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="permission">Permission Level</Label>
                  <Select value={permission} onValueChange={(value: 'view' | 'edit') => setPermission(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="edit">View & Edit</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    {permission === 'view' 
                      ? 'They can view your transactions and insights' 
                      : 'They can view and add transactions to your account'
                    }
                  </p>
                </div>
                <Button onClick={shareAccount} className="w-full">
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="shared-by-me" className="space-y-4">
          <TabsList>
            <TabsTrigger value="shared-by-me">Shared by Me</TabsTrigger>
            <TabsTrigger value="shared-with-me">Shared with Me</TabsTrigger>
          </TabsList>

          <TabsContent value="shared-by-me">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Accounts You've Shared
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sharedAccounts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>You haven't shared your account with anyone yet.</p>
                    <p className="text-sm">Share your account to collaborate with family or friends!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sharedAccounts.map((share) => (
                      <div key={share.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {share.profiles?.display_name || 'User'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Shared on {new Date(share.shared_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            share.status === 'accepted' ? 'default' : 
                            share.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {share.status === 'accepted' ? (
                              <UserCheck className="h-3 w-3 mr-1" />
                            ) : share.status === 'pending' ? (
                              <Clock className="h-3 w-3 mr-1" />
                            ) : (
                              <UserX className="h-3 w-3 mr-1" />
                            )}
                            {share.status}
                          </Badge>
                          <Badge variant="outline">
                            {share.permission_level}
                          </Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeShare(share.id)}
                          >
                            Revoke
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shared-with-me">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Accounts Shared with You
                </CardTitle>
              </CardHeader>
              <CardContent>
                {receivedShares.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No accounts have been shared with you yet.</p>
                    <p className="text-sm">When someone shares their account, you'll see it here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedShares.map((share) => (
                      <div key={share.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {share.profiles?.display_name || 'User'}'s Account
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Shared on {new Date(share.shared_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {share.permission_level}
                          </Badge>
                          {share.status === 'pending' ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => respondToShare(share.id, 'accepted')}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => respondToShare(share.id, 'declined')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          ) : (
                            <Badge variant={share.status === 'accepted' ? 'default' : 'destructive'}>
                              {share.status === 'accepted' ? (
                                <UserCheck className="h-3 w-3 mr-1" />
                              ) : (
                                <UserX className="h-3 w-3 mr-1" />
                              )}
                              {share.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}