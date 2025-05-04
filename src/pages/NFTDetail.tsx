import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNFT } from "@/contexts/NFTContext";
import {
  MapPin,
  Navigation,
  ArrowRight,
  Share2,
  Award,
  ArrowLeft,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";

const categoryColors = {
  common: "bg-gray-100 text-gray-800 border-gray-200",
  rare: "bg-blue-100 text-blue-800 border-blue-200",
  epic: "bg-purple-100 text-purple-800 border-purple-200",
  legendary: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function NFTDetail() {
  const { nftId } = useParams<{ nftId: string }>();
  const { nfts, selectedNFT, setSelectedNFT } = useNFT();
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedNFT && nftId) {
      const nft = nfts.find((n) => n.id === nftId);
      if (nft) {
        setSelectedNFT(nft);
      } else {
        navigate("/explore");
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    return (
      categoryColors[category as keyof typeof categoryColors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center space-x-2 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="group text-amber-700 hover:text-amber-800 hover:bg-amber-50"
        >
          <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          NFT Details
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-none shadow-xl">
          <div className="relative">
            <motion.div
              className="h-72 w-full bg-cover bg-center"
              style={{
                backgroundImage: selectedNFT.imageUrl
                  ? `url(${selectedNFT.imageUrl})`
                  : "",
              }}
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </motion.div>

            <div className="absolute top-4 right-4">
              <Badge
                className={`${getCategoryColor(
                  selectedNFT.category
                )} shadow-md`}
              >
                {selectedNFT.category}
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <motion.h2
                className="text-3xl font-bold mb-2 drop-shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {selectedNFT.name}
              </motion.h2>

              <motion.div
                className="flex items-center text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <MapPin className="h-4 w-4 mr-1" />
                <span className="font-medium">{selectedNFT.shopName}</span>
                {selectedNFT.distance && (
                  <span className="ml-2 text-white/70">
                    ({selectedNFT.distance} km away)
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          <div className="p-6 space-y-6 bg-white">
            <motion.p
              className="text-gray-700 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {selectedNFT.description}
            </motion.p>

            <motion.div
              className="pt-4 flex space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                className="flex-1 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
                onClick={handleNavigateToMap}
              >
                <Navigation className="h-4 w-4" />
                Find This NFT
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-amber-800">
          Rewards for collecting this NFT
        </h3>
        <Card className="p-5 border-amber-100 hover:shadow-md transition-all">
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Special Discount</h4>
              <p className="text-gray-500">
                10% off your next purchase at {selectedNFT.shopName}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-amber-400" />
          </motion.div>
        </Card>
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 text-center shadow-inner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center justify-center mb-3">
          <Compass className="h-5 w-5 text-amber-600 mr-2" />
          <p className="text-amber-800 font-medium">Claim Instructions</p>
        </div>
        <p className="text-amber-700">
          Visit <span className="font-semibold">{selectedNFT.shopName}</span>{" "}
          and scan the QR code to claim this NFT
        </p>
      </motion.div>
    </div>
  );
}
