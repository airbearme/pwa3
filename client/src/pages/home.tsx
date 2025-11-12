import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AirbearWheel from "@/components/airbear-wheel";
import EcoImpact from "@/components/eco-impact";
import CeoTshirtPromo from "@/components/ceo-tshirt-promo";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Crown } from "lucide-react";
import { useState } from "react";

// Types for API responses
type Analytics = {
  totalSpots: number;
  totalRickshaws: number;
  activeRickshaws: number;
  chargingRickshaws: number;
  maintenanceRickshaws: number;
  averageBatteryLevel: number;
};

export default function Home() {
  const [showCeoPromo, setShowCeoPromo] = useState(false);
  
  const { data: spots, isLoading } = useQuery({
    queryKey: ["/api/spots"],
  });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/analytics/overview"],
  });

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
          <motion.div 
            className="absolute top-1/2 left-1/4"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <AirbearWheel size="lg" className="opacity-30" effectType="solar" />
          </motion.div>
          <motion.div 
            className="absolute top-1/3 right-1/4"
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          >
            <AirbearWheel size="lg" className="opacity-20" effectType="eco" />
          </motion.div>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Mascot Image */}
          <motion.div 
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <img 
              src="/airbear-mascot.png" 
              alt="Friendly brown bear mascot with pilot goggles representing AirBear" 
              className="mx-auto rounded-full w-32 h-32 object-cover border-4 border-primary/30 hover-lift animate-pulse-glow"
              data-testid="img-mascot"
            />
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-white animate-pulse-glow airbear-holographic">
              AirBear Mobile Bodega
            </span>
            <br />
            <span className="text-foreground airbear-solar-rays">Solar Powered Rideshare</span>
            
            {/* Holographic overlay effect */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full opacity-60"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${30 + Math.sin(i) * 20}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 360, 720],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.h1>
          
          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed airbear-eco-breeze"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="text-primary font-bold animate-shimmer">Mobile bodega and solar-powered rideshare!</span>
            <br />
            Experience eco-friendly transportation with onboard shopping,
            <span className="text-emerald-500 font-semibold airbear-god-rays"> zero emissions</span>, and
            <span className="text-amber-500 font-semibold"> revolutionary sustainable mobility!</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/map">
              <Button 
                size="lg" 
                className="group relative eco-gradient text-white hover-lift ripple-effect px-8 py-4 text-lg font-semibold animate-neon-glow"
                data-testid="button-book-airbear"
              >
                <AirbearWheel size="sm" className="mr-3" animated glowing />
                Book Your AirBear
              </Button>
            </Link>
            
            <Button 
              size="lg"
              onClick={() => setShowCeoPromo(true)}
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white hover-lift ripple-effect px-8 py-4 text-lg font-semibold animate-pulse-glow"
              data-testid="button-ceo-tshirt"
            >
              <Crown className="mr-3 h-6 w-6" />
              CEO T-Shirt $100
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 text-lg font-semibold hover-lift ripple-effect"
              data-testid="button-watch-demo"
              onClick={() => {
                window.open('https://www.facebook.com/reel/1848713332735111', '_blank');
              }}
            >
              <i className="fas fa-play mr-3"></i>
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center hover-lift" data-testid="stat-rides">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {analytics?.totalRickshaws || 5}
              </div>
              <div className="text-sm text-muted-foreground">Active AirBears</div>
            </div>
            <div className="text-center hover-lift" data-testid="stat-co2">
              <div className="text-2xl sm:text-3xl font-bold text-lime-500">582kg</div>
              <div className="text-sm text-muted-foreground">CO₂ Saved</div>
            </div>
            <div className="text-center hover-lift" data-testid="stat-spots">
              <div className="text-2xl sm:text-3xl font-bold text-amber-500">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  analytics?.totalSpots || 16
                )}
              </div>
              <div className="text-sm text-muted-foreground">Active Spots</div>
            </div>
            <div className="text-center hover-lift" data-testid="stat-solar">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-500">100%</div>
              <div className="text-sm text-muted-foreground">Solar Powered</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-transparent to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary animate-pulse-glow">AirBear</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <span className="text-emerald-600 font-semibold">"Buy the tee, ride for free—AirBear's eco-key!"</span>
              <br />Experience the future of sustainable transportation in Binghamton
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-morphism hover-lift h-full" data-testid="card-eco-friendly">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-leaf text-emerald-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 text-center">
                    100% Eco-Friendly
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Solar-powered rickshaws that produce zero emissions while reducing your carbon footprint
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="glass-morphism hover-lift h-full" data-testid="card-mobile-bodega">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-store text-amber-500 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 text-center">
                    Mobile Bodega
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Shop local products during your ride with our onboard convenience store
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="glass-morphism hover-lift h-full" data-testid="card-smart-routing">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-route text-primary text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 text-center">
                    Smart AirBear Routing
                  </h3>
                  <p className="text-muted-foreground text-center">
                    AI-powered AirBear routing across 16 Binghamton locations with clear pathways
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Preview Section */}
      <section className="relative py-20 bg-gradient-to-b from-emerald-50/30 to-lime-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Explore <span className="text-primary animate-pulse-glow">Binghamton</span> Map
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our beautiful solar-powered network across Binghamton with interactive locations
            </p>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl p-6 shadow-2xl glass-morphism mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-4 left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-500/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden relative shadow-inner bg-gradient-to-br from-emerald-100 to-lime-100">
              {/* Simplified Map Preview */}
              <div className="w-full h-full relative">
                {/* Binghamton outline/map background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-lime-100 to-amber-100 opacity-80"></div>

                {/* Chenango River representation */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-blue-300 opacity-60 rounded-full"></div>

                {/* Binghamton landmarks/areas */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-emerald-700 whitespace-nowrap">Downtown</div>
                </div>

                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-lime-500 rounded-full animate-pulse shadow-lg shadow-lime-500/50" style={{animationDelay: '0.5s'}}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-lime-700 whitespace-nowrap">University</div>
                </div>

                <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50" style={{animationDelay: '1s'}}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-amber-700 whitespace-nowrap">Airport</div>
                </div>

                <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" style={{animationDelay: '1.5s'}}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary whitespace-nowrap">Mall</div>
                </div>

                {/* AirBear locations */}
                {Array.from({ length: 16 }, (_, i) => {
                  const angle = (i * 360) / 16;
                  const radius = 35;
                  const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                  const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-emerald-500 via-lime-500 to-green-400 rounded-full animate-pulse shadow-lg border border-white"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        animationDelay: `${i * 0.1}s`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {/* Solar rays effect */}
                      <div className="absolute inset-0 rounded-full border border-yellow-400 opacity-40 animate-ping"></div>
                    </div>
                  );
                })}

                {/* Central hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-lime-600 rounded-full animate-pulse shadow-xl shadow-emerald-500/60 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🐻</span>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-emerald-800 whitespace-nowrap">
                    AirBear Hub
                  </div>
                </div>

                {/* Route lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="rgb(132, 204, 22)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  {/* Curved route lines */}
                  <path d="M 20,30 Q 50,20 80,40" stroke="url(#routeGradient)" strokeWidth="1" fill="none" strokeDasharray="2,2" className="animate-pulse" />
                  <path d="M 15,60 Q 50,70 85,50" stroke="url(#routeGradient)" strokeWidth="1" fill="none" strokeDasharray="2,2" className="animate-pulse" style={{animationDelay: '1s'}} />
                  <path d="M 25,80 Q 50,60 75,85" stroke="url(#routeGradient)" strokeWidth="1" fill="none" strokeDasharray="2,2" className="animate-pulse" style={{animationDelay: '2s'}} />
                </svg>

                {/* Map overlay info */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-emerald-700">16 AirBear Spots</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Binghamton Network</div>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-yellow-500">⚡</span>
                    <span className="font-semibold text-amber-700">Solar Powered</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Zero Emissions</div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200"
                  onClick={() => {
                    // Simulate zoom in
                    const mapElement = document.querySelector('.map-preview');
                    if (mapElement) {
                      mapElement.classList.add('scale-110');
                      setTimeout(() => mapElement.classList.remove('scale-110'), 300);
                    }
                  }}
                >
                  <span className="text-lg">+</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-200"
                  onClick={() => {
                    // Simulate zoom out
                    const mapElement = document.querySelector('.map-preview');
                    if (mapElement) {
                      mapElement.classList.add('scale-90');
                      setTimeout(() => mapElement.classList.remove('scale-90'), 300);
                    }
                  }}
                >
                  <span className="text-lg">−</span>
                </Button>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">Available AirBear</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="text-amber-500">⚡</span>
                  <span className="font-medium">Solar Charging</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">🏪</span>
                  <span className="font-medium">Mobile Bodega</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/map">
              <Button
                size="lg"
                className="eco-gradient text-white hover-lift ripple-effect px-8 py-4 text-lg font-semibold animate-neon-glow"
              >
                <i className="fas fa-map-marked-alt mr-3"></i>
                View Full Interactive Map
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Eco Impact Section */}
      <EcoImpact />

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-500 via-lime-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Your Eco Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of Binghamton residents who are making a difference, one ride at a time
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-emerald-600 hover:bg-white/90 px-8 py-4 text-lg font-semibold hover-lift"
                  data-testid="button-get-started"
                >
                  <AirbearWheel size="sm" className="mr-3 border-emerald-600" />
                  Get Started Today
                </Button>
              </Link>
              
              <Link to="/map">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold hover-lift"
                  data-testid="button-explore-map"
                >
                  <i className="fas fa-map mr-3"></i>
                  Explore Map
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CEO T-Shirt Promo Dialog */}
      <CeoTshirtPromo 
        isOpen={showCeoPromo} 
        onClose={() => setShowCeoPromo(false)} 
      />
    </div>
  );
}
