
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Store, Users, TrendingUp, History } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const premiumNFTs = [
  {
    id: 'p1',
    name: 'Premium NFT #1',
    description: 'Exclusive digital collectible from Local Shop A with unique attributes and benefits.',
    price: '0.1 ETH',
    shopName: 'Local Shop A',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    rarity: 'Rare',
    attributes: ['Animated', 'Limited Edition']
  },
  {
    id: 'p2',
    name: 'Premium NFT #2',
    description: 'Limited edition NFT from Local Shop B with special access to exclusive in-store benefits.',
    price: '0.2 ETH',
    shopName: 'Local Shop B',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    rarity: 'Epic',
    attributes: ['Interactive', 'Unlocks Rewards']
  },
  {
    id: 'p3',
    name: 'Legendary Collection',
    description: 'A legendary NFT collection by Digital Gallery, featuring stunning artwork by renowned digital artists.',
    price: '0.5 ETH',
    shopName: 'Digital Gallery',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    rarity: 'Legendary',
    attributes: ['Artist Signature', '3D Model', 'AR Experience']
  },
];

const recentPurchases = [
  {
    id: 'rp1',
    nftName: 'Premium NFT #1',
    buyer: 'User123',
    timeAgo: '5 minutes ago',
    price: '0.1 ETH'
  },
  {
    id: 'rp2',
    nftName: 'Legendary Collection',
    buyer: 'NFTCollector',
    timeAgo: '2 hours ago',
    price: '0.5 ETH'
  },
];

export default function Shop() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("premium");

  const handlePurchase = (nftId: string) => {
    toast({
      title: "Purchase Initiated",
      description: "This feature will be available in future updates",
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-100 text-gray-800';
      case 'Rare': return 'bg-blue-100 text-blue-800';
      case 'Epic': return 'bg-purple-100 text-purple-800';
      case 'Legendary': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Premium NFT Shop</h1>
        <Button variant="outline" className="gap-2">
          <Store className="h-4 w-4" />
          View All Shops
        </Button>
      </div>
      
      <Tabs defaultValue="premium" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="premium">
            Premium NFTs
          </TabsTrigger>
          <TabsTrigger value="trending">
            Trending
          </TabsTrigger>
          <TabsTrigger value="recent">
            Recent Purchases
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="premium" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumNFTs.map((nft) => (
              <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${nft.image})` }}
                />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{nft.name}</h3>
                    <Badge className={getRarityColor(nft.rarity)}>
                      {nft.rarity}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-2">By: {nft.shopName}</p>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{nft.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {nft.attributes.map((attr, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-violet-700">{nft.price}</p>
                    <Button 
                      className="gap-2" 
                      onClick={() => handlePurchase(nft.id)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Purchase
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trending">
          <div className="rounded-lg border bg-gray-50 p-10 text-center">
            <div className="inline-flex rounded-full bg-gray-100 p-3 mb-4">
              <TrendingUp className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Trending NFTs Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
              We're analyzing the most popular NFTs across local shops. 
              Check back soon to discover trending collections!
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="space-y-4">
            {recentPurchases.map((purchase) => (
              <Card key={purchase.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium">{purchase.buyer} purchased</p>
                      <p className="text-sm text-gray-500">{purchase.nftName} for {purchase.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <History className="h-3 w-3 mr-1" />
                    {purchase.timeAgo}
                  </div>
                </div>
              </Card>
            ))}
            
            <div className="text-center py-4">
              <Button variant="outline" className="gap-2">
                <History className="h-4 w-4" />
                View All Activity
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="p-6 rounded-lg bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100">
        <h2 className="text-xl font-semibold mb-3">NFT Marketplace - Coming Soon</h2>
        <p className="text-gray-700 mb-4">
          We're working on a new marketplace where you can trade NFTs with other users, 
          participate in auctions, and explore the secondary market for limited editions.
        </p>
        <Button variant="outline" className="bg-white">
          Join Waitlist
        </Button>
      </div>
    </div>
  );
}
