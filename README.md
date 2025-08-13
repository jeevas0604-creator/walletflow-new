# 💰 WalletFlow - Smart SMS Transaction Tracker

> **Transform your SMS messages into financial insights with AI-powered transaction categorization**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-Mobile%20%7C%20Web-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-React%20%7C%20TypeScript%20%7C%20Capacitor-orange)

## 🌟 Overview

WalletFlow is an intelligent personal finance tracker that automatically reads your SMS messages to extract and categorize financial transactions. Built with modern web technologies and deployed as a Progressive Web App (PWA) with native mobile capabilities.

### ✨ Key Features

- 📱 **SMS Integration**: Automatic reading and parsing of bank/payment SMS messages
- 🤖 **AI Categorization**: Smart transaction categorization using machine learning
- 📊 **Financial Insights**: Real-time expense tracking and spending analytics  
- 🔒 **Secure Storage**: Encrypted local storage with optional cloud sync
- 📱 **Cross-Platform**: Works on web browsers and mobile devices
- 🌙 **Dark Mode**: Beautiful dark/light theme support
- 🚀 **Offline Ready**: Full functionality even without internet connection

## 🚀 Live Demo

**URL**: [https://511a9013-7049-4b6d-9713-a950e943af89.lovableproject.com](https://511a9013-7049-4b6d-9713-a950e943af89.lovableproject.com)

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components

### Mobile & Native
- **Capacitor 7** - Native mobile app capabilities
- **Android SMS API** - SMS reading permissions and functionality
- **PWA Support** - Progressive Web App features

### Backend & Data
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security (RLS)** - Database-level security
- **Real-time subscriptions** - Live data updates

### State Management & Utils
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling with validation
- **Crypto-JS** - Client-side encryption
- **date-fns** - Date manipulation and formatting

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- For mobile development: Android Studio (Android) or Xcode (iOS)

### Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd walletflow-new

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Mobile Development Setup

```bash
# Add mobile platforms
npx cap add android  # For Android
npx cap add ios      # For iOS (macOS only)

# Build the app
npm run build

# Sync with native platforms
npx cap sync

# Run on device/emulator
npx cap run android  # For Android
npx cap run ios      # For iOS
```

## 📱 Mobile App Features

### SMS Permissions
The app requests SMS read permissions on Android devices to:
- Read transaction-related SMS messages
- Parse bank notifications and payment confirmations
- Extract amount, merchant, and transaction type
- Categorize expenses automatically

### Security & Privacy
- All SMS data is processed locally on your device
- Optional cloud backup with end-to-end encryption
- No SMS content is shared with third parties
- User controls all data retention and deletion

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
│   ├── useSmsTransactions.ts  # SMS reading and parsing
│   └── use-mobile.tsx  # Mobile device detection
├── lib/                # Utility libraries
│   ├── categorizer.ts  # Transaction categorization logic
│   ├── secureStore.ts  # Encrypted storage utilities
│   └── utils.ts        # General utilities
├── pages/              # Application pages/routes
│   ├── Index.tsx       # Main dashboard
│   ├── Auth.tsx        # Authentication page
│   └── Settings.tsx    # User settings
├── plugins/            # Native plugin integrations
│   └── smsInbox.ts     # SMS reading plugin wrapper
└── integrations/       # External service integrations
    └── supabase/       # Supabase client and types
```

## 🔧 Configuration

### Environment Variables
All configuration is handled through the UI - no environment variables needed for basic setup.

### Supabase Configuration
The app includes a pre-configured Supabase backend. For your own deployment:
1. Create a new Supabase project
2. Update `src/integrations/supabase/client.ts` with your credentials
3. Run the provided database migrations

### Mobile App Configuration
Update `capacitor.config.ts` for your mobile app:
```typescript
const config: CapacitorConfig = {
  appId: "your.app.identifier",
  appName: "Your App Name",
  webDir: "dist",
  server: {
    url: "your-production-url",
    cleartext: true
  }
};
```

## 🚀 Deployment

### Web Deployment
```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting provider
```

### Mobile App Store Deployment
```bash
# Build and sync
npm run build
npx cap sync

# Open in native IDEs for final build
npx cap open android  # Android Studio
npx cap open ios      # Xcode
```

## 📊 Features Deep Dive

### Transaction Categorization
The app uses intelligent parsing to categorize transactions:
- **Food & Dining**: Restaurant and food delivery payments
- **Transportation**: Uber, taxi, gas station transactions
- **Shopping**: E-commerce and retail purchases
- **Utilities**: Bill payments and subscriptions
- **Entertainment**: Movie tickets, streaming services
- **Healthcare**: Medical payments and insurance
- **Custom Categories**: User-defined categories

### SMS Parsing Intelligence
- Recognizes multiple bank SMS formats
- Extracts transaction amounts in various currencies
- Identifies merchant names and transaction types
- Handles debit, credit, and UPI transactions
- Filters out non-financial SMS messages

### Data Security
- All sensitive data encrypted using AES-256
- Local-first architecture with optional cloud sync
- SMS permissions only requested when needed
- User controls all data retention policies
- GDPR and privacy regulation compliant

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation for API changes
- Ensure mobile compatibility for UI changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Project Wiki](https://github.com/your-repo/wiki)
- **Mobile Development Guide**: [Capacitor Setup Guide](https://lovable.dev/blogs/mobile-development)

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) - The AI-powered development platform
- UI components by [shadcn/ui](https://ui.shadcn.com)
- Mobile capabilities by [Capacitor](https://capacitorjs.com)
- Backend services by [Supabase](https://supabase.com)

---

**Made with ❤️ using Lovable AI Platform**