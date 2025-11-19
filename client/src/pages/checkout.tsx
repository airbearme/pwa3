import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { createCheckoutSession } from "@/lib/stripe";
import RickshawWheel from "@/components/airbear-wheel";
import LoadingSpinner from "@/components/loading-spinner";
import { useAirbearSession } from "@/hooks/use-airbear-session";

const orderData = {
  orderId: "order_123",
  rideId: "ride_456",
  items: [
    { name: "Local Coffee Blend", price: 12.99, quantity: 1 },
    { name: "Fresh Produce Box", price: 24.99, quantity: 1 },
  ],
  subtotal: 37.98,
  tax: 3.04,
  total: 41.02,
};

export default function Checkout() {
  const { user } = useAirbearSession();
  const { toast } = useToast();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/orders", data);
      return response.json();
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setPaymentSuccess(true);
    }
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete checkout",
        variant: "destructive",
      });
      return;
    }

    if (isRedirecting) return;

    setIsRedirecting(true);

    try {
      const order = await createOrderMutation.mutateAsync({
        userId: user.id,
        items: orderData.items.map((item) => ({
          itemId: `bodega_${item.name.replace(/\s+/g, '-').toLowerCase()}`,
          quantity: item.quantity,
          price: item.price.toFixed(2),
        })),
        totalAmount: orderData.total.toFixed(2),
      });

      const lineItems = orderData.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await createCheckoutSession({
        lineItems,
        successUrl: `${window.location.origin}/checkout?success=true`,
        cancelUrl: `${window.location.origin}/checkout?cancelled=true`,
        userId: user.id,
        orderId: order.id,
      });

      if (!session.url) {
        throw new Error("Stripe did not return a redirect URL");
      }

      window.location.href = session.url;
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message || "Unable to initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsRedirecting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto glass-morphism">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to proceed with checkout</p>
            <Button asChild className="eco-gradient text-white">
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center space-y-4"
        >
          <RickshawWheel size="lg" className="mx-auto text-emerald-500" />
          <h2 className="text-3xl font-bold">Payment confirmed!</h2>
          <p className="text-muted-foreground">
            Your order is being processed. You will be redirected shortly.
          </p>
          <Link to="/dashboard">
            <Button className="eco-gradient text-white">Return to Dashboard</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto space-y-8 px-4">
        <Card className="glass-morphism p-6">
          <CardHeader className="pb-2">
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Order subtotal</p>
                <p className="text-lg font-semibold">${orderData.subtotal.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tax</p>
                <p className="text-lg font-semibold">${orderData.tax.toFixed(2)}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-2xl font-bold">
                ${orderData.total.toFixed(2)}
              </p>
            </div>
            <Button
              className="w-full eco-gradient text-white"
              onClick={handleCheckout}
              disabled={isRedirecting}
            >
              {isRedirecting ? (
                <div className="flex items-center justify-center space-x-2">
                  <RickshawWheel size="sm" className="animate-spin" />
                  <span>Redirecting to Stripe…</span>
                </div>
              ) : (
                "Continue to payment"
              )}
            </Button>
          </CardContent>
        </Card>
        <Card className="glass-morphism p-5 border border-emerald-500/50">
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              You will be redirected to Stripe's secure checkout. Close the tab if you decide to cancel.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Billing is handled securely by Stripe.</p>
              <p>Any problems? Reach out via support@airbear.io</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
