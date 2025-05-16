import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import NFTDetail from "./pages/NFTDetail";
import Map from "./pages/Map";
import Rewards from "./pages/Rewards";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { CivicAuthProvider, UserButton } from "@civic/auth-web3/react";
import { LoginContent } from "./pages/login";

const queryClient = new QueryClient();

const App = () => (
  <CivicAuthProvider clientId={"d36d9692-89a3-4850-8058-9c9ee767812e"}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />}>
              <Route index element={<Navigate to="/explore" replace />} />
              <Route path="explore" element={<Explore />} />
              <Route path="nft/:nftId" element={<NFTDetail />} />
              <Route path="map" element={<Map />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="shop" element={<Shop />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<LoginContent />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </CivicAuthProvider>
);

export default App;
