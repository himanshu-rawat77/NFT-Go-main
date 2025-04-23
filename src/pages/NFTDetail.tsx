
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNFT } from "@/contexts/NFTContext";
import { MapPin, Navigation, ArrowRight, Share2, Award } from "lucide-react";

const categoryColors = {
  common: "bg-gray-100 text-gray-800",
  rare: "bg-blue-100 text-blue-800",
  epic: "bg-purple-100 text-purple-800",
  legendary: "bg-amber-100 text-amber-800",
};

export default function NFTDetail() {
  const { nftId } = useParams<{ nftId: string }>();
  const { nfts, selectedNFT, setSelectedNFT } = useNFT();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedNFT && nftId) {
      const nft = nfts.find(n => n.id === nftId);
      if (nft) {
        setSelectedNFT(nft);
      } else {
        navigate('/explore');
      }
    }
    
    return () => {
      // Clean up when leaving this page
      setSelectedNFT(null);
    };
  }, [nftId, nfts, selectedNFT, setSelectedNFT, navigate]);

  const handleNavigateToMap = () => {
    navigate(`/map?nft=${selectedNFT?.id || nftId}`);
  };

  if (!selectedNFT) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">NFT Details</h1>
      </div>

      <Card className="overflow-hidden">
        <div 
          className="h-64 w-full bg-cover bg-center" 
          style={{ backgroundImage: selectedNFT.imageUrl ? `url(${selectedNFT.imageUrl})` : '' }}
        />
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{selectedNFT.name}</h2>
            <Badge className={getCategoryColor(selectedNFT.category)}>
              {selectedNFT.category}
            </Badge>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{selectedNFT.shopName}</span>
            {selectedNFT.distance && (
              <span className="ml-2">({selectedNFT.distance} km away)</span>
            )}
          </div>
          
          <p className="text-gray-700">{selectedNFT.description}</p>
          
          <div className="pt-4 flex space-x-2">
            <Button 
              className="flex-1 gap-2" 
              onClick={handleNavigateToMap}
            >
              <Navigation className="h-4 w-4" />
              Find This NFT
            </Button>
            
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Rewards for collecting this NFT</h3>
        <Card className="p-4 flex items-center space-x-3">
          <div className="bg-violet-100 p-2 rounded-full">
            <Award className="h-5 w-5 text-violet-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Special Discount</h4>
            <p className="text-sm text-gray-500">10% off your next purchase at {selectedNFT.shopName}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </Card>
      </div>
      
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-700">
          Visit <span className="font-semibold">{selectedNFT.shopName}</span> and scan the QR code to claim this NFT
        </p>
      </div>
    </div>
  );
}
