# MeowFeeder 🐾

An intelligent automatic animal feeder system designed to keep your furry friends happy and well-fed, even when you're away!

## 🌟 Features

### Current Features
- **Real-time Device Control**: Feed your pet instantly through the web dashboard
- **WebSocket Communication**: Real-time status updates and device monitoring
- **IR Remote Support**: Manual feeding using infrared remote control
- **Daily Feed Tracking**: Monitor how many times your pet has been fed
- **Mobile-Responsive Dashboard**: Manage your devices from any device
- **Device Status Monitoring**: Live connection status and feed sequence tracking
- **Multi-Device Support**: Add and manage multiple MeowFeeder devices
- **User Authentication**: Secure user accounts and device management
- **Modern UI**: Beautiful, cat-themed interface with smooth animations

### Hardware Features
- **ESP32-based**: Reliable WiFi connectivity and processing power
- **Stepper Motor Control**: Precise feeding mechanism with 28BYJ-48 motor
- **IR Receiver**: Compatible with standard IR remote controls
- **LED Status Indicators**: Visual feedback for device status

## 🚧 Current Status

**This is a development/mockup version** with the following limitations:
- Device ID is **hardcoded** in the firmware (`6866adc4845d2990e46152df`)
- Manual feeding only (no automatic scheduled feeding yet), only visual on the website/app
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

### Frontend
- **React**: Modern web application
- **Tailwind CSS**: Responsive, mobile-first design
- **WebSocket**: Real-time device communication

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

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run start
```

4. **Flash Hardware**
```bash
cd hardware/MeowFeeder
# Configure WiFi credentials in src/secrets.h
pio run --target upload

cd hareware/RemoteController
pio run --target upload
```

## 🔧 Configuration

### Hardware Setup
1. Connect ESP32 to stepper motor (pins 19, 18, 5, 4)
2. Connect IR receiver to pin 27
3. Update `src/secrets.h` with your WiFi credentials
4. PlatformIO

### Web App Setup
1. Configure MongoDB connection string
2. Set up environment variables for API endpoints
3. Update device IP addresses in the dashboard

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
