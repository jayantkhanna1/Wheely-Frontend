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

## 📱 Screenshots

The app includes four main screens:
1. **Welcome Screen**: Green-themed landing page with app branding
2. **Create Account**: Multiple sign-up options with social providers
3. **Registration Form**: Complete form with real-time validation
4. **Email Verification**: OTP verification with 5-digit code input

## 🛠 Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router 4.0
- **Language**: TypeScript
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

## 🏗 Project Structure

```
app/
├── _layout.tsx              # Root layout with navigation setup
├── index.tsx                # Welcome/landing screen
├── create-account.tsx       # Account creation options
├── register.tsx             # Registration form with validation
├── verify-email.tsx         # OTP verification screen
└── (tabs)/
    ├── _layout.tsx          # Tab navigation layout
    └── index.tsx            # Home screen (post-authentication)

components/
└── Toast.tsx                # Reusable toast notification component

hooks/
└── useFrameworkReady.ts     # Framework initialization hook

types/
└── env.d.ts                 # Environment variable type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/wheely-app.git
cd wheely-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your API base URL:
```
EXPO_PUBLIC_API_BASE_URL=http://your-api-url-here
```

4. Start the development server:
```bash
npm run dev
```

5. Open the app:
   - Scan the QR code with Expo Go app on your phone
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` to open in web browser

## 🔧 API Integration

The app integrates with a backend API for user authentication:

### Registration Endpoint
```
POST /api/user/register/
```
**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "date_of_birth": "1990-05-15"
}
```

### Email Verification Endpoint
```
POST /api/user/verifyEmail/
```
**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "otp": 12345
}
```

## 🎨 Design Features

- **Modern UI/UX**: Clean, intuitive interface following mobile design best practices
- **Consistent Branding**: Green color scheme (#059669) throughout the app
- **Responsive Layout**: Adapts to different screen sizes and orientations
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Accessibility**: Proper contrast ratios and touch targets

## 🔐 Security Features

- **Password Validation**: Enforces strong password requirements
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: Client-side and server-side validation
- **Error Handling**: Graceful error handling with user-friendly messages

## 📝 Development Guidelines

- **Code Style**: Consistent formatting with Prettier
- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Reusable, modular components
- **Error Boundaries**: Proper error handling and user feedback
- **Performance**: Optimized for smooth user experience

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
```

### Mobile App Store Deployment
1. Configure app.json for production
2. Build with EAS Build
3. Submit to App Store/Google Play

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community for continuous improvements
- Lucide for beautiful icons
- Pexels for high-quality stock images

## 📞 Support

For support, email support@wheely-app.com or create an issue in this repository.

---

**Built with ❤️ using React Native and Expo**