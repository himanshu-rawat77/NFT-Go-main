import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNFT } from "@/contexts/NFTContext";
import Map, {
  Marker,
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  MapRef,
} from "react-map-gl/mapbox";
import type { ViewState } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import type { LineLayer } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  QrCode,
  Navigation,
  Compass,
  Check,
  Clock,
  MapPin,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";

// Replace with your actual Mapbox token
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGltYW5zaHUtcmF3YXQtNyIsImEiOiJjbTIxcmViNm0weGZnMmpxc2E0dmIwazdhIn0.0n9VXfbQP3k05uC86PMGDg";

const INITIAL_VIEW_STATE: Partial<ViewState> = {
  latitude: 28.4996139,
  longitude: 77.2457196,
  zoom: 13,
  bearing: 0,
  pitch: 0,
};

const routeLayerStyle: LineLayer = {
  id: "route",
  type: "line",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": "#F59E0B",
    "line-width": 4,
    "line-dasharray": [2, 2],
  },
  source: "route",
};

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const nftId = searchParams.get("nft");
  const { nfts, claimNFT, userLocation, watchUserLocation } = useNFT();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [scanning, setScanning] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [nearDestination, setNearDestination] = useState(false);
  const [viewState, setViewState] =
    useState<Partial<ViewState>>(INITIAL_VIEW_STATE);
  const [routeGeoJson, setRouteGeoJson] =
    useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  interface NavigationStep {
    distance: number;
    duration: number;
    maneuver: {
      instruction: string;
      location: [number, number];
      type: string;
    };
  }

  const [navigationSteps, setNavigationSteps] = useState<NavigationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const pulseRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  const currentNFT = nfts.find((nft) => nft.id === nftId);

  // Start watching location when component mounts
  useEffect(() => {
    watchUserLocation();

    // Pulse animation for markers
    const animatePulse = () => {
      pulseRef.current = (pulseRef.current + 1) % 100;
      animationRef.current = requestAnimationFrame(animatePulse);
    };

    animationRef.current = requestAnimationFrame(animatePulse);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update view state when user location changes
  useEffect(() => {
    if (userLocation && !isNavigating) {
      setViewState((prev) => ({
        ...prev,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      }));
    }
  }, [userLocation, isNavigating]);

  const fetchRoute = useCallback(
    async (start: [number, number], end: [number, number]) => {
      try {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        const json = await query.json();

        if (json.routes?.[0]) {
          setRouteGeoJson({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: json.routes[0].geometry.coordinates,
            },
          });
          setNavigationSteps(json.routes[0].legs[0].steps);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    },
    []
  );

  // Update route when user location or NFT changes
  useEffect(() => {
    if (currentNFT && userLocation) {
      fetchRoute(
        [userLocation.lng, userLocation.lat],
        [currentNFT.location.lng, currentNFT.location.lat]
      );
    }
  }, [currentNFT, userLocation, fetchRoute]);

  // Check if user is near destination
  useEffect(() => {
    if (currentNFT && userLocation) {
      const distance = Math.sqrt(
        Math.pow(userLocation.lat - currentNFT.location.lat, 2) +
          Math.pow(userLocation.lng - currentNFT.location.lng, 2)
      );
      setNearDestination(distance < 0.002);
    }
  }, [currentNFT, userLocation]);

  const startNavigation = () => {
    setIsNavigating(true);
    setShowSteps(true);
    if (userLocation) {
      setViewState((prev) => ({
        ...prev,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        zoom: 16,
        pitch: 60,
        bearing: 0,
      }));
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setShowSteps(false);
    setViewState(INITIAL_VIEW_STATE);
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      if (currentNFT) {
        setClaiming(true);
        setTimeout(() => {
          claimNFT(currentNFT);
          setClaiming(false);

          toast({
            title: "NFT Claimed!",
            description: `You've successfully claimed ${currentNFT.name}`,
          });

          setTimeout(() => {
            navigate("/profile");
          }, 1500);
        }, 2000);
      }
    }, 2000);
  };

  const estimatedTime = currentNFT?.distance
    ? Math.round(currentNFT.distance * 12)
    : 0;

  // When no location is available, use Delhi coordinates
  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-amber-500 border-t-transparent"></div>
            <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
          </div>
          <p className="text-gray-500 font-medium">Getting your location...</p>
          <p className="text-xs text-gray-400">
            Please enable location services
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Map Explorer
        </h1>
        <div className="flex space-x-2">
          {currentNFT && nearDestination && (
            <Button
              onClick={handleScan}
              disabled={scanning || claiming}
              className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all"
            >
              {scanning ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Scanning...
                </>
              ) : claiming ? (
                <>
                  <div className="animate-pulse">
                    <Check className="h-4 w-4" />
                  </div>
                  Claiming...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4" />
                  Scan QR Code
                </>
              )}
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <Compass className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[50vh] overflow-auto">
              <SheetHeader>
                <SheetTitle className="text-amber-800">Directions</SheetTitle>
                <SheetDescription>
                  Follow these directions to claim your NFT
                </SheetDescription>
              </SheetHeader>

              {currentNFT ? (
                <motion.div
                  className="py-4 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Navigation className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">{currentNFT.shopName}</p>
                        <p className="text-sm text-gray-500">Destination</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center text-amber-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{estimatedTime} min</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {currentNFT.distance} km
                      </p>
                    </div>
                  </div>

                  {navigationSteps.length > 0 && (
                    <Collapsible open={showSteps} onOpenChange={setShowSteps}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between border-amber-200 text-amber-700 hover:bg-amber-50"
                        >
                          <span>Navigation Steps</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              showSteps ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2 space-y-2">
                        {navigationSteps.map((step, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                              currentStepIndex === index
                                ? "bg-amber-50 border-amber-200"
                                : "bg-white border-gray-100"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-medium text-amber-800">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {step.maneuver?.instruction ||
                                    "Follow the route"}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Navigation className="h-3 w-3 mr-1" />
                                  <span>{step.distance?.toFixed(0) || 0}m</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </motion.div>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  Select an NFT to view directions
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>

      <motion.div
        className="relative h-[calc(100vh-12rem)] rounded-xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Map
          {...viewState}
          ref={mapRef as unknown as React.MutableRefObject<MapRef | null>}
          onMove={(evt) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: "100%", height: "100%" }}
        >
          <GeolocateControl
            position="top-right"
            trackUserLocation
            showUserHeading
            onGeolocate={(e) => {
              setViewState((prev) => ({
                ...prev,
                latitude: e.coords.latitude,
                longitude: e.coords.longitude,
              }));
            }}
          />
          <NavigationControl position="top-right" />

          {/* User location marker */}
          <Marker
            latitude={userLocation.lat}
            longitude={userLocation.lng}
            anchor="center"
          >
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
            >
              <div className="h-5 w-5 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
              <div className="absolute h-12 w-12 bg-blue-500 rounded-full -top-3.5 -left-3.5 animate-ping opacity-20"></div>
            </motion.div>
          </Marker>

          {/* Destination marker */}
          {currentNFT && (
            <Marker
              latitude={currentNFT.location.lat}
              longitude={currentNFT.location.lng}
              anchor="bottom"
            >
              <motion.div
                className="flex flex-col items-center"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                <div className="bg-amber-500 h-8 w-8 rounded-full flex items-center justify-center text-white shadow-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="h-3 w-3 bg-amber-500 rotate-45 -mt-1.5 shadow-sm"></div>
              </motion.div>
            </Marker>
          )}

          {/* Route line */}
          {routeGeoJson && (
            <Source type="geojson" data={routeGeoJson}>
              <Layer {...routeLayerStyle} />
            </Source>
          )}
        </Map>

        {/* Navigation Controls */}
        {currentNFT && !nearDestination && (
          <div className="absolute top-4 left-4 right-4">
            <Card className="bg-white/90 backdrop-blur-sm p-3 shadow-lg border-none">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {isNavigating ? (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">
                        {navigationSteps[currentStepIndex]?.maneuver
                          ?.instruction || "Follow the route"}
                      </p>
                      <div className="flex items-center text-xs text-amber-600">
                        <Navigation className="h-3 w-3 mr-1" />
                        <span>
                          {navigationSteps[currentStepIndex]?.distance?.toFixed(
                            0
                          ) || 0}
                          m
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="font-medium text-sm">
                      Start navigation to {currentNFT.shopName}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={isNavigating ? "outline" : "default"}
                  onClick={() =>
                    isNavigating ? stopNavigation() : startNavigation()
                  }
                  className={
                    isNavigating
                      ? "border-red-200 text-red-600 hover:bg-red-50"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  }
                >
                  {isNavigating ? "Stop Navigation" : "Start Navigation"}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {nearDestination && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="bg-white/90 backdrop-blur-sm p-4 shadow-lg border-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <Check className="h-5 w-5 text-green-600" />
                  </motion.div>
                  <div>
                    <p className="font-medium">You've arrived!</p>
                    <p className="text-sm text-gray-500">
                      Scan QR code to claim NFT
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={handleScan}
                  disabled={scanning || claiming}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  Scan QR
                </Button>
              </div>
            </Card>
          </div>
        )}

        <AnimatePresence>
          {claiming && (
            <motion.div
              className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-8 max-w-sm w-full text-center space-y-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex justify-center">
                  <div className="relative">
                    <motion.div
                      className="h-20 w-20 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0, -10, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                    >
                      <Sparkles className="h-10 w-10 text-white" />
                    </motion.div>
                    <motion.div
                      className="absolute -inset-3"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 8,
                        ease: "linear",
                      }}
                    >
                      <div className="h-4 w-4 bg-white rounded-full absolute top-1/2 left-0 transform -translate-y-1/2"></div>
                    </motion.div>
                  </div>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Claiming NFT
                </h3>
                <p className="text-gray-500">
                  Please wait while we mint your NFT on the blockchain
                </p>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {currentNFT && (
        <motion.div
          className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg shadow-inner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-medium mb-2 text-amber-800">
            NFT Location Information
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Location:</span>{" "}
                {currentNFT.shopName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">NFT:</span> {currentNFT.name}
              </p>
            </div>
            {currentNFT.distance && (
              <div className="flex items-center text-amber-700 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{currentNFT.distance} km away</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
