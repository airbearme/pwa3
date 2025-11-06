import { z } from "zod";
import { insertUserSchema, insertRideSchema, insertOrderSchema, insertPaymentSchema } from "@shared/schema";

export const registerSchema = insertUserSchema.omit({ role: true });
export const loginSchema = z.object({
  email: z.string().email(),
});

export const createRideSchema = insertRideSchema;
export const updateRideSchema = insertRideSchema.partial();

export const createOrderSchema = insertOrderSchema;

export const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  orderId: z.string().optional(),
  rideId: z.string().optional(),
  paymentMethod: z.enum(["stripe", "cash"]).optional(),
});

export const confirmPaymentSchema = insertPaymentSchema;

export const purchaseCeoTshirtSchema = z.object({
  userId: z.string(),
  size: z.string(),
  amount: z.number().positive(),
});
