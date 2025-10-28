# 🏥 Drug GENIE - AI-Powered Healthcare Management System

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)

A comprehensive full-stack healthcare application with AI assistance, medicine tracking, blood bank management, real-time notifications, and personalized health insights. Built with modern technologies and featuring a beautiful dark mode interface.

## ✨ Features

### 🎯 Core Features
- **🤖 AI Health Assistant** - Get personalized medical advice and symptom analysis with intelligent responses
- **💊 Medicine Library** - Search through 14,690+ medicines with comprehensive information
- **⚠️ Drug Interaction Checker** - Verify medicine compatibility with 770+ interaction database
- **🔔 Medicine Reminders** - Smart medication tracking with customizable schedules and notifications
- **🩸 Blood Bank System** - Connect donors and recipients with blood compatibility matching
- **🔍 Symptom Checker** - AI-powered symptom analysis and health recommendations
- **🔐 Secure Authentication** - JWT-based user authentication with bcrypt password hashing

### 🎨 UI/UX Features
- **🌙 Dark Mode** - Complete dark theme support across all pages with smooth transitions
- **📊 Dynamic Dashboard** - Real-time statistics with live data from MongoDB
- **🔔 Real-time Notifications** - Blood donation alerts and system notifications
- **📱 Responsive Design** - Mobile-first design that works on all devices
- **⚡ Fast Performance** - Optimized with React.memo, useCallback, and debouncing
- **🎭 Smooth Animations** - Framer Motion animations throughout the app

### 📈 Analytics & Tracking
- **Active Users Tracking** - Monitor total registered users
- **Drug Interaction Logs** - Track all drug interaction checks
- **AI Consultation Logs** - Record all AI assistant conversations
- **Blood Request Analytics** - Monitor blood donation requests

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with dark mode support
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **API**: RESTful architecture

### Features
- **Real-time Updates**: Polling-based notifications (2-minute intervals)
- **Data Persistence**: MongoDB collections for all features
- **Security**: Protected routes, password hashing, CORS configuration
- **Performance**: Optimized re-renders, debounced search, lazy loading

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Drug_GENIE
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
MONGO_URI=mongodb://localhost:27017/drug-genie
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

Build and start backend:
```bash
npm run build
npm run dev
```

### 3. Frontend Setup
```bash
cd ../my-app
npm install
```

The frontend `.env` is already configured:
```env
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

## 🚀 Running the Application

1. **Start MongoDB** (if running locally)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd my-app && npm run dev`
4. **Access Application**: Open `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/change-password` - Change password (protected)

### Medicine Library
- `GET /api/medicines/search?query=name` - Search medicines
- `GET /api/medicines/:name` - Get medicine details
- `GET /api/medicines` - Get all medicines (paginated)

### Reminders
- `GET /api/reminders` - Get user reminders (protected)
- `POST /api/reminders` - Create reminder (protected)
- `PUT /api/reminders/:id` - Update reminder (protected)
- `DELETE /api/reminders/:id` - Delete reminder (protected)

### Blood Requests
- `GET /api/blood-requests` - Get all blood requests (protected)
- `POST /api/blood-requests` - Create blood request (protected)
- `DELETE /api/blood-requests/:id` - Cancel blood request (protected)

### Notifications
- `GET /api/notifications` - Get user notifications (protected)
- `GET /api/notifications/unread-count` - Get unread count (protected)
- `PUT /api/notifications/:id/read` - Mark as read (protected)
- `DELETE /api/notifications/:id` - Delete notification (protected)

### Statistics
- `GET /api/stats/dashboard` - Get dashboard statistics
- `GET /api/stats/user` - Get user-specific stats (protected)
- `POST /api/stats/log-interaction` - Log drug interaction check
- `POST /api/stats/log-consultation` - Log AI consultation

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with hot reload
```

### Frontend Development
```bash
cd my-app
npm run dev  # Starts with hot reload
```

### Building for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd my-app
npm run build
npm run preview
```

## 🧪 Testing the Integration

1. **Register a new user** via the signup page
2. **Login** with your credentials
3. **Create medicine reminders** in the Reminders section
4. **Post blood requests** in the Blood Bank section
5. **Verify data persistence** by refreshing the page

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Protected Routes** - Middleware-based route protection
- **CORS Configuration** - Controlled cross-origin requests
- **Input Validation** - Server-side validation and sanitization
- **Environment Variables** - Sensitive data in .env files
- **No Credentials in Git** - .gitignore protection for secrets

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check MongoDB connection
   - Verify `.env` file exists with correct values
   - Ensure port 5000 is available

2. **Frontend API calls fail**
   - Verify backend is running on port 5000
   - Check browser network tab for CORS errors
   - Ensure `.env` file has correct API URL

3. **Authentication issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend `.env`
   - Verify token expiration settings

## 📝 Project Structure

```
Drug_GENIE/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # API route handlers
│   │   │   ├── authController.ts
│   │   │   ├── reminderController.ts
│   │   │   ├── bloodRequestController.ts
│   │   │   ├── notificationController.ts
│   │   │   ├── medicineController.ts
│   │   │   └── statsController.ts
│   │   ├── middleware/      # Auth & error middleware
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── userModel.ts
│   │   │   ├── reminderModel.ts
│   │   │   ├── bloodRequestModel.ts
│   │   │   ├── notificationModel.ts
│   │   │   ├── medicineModel.ts
│   │   │   ├── drugInteractionLogModel.ts
│   │   │   └── aiConsultationLogModel.ts
│   │   ├── routes/          # API routes
│   │   └── utils/           # Helper functions
│   └── package.json
├── my-app/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── NotificationDropdown.tsx
│   │   │   └── GlobalSearch.tsx
│   │   ├── contexts/        # React contexts
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/           # Application pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── DrugChecker.tsx
│   │   │   ├── MedicineLibrary.tsx
│   │   │   ├── Reminders.tsx
│   │   │   ├── BloodBank.tsx
│   │   │   ├── SymptomChecker.tsx
│   │   │   └── Profile.tsx
│   │   ├── services/        # API service layer
│   │   │   ├── api.ts
│   │   │   ├── medicineApi.ts
│   │   │   └── notificationService.ts
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   └── package.json
└── README.md
```

## 🎯 Key Features Explained

### Dark Mode Implementation
Complete dark mode support with:
- Tailwind CSS `dark:` classes throughout
- Theme context for global state management
- Smooth transitions with `transition-colors duration-200`
- Persistent theme preference in localStorage

### Dynamic Dashboard Statistics
- Real-time data from MongoDB collections
- Automatic logging of user interactions
- Drug interaction checks tracked
- AI consultations recorded
- Live user and blood request counts

### Medicine Library (14,690+ Medicines)
- MongoDB text indexing for fast search
- Debounced search (300ms) for performance
- Comprehensive medicine information:
  - Introduction & uses
  - Benefits & side effects
  - How to use & how it works
  - Quick tips & safety information

### Notification System
- Real-time notifications for blood compatibility
- Unread count badge on navbar
- Mark as read/unread functionality
- Automatic notifications for compatible donors
- Optimized polling (2-minute intervals)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎨 Screenshots

- **Dashboard**: Real-time statistics with beautiful cards
- **Dark Mode**: Complete dark theme across all pages
- **Medicine Library**: Search 14,690+ medicines instantly
- **Drug Checker**: Verify medication safety
- **Blood Bank**: Connect donors and recipients
- **Notifications**: Real-time alerts and updates

## 🚀 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Medicine price comparison
- [ ] Pharmacy locator
- [ ] Health records management
- [ ] Doctor appointment booking
- [ ] Prescription upload and OCR

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed with ❤️ for better healthcare management

---

**⭐ Star this repository if you find it helpful!**
