"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNFT } from "@/contexts/NFTContext";
import { useUser } from "@civic/auth-web3/react";
import {
  MapPin,
  Filter,
  Navigation,
  Loader2,
  X,
  Compass,
  ArrowRight,
  LogOut,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

const categoryColors = {
  common: "bg-gray-100 text-gray-800 border-gray-200",
  rare: "bg-blue-100 text-blue-800 border-blue-200",
  epic: "bg-purple-100 text-purple-800 border-purple-200",
  legendary: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function Explore() {
  const {
    nfts,
    loading,
    setSelectedNFT,
    refreshNFTs,
    userLocation,
    watchUserLocation,
  } = useNFT();

  const user = useUser();
  const [category, setCategory] = useState("all");
  const [maxDistance, setMaxDistance] = useState(5);
  const [expandedNft, setExpandedNft] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Start watching location when component mounts
  useEffect(() => {
    watchUserLocation();
  }, []);

  // Calculate distances for NFTs based on user location
  const getNFTsWithDistance = () => {
    if (!userLocation) return nfts;

    return nfts.map((nft) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        nft.location.lat,
        nft.location.lng
      );
      return { ...nft, distance };
    });
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Number(distance.toFixed(1));
  };

  const filteredNfts = getNFTsWithDistance()
    .filter((nft) => {
      let categoryMatch = true;
      let distanceMatch = true;

      if (category && category !== "all") {
        categoryMatch = nft.category === category;
      }

      if (maxDistance && nft.distance) {
        distanceMatch = nft.distance <= maxDistance;
      }

      return categoryMatch && distanceMatch;
    })
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const handleViewNFT = (id: string) => {
    const nft = nfts.find((n) => n.id === id);
    if (nft) {
      setSelectedNFT(nft);
      navigate(`/nft/${id}`);
    }
  };

  const handleNavigateToMap = (nftId: string) => {
    navigate(`/map?nft=${nftId}`);
  };

  const getCategoryColor = (category: string) => {
    return (
      categoryColors[category as keyof typeof categoryColors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const toggleExpandNft = (id: string) => {
    if (expandedNft === id) {
      setExpandedNft(null);
    } else {
      setExpandedNft(id);
      // Scroll to the expanded card
      setTimeout(() => {
        const element = document.getElementById(`nft-card-${id}`);
        if (element && containerRef.current) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await user.signOut();

      // Show loader for 2 seconds before redirecting
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoggingOut(false);
    }
  };

  console.log("user", user);

  return (
    <div className="space-y-6" ref={containerRef}>
      <motion.div
        className="flex justify-between items-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Explore NFTs
          </h1>
          {!userLocation && (
            <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Getting location...
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Sheet open={isFiltering} onOpenChange={setIsFiltering}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative overflow-hidden group"
              >
                <Filter className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="absolute inset-0 bg-amber-100 opacity-0 group-hover:opacity-20 transition-opacity" />
              </Button>
            </SheetTrigger>
            <SheetContent className="border-l-amber-200">
              <SheetHeader>
                <SheetTitle className="text-amber-800">Filter NFTs</SheetTitle>
                <SheetDescription>
                  Customize your NFT exploration experience
                </SheetDescription>
              </SheetHeader>

              <motion.div
                className="space-y-6 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-amber-800">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-amber-200 focus:ring-amber-400">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-amber-800">
                      Max Distance
                    </label>
                    <span className="text-sm text-amber-600">
                      {maxDistance} km
                    </span>
                  </div>
                  <Slider
                    value={[maxDistance]}
                    min={0.5}
                    max={10}
                    step={0.5}
                    onValueChange={(values) => setMaxDistance(values[0])}
                    className="[&>span]:bg-amber-400"
                  />
                </div>

                <SheetClose asChild>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    Apply Filters
                  </Button>
                </SheetClose>
              </motion.div>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-amber-200 hover:bg-amber-50 transition-all"
              >
                {user.user === null ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                    <span className="text-sm text-amber-600">
                      Authenticating...
                    </span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 text-amber-600" />
                    <span className="max-w-[100px] truncate text-sm">
                      {user.user?.name || "User"}
                    </span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>

            {user.authStatus === "authenticated" && (
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredNfts.map((nft) => {
            const isExpanded = expandedNft === nft.id;
            return (
              <motion.div
                key={nft.id}
                id={`nft-card-${nft.id}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  zIndex: isExpanded ? 10 : 1,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  layout: { duration: 0.3 },
                }}
                className={`${
                  isExpanded ? "md:col-span-2 lg:col-span-3 relative z-10" : ""
                }`}
              >
                <Card
                  className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isExpanded
                      ? "shadow-2xl"
                      : "hover:shadow-amber-100 cursor-pointer"
                  }`}
                  onClick={() => !isExpanded && toggleExpandNft(nft.id)}
                >
                  <div className="relative">
                    <div
                      className={`bg-cover bg-center transition-all duration-500 ${
                        isExpanded ? "h-64" : "h-48"
                      }`}
                      style={{
                        backgroundImage: nft.imageUrl
                          ? `url(${nft.imageUrl})`
                          : "",
                        backgroundPosition: "center 30%",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    <div className="absolute top-3 right-3">
                      <Badge
                        className={`${getCategoryColor(
                          nft.category
                        )} border shadow-sm`}
                      >
                        {nft.category}
                      </Badge>
                    </div>

                    {isExpanded && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-3 left-3 bg-black/30 hover:bg-black/50 text-white border-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpandNft(nft.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-lg drop-shadow-md">
                        {nft.name}
                      </h3>
                      <div className="flex items-center text-white/90 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{nft.shopName}</span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="p-4 space-y-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-600">{nft.description}</p>

                        <div className="flex items-center text-amber-600 text-sm font-medium">
                          <MapPin className="h-4 w-4 mr-1" />
                          {nft.distance
                            ? `${nft.distance} km away`
                            : "Getting location..."}
                        </div>

                        <div className="flex space-x-3 pt-2">
                          <Button
                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewNFT(nft.id);
                            }}
                          >
                            <ArrowRight className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToMap(nft.id);
                            }}
                          >
                            <Navigation className="h-4 w-4" />
                            Navigate
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!isExpanded && (
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex items-center text-amber-600 text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {nft.distance ? `${nft.distance} km away` : "..."}
                      </div>
                      <div className="text-xs text-gray-500">Tap to view</div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredNfts.length === 0 && (
          <motion.div
            className="col-span-full flex flex-col items-center justify-center py-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-amber-100 p-5 mb-4">
              <Compass className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No NFTs Found</h3>
            <p className="text-gray-500 max-w-md mt-2">
              Try adjusting your filters or explore different areas to find
              NFTs.
            </p>
          </motion.div>
        )}
      </div>

      {expandedNft && (
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setExpandedNft(null)}
        />
      )}

      {/* Logout loading overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="relative mb-4">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 blur-xl opacity-70"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="relative h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-xl"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: -360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      },
                      scale: {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <Compass className="h-10 w-10 text-amber-500" />
                  </motion.div>
                </motion.div>
              </div>
              <motion.h3
                className="text-xl font-medium text-gray-800"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                Logging out...
              </motion.h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="text-center text-amber-600 text-sm py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {loading ? "Loading NFTs..." : "Pull down to refresh"}
      </motion.div>
    </div>
  );
}
