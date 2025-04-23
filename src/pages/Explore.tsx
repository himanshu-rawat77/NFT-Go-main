import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNFT } from "@/contexts/NFTContext";
import { MapPin, Grid2x2, Filter, Navigation, Loader2 } from "lucide-react";
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
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

const categoryColors = {
  common: "bg-gray-100 text-gray-800",
  rare: "bg-blue-100 text-blue-800",
  epic: "bg-purple-100 text-purple-800",
  legendary: "bg-amber-100 text-amber-800",
};

export default function Explore() {
  const { 
    nfts, 
    loading, 
    setSelectedNFT, 
    refreshNFTs, 
    userLocation,
    watchUserLocation
  } = useNFT();
  
  const [category, setCategory] = useState("all");
  const [maxDistance, setMaxDistance] = useState(5);
  const navigate = useNavigate();

  // Start watching location when component mounts
  useEffect(() => {
    watchUserLocation();
  }, [watchUserLocation]);

  // Calculate distances for NFTs based on user location
  const getNFTsWithDistance = () => {
    if (!userLocation) return nfts;

    return nfts.map(nft => {
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
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Number(distance.toFixed(1));
  };

  const filteredNfts = getNFTsWithDistance().filter(nft => {
    let categoryMatch = true;
    let distanceMatch = true;
    
    if (category && category !== 'all') {
      categoryMatch = nft.category === category;
    }
    
    if (maxDistance && nft.distance) {
      distanceMatch = nft.distance <= maxDistance;
    }
    
    return categoryMatch && distanceMatch;
  }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  const handleViewNFT = (id: string) => {
    const nft = nfts.find(n => n.id === id);
    if (nft) {
      setSelectedNFT(nft);
      navigate(`/nft/${id}`);
    }
  };

  const handleNavigateToMap = (nftId: string) => {
    navigate(`/map?nft=${nftId}`);
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Explore NFTs</h1>
          {!userLocation && (
            <div className="flex items-center text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Getting location...
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter NFTs</SheetTitle>
                <SheetDescription>
                  Customize your NFT exploration
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
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
                    <label className="text-sm font-medium">Max Distance</label>
                    <span className="text-sm text-gray-500">{maxDistance} km</span>
                  </div>
                  <Slider 
                    value={[maxDistance]} 
                    min={0.5} 
                    max={10} 
                    step={0.5} 
                    onValueChange={(values) => setMaxDistance(values[0])}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNfts.map((nft) => (
          <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div 
              className="h-48 bg-cover bg-center bg-gradient-to-br from-violet-100 to-blue-100" 
              style={{ backgroundImage: nft.imageUrl ? `url(${nft.imageUrl})` : '' }}
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{nft.name}</h3>
                <Badge className={getCategoryColor(nft.category)}>
                  {nft.category}
                </Badge>
              </div>
              <p className="text-gray-500 text-sm mb-2">{nft.shopName}</p>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{nft.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  {nft.distance ? `${nft.distance} km away` : 'Getting location...'}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleNavigateToMap(nft.id)}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Navigate
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleViewNFT(nft.id)}
                  >
                    View NFT
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredNfts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <MapPin className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No NFTs Found</h3>
            <p className="text-gray-500 max-w-md mt-2">
              Try adjusting your filters or explore different areas to find NFTs.
            </p>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-500 text-sm py-4">
        {loading ? 'Loading NFTs...' : 'Pull down to refresh'}
      </div>
    </div>
  );
}
