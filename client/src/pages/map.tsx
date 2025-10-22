import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RickshawWheel from "@/components/airbear-wheel";
import LoadingSpinner from "@/components/loading-spinner";
import { spots } from "@/lib/spots";
import { 
  MapPin, 
  Navigation, 
  Battery, 
  Store, 
  Clock,
  Users,
  Zap,
  Plus,
  Minus
} from "lucide-react";

declare global {
  interface Window {
    L: any;
  }
}

interface Spot {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
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

  // Calculate available AirBears count for map overlay
  const availableAirbearsCount = rickshaws?.filter(r => r.isAvailable).length || 0;

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

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapReady) return;

    const initMap = () => {
      if (!window.L) {
        // Load Leaflet dynamically
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

      // Add custom zoom controls
      const zoomControl = window.L.control.zoom({
        position: 'topright'
      });
      zoomControl.addTo(map);

      // Add tile layer
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

  // Add markers to map
  useEffect(() => {
    if (!mapInstanceRef.current || !spotsData || !rickshaws) return;

    const map = mapInstanceRef.current;
    
    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof window.L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add spot markers
    spotsData.forEach((spot: Spot) => {
      const availableAirbears = rickshaws.filter(r => r.currentSpotId === spot.id);
      const hasAirbears = availableAirbears.length > 0;
      
      // Create custom AirBear icon with enhanced special effects
      const iconHtml = `
        <div class="relative group cursor-pointer airbear-marker">
          <!-- Main AirBear marker with holographic effects -->
          <div class="w-16 h-16 border-4 border-${hasAirbears ? 'emerald-500' : 'gray-400'} rounded-full 
                      ${hasAirbears ? 'animate-pulse-glow shadow-xl shadow-emerald-500/60' : ''} 
                      bg-gradient-to-br from-white via-emerald-50 to-lime-100
                      flex items-center justify-center hover:scale-125 transition-all duration-500 group-hover:animate-rickshaw-bounce
                      relative overflow-hidden">
            
            <!-- Holographic rainbow effect -->
            <div class="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 via-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 opacity-20 animate-spin-slow"></div>
            
            <!-- Fire/smoke particles on hover -->
            ${hasAirbears ? Array.from({ length: 6 }, (_, i) => `
              <div class="absolute w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-particle"
                   style="left: ${50 + Math.cos(i * 60 * Math.PI / 180) * 25}%; top: ${50 + Math.sin(i * 60 * Math.PI / 180) * 25}%; animation-delay: ${i * 0.1}s;"></div>
            `).join('') : ''}
            
            <!-- AirBear mascot with enhanced effects -->
            <div class="text-2xl ${hasAirbears ? 'animate-airbear-bounce' : ''} group-hover:animate-spin relative z-10">
              🐻
            </div>
            
            <!-- Solar rays effect -->
            ${Array.from({ length: 12 }, (_, i) => `
              <div class="absolute w-0.5 h-4 bg-yellow-400 opacity-40 group-hover:opacity-80 transition-opacity"
                   style="left: 50%; top: -8px; transform-origin: 50% 32px; transform: rotate(${i * 30}deg); animation: solar-rays 4s linear infinite; animation-delay: ${i * 0.1}s;"></div>
            `).join('')}
            
            ${hasAirbears ? `
              <!-- Spinning wheel effect -->
              <div class="absolute inset-2 rounded-full border-2 border-lime-400 opacity-60 animate-wheel-spin"></div>
              <div class="absolute inset-4 rounded-full border border-emerald-400 opacity-40 animate-spin-slow"></div>
              
              <!-- Plasma energy rings -->
              <div class="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-30"></div>
              <div class="absolute -inset-2 rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-yellow-400 opacity-15 blur-md animate-pulse"></div>
              
              <!-- God rays effect -->
              <div class="absolute -inset-6 rounded-full bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent animate-god-rays"></div>
            ` : ''}
          </div>
          
          <!-- Enhanced availability counter with special effects -->
          ${availableAirbears.length > 0 ? `
            <div class="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-emerald-500 via-lime-500 to-green-400 text-white rounded-full 
                        flex items-center justify-center text-sm font-bold shadow-xl animate-confetti-burst border-2 border-white
                        relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 animate-holographic"></div>
              <span class="relative z-10">${availableAirbears.length}</span>
            </div>
          ` : ''}
          
          <!-- Enhanced location label with effects -->
          <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs font-bold text-emerald-800 
                      bg-gradient-to-r from-white via-emerald-50 to-white px-3 py-2 rounded-full shadow-lg whitespace-nowrap
                      border border-emerald-200 hover:shadow-xl transition-all duration-300 hover:scale-105
                      relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent animate-shimmer"></div>
            <span class="relative z-10">${spot.name}</span>
          </div>
          
          <!-- Floating eco particles -->
          ${Array.from({ length: 4 }, (_, i) => `
            <div class="absolute w-1 h-1 bg-green-400 rounded-full opacity-60 animate-float"
                 style="left: ${30 + i * 15}%; top: ${20 + i * 10}%; animation-delay: ${i * 0.5}s; animation-duration: ${3 + i}s;"></div>
          `).join('')}
        </div>
      `;

      const customIcon = window.L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = window.L.marker(
        [parseFloat(spot.latitude), parseFloat(spot.longitude)], 
        { icon: customIcon }
      ).addTo(map);

      // Add popup
      const popupContent = `
        <div class="p-4 min-w-[250px] bg-white rounded-lg">
          <div class="flex items-center mb-3">
            <span class="text-2xl mr-2">🐻</span>
            <h3 class="font-bold text-lg text-emerald-700">${spot.name}</h3>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="flex items-center">
                <span class="w-3 h-3 rounded-full ${hasAirbears ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'} mr-2"></span>
                AirBears Available
              </span>
              <span class="font-semibold ${hasAirbears ? 'text-emerald-600' : 'text-gray-500'}">
                ${hasAirbears ? `${availableAirbears.length} ready` : 'None'}
              </span>
            </div>
            ${hasAirbears ? `
              <div class="text-xs text-emerald-600 italic mb-2">
                "Glide with AirBear, eco-rides so rare!"
              </div>
              <button onclick="window.selectSpotForRide('${spot.id}')" 
                      class="w-full mt-2 px-4 py-3 bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-500 
                             text-white rounded-lg hover:shadow-lg hover:scale-105
                             transition-all font-bold text-sm shadow-md">
                🚀 Book AirBear Ride
              </button>
            ` : `
              <div class="text-xs text-gray-500 italic">
                No AirBears available at this spot
              </div>
            `}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Global function for booking
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
      fare: 15.00, // Base fare
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
        {/* Header */}
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

        {/* Booking Status Info */}
        <motion.div
          className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-lime-50 rounded-lg border border-emerald-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <RickshawWheel size="sm" className="text-primary" />
              <span className="font-semibold text-emerald-700">Ready to Book?</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4 text-sm text-emerald-600">
              <span>💡 Click any green marker to book a ride</span>
              <span>⚡ Real-time availability updates</span>
              <span>🌱 Carbon-neutral transportation</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="bg-card rounded-2xl p-6 shadow-2xl glass-morphism mb-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-500/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="aspect-video rounded-xl overflow-hidden relative shadow-inner">
            <div 
              ref={mapRef} 
              className="w-full h-full"
              data-testid="map-container"
            />
            
            {/* Enhanced Real-time Stats Overlay */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <div>
                    <div className="font-semibold text-green-600">{availableAirbearsCount} AirBears</div>
                    <div className="text-xs text-muted-foreground">Available</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50"></div>
                  <div>
                    <div className="font-semibold text-amber-600">{rickshaws?.filter(r => !r.isAvailable && !r.isCharging).length || 0}</div>
                    <div className="text-xs text-muted-foreground">En Route</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                  <div>
                    <div className="font-semibold text-blue-600">{rickshaws?.filter(r => r.isCharging).length || 0}</div>
                    <div className="text-xs text-muted-foreground">Charging</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-3">
              <div className="bg-card/90 backdrop-blur-md rounded-lg p-2 shadow-xl border border-white/20">
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-12 h-12 p-0 hover:bg-primary/10 transition-all duration-200"
                  data-testid="button-zoom-in"
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.zoomIn();
                    }
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-12 h-12 p-0 hover:bg-primary/10 transition-all duration-200"
                  data-testid="button-zoom-out"
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.zoomOut();
                    }
                  }}
                >
                  <Minus className="h-5 w-5" />
                </Button>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="w-12 h-12 p-0 bg-card/90 backdrop-blur-md shadow-xl border border-white/20 hover:bg-primary/10 transition-all duration-200"
                data-testid="button-center-map"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([42.0987, -75.9179], 13);
                  }
                }}
              >
                <Navigation className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Enhanced Map Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
              <div className="flex items-center space-x-2">
                <RickshawWheel size="sm" className="text-primary" />
                <span className="font-medium">Available AirBear</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
              <div className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Bodega Available</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-lime-500" />
                <span className="font-medium">Solar Charging</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Spots List */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {spotsData?.map((spot: Spot, index: number) => {
            const availableAirbears = rickshaws?.filter(r => r.currentSpotId === spot.id) || [];
            const avgBattery = availableAirbears.length > 0 
              ? Math.round(availableAirbears.reduce((sum, r) => sum + r.batteryLevel, 0) / availableAirbears.length)
              : 0;
            
            return (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="hover-lift glass-morphism cursor-pointer group"
                  onClick={() => {
                    setSelectedSpot(spot);
                    if (availableAirbears.length > 0) {
                      setShowBookingDialog(true);
                    }
                  }}
                  data-testid={`card-spot-${spot.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="truncate">{spot.name}</span>
                      <RickshawWheel 
                        size="sm" 
                        animated={availableAirbears.length > 0}
                        className={availableAirbears.length > 0 ? "text-primary" : "text-muted-foreground"}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Available</span>
                      <Badge 
                        variant={availableAirbears.length > 0 ? "default" : "secondary"}
                        className={availableAirbears.length > 0 ? "bg-green-500" : ""}
                      >
                        {availableAirbears.length} AirBear{availableAirbears.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>

                    {availableAirbears.length > 0 && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Avg Battery</span>
                          <div className="flex items-center space-x-2">
                            <Battery className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">{avgBattery}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Wait Time</span>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium">~2 min</span>
                          </div>
                        </div>
                      </>
                    )}

                    <Button 
                      size="sm" 
                      className="w-full eco-gradient text-white"
                      disabled={availableAirbears.length === 0}
                      data-testid={`button-book-from-${spot.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {availableAirbears.length > 0 ? "Book Ride" : "No AirBears"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Booking Dialog */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="glass-morphism max-w-md" data-testid="dialog-book-ride">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <RickshawWheel size="sm" className="mr-2" />
                Book Your Ride
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Pickup Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pickup Location</label>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-primary mr-2" />
                    <span>{selectedSpot?.name}</span>
                  </div>
                </div>
              </div>

              {/* Destination Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination</label>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {spotsData?.filter(s => s.id !== selectedSpot?.id).map((spot) => (
                    <div
                      key={spot.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDestination?.id === spot.id 
                          ? "bg-primary/20 border border-primary" 
                          : "bg-muted/10 hover:bg-muted/20"
                      }`}
                      onClick={() => setSelectedDestination(spot)}
                      data-testid={`option-destination-${spot.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">{spot.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ride Summary */}
              {selectedDestination && (
                <div className="p-4 bg-muted/10 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Fare</span>
                    <span>$15.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Distance</span>
                    <span>~2.3 km</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Est. Time</span>
                    <span>8-12 min</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>$15.00</span>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleBookRide}
                disabled={!selectedDestination || bookRideMutation.isPending}
                className="w-full eco-gradient text-white hover-lift"
                data-testid="button-confirm-booking"
              >
                {bookRideMutation.isPending ? (
                  <div className="flex items-center">
                    <RickshawWheel size="sm" className="mr-2" />
                    Booking...
                  </div>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
