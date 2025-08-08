import { useEffect } from "react";

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
  useEffect(() => setSeo(), []);
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Walletflow Dashboard</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </section>
    </main>
  );
};

export default Index;
