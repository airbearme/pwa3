import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AirbearWheel from "@/components/airbear-wheel";
import EcoImpact from "@/components/eco-impact";
import CeoTshirtPromo from "@/components/ceo-tshirt-promo";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Crown, Star } from "lucide-react";
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
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <AirbearWheel size="xl" effect="holographic" animated />
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent">
              AirBear Mobile Bodega
            </span>
            <br />
            <span className="text-foreground">Solar Powered Rideshare</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the future of sustainable transportation! Solar-powered vehicles with onboard shopping experiences, zero emissions, and revolutionary eco-mobility!
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/map">
              <Button 
                size="lg" 
                className="group relative eco-gradient text-white hover-lift px-8 py-4 text-lg font-semibold"
                data-testid="button-book-airbear"
              >
                Book Your AirBear
              </Button>
            </Link>
            
            <Button 
              size="lg"
              onClick={() => setShowCeoPromo(true)}
              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white hover-lift px-8 py-4 text-lg font-semibold"
              data-testid="button-ceo-tshirt"
            >
              <Crown className="mr-3 h-6 w-6" />
              CEO T-Shirt $100
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose AirBear?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of sustainable transportation in Binghamton
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
                <CardContent className="p-6 text-center">
                  <AirbearWheel size="lg" effect="neon" animated className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    100% Eco-Friendly
                  </h3>
                  <p className="text-muted-foreground">
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
                <CardContent className="p-6 text-center">
                  <AirbearWheel size="lg" effect="plasma" animated className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Mobile Bodega
                  </h3>
                  <p className="text-muted-foreground">
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
                <CardContent className="p-6 text-center">
                  <AirbearWheel size="lg" effect="solar" animated className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Smart AirBear Routing
                  </h3>
                  <p className="text-muted-foreground">
                    AI-powered AirBear routing across 16 Binghamton locations with clear pathways
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <EcoImpact />

      <CeoTshirtPromo 
        isOpen={showCeoPromo} 
        onClose={() => setShowCeoPromo(false)} 
      />
    </div>
  );
}
