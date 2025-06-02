# Finance Tracker Web Application

A comprehensive React-based personal finance management platform with secure authentication, bank account integration, and advanced financial tracking capabilities.

## 🚀 Features

### Authentication System ✅

- **User Registration** with email verification
- **Secure Login** with JWT tokens
- **Password Recovery** with email reset links
- **Form Validation** using Yup schemas
- **Protected Routes** with automatic redirects
- **Persistent Sessions** with Zustand state management
- **Modern UI** with shadcn/ui components

### Planned Features

- Bank account integration via Plaid
- Transaction management and categorization
- Budget tracking and goal setting
- Financial reports and analytics
- Multi-currency support
- Data import/export capabilities

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0, TypeScript, Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.8, shadcn/ui components
- **State Management**: Zustand 5.0.3
- **Routing**: React Router 7.1.5
- **HTTP Client**: Axios 1.7.9, React Query 5.66.5
- **Form Handling**: React Hook Form 7.57.0, Yup 1.6.1
- **Icons**: Lucide React 0.511.0
- **Notifications**: Sonner 2.0.4

## 📁 Project Structure

```
src/
├── api/                    # HTTP client modules
│   └── auth.ts            # Authentication API calls
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── auth/             # Authentication components
├── hooks/                # Custom React hooks
│   └── auth/             # Authentication hooks
├── lib/                  # Library configurations
│   ├── axios.ts          # Axios setup with interceptors
│   └── queryClient.ts    # React Query configuration
├── pages/                # Route components
│   ├── auth/             # Authentication pages
│   └── Dashboard.tsx     # Main dashboard
├── schema/               # Validation schemas
│   └── auth.ts           # Authentication form schemas
├── store/                # Zustand state management
│   └── authStore.ts      # Authentication state
├── types/                # TypeScript type definitions
│   └── auth.d.ts         # Authentication types
├── constants/            # Application constants
│   └── routes.ts         # Route definitions
└── App.tsx               # Main application component
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finance-tracker-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   VITE_API_URL=http://localhost:3001/api/v1
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔐 Authentication Flow

### Registration Process

1. User fills out registration form with validation
2. Password strength meter provides real-time feedback
3. Terms of service agreement required
4. Account created with JWT token
5. Automatic redirect to dashboard

### Login Process

1. Email and password validation
2. Optional "Remember Me" functionality
3. JWT token stored securely
4. Automatic redirect to dashboard
5. Session persistence across browser sessions

### Password Recovery

1. Email-based password reset request
2. Secure token generation
3. Email confirmation flow
4. Password reset with validation

### Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure token storage
- Protected route guards
- Session timeout handling
- CSRF protection ready

## 🎨 UI Components

The application uses **shadcn/ui** components for a modern, accessible interface:

- **Forms**: Input, Label, Button, Checkbox
- **Layout**: Card, CardHeader, CardContent
- **Feedback**: Toast notifications, Progress bars
- **Navigation**: Protected routing with redirects

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting (recommended)
- **Strict type checking** enabled

## 🚀 Deployment

The application is ready for deployment to:

- **Vercel** (recommended for React apps)
- **Netlify**
- **AWS S3 + CloudFront**
- **Docker containers**

Build the application:

```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the implementation guide

---

**Note**: This application requires a backend API server for full functionality. The authentication system is designed to work with a Node.js/Express backend with JWT authentication.
