import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAirbearSession } from "@/hooks/use-airbear-session";
import { useToast } from "@/hooks/use-toast";
import { createCheckoutSession } from "@/lib/stripe";
import AirbearWheel from "./airbear-wheel";
import { 
  Crown, 
  Shirt, 
  Sparkles, 
  Gift, 
  CheckCircle,
  AlertTriangle,
  Star,
  Zap
} from "lucide-react";

interface CeoTshirtPromoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CeoTshirtPromo({ isOpen, onClose }: CeoTshirtPromoProps) {
  const { user } = useAirbearSession();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to purchase the CEO T-shirt",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a t-shirt size",
        variant: "destructive",
      });
      return;
    }

    if (!acceptedTerms) {
      setShowAgreement(true);
      return;
    }

    setIsPurchasing(true);

    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          items: [
            {
              itemId: `ceo-tshirt-${selectedSize.toLowerCase()}`,
              quantity: 1,
              price: "100.00",
            },
          ],
          totalAmount: "100.00",
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.message || "Unable to create order");
      }

      const order = await orderResponse.json();

      const session = await createCheckoutSession({
        lineItems: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "CEO-Signed AirBear T-Shirt",
                description: `Size ${selectedSize}`,
              },
              unit_amount: 10000,
            },
            quantity: 1,
          },
        ],
        successUrl: `${window.location.origin}/promo?success=true`,
        cancelUrl: `${window.location.origin}/promo?cancelled=true`,
        userId: user.id,
        orderId: order.id,
        metadata: {
          product_type: "ceo_tshirt",
          size: selectedSize,
        },
      });

      if (!session.url) {
        throw new Error("Stripe checkout URL missing");
      }

      window.location.href = session.url;
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Unable to complete purchase",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="glass-morphism max-w-2xl" data-testid="dialog-ceo-tshirt">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Crown className="mr-3 h-8 w-8 text-amber-500 animate-bounce" />
              CEO-Signed AirBear T-Shirt
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* T-Shirt Preview */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-emerald-100 via-lime-100 to-amber-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Holographic background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-cyan-400/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="text-center relative z-10">
                  <motion.div 
                    className="text-6xl mb-4"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🐻
                  </motion.div>
                  <div className="text-2xl font-bold text-emerald-700 mb-2">AirBear</div>
                  <div className="text-sm text-emerald-600 font-semibold">
                    "Solar power in the air!"
                  </div>
                  <div className="text-xs text-amber-600 mt-2 italic">
                    ✍️ CEO Signature
                  </div>
                </div>
                
                {/* Sparkle effects */}
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-amber-400 rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.25,
                    }}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <Badge className="bg-amber-500 text-white text-lg px-4 py-2">
                  <Star className="mr-2 h-4 w-4" />
                  $1,500+ Value
                </Badge>
              </div>
            </div>

            {/* Purchase Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">Premium Benefits</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium">Daily Free AirBear Ride</p>
                      <p className="text-sm text-muted-foreground">One complimentary ride every 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium">CEO Authentic Signature</p>
                      <p className="text-sm text-muted-foreground">Hand-signed by AirBear CEO</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-medium">VIP Priority Access</p>
                      <p className="text-sm text-muted-foreground">Skip the line with priority booking</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-1" />
                    <div>
                      <p className="font-medium text-amber-700">Non-Transferable</p>
                      <p className="text-sm text-muted-foreground">Benefits tied to your account only</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        Size {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ceo-terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                />
                <label htmlFor="ceo-terms" className="text-sm cursor-pointer">
                  I agree to the{" "}
                  <button 
                    className="text-primary hover:underline"
                    onClick={() => setShowAgreement(true)}
                  >
                    CEO T-Shirt Terms & Conditions
                  </button>
                </label>
              </div>

              {/* Purchase Button */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$100</div>
                  <p className="text-sm text-muted-foreground">One-time purchase • Lifetime benefits</p>
                </div>
                
                <Button
                  onClick={handlePurchase}
                  disabled={!selectedSize || !acceptedTerms || isPurchasing}
                  className="w-full eco-gradient text-white hover-lift ripple-effect text-lg py-6"
                  data-testid="button-purchase-ceo-tshirt"
                >
                  {isPurchasing ? (
                    <div className="flex items-center">
                      <AirbearWheel size="sm" className="mr-3" />
                      Processing Purchase...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Sparkles className="mr-3 h-6 w-6" />
                      Purchase CEO T-Shirt
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Agreement Dialog */}
      <Dialog open={showAgreement} onOpenChange={setShowAgreement}>
        <DialogContent className="glass-morphism max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Crown className="mr-2 h-6 w-6 text-amber-500" />
              CEO T-Shirt Terms & Conditions
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">1. EXCLUSIVE BENEFITS</h3>
              <p>The CEO-signed AirBear T-shirt grants the holder one (1) complimentary AirBear ride per 24-hour period. This benefit is non-transferable and tied exclusively to the purchaser's account.</p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">2. NON-TRANSFERABLE LICENSE</h3>
              <p>This promotional benefit cannot be sold, transferred, gifted, or shared with any other individual. Violation of this term results in immediate termination of benefits.</p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">3. RIDE LIMITATIONS</h3>
              <p>Free rides are limited to standard AirBear routes within Binghamton. Premium routes, extended trips, or special event transportation may incur additional charges.</p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">4. AUTHENTICITY GUARANTEE</h3>
              <p>Each T-shirt includes an authentic CEO signature and holographic verification. AirBear reserves the right to verify authenticity at any time.</p>
            </section>

            <div className="flex space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAgreement(false)}
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowAgreement(false);
                }}
                className="eco-gradient text-white"
              >
                Accept Terms
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}
