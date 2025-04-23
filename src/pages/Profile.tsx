
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNFT } from "@/contexts/NFTContext";
import { User, MapPin, Award, Share2, Wallet, Clock } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const categoryColors = {
  common: "bg-gray-100 text-gray-800",
  rare: "bg-blue-100 text-blue-800",
  epic: "bg-purple-100 text-purple-800",
  legendary: "bg-amber-100 text-amber-800",
};

export default function Profile() {
  const { claimedNFTs } = useNFT();
  const [activeTab, setActiveTab] = useState("collection");

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800";
  };

  const sortedNFTs = [...claimedNFTs].sort((a, b) => {
    return new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime();
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80" />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Alex Johnson</h1>
            <p className="text-gray-500 mb-4">NFT Collector & Explorer</p>
            
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <Button variant="outline" size="sm" className="gap-1">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="h-4 w-4" />
                Share Profile
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center w-full sm:w-auto">
            <h3 className="font-medium text-lg">Collection Stats</h3>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-2xl font-bold">{claimedNFTs.length}</p>
                <p className="text-sm text-gray-500">NFTs Claimed</p>
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-500">Shops Visited</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="collection" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="collection" className="space-y-6">
          {claimedNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNFTs.map((nft) => (
                <Card key={nft.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div 
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: nft.imageUrl ? `url(${nft.imageUrl})` : '' }}
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{nft.name}</h3>
                      <Badge className={getCategoryColor(nft.category)}>
                        {nft.category}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{nft.shopName}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Claimed {new Date(nft.claimedAt).toLocaleDateString()}</span>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-gray-50 p-10 text-center">
              <div className="inline-flex rounded-full bg-gray-100 p-3 mb-4">
                <Award className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No NFTs Claimed Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                Explore nearby shops and scan QR codes to claim exclusive NFTs
              </p>
              <Button className="mt-4" onClick={() => window.location.href = '/explore'}>
                Explore NFTs
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="space-y-4">
            {sortedNFTs.length > 0 ? (
              sortedNFTs.map((nft) => (
                <Card key={nft.id} className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Claimed NFT: {nft.name}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{nft.shopName}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(nft.claimedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="rounded-lg border bg-gray-50 p-10 text-center">
                <p className="text-gray-500">No activity yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="rewards">
          <div className="rounded-lg border bg-gray-50 p-10 text-center">
            <div className="inline-flex rounded-full bg-gray-100 p-3 mb-4">
              <Award className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Rewards Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
              We're preparing exclusive rewards for collectors. Keep collecting NFTs to earn points!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
