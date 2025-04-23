import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNFT } from "@/contexts/NFTContext";
import Map, { Marker, NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl/mapbox';
import type { ViewState } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import type { LineLayer } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  QrCode, 
  Navigation, 
  Compass, 
  Check, 
  Clock, 
  Map as MapIcon,
  X,
  MapPin
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Replace with your actual Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiaGltYW5zaHUtcmF3YXQtNyIsImEiOiJjbTIxcmViNm0weGZnMmpxc2E0dmIwazdhIn0.0n9VXfbQP3k05uC86PMGDg';

const INITIAL_VIEW_STATE: Partial<ViewState> = {
  latitude: 28.4996139,
  longitude: 77.2457196,
  zoom: 13,
  bearing: 0,
  pitch: 0
};

const routeLayerStyle: LineLayer = {
  id: 'route',
  type: 'line',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#6366F1',
    'line-width': 3,
    'line-dasharray': [2, 2]
  },
  source: 'route'
};

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const nftId = searchParams.get('nft');
  const { nfts, claimNFT, userLocation, watchUserLocation } = useNFT();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [scanning, setScanning] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [nearDestination, setNearDestination] = useState(false);
  const [viewState, setViewState] = useState<Partial<ViewState>>(INITIAL_VIEW_STATE);
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationSteps, setNavigationSteps] = useState<any[]>([]);

  const currentNFT = nfts.find(nft => nft.id === nftId);

  // Start watching location when component mounts
  useEffect(() => {
    watchUserLocation();
  }, [watchUserLocation]);

  // Update view state when user location changes
  useEffect(() => {
    if (userLocation && !isNavigating) {
      setViewState(prev => ({
        ...prev,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      }));
    }
  }, [userLocation, isNavigating]);

  const fetchRoute = useCallback(async (start: [number, number], end: [number, number]) => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const json = await query.json();
      
      if (json.routes?.[0]) {
        setRouteGeoJson({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: json.routes[0].geometry.coordinates
          }
        });
        setNavigationSteps(json.routes[0].legs[0].steps);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }, []);

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
    if (userLocation) {
      setViewState(prev => ({
        ...prev,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        zoom: 16,
        pitch: 60,
        bearing: 0
      }));
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
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
            navigate('/profile');
          }, 1500);
        }, 2000);
      }
    }, 2000);
  };

  const estimatedTime = currentNFT?.distance ? Math.round(currentNFT.distance * 12) : 0;

  // When no location is available, use Delhi coordinates
  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Map Explorer</h1>
        <div className="flex space-x-2">
          {currentNFT && nearDestination && (
            <Button 
              onClick={handleScan} 
              disabled={scanning || claiming}
              className="gap-2"
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
              <Button variant="outline" size="icon">
                <Compass className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Directions</SheetTitle>
                <SheetDescription>
                  Follow these directions to claim your NFT
                </SheetDescription>
              </SheetHeader>
              
              {currentNFT ? (
                <div className="py-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{currentNFT.shopName}</p>
                        <p className="text-sm text-gray-500">Destination</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{estimatedTime} min</span>
                      </div>
                      <p className="text-sm text-gray-500">{currentNFT.distance} km</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  Select an NFT to view directions
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="relative h-[calc(100vh-12rem)] rounded-xl overflow-hidden shadow-inner">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: '100%', height: '100%' }}
        >
          <GeolocateControl
            position="top-right"
            trackUserLocation
            onGeolocate={(e) => {
              setViewState(prev => ({
                ...prev,
                latitude: e.coords.latitude,
                longitude: e.coords.longitude
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
              <div className="relative">
                <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                <div className="absolute h-10 w-10 bg-blue-500 rounded-full -top-3 -left-3 animate-ping opacity-20"></div>
              </div>
          </Marker>
            
            {/* Destination marker */}
          {currentNFT && (
            <Marker
              latitude={currentNFT.location.lat}
              longitude={currentNFT.location.lng}
              anchor="bottom"
            >
              <div className="bg-red-500 h-6 w-6 rounded-full flex items-center justify-center text-white">
                <MapPin className="h-3 w-3" />
              </div>
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
            <Card className="bg-white/90 backdrop-blur-sm p-3 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {isNavigating ? (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">
                        {navigationSteps[0]?.maneuver?.instruction || 'Follow the route'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Navigation className="h-3 w-3 mr-1" />
                        <span>{navigationSteps[0]?.distance?.toFixed(0) || 0}m</span>
                      </div>
                    </div>
                  ) : (
                    <p className="font-medium text-sm">Start navigation to {currentNFT.shopName}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={isNavigating ? "destructive" : "default"}
                  onClick={() => isNavigating ? stopNavigation() : startNavigation()}
                >
                  {isNavigating ? 'Stop' : 'Start'} Navigation
                </Button>
              </div>
            </Card>
            </div>
        )}
            
            {nearDestination && (
              <div className="absolute bottom-4 left-4 right-4">
                <Card className="bg-white/90 backdrop-blur-sm p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">You've arrived!</p>
                        <p className="text-sm text-gray-500">Scan QR code to claim NFT</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={handleScan} disabled={scanning || claiming}>
                      Scan QR
                    </Button>
              </div>
            </Card>
          </div>
        )}
        
        {claiming && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="animate-pulse h-20 w-20 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Check className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute inset-0 animate-spin">
                    <div className="h-4 w-4 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold">Claiming NFT</h3>
              <p className="text-gray-500">
                Please wait while we mint your NFT on the blockchain
              </p>
            </div>
          </div>
        )}
      </div>
      
      {currentNFT && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-medium mb-2">NFT Location Information</h2>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Location:</span> {currentNFT.shopName}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">NFT:</span> {currentNFT.name}
          </p>
        </div>
      )}
    </div>
  );
}
