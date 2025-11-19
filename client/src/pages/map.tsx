import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAirbearSession } from "@/hooks/use-airbear-session";
import { useToast } from "@/hooks/use-toast";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import RickshawWheel from "@/components/airbear-wheel";
import LoadingSpinner from "@/components/loading-spinner";
import { MapComponent } from "@/components/map/MapComponent";
import { spots, getRouteDistance, estimateRideFare, estimateRideTime } from "@/lib/spots";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  Navigation, 
  Battery, 
  Store, 
  Clock,
  Users,
  Zap,
  Plus,
  Minus,
  RefreshCw
} from "lucide-react";

type L = typeof import('leaflet');

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
  const { user } = useAirbearSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mapInstanceRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Spot | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const { data: spotsData, isLoading: spotsLoading } = useQuery<Spot[]>({
    queryKey: ["/api/spots"],
    initialData: spots,
  });

  const { data: rickshaws, isLoading: rickshawsLoading } = useQuery<Rickshaw[]>({
    queryKey: ["/api/rickshaws/available"],
  });

  // Calculate available AirBears count for map overlay
  const availableAirbearsCount = rickshaws?.filter(r => r.isAvailable).length || 0;
  const totalSpots = spotsData?.length || 0;
  const chargingAirbearsCount = rickshaws?.filter(r => r.isCharging).length || 0;

  const {
    isSubscribed,
    preferences
  } = usePushNotifications();

  // Monitor driver availability and send notifications when drivers become available
  useEffect(() => {
    if (!user || !isSubscribed || !preferences.driverAvailability) return;

    let lastAvailableCount = availableAirbearsCount;

    const checkForNewDrivers = () => {
      if (availableAirbearsCount > lastAvailableCount && availableAirbearsCount > 0) {
        // Drivers became available - send notification
        fetch('/api/notifications/driver-available', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            location: 'nearby',
            availableDrivers: availableAirbearsCount
          })
        }).catch(error => {
          console.error('Error sending driver availability notification:', error);
        });
      }
      lastAvailableCount = availableAirbearsCount;
    };

    // Check every 30 seconds for new drivers
    const interval = setInterval(checkForNewDrivers, 30000);

    return () => clearInterval(interval);
  }, [user, isSubscribed, preferences.driverAvailability, availableAirbearsCount]);

  const bookRideMutation = useMutation({
    mutationFn: async (rideData: any) => {
      const response = await apiRequest("POST", "/api/rides", rideData);
      return response.json();
    },
    onSuccess: (rideData) => {
      // Find available driver at pickup location
      const availableDrivers = rickshaws?.filter(r =>
        r.currentSpotId === selectedSpot?.id && r.isAvailable
      ) || [];

      const assignedDriver = availableDrivers[0]; // Assign first available driver
      const pickupSpotName = selectedSpot?.name;
      const destinationSpotName = selectedDestination?.name;

      toast({
        title: "🚀 Ride Booked Successfully!",
        description: `AirBear from ${pickupSpotName} → ${destinationSpotName}. Driver arriving in ~2 minutes.`,
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

  const handleMapReady = useCallback((map: any) => {
    try {
      mapInstanceRef.current = map;
      setMapReady(true);
    } catch (error) {
      console.error('Error setting up map:', error);
    }
  }, []);

  const handleBookRide = () => {
    if (!selectedSpot || !selectedDestination) {
      toast({
        title: "Missing Information",
        description: "Please select both pickup and destination locations.",
        variant: "destructive",
      });
      return;
    }

    // Generate guest user ID if not logged in
    const userId = user?.id || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    const rideData = {
      userId,
      pickupSpotId: selectedSpot.id,
      destinationSpotId: selectedDestination.id,
      fare: estimateRideFare(getRouteDistance(selectedSpot.id, selectedDestination.id) || 0),
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

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            {
              label: "Active Spots",
              value: totalSpots,
              description: "Strategic Binghamton coverage",
            },
            {
              label: "Available AirBears",
              value: availableAirbearsCount,
              description: "Ready for pickup",
            },
            {
              label: "Charging AirBears",
              value: chargingAirbearsCount,
              description: "Solar power in the bank",
            },
            {
              label: "Instant ETA",
              value: "4m",
              description: "Average wait time",
            },
          ].map(card => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/10 bg-muted/30 p-4 text-left shadow-xl shadow-cyan-500/10"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">{card.label}</p>
              <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
          ))}
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
            <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-xl">
              <MapComponent
                key={mapKey}
                center={[42.0987, -75.9179]}
                zoom={13}
                className="rounded-xl border border-gray-200 dark:border-gray-700"
                onMapReady={handleMapReady}
              />
              
              {/* Map controls */}
              <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700"
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.zoomIn();
                    }
                  }}
                  title="Zoom in"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700"
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.zoomOut();
                    }
                  }}
                  title="Zoom out"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700"
                  onClick={() => setMapKey(prev => prev + 1)}
                  title="Refresh map"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Map legend */}
              <div className="absolute bottom-4 left-4 z-[1000] flex flex-col space-y-2">
                <div className="flex items-center space-x-3 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
                  <div className="flex items-center space-x-2">
                    <RickshawWheel size="sm" className="text-primary" />
                    <span className="font-medium text-sm">Available AirBear</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
                  <div className="flex items-center space-x-2">
                    <Store className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-sm">Bodega Available</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-lime-500" />
                    <span className="font-medium text-sm">Solar Charging</span>
                  </div>
                </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-primary mr-2" />
                      <div>
                        <div className="font-medium">{selectedSpot?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(() => {
                            const availableAtSpot = rickshaws?.filter(r => r.currentSpotId === selectedSpot?.id && r.isAvailable) || [];
                            return `${availableAtSpot.length} AirBear${availableAtSpot.length !== 1 ? 's' : ''} available here`;
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Spot #{spotsData?.findIndex(s => s.id === selectedSpot?.id)! + 1}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination</label>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {spotsData?.filter(s => s.id !== selectedSpot?.id).map((spot) => {
                    const availableAtDestination = rickshaws?.filter(r => r.currentSpotId === spot.id && r.isAvailable) || [];
                    return (
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                            <div>
                              <div className="font-medium text-sm">{spot.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {availableAtDestination.length > 0
                                  ? `${availableAtDestination.length} AirBear${availableAtDestination.length !== 1 ? 's' : ''} available`
                                  : 'No AirBears currently available'
                                }
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Spot #{spotsData?.findIndex(s => s.id === spot.id)! + 1}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ride Summary */}
              {selectedDestination && (
                <div className="p-4 bg-muted/10 rounded-lg space-y-2">
                  {(() => {
                    const distance = selectedSpot ? getRouteDistance(selectedSpot.id, selectedDestination.id) : null;
                    const time = distance ? estimateRideTime(distance) : 0;
                    const fare = distance ? estimateRideFare(distance) : 0;
                    return (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Distance</span>
                          <span>{distance ? `${distance.toFixed(1)} km` : "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Est. Time</span>
                          <span>{time ? `${time} min` : "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Fare</span>
                          <span>${fare.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Total</span>
                          <span>${fare.toFixed(2)}</span>
                        </div>
                      </>
                    );
                  })()}
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
