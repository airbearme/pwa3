import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import RickshawWheel from "@/components/airbear-wheel";
import LoadingSpinner from "@/components/loading-spinner";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Battery, MapPin, ShoppingCart, TrendingUp, Users, Zap, Award, Target, Calendar } from "lucide-react";
import NotificationSettings from "@/components/notification-settings";

interface Analytics {
  totalSpots: number;
  totalAirbears: number;
  activeAirbears: number;
  chargingAirbears: number;
  maintenanceAirbears: number;
  averageBatteryLevel: number;
}

export default function Dashboard() {
  const { user, isUserReady } = useAuth();

  const { data: rides, isLoading: ridesLoading } = useQuery<any[]>({
    queryKey: ["/api/rides/user", user?.id],
    enabled: isUserReady && !!user?.id,
  });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/analytics/overview"],
  });

  if (!user || !isUserReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const renderUserDashboard = () => (
    <div className="space-y-8">
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center items-center space-x-3 mb-4">
          <RickshawWheel size="lg" animated glowing />
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, <span className="text-primary animate-pulse-glow">{user.username}</span>!
            </h1>
            <p className="text-emerald-600 font-semibold">
              "AirBear flair, ride without a care!"
            </p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Ready for your next eco-friendly AirBear adventure?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card className="eco-gradient text-white overflow-hidden relative" data-testid="card-eco-points">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Leaf className="mr-3 h-6 w-6" />
              Eco Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{user.ecoPoints?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link to="/map">
          <Card className="hover-lift glass-morphism cursor-pointer group" data-testid="card-book-airbear">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Book AirBear</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/bodega">
          <Card className="hover-lift glass-morphism cursor-pointer group" data-testid="card-shop-bodega">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Shop Bodega</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/challenges">
          <Card className="hover-lift glass-morphism cursor-pointer group" data-testid="card-eco-challenges">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Eco Challenges</h3>
            </CardContent>
          </Card>
        </Link>

        <Link to="/rewards">
          <Card
            className="hover-lift glass-morphism cursor-pointer group"
            data-testid="card-rewards"
          >
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Rewards</h3>
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Card className="glass-morphism" data-testid="card-recent-activity">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {ridesLoading ? (
              <LoadingSpinner size="sm" text="Loading activities..." />
            ) : Array.isArray(rides) && rides.length > 0 ? (
              <div className="space-y-4">
                {rides.slice(0, 5).map((ride: any) => (
                  <motion.div
                    key={ride.id}
                    className="flex items-center justify-between p-3"
                  >
                    <div>
                      <p className="font-medium">Ride #{ride.id.slice(0, 8)}</p>
                    </div>
                    <Badge>{ride.status}</Badge>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No rides yet.</p>
                <Link to="/map">
                  <Button className="mt-4 eco-gradient text-white" data-testid="button-book-first-ride">
                    Book Your First Ride
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <NotificationSettings />
      </motion.div>
    </div>
  );

  const renderDriverDashboard = () => (
    <div>Driver Dashboard</div>
  );

  const renderAdminDashboard = () => (
    <div>Admin Dashboard</div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {user.role === "admin" ? (
          renderAdminDashboard()
        ) : user.role === "driver" ? (
          renderDriverDashboard()
        ) : (
          renderUserDashboard()
        )}
      </div>
    </div>
  );
}
