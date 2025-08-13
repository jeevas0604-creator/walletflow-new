import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Shield, CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import { ensureSmsPermission, readRecentMessages } from "@/plugins/smsInbox";
import { toast } from "@/components/ui/use-toast";

interface PermissionSetupProps {
  onComplete: () => void;
}

export function PermissionSetup({ onComplete }: PermissionSetupProps) {
  const [smsPermission, setSmsPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"intro" | "requesting" | "testing" | "complete">("intro");

  const handleRequestPermission = async () => {
    setLoading(true);
    setStep("requesting");

    try {
      const granted = await ensureSmsPermission();
      setSmsPermission(granted);
      
      if (granted) {
        setStep("testing");
        // Test reading a few messages to verify it works
        const messages = await readRecentMessages(7, 10);
        
        toast({
          title: "Permission granted!",
          description: `Found ${messages.length} recent SMS messages to analyze.`
        });
        
        setStep("complete");
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        toast({
          title: "Permission denied",
          description: "SMS permission is required for transaction tracking.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Permission error",
        description: "Failed to request SMS permission. Please try again.",
        variant: "destructive"
      });
      setSmsPermission(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          {step === "complete" ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : step === "testing" ? (
            <MessageSquare className="h-8 w-8 text-blue-500 animate-pulse" />
          ) : (
            <Smartphone className="h-8 w-8 text-primary" />
          )}
        </div>
        <CardTitle>
          {step === "complete" ? "Setup Complete!" : "SMS Permission Setup"}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {step === "intro" && (
          <>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                WalletFlow needs SMS permission to read bank notifications and extract transaction data automatically.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">Read bank SMS notifications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">Extract transaction amounts & merchants</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">Categorize expenses automatically</span>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Privacy:</strong> All SMS data is processed locally on your device. 
                No SMS content is uploaded to any server.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleRequestPermission} 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Requesting Permission..." : "Grant SMS Permission"}
            </Button>
          </>
        )}

        {step === "requesting" && (
          <div className="text-center space-y-4">
            <div className="animate-spin mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            <p className="text-sm text-muted-foreground">
              Please allow SMS permission in the system dialog...
            </p>
          </div>
        )}

        {step === "testing" && (
          <div className="text-center space-y-4">
            <div className="animate-pulse">
              <MessageSquare className="h-12 w-12 text-blue-500 mx-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Testing SMS access and scanning recent messages...
            </p>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <p className="font-semibold text-green-600">Permission Granted!</p>
              <p className="text-sm text-muted-foreground">
                WalletFlow can now track your transactions automatically.
              </p>
            </div>
          </div>
        )}

        {smsPermission === false && step !== "intro" && (
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                SMS permission was denied. You can manually add transactions or try again.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("intro")} className="flex-1">
                Try Again
              </Button>
              <Button onClick={onComplete} className="flex-1">
                Continue Anyway
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}