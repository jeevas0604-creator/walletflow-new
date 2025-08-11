import { PropsWithChildren, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const guestActive = localStorage.getItem('guest_active') === 'true';
      setIsAuthed(!!session?.user || guestActive);
    });

    const init = async () => {
      const guestActive = localStorage.getItem('guest_active') === 'true';
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthed(!!session?.user || guestActive);
      setLoading(false);
    };
    init();

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Loading...
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
