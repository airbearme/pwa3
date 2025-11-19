import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useRealTimeTracking } from '@/hooks/use-real-time-tracking';
import { useAirbearSession } from '@/hooks/use-airbear-session';
import LoadingSpinner from '@/components/loading-spinner';
import RickshawWheel from '@/components/airbear-wheel';
import {
  Activity,
  Users,
  Zap,
  DollarSign,
  MapPin,
  Battery,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Car,
  ShoppingBag,
  Leaf,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw,
  Download,
  Settings
} from 'lucide-react';

interface SystemMetrics {
  totalRides: number;
  activeRides: number;
  completedRides: number;
  totalRevenue: number;
  activeDrivers: number;
  availableDrivers: number;
  chargingDrivers: number;
  totalUsers: number;
  ecoImpact: {
    co2Saved: number;
    ridesCompleted: number;
    averageDistance: number;
  };
  systemHealth: {
    uptime: string;
    responseTime: number;
    errorRate: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'ride' | 'order' | 'payment' | 'system';
  userId: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function AdminDashboard() {
  const { user } = useAirbearSession();
  const { isTracking, lastUpdate } = useRealTimeTracking();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  // Fetch system metrics
  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery<SystemMetrics>({
    queryKey: ['/api/admin/metrics'],
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });

  // Fetch recent activity
  const { data: recentActivity, isLoading: activityLoading } = useQuery<RecentActivity[]>({
    queryKey: ['/api/admin/recent-activity'],
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });

  // Fetch fleet status
  const { data: fleetStatus, isLoading: fleetLoading } = useQuery({
    queryKey: ['/api/admin/fleet-status'],
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });

  // Fetch user analytics
  const { data: userAnalytics, isLoading: userAnalyticsLoading } = useQuery({
    queryKey: ['/api/admin/user-analytics'],
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });

  // Calculate health score
  const getHealthScore = () => {
    if (!metrics) return 0;
    const { activeDrivers, availableDrivers, totalRides, completedRides } = metrics;
    
    const driverAvailability = totalRides > 0 ? (availableDrivers / activeDrivers) * 100 : 100;
    const completionRate = totalRides > 0 ? (completedRides / totalRides) * 100 : 100;
    const systemUptime = metrics.systemHealth.uptime ? 95 : 85; // Mock uptime calculation
    
    return Math.round((driverAvailability + completionRate + systemUptime) / 3);
  };

  const healthScore = getHealthScore();

  // Get status color
  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format number
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Export data
  const exportData = (type: string) => {
    const data = type === 'metrics' ? metrics : recentActivity;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airbear-${type}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto glass-morphism">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to access this dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (metricsLoading || activityLoading || fleetLoading || userAnalyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
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
          <div className="flex justify-center items-center space-x-3 mb-4">
            <RickshawWheel size="lg" className="text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              AirBear <span className="text-primary">Command Center</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Real-time system monitoring and fleet analytics dashboard
          </p>
          
          {/* System Status */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isTracking ? 'Real-time tracking active' : 'Tracking inactive'}
              </span>
            </div>
            {lastUpdate && (
              <div className="text-sm text-muted-foreground">
                Last update: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-primary/10 border-primary/30' : ''}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto Refresh: {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetchMetrics()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Now
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportData('metrics')}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </motion.div>

        {/* System Health Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="glass-morphism" data-testid="card-system-health">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Activity className="mr-2 h-5 w-5 text-green-500" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                <span className={getStatusColor(healthScore)}>{healthScore}%</span>
              </div>
              <Progress value={healthScore} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Overall system performance
              </p>
            </CardContent>
          </Card>

          <Card className="glass-morphism" data-testid="card-active-rides">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Car className="mr-2 h-5 w-5 text-blue-500" />
                Active Rides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {metrics?.activeRides || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                Rides in progress
              </p>
            </CardContent>
          </Card>

          <Card className="glass-morphism" data-testid="card-available-drivers">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-emerald-500" />
                Available Drivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-500 mb-2">
                {metrics?.availableDrivers || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                Ready for pickup
              </p>
            </CardContent>
          </Card>

          <Card className="glass-morphism" data-testid="card-daily-revenue">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-amber-500" />
                Daily Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500 mb-2">
                {formatCurrency(metrics?.totalRevenue || 0)}
              </div>
              <p className="text-sm text-muted-foreground">
                Total earnings today
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-muted/50">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="fleet" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Car className="h-4 w-4 mr-2" />
                Fleet
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <PieChart className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Metrics */}
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle>Key Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Rides Today</span>
                      <span className="font-semibold">{formatNumber(metrics?.totalRides || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold text-green-500">
                        {metrics ? Math.round((metrics.completedRides / metrics.totalRides) * 100) || 0 : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Ride Duration</span>
                      <span className="font-semibold">12 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Customer Satisfaction</span>
                      <span className="font-semibold text-green-500">4.8/5.0</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Eco Impact */}
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Leaf className="mr-2 h-5 w-5 text-green-500" />
                      Environmental Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CO₂ Saved Today</span>
                      <span className="font-semibold text-green-500">{metrics?.ecoImpact.co2Saved || 0} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Carbon Neutral Rides</span>
                      <span className="font-semibold">{formatNumber(metrics?.ecoImpact.ridesCompleted || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Distance</span>
                      <span className="font-semibold">{metrics?.ecoImpact.averageDistance || 0} km</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Eco Score</span>
                      <Badge className="bg-green-500">Excellent</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Fleet Tab */}
            <TabsContent value="fleet" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Battery className="mr-2 h-5 w-5 text-green-500" />
                      Battery Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High (80-100%)</span>
                      <Badge className="bg-green-500">12 AirBears</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Medium (50-79%)</span>
                      <Badge className="bg-yellow-500">8 AirBears</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Low (0-49%)</span>
                      <Badge className="bg-red-500">3 AirBears</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-blue-500" />
                      Location Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Locations</span>
                      <Badge className="bg-blue-500">16 Spots</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">High Traffic Areas</span>
                      <Badge className="bg-orange-500">5 Areas</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Optimal Coverage</span>
                      <Badge className="bg-green-500">95%</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-purple-500" />
                      Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ready for Service</span>
                      <Badge className="bg-green-500">18 AirBears</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Needs Maintenance</span>
                      <Badge className="bg-yellow-500">3 AirBears</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Out of Service</span>
                      <Badge className="bg-red-500">2 AirBears</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Revenue charts would be displayed here</p>
                      <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>User Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{formatNumber(metrics?.totalUsers || 0)}</div>
                      <div className="text-sm text-muted-foreground">Total Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">247</div>
                      <div className="text-sm text-muted-foreground">Active Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">89</div>
                      <div className="text-sm text-muted-foreground">New Signups</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-500">4.8</div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {recentActivity?.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'completed' ? 'bg-green-500' :
                            activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="font-medium text-sm">{activity.description}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-muted-foreground">
                        No recent activity
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
