import { Router } from 'express';
import { signUp, signIn, signOut, getUserProfile, createUserProfile, authMiddleware } from '../auth/supabase-auth';

const router = Router();

// Register user with real Supabase Auth
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, fullName, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Create user with Supabase Auth
    const userData = await signUp(email, password, {
      username,
      full_name: fullName,
      role: role || 'user'
    });

    if (userData.user) {
      // Create user profile in our database
      try {
        await createUserProfile(userData.user.id, {
          username,
          full_name: fullName,
          role: role || 'user'
        });
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue even if profile creation fails
      }
    }

    res.json({ 
      user: userData.user ? {
        id: userData.user.id,
        email: userData.user.email,
        username: userData.user.user_metadata?.username,
        role: userData.user.user_metadata?.role || 'user'
      } : null,
      session: userData.session 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Login with real Supabase Auth
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userData = await signIn(email, password);

    if (!userData.user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ 
      user: {
        id: userData.user.id,
        email: userData.user.email,
        username: userData.user.user_metadata?.username,
        role: userData.user.user_metadata?.role || 'user'
      },
      session: userData.session 
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    await signOut();
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user profile (protected route)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }

    // Get user profile from database
    let profile;
    try {
      profile = await getUserProfile(user.id);
    } catch (profileError) {
      console.error('Profile fetch error:', profileError);
      // Return basic user info if profile doesn't exist
      profile = {
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username,
        full_name: user.user_metadata?.full_name,
        role: user.user_metadata?.role || 'user'
      };
    }

    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        username: profile?.username || user.user_metadata?.username,
        full_name: profile?.full_name || user.user_metadata?.full_name,
        role: profile?.role || user.user_metadata?.role || 'user'
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (protected route)
router.get('/user/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await getUserProfile(id);
    
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: profile });
  } catch (error: any) {
    res.status(404).json({ message: "User not found" });
  }
});

export default router;
