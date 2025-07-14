# MeowFeeder 🐾

An intelligent automatic animal feeder system designed to keep your furry friends happy and well-fed, even when you're away!

## 📋 Table of Contents
- [Features](#-features)
- [Current Status](#-current-status)
- [Roadmap](#-roadmap)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [📱 Mobile App](#-mobile-app)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Features

### Current Features
- **Real-time Device Control**: Feed your pet instantly through web dashboard and mobile app
- **Cross-Platform Mobile App**: Native iOS/Android apps with full functionality
- **WebSocket Communication**: Real-time status updates and device monitoring
- **IR Remote Support**: Manual feeding using infrared remote control
- **Daily Feed Tracking**: Monitor how many times your pet has been fed
- **Schedule Management**: Add, edit, and delete feeding schedules from mobile app and web
- **User Authentication**: Secure user accounts and device management across all platforms
- **Modern UI**: Beautiful, cat-themed interface with smooth animations
- **Theme Support**: Light/dark mode switching on mobile app with system preference detection
- **Multi-Device Support**: Add and manage multiple MeowFeeder devices
- **Device Status Monitoring**: Live connection status and feed sequence tracking
- **Offline Handling**: Graceful handling of connectivity issues on mobile

### Hardware Features
- **ESP32-based**: Reliable WiFi connectivity and processing power
- **Stepper Motor Control**: Precise feeding mechanism with 28BYJ-48 motor
- **IR Receiver**: Compatible with standard IR remote controls
- **LED Status Indicators**: Visual feedback for device status

## 🚧 Current Status

**This is a fully functional system** with the following features:
- **Web Dashboard**: Complete device management and control
- **Mobile App**: Native iOS/Android apps with full functionality
- **Real-time Communication**: WebSocket integration for instant feeding
- **Schedule Management**: Add, edit, and delete feeding schedules
- **User Authentication**: Secure user accounts across all platforms
- **Theme Support**: Light/dark mode switching

### Known Limitations:
- Device ID is **hardcoded** in the firmware (`6866adc4845d2990e46152df`)
- Mobile app uses backend API for device communication (not direct WebSocket)
- Single device testing setup

## 🗺️ Roadmap

### Phase 1: Core Functionality ✅
- [x] Basic hardware setup and motor control
- [x] WebSocket communication between device and web app
- [x] Real-time "Feed Now" functionality
- [x] User authentication and device management
- [x] Mobile-responsive web interface
- [x] **Mobile App**: Native iOS/Android applications

### Phase 2: Enhanced Features 🚧
- [ ] **Automatic Scheduled Feeding**: Time-based feeding controlled from the website
  - Web-based schedule configuration
  - Multiple daily feeding times
  - Timezone support
  - Feed amount customization
- [ ] **Dynamic Device Registration**: Remove hardcoded device IDs
- [ ] **Feed History & Analytics**: 
  - Detailed feeding logs
  - Consumption patterns
  - Health insights
- [ ] **Smart Notifications**:
  - Low food alerts
  - Missed feeding notifications
  - Device offline alerts

### Phase 3: Advanced Features 🔮
- [ ] **Food Level Monitoring**: Automatic food quantity detection
- [ ] **Camera Integration**: Live pet monitoring during feeding
- [ ] **Voice Control**: Integration with smart home assistants
- [ ] **Multi-Pet Support**: Individual feeding schedules per pet
- [ ] **Veterinary Integration**: Health tracking and vet recommendations

## 🏗️ Architecture

### Frontend Web App
- **React**: Modern web application
- **Tailwind CSS**: Responsive, mobile-first design
- **WebSocket**: Real-time device communication

### Mobile App
- **React Native**: Cross-platform mobile application
- **Expo**: Development and deployment platform
- **React Navigation**: Seamless navigation experience
- **AsyncStorage**: Local data persistence
- **Theme Support**: Light/dark mode with instant switching

### Backend
- **Node.js**: RESTful API server
- **MongoDB**: User and device data storage
- **JWT Authentication**: Secure user sessions

### Hardware
- **ESP32**: WiFi-enabled microcontroller
- **28BYJ-48 Stepper Motor**: Precise feeding mechanism
- **IR Receiver**: Remote control support
- **WebSocket Client**: Real-time communication

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB database
- ESP32 development environment (PlatformIO)
- React development setup
- **Mobile Development**:
  - Expo CLI (`npm install -g expo-cli`)
  - EAS CLI for production builds (`npm install -g @expo/eas-cli`)
  - Android Studio (for Android development/builds)
  - Xcode (for iOS development/builds - macOS only)
  - iOS/Android device or simulator for testing

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/MeowFeeder.git
cd MeowFeeder
```

2. **Setup Backend**
```bash
cd backend
npm install
# Configure your MongoDB connection in .env
node index
```

3. **Setup Frontend Web App**
```bash
cd frontend
npm install
npm run start
```

4. **Setup Mobile App**
```bash
cd mobile
npm install
npm start
# Scan QR code with Expo Go app or use simulator
```

5. **Flash Hardware**
```bash
cd hardware/MeowFeeder
# Configure WiFi credentials in src/secrets.h
pio run --target upload

cd hardware/RemoteController
pio run --target upload
```

## 🔧 Configuration

### Hardware Setup
1. Connect ESP32 to stepper motor (pins 19, 18, 5, 4)
2. Connect IR receiver to pin 27
3. Update `src/secrets.h` with your WiFi credentials
4. Flash using PlatformIO

### Web App Setup
1. Configure MongoDB connection string in backend/.env
2. Set up environment variables for API endpoints
3. Update device IP addresses in the dashboard

### Mobile App Setup
1. Install Expo CLI: `npm install -g expo-cli`
2. Configure API endpoints in mobile/.env
3. For production builds:
   - Install EAS CLI: `npm install -g @expo/eas-cli`
   - Run: `eas build --platform android` or `eas build --platform ios`

## 📱 Mobile App

The MeowFeeder mobile app provides a native iOS and Android experience for managing your pet's feeding schedule on the go. Built with React Native and Expo, it offers all the functionality of the web dashboard in a mobile-optimized interface.

### Key Features
- **Cross-Platform**: Native iOS and Android apps from a single codebase
- **Real-Time Control**: Feed your pet instantly with the "Feed Now" button
- **Schedule Management**: Create, edit, and delete feeding schedules
- **Device Monitoring**: View real-time device status and connection state
- **User Authentication**: Secure sign-in/sign-up with comprehensive error handling
- **Theme Support**: Light/dark mode with instant switching and system preference detection
- **Offline Handling**: Graceful handling of offline states and connectivity issues
- **Responsive Design**: Optimized for various screen sizes and orientations

### Technical Architecture
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and build system
- **React Navigation**: Navigation library for seamless user experience
- **AsyncStorage**: Local data persistence for user preferences
- **Context API**: State management for authentication and theme
- **Custom Hooks**: Reusable logic for API calls and data management

### API Integration
The mobile app communicates with the backend through RESTful API endpoints:
- **Authentication**: JWT-based user authentication
- **Device Control**: Feed commands sent via API (not direct WebSocket)
- **Schedule Management**: Full CRUD operations for feeding schedules
- **Dashboard Data**: Real-time device stats and feeding history

### Development & Building
```bash
# Development
cd mobile
npm install
npm start

# Production builds
eas build --platform android
eas build --platform ios

# Local development builds
expo run:android
expo run:ios
```

### Mobile App Features
- **Authentication**: Secure sign-in/sign-up with error handling
- **Dashboard**: Device overview with real-time stats
- **Feed Control**: Manual feeding with online/offline status
- **Schedule Management**: Add, edit, and delete feeding schedules
- **Profile Management**: User settings and feeding history
- **Theme Support**: Light/dark mode with instant switching
- **Offline Handling**: Commands recorded when device is offline

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐱 About

MeowFeeder was created to solve the problem of feeding your cutie patootie when away from home. Whether you're at work, traveling, or just want to maintain consistent feeding schedules, MeowFeeder ensures your furry friends are always taken care of.

*Made with ❤️ for your cutie patooties*
