import { Router } from 'express';
import { storage } from '../storage';

const router = Router();

// Get all spots
router.get('/spots', async (req, res) => {
  try {
    const spots = await storage.getAllSpots();
    res.json(spots);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get spot by ID
router.get('/spots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const spot = await storage.getSpotById(id);

    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    res.json(spot);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Rickshaws/Airbears (for backward compatibility)
router.get('/rickshaws', async (req, res) => {
  try {
    const rickshaws = await storage.getAllRickshaws();
    res.json(rickshaws);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/rickshaws/available', async (req, res) => {
  try {
    const rickshaws = await storage.getAvailableRickshaws();
    res.json(rickshaws);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Rides
router.post('/rides', async (req, res) => {
  try {
    const rideData = req.body;
    const ride = await storage.createRide(rideData);
    res.json(ride);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/rides/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const rides = await storage.getRidesByUser(userId);
    res.json(rides);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Bodega items
router.get('/bodega/items', async (req, res) => {
  try {
    const { category } = req.query;
    const items = category
      ? await storage.getBodegaItemsByCategory(category as string)
      : await storage.getAllBodegaItems();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Orders
router.post('/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const order = await storage.createOrder(orderData);
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Payments
router.post('/payments/confirm', async (req, res) => {
  try {
    const paymentData = req.body;
    const payment = await storage.createPayment(paymentData);
    res.json(payment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
