import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import RickshawWheel from "@/components/airbear-wheel";
import LoadingSpinner from "@/components/loading-spinner";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Navigation, Battery, Store, Clock, Users, Zap, Plus, Minus } from "lucide-react";

declare global {
  interface Window {
    L: any;
  }
}

interface Spot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

interface Rickshaw {
  id: string;
  currentSpotId: string;
  batteryLevel: number;
  isAvailable: boolean;
  isCharging: boolean;
}

export default function Map() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Spot | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const { data: spotsData, isLoading: spotsLoading } = useQuery<Spot[]>({
    queryKey: ["/api/spots"],
  });

  const { data: rickshaws, isLoading: rickshawsLoading } = useQuery<Rickshaw[]>({
    queryKey: ["/api/rickshaws/available"],
  });

  const bookRideMutation = useMutation({
    mutationFn: async (rideData: any) => {
      const response = await apiRequest("POST", "/api/rides", rideData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ride Booked!",
        description: "Your rickshaw is on the way. You'll receive updates shortly.",
      });
      setShowBookingDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to book ride. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!mapRef.current || mapReady) return;

    const initMap = () => {
      if (!window.L) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
        
        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletJS.onload = () => setTimeout(initMap, 100);
        document.head.appendChild(leafletJS);
        return;
      }

      const map = window.L.map(mapRef.current, {
        center: [42.0987, -75.9179], // Binghamton coordinates
        zoom: 13,
        zoomControl: false,
      });

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [mapReady]);

  useEffect(() => {
    if (!mapInstanceRef.current || !spotsData || !rickshaws) return;

    const map = mapInstanceRef.current;
    
    map.eachLayer((layer: any) => {
      if (layer instanceof window.L.Marker) {
        map.removeLayer(layer);
      }
    });

    spotsData.forEach((spot: Spot) => {
      const availableAirbears = rickshaws.filter(r => r.currentSpotId === spot.id);
      
      const iconHtml = `
        <div class="relative group cursor-pointer">
          <div class="w-16 h-16">
            <RickshawWheel size="lg" animated effect="${availableAirbears.length > 0 ? 'neon' : 'fire'}" />
          </div>
        </div>
      `;

      const customIcon = window.L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [64, 64],
        iconAnchor: [32, 32],
      });

      const marker = window.L.marker(
        [spot.latitude, spot.longitude], 
        { icon: customIcon }
      ).addTo(map);

      const popupContent = `
        <div class="p-4">
          <h3 class="font-bold text-lg">${spot.name}</h3>
          <p>${availableAirbears.length} AirBears available</p>
          <button onclick="window.selectSpotForRide('${spot.id}')"
                  class="w-full mt-2 px-4 py-2 bg-primary text-white rounded-lg">
            Book AirBear Ride
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    (window as any).selectSpotForRide = (spotId: string) => {
      const spot = spotsData.find(s => s.id === spotId);
      if (spot) {
        setSelectedSpot(spot);
        setShowBookingDialog(true);
      }
    };

  }, [spotsData, rickshaws, mapReady]);

  const handleBookRide = () => {
    if (!user || !selectedSpot || !selectedDestination) {
      toast({
        title: "Missing Information",
        description: "Please select both pickup and destination locations.",
        variant: "destructive",
      });
      return;
    }

    const rideData = {
      userId: user.id,
      pickupSpotId: selectedSpot.id,
      destinationSpotId: selectedDestination.id,
      fare: 5.00, // Replace with actual fare calculation
    };

    bookRideMutation.mutate(rideData);
  };

  if (spotsLoading || rickshawsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading map..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Find Your <span className="text-primary">Perfect Ride</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover all 16 AirBear spots across Binghamton with real-time availability
          </p>
        </motion.div>

        <motion.div
          className="bg-card rounded-2xl p-6 shadow-2xl glass-morphism mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="aspect-video rounded-xl overflow-hidden">
            <div 
              ref={mapRef} 
              className="w-full h-full"
              data-testid="map-container"
            />
          </div>
        </motion.div>

        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="glass-morphism max-w-md" data-testid="dialog-book-ride">
            <DialogHeader>
              <DialogTitle>Book Your Ride</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <div>{selectedSpot?.name}</div>
              </div>

              <div className="space-y-2">
                <Label>Destination</Label>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {spotsData?.filter(s => s.id !== selectedSpot?.id).map((spot) => (
                    <div
                      key={spot.id}
                      className={`p-3 rounded-lg cursor-pointer ${
                        selectedDestination?.id === spot.id 
                          ? "bg-primary/20"
                          : "hover:bg-muted/20"
                      }`}
                      onClick={() => setSelectedDestination(spot)}
                      data-testid={`option-destination-${spot.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {spot.name}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleBookRide}
                disabled={!selectedDestination || bookRideMutation.isPending}
                className="w-full eco-gradient text-white"
                data-testid="button-confirm-booking"
              >
                {bookRideMutation.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
