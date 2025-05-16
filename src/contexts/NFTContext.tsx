import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  shopName: string;
  category: "common" | "rare" | "epic" | "legendary";
  distance?: number; // in kilometers
  location: {
    lat: number;
    lng: number;
  };
}

interface ClaimedNFT extends NFT {
  claimedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  progress: number;
  shopName: string;
  reward: string;
  expiresAt?: Date;
  type: "shop" | "platform" | "event";
}

interface Shop {
  id: string;
  name: string;
  logo: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface NFTContextType {
  nfts: NFT[];
  claimedNFTs: ClaimedNFT[];
  tasks: Task[];
  shops: Shop[];
  claimNFT: (nft: NFT) => void;
  loading: boolean;
  error: string | null;
  selectedNFT: NFT | null;
  setSelectedNFT: (nft: NFT | null) => void;
  filterNFTs: (category?: string, distance?: number) => NFT[];
  refreshNFTs: () => Promise<void>;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  watchUserLocation: () => void;
  stopWatchingLocation: () => void;
}

const NFTContext = createContext<NFTContextType | undefined>(undefined);

const SAMPLE_LOCATIONS = [
  { lat: 28.4968497, lng: 77.244192, name: "India Gate Gallery" },
  { lat: 28.4996139, lng: 77.2457196, name: "National Gallery" },
  { lat: 28.5072521, lng: 77.2397517, name: "Children's Park Art Space" },
  { lat: 28.5083561, lng: 77.2317759, name: "Hyderabad House Collection" },
  { lat: 28.5015898, lng: 77.2373485, name: "National Stadium NFT Hub" },
  { lat: 28.5061144, lng: 77.2402497, name: "C-Hexagon Digital Gallery" },
  { lat: 28.5061144, lng: 77.2362497, name: "Central Vista Art Space" },
  { lat: 28.5051144, lng: 77.2382497, name: "India Gate NFT Market" },
];

export function NFTProvider({ children }: { children: ReactNode }) {
  const [nfts, setNfts] = useState<NFT[]>([
    {
      id: "1",
      name: "India Gate Digital Art #1",
      description:
        "Exclusive digital collectible from the iconic India Gate. Limited edition design capturing the monument's majestic spirit.",
      imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
      shopName: SAMPLE_LOCATIONS[0].name,
      category: "rare",
      location: { lat: SAMPLE_LOCATIONS[0].lat, lng: SAMPLE_LOCATIONS[0].lng },
    },
    {
      id: "2",
      name: "National Gallery View",
      description:
        "Iconic Delhi NFT featuring a unique perspective of the National Gallery. Collect this piece of architectural history.",
      imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
      shopName: SAMPLE_LOCATIONS[1].name,
      category: "legendary",
      location: { lat: SAMPLE_LOCATIONS[1].lat, lng: SAMPLE_LOCATIONS[1].lng },
    },
    {
      id: "3",
      name: "Children's Park Collection",
      description:
        "Contemporary NFT art inspired by the vibrant Children's Park area. Each piece tells a unique story.",
      imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      shopName: SAMPLE_LOCATIONS[2].name,
      category: "epic",
      location: { lat: SAMPLE_LOCATIONS[2].lat, lng: SAMPLE_LOCATIONS[2].lng },
    },
    {
      id: "4",
      name: "Hyderabad House Series",
      description:
        "Sophisticated digital art collection from the Hyderabad House area. Limited availability.",
      imageUrl: "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07",
      shopName: SAMPLE_LOCATIONS[3].name,
      category: "rare",
      location: { lat: SAMPLE_LOCATIONS[3].lat, lng: SAMPLE_LOCATIONS[3].lng },
    },
    {
      id: "5",
      name: "Stadium Masterpiece",
      description:
        "Dynamic NFT artwork capturing the energy of National Stadium area. A must-have for digital art collectors.",
      imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df",
      shopName: SAMPLE_LOCATIONS[4].name,
      category: "epic",
      location: { lat: SAMPLE_LOCATIONS[4].lat, lng: SAMPLE_LOCATIONS[4].lng },
    },
    {
      id: "6",
      name: "C-Hexagon Collection",
      description:
        "Premium digital collectible from the prestigious C-Hexagon area. Exclusive to this location.",
      imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      shopName: SAMPLE_LOCATIONS[5].name,
      category: "legendary",
      location: { lat: SAMPLE_LOCATIONS[5].lat, lng: SAMPLE_LOCATIONS[5].lng },
    },
    {
      id: "7",
      name: "Central Vista Art",
      description:
        "Urban-inspired NFT collection from the artistic heart of Central Vista. Limited edition series.",
      imageUrl: "https://images.unsplash.com/photo-1460411794035-42aac080490a",
      shopName: SAMPLE_LOCATIONS[6].name,
      category: "epic",
      location: { lat: SAMPLE_LOCATIONS[6].lat, lng: SAMPLE_LOCATIONS[6].lng },
    },
    {
      id: "8",
      name: "India Gate Pixels",
      description:
        "Contemporary pixel art NFT from India Gate area. A perfect blend of traditional and digital art.",
      imageUrl: "https://images.unsplash.com/photo-1496449903678-68ddcb189a24",
      shopName: SAMPLE_LOCATIONS[7].name,
      category: "common",
      location: { lat: SAMPLE_LOCATIONS[7].lat, lng: SAMPLE_LOCATIONS[7].lng },
    },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Visit Local Shop A",
      description:
        "Visit Local Shop A and scan the QR code to claim an exclusive NFT",
      progress: 0,
      shopName: "Local Shop A",
      reward: "Exclusive Shop A NFT",
      type: "shop",
    },
    {
      id: "2",
      title: "Purchase from Local Shop B",
      description: "Make a purchase at Local Shop B and claim your reward",
      progress: 50,
      shopName: "Local Shop B",
      reward: "10% Discount on Next Purchase",
      type: "shop",
    },
    {
      id: "3",
      title: "Collect 5 NFTs",
      description: "Collect 5 different NFTs from any shop",
      progress: 20,
      shopName: "Platform Challenge",
      reward: "Rare Platform NFT",
      type: "platform",
    },
    {
      id: "4",
      title: "Summer Festival NFT Hunt",
      description: "Visit 3 shops participating in the summer festival",
      progress: 33,
      shopName: "Summer Festival",
      reward: "Limited Edition Summer NFT",
      expiresAt: new Date("2025-06-30"),
      type: "event",
    },
  ]);

  const [shops] = useState<Shop[]>([
    {
      id: "1",
      name: "Local Shop A",
      logo: "https://via.placeholder.com/50",
      location: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: "2",
      name: "Local Shop B",
      logo: "https://via.placeholder.com/50",
      location: { lat: 40.758, lng: -73.9855 },
    },
    {
      id: "3",
      name: "Local Shop C",
      logo: "https://via.placeholder.com/50",
      location: { lat: 40.7328, lng: -73.986 },
    },
  ]);

  const [claimedNFTs, setClaimedNFTs] = useState<ClaimedNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);

  // Watch user's location with high accuracy
  const watchUserLocation = () => {
    if ("geolocation" in navigator) {
      // Clear any existing watch first to prevent duplicates
      if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
      }

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error watching location:", error);
          setError(
            "Unable to track location. Please enable location services."
          );
          // Default to Delhi if location access is denied
          setUserLocation({ lat: 28.4996139, lng: 77.2457196 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout
          maximumAge: 30000, // Allow cached positions up to 30 seconds old
        }
      );
      setLocationWatchId(watchId);
    } else {
      setError("Geolocation is not supported by your browser");
      // Default to a location in Delhi
      setUserLocation({ lat: 28.4996139, lng: 77.2457196 });
    }
  };

  // Stop watching location
  const stopWatchingLocation = () => {
    if (locationWatchId !== null) {
      navigator.geolocation.clearWatch(locationWatchId);
      setLocationWatchId(null);
    }
  };

  // Clean up location watching when component unmounts
  useEffect(() => {
    return () => {
      stopWatchingLocation();
    };
  }, []);

  // Simulate refresh functionality
  const refreshNFTs = async () => {
    setLoading(true);
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In a real app, this would be an API call to get fresh data
      // For now, we'll just refresh with the same data
      setNfts([...nfts]);
    } catch (err) {
      setError("Failed to refresh NFTs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter NFTs based on category and distance
  const filterNFTs = (category?: string, distance?: number) => {
    return nfts.filter((nft) => {
      let categoryMatch = true;
      let distanceMatch = true;

      if (category && category !== "all") {
        categoryMatch = nft.category === category;
      }

      if (distance) {
        distanceMatch = (nft.distance || 0) <= distance;
      }

      return categoryMatch && distanceMatch;
    });
  };

  const claimNFT = (nft: NFT) => {
    const claimedNFT: ClaimedNFT = {
      ...nft,
      claimedAt: new Date(),
    };
    setClaimedNFTs((prev) => [...prev, claimedNFT]);

    // Update related task progress
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.shopName === nft.shopName && task.progress < 100) {
          return { ...task, progress: 100 };
        }
        if (task.type === "platform" && task.title.includes("Collect")) {
          const newProgress = Math.min(100, (claimedNFTs.length + 1) * 20);
          return { ...task, progress: newProgress };
        }
        return task;
      });
    });
  };

  return (
    <NFTContext.Provider
      value={{
        nfts,
        claimedNFTs,
        tasks,
        shops,
        claimNFT,
        loading,
        error,
        selectedNFT,
        setSelectedNFT,
        filterNFTs,
        refreshNFTs,
        userLocation,
        setUserLocation,
        watchUserLocation,
        stopWatchingLocation,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
}

export function useNFT() {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error("useNFT must be used within a NFTProvider");
  }
  return context;
}
