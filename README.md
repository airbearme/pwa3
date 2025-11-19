# 🐻 AirBear - Solar-Powered Eco-Ride Platform

**"AirBear flair, ride without a care—solar power in the air!"**

AirBear is a revolutionary solar-powered ride-sharing platform featuring eco-friendly vehicles with onboard mobile bodegas in Binghamton, NY. Our mission is to provide sustainable transportation while supporting local businesses and reducing carbon emissions.

## ✨ Key Features

### 🌟 **Triple Role System**
- **👨‍💼 Admin**: Fleet analytics, system monitoring, revenue tracking
- **🚗 Driver**: AirBear management, inventory control, ride confirmations  
- **👤 User**: Booking rides, shopping mobile bodega, viewing eco-impact

### 🎯 **Exclusive CEO T-Shirt Promo**
- **$100 Value**: CEO-signed authentic AirBear t-shirt
- **Daily Free Rides**: One complimentary ride every 24 hours
- **Non-Transferable**: Benefits tied exclusively to purchaser's account
- **VIP Access**: Priority booking and exclusive events

### 🗺️ **Interactive Binghamton Map**
- **16 Strategic Locations**: Full coverage across Binghamton from real spots.csv data
- **Spinning AirBear Markers**: Animated 🐻 logos with hover effects
- **Real-Time Updates**: Live ETA, distance calculations, availability
- **Solar-Powered Tracking**: Battery levels, charging status, maintenance

### 🎨 **Stunning Visual Effects**
- **Spinning Wheels**: Fire, neon, holographic, plasma effects
- **Solar Animations**: God rays, prism spectrums, solar winds  
- **Eco Particles**: Floating leaves, fireflies, clean air breezes
- **Motion Effects**: 3D tilts, ripples, glitches, vortexes, morphs
- **Performance**: 60fps optimized, low-power mode support

### 🚀 **Enhanced LLM Rotation System** (Recently Added)
- **🤖 AI-Powered Provider Selection**: Automatically selects the best free LLM for coding tasks
- **🔄 Proactive Token Monitoring**: Predicts usage before limits are reached
- **💰 Cost Optimization**: Prefers free models (DeepSeek, Google, OpenRouter) when possible
- **📊 Real-time Metrics**: Tracks performance, success rates, and costs across providers
- **🛡️ Enterprise-Grade**: Multi-provider rotation with cooldown management and capability matching

## 🚀 **AirBear Slogans**

- *"AirBear flair, ride without a care—solar power in the air!"*
- *"Glide with AirBear, eco-rides so rare!"*  
- *"Buy the tee, ride for free—AirBear's eco-key!"*

## 📱 Progressive Web App (PWA)

- **📲 One-Click Install**: Native app experience across devices
- **⚡ Lightning Fast**: Optimized performance and caching
- **📴 Offline Support**: Core features work without internet
- **🔔 Push Notifications**: Ride updates and eco-achievements

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS** with custom eco-luxury theme
- **Framer Motion** for stunning animations
- **TanStack Query** for data management
- **Wouter** for lightweight routing

### Backend  
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Stripe** for payment processing
- **RESTful API** architecture

### Maps & Location
- **Leaflet** for interactive mapping
- **Custom AirBear Markers** with real-time data
- **Geolocation Services** for user positioning

### AI & Machine Learning
- **Enhanced LLM Rotation System**: Multi-provider intelligent rotation
- **Proactive Token Management**: Predictive usage analysis
- **Provider Capabilities**: Automatic task-based provider selection

## 🌍 Environmental Impact

- **🌱 Zero Emissions**: 100% solar-powered fleet
- **📊 CO₂ Tracking**: Real-time environmental impact metrics  
- **♻️ Sustainable Materials**: Eco-friendly vehicle components
- **🏆 Green Rewards**: Eco-points and sustainability challenges

## 💳 Monetization Strategy

### 🎯 **Advertising Tiers**
- **🥈 Silver**: Website banner ads, basic placement
- **🥇 Gold**: Premium website placement + AirBear LED banners
- **💎 Platinum**: Full integration + AirBear screen advertisements

### 💰 **Revenue Streams**  
- Ride booking fees
- Mobile bodega commissions
- CEO t-shirt exclusive sales
- Premium advertising placements
- Corporate partnerships

## 📥 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Quick Start
```bash
# Clone the repository
git clone https://github.com/airbearme/airbear-pwa.git
cd airbear-pwa

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to production
npm start
```

### Environment Variables
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (Optional - uses in-memory for development)
DATABASE_URL=postgresql://...

# API Configuration  
NODE_ENV=production
PORT=5000

# LLM API Keys (for enhanced rotation system)
DEEPSEEK_API_KEY=sk-your-deepseek-key
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-your-anthropic-key
GOOGLE_API_KEY=your-google-key
```

## 🚀 Deployment Options

### IONOS FTP Deployment
1. **Set up Environment Variables**:
   - Ensure your `.env` file includes IONOS FTP credentials:
     ```env
     IONOS_FTP_HOST=ftp.airbear.me
     IONOS_FTP_USER=your_ftp_username
     IONOS_FTP_PASSWORD=your_ftp_password
     ```

2. **Build and Deploy**:
   ```bash
   npm run deploy:ionos
   ```

   This script will:
   - Build the production version
   - Create a deployment package
   - Upload to your IONOS FTP server
   - Verify PWA features

3. **Access Your Live App**:
   - Visit `https://your-domain.com` (replace with your IONOS domain)
   - The PWA will prompt for installation on mobile devices

### Automated GitHub Action Deployment
1. **Create Repository Secrets**: In GitHub, add `IONOS_SFTP_HOST`, `IONOS_SFTP_USER`, `IONOS_SFTP_PASSWORD`, and optionally `IONOS_SFTP_PORT` (defaults to `22`) under **Settings > Secrets**.
2. **Trigger the Workflow**: Push to `main` or dispatch the `Deploy to IONOS SFTP` workflow under the **Actions** tab. The workflow runs `npm ci`, builds the project, and executes `scripts/deploy-ionos.js` with the secret-backed credentials so `dist/public` is pushed to the webspace root.
3. **Verify**:
   - Once the workflow succeeds, visit `https://airbear.me` or your assigned domain to confirm the full PWA loads and the add-to-home prompt appears.

### Replit Static Deployment (Alternative)
1. Open Deployments tab in Replit
2. Select "Static" deployment type
3. Configure:
   - **Build Command**: `npm run build`
   - **Public Directory**: `dist`
4. Deploy with one click!

### Manual Deployment
```bash
# Build the application
npm run build

# Serve static files
npx serve dist -p 3000
```

## 📊 Analytics & Monitoring

- **Real-Time Fleet Status**: Live AirBear locations and availability
- **Revenue Tracking**: Detailed earnings and transaction analytics  
- **User Engagement**: Ride patterns, popular routes, user retention
- **Environmental Metrics**: CO₂ saved, solar energy generated
- **Performance Monitoring**: App speed, error tracking, user experience

## 🤖 AI & Development Tools

### Enhanced LLM Rotation System Features
- **Multi-Provider Support**: OpenAI, Anthropic, Google, DeepSeek, Grok, OpenRouter, Hugging Face
- **Intelligent Rotation**: Automatic provider switching based on token limits and task requirements
- **Free Model Prioritization**: Automatically selects best free options for cost optimization
- **Performance Metrics**: Success rates, response times, and cost tracking
- **Capability Matching**: Matches provider strengths to specific tasks (coding, analysis, creative)

### Usage Example
```typescript
import { llmTokenManager } from './llm-rotation-enhanced';

// Automatic rotation check before API call
const result = await llmTokenManager.preRotateCheck(
  'openai', 'gpt-4o-mini', 'Help me debug this React component'
);

// If rotation needed, automatically switches to best provider
if (!result.proceed && result.switchTo) {
  console.log(`Switching to: ${result.switchTo.provider}/${result.switchTo.model}`);
}
```

## 🔐 Security & Compliance

- **🛡️ Data Protection**: GDPR and CCPA compliant data handling
- **🔒 Secure Payments**: PCI DSS compliant payment processing
- **🔐 Authentication**: Secure user authentication and authorization
- **📱 Device Security**: PWA security best practices
- **🔑 API Key Protection**: Environment variable-based secret management

## 📋 Project Status & Tasks

### ✅ **Recently Completed Tasks**
- **Enhanced LLM Rotation System Implementation**: Complete multi-provider rotation system
- **Proactive Token Monitoring**: Predictive usage analysis with intelligent thresholds
- **Cost Optimization Logic**: Free model prioritization and automatic fallback
- **Comprehensive Testing Suite**: Full test coverage with TypeScript interfaces
- **Documentation**: Complete integration guide and API documentation
- **Security Audit**: Verified no secrets exposed in repository

### 🎯 **Current Development Phase**

#### Phase 1: Foundation (In Progress)
- [ ] Replace mock API with real Supabase client
- [ ] Implement basic user authentication
- [ ] Create routing structure with protected routes
- [ ] Connect core components to live data

#### Phase 2: Core Features (Planned)
- [ ] Build interactive Leaflet map with Binghamton locations
- [ ] Develop ride booking and pricing system
- [ ] Implement Stripe payment processing
- [ ] Create mobile bodega shopping experience

#### Phase 3: Advanced Features (Planned)
- [ ] Add real-time ride tracking and notifications
- [ ] Build driver and admin dashboards
- [ ] Implement PWA features (offline, push notifications)
- [ ] Develop eco-impact tracking and rewards

#### Phase 4: Optimization (Planned)
- [ ] Performance monitoring and optimization
- [ ] Advanced map features (routes, traffic)
- [ ] Social features and community building
- [ ] Multi-language and accessibility improvements

### 🚀 **Recently Added Capabilities**
- **Multi-LLM Provider Integration**: Support for 7+ major LLM providers
- **Intelligent Token Management**: Proactive rotation before limits reached
- **Task-Based Provider Selection**: Automatic matching of provider capabilities
- **Real-Time Performance Metrics**: Provider success rate and cost tracking
- **Enterprise-Grade Rotation Logic**: Cooldown management and fallback systems

## 🤝 Contributing

We welcome contributions to make AirBear even better! 

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for clear history
- Component testing with React Testing Library

## 📞 Support & Contact

- **🌐 Website**: [airbear.app](https://airbear.app)
- **📧 Email**: support@airbear.app  
- **🐦 Twitter**: [@AirBearEco](https://twitter.com/AirBearEco)
- **💬 Discord**: [AirBear Community](https://discord.gg/airbear)

## 📄 License

Copyright © 2024 AirBear. All rights reserved.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with 🌱 by the AirBear team in Binghamton, NY**

*"Zero emissions, infinite possibilities with AirBear's solar-powered future!"*

**Latest Enhancement**: 🚀 **Enhanced LLM Rotation System** - Now automatically selects the best free LLM for coding tasks with proactive token monitoring and cost optimization!
# Running the App

- `npm run dev` — starts the Express/Supabase/Stripe API stack on port 5000 (keeps the mock warnings until you supply real secrets).
- `cd client && npm run dev -- --host 0.0.0.0 --port 5173` — runs the Vite-powered PWA with HMR on port 5173.
- `npm run all` — new helper that uses `concurrently` to launch both the backend and frontend together (useful for holistic testing).

## Secrets & Configuration

- Keep your Supabase/Stripe credentials in `.env` (never commit this file). Required vars include `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and any provider API keys used by the rotation system.
- The backend loads `.env` automatically; restarting `npm run dev` (or `npm run all`) picks up fresh values so secrets stay in sync without manual repetition.
- Refer to `.env.example` and `llm-rotation.env.example` for all required vars before deploying or running locally.

## Next Steps

- Validate the Stripe checkout and promo flows end-to-end with your keys (watch for `stripe_session_id` in Supabase).
- Monitor the dashboard/order statuses to confirm paid statuses once the webhook fires.
