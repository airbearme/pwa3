import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock_key_1234567890';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

export interface PaymentIntentData {
  amount: number;
  currency?: string;
  orderId?: string;
  rideId?: string;
  paymentMethod?: 'stripe' | 'apple_pay' | 'google_pay' | 'cash';
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntent?: any;
  error?: string;
  qrCode?: string;
}

export const createPaymentIntent = async (data: PaymentIntentData): Promise<PaymentResult> => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    const result = await response.json();

    if (data.paymentMethod === 'cash') {
      return {
        success: true,
        qrCode: result.qrCode,
      };
    }

    return {
      success: true,
      paymentIntent: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment setup failed',
    };
  }
};

export const confirmPayment = async (
  stripe: Stripe,
  clientSecret: string,
  paymentElement: any,
  returnUrl?: string
): Promise<PaymentResult> => {
  try {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements: paymentElement,
      confirmParams: {
        return_url: returnUrl || `${window.location.origin}/checkout/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Payment confirmation failed',
      };
    }

    return {
      success: true,
      paymentIntent,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment confirmation failed',
    };
  }
};

export const processApplePayPayment = async (data: PaymentIntentData): Promise<PaymentResult> => {
  const stripe = await getStripe();
  
  if (!stripe) {
    return {
      success: false,
      error: 'Stripe not initialized',
    };
  }

  try {
    // Create payment intent with Apple Pay metadata
    const paymentIntent = await createPaymentIntent({
      ...data,
      paymentMethod: 'apple_pay',
      metadata: {
        ...data.metadata,
        payment_method: 'apple_pay',
      },
    });

    if (!paymentIntent.success || !paymentIntent.paymentIntent) {
      return paymentIntent;
    }

    // Initialize Apple Pay payment request
    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: data.currency || 'usd',
      total: {
        label: 'AirBear Ride',
        amount: data.amount * 100, // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    const canMakePayment = await paymentRequest.canMakePayment();
    
    if (!canMakePayment || !canMakePayment.applePay) {
      return {
        success: false,
        error: 'Apple Pay not available',
      };
    }

    return new Promise((resolve) => {
      paymentRequest.on('paymentmethod', async (event) => {
        const { error } = await stripe.confirmCardPayment(
          paymentIntent.paymentIntent.clientSecret,
          {
            payment_method: event.paymentMethod.id,
          }
        );

        if (error) {
          event.complete('fail');
          resolve({
            success: false,
            error: error.message || 'Apple Pay payment failed',
          });
        } else {
          event.complete('success');
          resolve({
            success: true,
            paymentIntent: paymentIntent.paymentIntent,
          });
        }
      });

      paymentRequest.show();
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Apple Pay initialization failed',
    };
  }
};

export const processGooglePayPayment = async (data: PaymentIntentData): Promise<PaymentResult> => {
  const stripe = await getStripe();
  
  if (!stripe) {
    return {
      success: false,
      error: 'Stripe not initialized',
    };
  }

  try {
    // Create payment intent with Google Pay metadata
    const paymentIntent = await createPaymentIntent({
      ...data,
      paymentMethod: 'google_pay',
      metadata: {
        ...data.metadata,
        payment_method: 'google_pay',
      },
    });

    if (!paymentIntent.success || !paymentIntent.paymentIntent) {
      return paymentIntent;
    }

    // Initialize Google Pay payment request
    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: data.currency || 'usd',
      total: {
        label: 'AirBear Ride',
        amount: data.amount * 100, // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    const canMakePayment = await paymentRequest.canMakePayment();
    
    if (!canMakePayment || !canMakePayment.googlePay) {
      return {
        success: false,
        error: 'Google Pay not available',
      };
    }

    return new Promise((resolve) => {
      paymentRequest.on('paymentmethod', async (event) => {
        const { error } = await stripe.confirmCardPayment(
          paymentIntent.paymentIntent.clientSecret,
          {
            payment_method: event.paymentMethod.id,
          }
        );

        if (error) {
          event.complete('fail');
          resolve({
            success: false,
            error: error.message || 'Google Pay payment failed',
          });
        } else {
          event.complete('success');
          resolve({
            success: true,
            paymentIntent: paymentIntent.paymentIntent,
          });
        }
      });

      paymentRequest.show();
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Google Pay initialization failed',
    };
  }
};

export const generateCashQRCode = async (data: PaymentIntentData): Promise<PaymentResult> => {
  try {
    const result = await createPaymentIntent({
      ...data,
      paymentMethod: 'cash',
    });

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'QR code generation failed',
    };
  }
};

export const confirmCashPayment = async (qrCode: string, driverId: string): Promise<PaymentResult> => {
  try {
    const response = await fetch('/api/payments/confirm-cash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        qrCode,
        driverId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Cash payment confirmation failed');
    }

    const result = await response.json();

    return {
      success: true,
      paymentIntent: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Cash payment confirmation failed',
    };
  }
};

// CEO T-shirt purchase integration
export const purchaseCeoTshirt = async (data: PaymentIntentData & { size: string }): Promise<PaymentResult> => {
  try {
    const response = await fetch('/api/ceo-tshirt/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        amount: 10000, // $100.00 in cents
        metadata: {
          ...data.metadata,
          product_type: 'ceo_tshirt',
          size: data.size,
          unlimited_rides: 'true',
          non_transferable: 'true'
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to purchase CEO T-shirt');
    }

    const result = await response.json();
    return {
      success: true,
      paymentIntent: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'CEO T-shirt purchase failed',
    };
  }
};

// Free ride validation for CEO T-shirt holders
export const validateFreeRide = async (userId: string): Promise<{ canRideFree: boolean; reason?: string }> => {
  try {
    const response = await fetch(`/api/users/${userId}/free-ride-status`);
    
    if (!response.ok) {
      throw new Error('Failed to validate free ride status');
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    return {
      canRideFree: false,
      reason: error.message || 'Validation failed'
    };
  }
};

// Webhook signature verification helper
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  endpointSecret: string
): boolean => {
  try {
    // This would typically be done on the server side
    // Included here for completeness
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    return true;
  } catch (error) {
    return false;
  }
};

// Payment method availability checks
export const checkApplePayAvailability = async (): Promise<boolean> => {
  const stripe = await getStripe();
  if (!stripe) return false;

  const paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: { label: 'Test', amount: 100 },
  });

  const canMakePayment = await paymentRequest.canMakePayment();
  return canMakePayment?.applePay || false;
};

export const checkGooglePayAvailability = async (): Promise<boolean> => {
  const stripe = await getStripe();
  if (!stripe) return false;

  const paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: { label: 'Test', amount: 100 },
  });

  const canMakePayment = await paymentRequest.canMakePayment();
  return canMakePayment?.googlePay || false;
};

// Transaction fee calculator (AirBear is 100% free for users)
export const calculateTransactionFee = (amount: number, paymentMethod: string): number => {
  // Stripe transaction fees (passed to customer)
  const stripeFeePercent = 0.029; // 2.9%
  const stripeFeeFixed = 0.30; // $0.30

  switch (paymentMethod) {
    case 'stripe':
    case 'apple_pay':
    case 'google_pay':
      return Math.round((amount * stripeFeePercent + stripeFeeFixed) * 100) / 100;
    case 'cash':
      return 0; // No fees for cash
    default:
      return 0;
  }
};