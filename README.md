# Wheely - Smart Rides, Faster Lives

A modern ride-sharing mobile application built with React Native and Expo, featuring a complete user authentication flow and beautiful UI design.

## 🚀 Features

- **Beautiful Onboarding Flow**: Engaging welcome screen with smooth transitions
- **Complete Authentication System**: 
  - User registration with email/password
  - Real-time password validation
  - Email verification with OTP
  - Social login options (Apple, Facebook, Google)
- **Responsive Design**: Optimized for both iOS and Android
- **Production Ready**: Clean architecture with proper error handling
- **Modern UI**: Beautiful, intuitive interface with attention to detail
- **Offline Support**: Basic functionality works without internet connection

## 📱 Building the APK

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- EAS CLI

### Building with EAS Build

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Log in to your Expo account:
```bash
eas login
```

3. Configure your project for building:
```bash
eas build:configure
```

4. Build the APK:
```bash
eas build -p android --profile preview
```

5. Once the build is complete, you can download the APK from the Expo website or using the provided link.

### Building Locally (Alternative)

If you prefer to build locally:

1. Install the required dependencies:
```bash
npm install
```

2. Create a development build:
```bash
npx expo prebuild -p android
```

3. Build the APK:
```bash
cd android
./gradlew assembleDebug
```

4. The APK will be available at `android/app/build/outputs/apk/debug/app-debug.apk`

## 🔧 API Configuration

The app is configured to connect to the API at the URL specified in the `.env` file:

```
EXPO_PUBLIC_API_BASE_URL=http://43.206.193.125
```

## 📱 Offline Support

The app includes basic offline support:
- Network connection detection
- Graceful handling of API failures
- Local data caching for critical features
- Retry mechanisms for failed requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React Native and Expo**