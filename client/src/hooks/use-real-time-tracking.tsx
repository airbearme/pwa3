import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '../lib/supabaseClient';
import { useAirbearSession } from './use-airbear-session';
import { useToast } from './use-toast';

interface RideUpdate {
  id: string;
  userId: string;
  driverId?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  pickupSpotId: string;
  destinationSpotId: string;
  estimatedDuration?: number;
  actualDuration?: number;
  distance?: number;
  co2Saved?: number;
  fare: number;
  requestedAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  airbearId?: string;
}

interface AirBearLocation {
  id: string;
  currentSpotId: string;
  batteryLevel: number;
  isAvailable: boolean;
  isCharging: boolean;
  maintenanceStatus: string;
  lastLocationUpdate: string;
  currentLat: number;
  currentLng: number;
}

interface TrackingState {
  activeRides: RideUpdate[];
  availableDrivers: AirBearLocation[];
  userRides: RideUpdate[];
  driverAssignments: RideUpdate[];
  isTracking: boolean;
  lastUpdate: Date | null;
}

export const useRealTimeTracking = () => {
  const { user } = useAirbearSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [state, setState] = useState<TrackingState>({
    activeRides: [],
    availableDrivers: [],
    userRides: [],
    driverAssignments: [],
    isTracking: false,
    lastUpdate: null
  });

  // Subscribe to real-time ride updates
  const subscribeToRideUpdates = useCallback(() => {
    if (!user) return;

    const channel = supabaseClient
      .channel('ride-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: user.role === 'driver' ? `driverId=eq.${user.id}` : `userId=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time ride update:', payload);
          
          // Update query cache
          queryClient.invalidateQueries({ queryKey: ['/api/rides'] });
          queryClient.invalidateQueries({ queryKey: ['/api/rides/user', user.id] });
          
          // Show notifications for status changes
          if (payload.eventType === 'UPDATE') {
            const newRide = payload.new as RideUpdate;
            const oldRide = payload.old as RideUpdate;
            
            if (newRide.status !== oldRide.status) {
              handleRideStatusUpdate(newRide);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Subscribe to real-time AirBear location updates
  const subscribeToDriverLocations = useCallback(() => {
    const channel = supabaseClient
      .channel('driver-locations')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'airbears'
        },
        (payload) => {
          console.log('Real-time AirBear location update:', payload);
          
          // Update driver locations in cache
          queryClient.invalidateQueries({ queryKey: ['/api/rickshaws/available'] });
          
          // Notify if driver became available near user
          const newAirBear = payload.new as AirBearLocation;
          if (newAirBear.isAvailable && !newAirBear.isCharging) {
            // This could trigger a notification if user has an active ride request
            handleDriverAvailabilityUpdate(newAirBear);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [queryClient]);

  // Subscribe to general system updates (for admin dashboard)
  const subscribeToSystemUpdates = useCallback(() => {
    if (user?.role !== 'admin') return;

    const channel = supabaseClient
      .channel('system-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('System order update:', payload);
          queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
          queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments'
        },
        (payload) => {
          console.log('System payment update:', payload);
          queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Handle ride status updates with notifications
  const handleRideStatusUpdate = useCallback((ride: RideUpdate) => {
    const statusMessages = {
      pending: 'Your ride request has been received!',
      accepted: 'Your driver has accepted the ride!',
      in_progress: 'Your ride is in progress!',
      completed: 'Ride completed successfully!',
      cancelled: 'Ride has been cancelled.'
    };

    toast({
      title: 'Ride Update',
      description: statusMessages[ride.status as keyof typeof statusMessages] || 'Ride status updated',
    });

    // Play sound for important updates
    if (ride.status === 'accepted' || ride.status === 'in_progress') {
      playNotificationSound();
    }
  }, [toast]);

  // Handle driver availability updates
  const handleDriverAvailabilityUpdate = useCallback((airBear: AirBearLocation) => {
    if (user?.role === 'user') {
      toast({
        title: '🚗 Driver Available!',
        description: 'An AirBear driver is now available in your area',
        duration: 5000,
      });
    }
  }, [user, toast]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Could not play notification sound:', e));
    } catch (e) {
      console.log('Notification sound not available');
    }
  }, []);

  // Start tracking
  const startTracking = useCallback(() => {
    setState(prev => ({ ...prev, isTracking: true }));
    
    const cleanupRideUpdates = subscribeToRideUpdates();
    const cleanupDriverLocations = subscribeToDriverLocations();
    const cleanupSystemUpdates = subscribeToSystemUpdates();

    setState(prev => ({ ...prev, lastUpdate: new Date() }));

    return () => {
      cleanupRideUpdates?.();
      cleanupDriverLocations?.();
      cleanupSystemUpdates?.();
      setState(prev => ({ ...prev, isTracking: false }));
    };
  }, [subscribeToRideUpdates, subscribeToDriverLocations, subscribeToSystemUpdates]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    setState(prev => ({ ...prev, isTracking: false }));
  }, []);

  // Update ride location (for drivers)
  const updateDriverLocation = useCallback(async (airBearId: string, lat: number, lng: number) => {
    try {
      const { error } = await supabaseClient
        .from('airbears')
        .update({
          currentLat: lat,
          currentLng: lng,
          lastLocationUpdate: new Date().toISOString()
        })
        .eq('id', airBearId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['/api/rickshaws/available'] });
    } catch (error) {
      console.error('Error updating driver location:', error);
      toast({
        title: 'Location Update Failed',
        description: 'Unable to update your location',
        variant: 'destructive'
      });
    }
  }, [queryClient, toast]);

  // Send ride status update (for drivers)
  const updateRideStatus = useCallback(async (rideId: string, status: RideUpdate['status']) => {
    try {
      const updates: any = { status };
      
      // Add timestamps based on status
      switch (status) {
        case 'accepted':
          updates.acceptedAt = new Date().toISOString();
          break;
        case 'in_progress':
          updates.startedAt = new Date().toISOString();
          break;
        case 'completed':
          updates.completedAt = new Date().toISOString();
          break;
      }

      const { error } = await supabaseClient
        .from('rides')
        .update(updates)
        .eq('id', rideId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['/api/rides'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rides/user'] });

      toast({
        title: 'Status Updated',
        description: `Ride status changed to ${status.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating ride status:', error);
      toast({
        title: 'Update Failed',
        description: 'Unable to update ride status',
        variant: 'destructive'
      });
    }
  }, [queryClient, toast]);

  // Get nearby drivers (for users)
  const getNearbyDrivers = useCallback(async (userLat: number, userLng: number, radiusKm: number = 5) => {
    try {
      const { data: drivers, error } = await supabaseClient
        .from('airbears')
        .select(`
          *,
          spots!current_spot_id (
            name,
            latitude,
            longitude
          )
        `)
        .eq('isAvailable', true)
        .eq('isCharging', false);

      if (error) throw error;

      // Calculate distances and filter by radius
      const nearbyDrivers = drivers?.filter(driver => {
        if (!driver.spots || !driver.currentLat || !driver.currentLng) return false;
        
        const distance = calculateDistance(
          userLat, userLng,
          driver.currentLat, driver.currentLng
        );
        
        return distance <= radiusKm;
      }).map(driver => ({
        ...driver,
        distance: calculateDistance(
          userLat, userLng,
          driver.currentLat, driver.currentLng
        )
      })) || [];

      return nearbyDrivers;
    } catch (error) {
      console.error('Error fetching nearby drivers:', error);
      return [];
    }
  }, []);

  // Helper function to calculate distance between two points
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Auto-start tracking when user is authenticated
  useEffect(() => {
    if (user && !state.isTracking) {
      const cleanup = startTracking();
      return cleanup;
    }
  }, [user, state.isTracking, startTracking]);

  return {
    ...state,
    startTracking,
    stopTracking,
    updateDriverLocation,
    updateRideStatus,
    getNearbyDrivers,
    calculateDistance
  };
};
