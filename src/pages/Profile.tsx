"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNFT } from "@/contexts/NFTContext";
import {
  User,
  MapPin,
  Award,
  Share2,
  Wallet,
  Clock,
  Grid,
  List,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@civic/auth-web3/react";

const categoryColors = {
  common: "bg-gray-100 text-gray-800 border-gray-200",
  rare: "bg-blue-100 text-blue-800 border-blue-200",
  epic: "bg-purple-100 text-purple-800 border-purple-200",
  legendary: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function Profile() {
  const { claimedNFTs } = useNFT();
  const [activeTab, setActiveTab] = useState("collection");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useUser();

  const getCategoryColor = (category: string) => {
    return (
      categoryColors[category as keyof typeof categoryColors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const sortedNFTs = [...claimedNFTs].sort((a, b) => {
    return new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime();
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-none shadow-xl">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-800" />
            <div className="absolute -bottom-12 left-0 w-full px-6 flex justify-between">
              <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
                <AvatarImage src={user.picture} />
                <AvatarFallback className="bg-gray-200">
                  <User className="h-10 w-10 text-gray-500" />
                </AvatarFallback>
              </Avatar>

              <div className="flex space-x-2 self-end mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-white/90 backdrop-blur-sm"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-white/90 backdrop-blur-sm"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                <p className="text-gray-500">NFT Collector & Explorer</p>
              </div>

              <div className="flex gap-4 self-start sm:self-end">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {claimedNFTs.length}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    NFTs
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Shops
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">120</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Points
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs
          defaultValue="collection"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger
                value="collection"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Collection
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="rewards"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Rewards
              </TabsTrigger>
            </TabsList>

            {activeTab === "collection" && claimedNFTs.length > 0 && (
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-none ${
                    viewMode === "grid" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-none ${
                    viewMode === "list" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="collection" className="space-y-6 mt-0">
            <AnimatePresence mode="wait">
              {claimedNFTs.length > 0 ? (
                viewMode === "grid" ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {sortedNFTs.map((nft, index) => (
                      <motion.div
                        key={nft.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-all group">
                          <div
                            className="aspect-[4/3] bg-cover bg-center relative"
                            style={{
                              backgroundImage: nft.imageUrl
                                ? `url(${nft.imageUrl})`
                                : "",
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                              <h3 className="font-semibold">{nft.name}</h3>
                              <div className="flex items-center text-white/80 text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{nft.shopName}</span>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className={getCategoryColor(nft.category)}>
                                {nft.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3 flex justify-between items-center bg-gray-50">
                            <div className="flex items-center text-gray-500 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(nft.claimedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 -mr-2"
                            >
                              View
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {sortedNFTs.map((nft, index) => (
                      <motion.div
                        key={nft.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-all">
                          <div className="flex items-center p-3">
                            <div
                              className="h-16 w-16 rounded-md bg-cover bg-center flex-shrink-0"
                              style={{
                                backgroundImage: nft.imageUrl
                                  ? `url(${nft.imageUrl})`
                                  : "",
                              }}
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{nft.name}</h3>
                                  <div className="flex items-center text-gray-500 text-xs">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>{nft.shopName}</span>
                                  </div>
                                </div>
                                <Badge
                                  className={getCategoryColor(nft.category)}
                                >
                                  {nft.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="ml-3 flex items-center gap-3">
                              <div className="text-right text-xs text-gray-500">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {new Date(nft.claimedAt).toLocaleDateString()}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border-2 border-dashed border-gray-200 p-10 text-center"
                >
                  <div className="inline-flex rounded-full bg-gray-100 p-3 mb-4">
                    <Award className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No NFTs Claimed Yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mt-2">
                    Explore nearby shops and scan QR codes to claim exclusive
                    NFTs
                  </p>
                  <Button
                    className="mt-4 bg-gray-900 hover:bg-gray-800"
                    onClick={() => (window.location.href = "/explore")}
                  >
                    Explore NFTs
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <AnimatePresence>
              {sortedNFTs.length > 0 ? (
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {sortedNFTs.map((nft, index) => (
                    <motion.div
                      key={nft.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Award className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">
                              Claimed NFT: {nft.name}
                            </p>
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
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="rounded-lg border-2 border-dashed border-gray-200 p-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-500">No activity yet</p>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="rewards" className="mt-0">
            <motion.div
              className="rounded-lg border-2 border-dashed border-gray-200 p-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="inline-flex rounded-full bg-gray-100 p-3 mb-4">
                <Award className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Rewards Coming Soon
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                We're preparing exclusive rewards for collectors. Keep
                collecting NFTs to earn points!
              </p>

              <div className="mt-6 max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-gray-900 h-2 rounded-full w-[35%]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>120 points</span>
                  <span>350 points needed for next reward</span>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
