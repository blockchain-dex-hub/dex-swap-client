import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Swap from "@/pages/Swap";
import Bridge from "@/pages/Bridge";
import { WalletProvider } from "@/hooks/useWallet";
import { ChainProvider } from "@/hooks/useChainSelector";
import { LanguageProvider } from "@/hooks/useLanguage";
import Layout from "@/components/Layout";
import { ThemeProvider } from "next-themes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/swap" component={Swap} />
      <Route path="/bridge" component={Bridge} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <LanguageProvider>
          <ChainProvider>
            <WalletProvider>
              <TooltipProvider>
                <Layout>
                  <Toaster />
                  <Router />
                </Layout>
              </TooltipProvider>
            </WalletProvider>
          </ChainProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
