# User Management System

A full-stack User Management System built with MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, CRUD operations, and an admin dashboard.

## 🚀 Features

- ✅ User Registration & Login
- ✅ JWT Token-Based Authentication (Access Token + Refresh Token)
- ✅ CRUD Operations for Users
- ✅ Admin Panel (Web-based Dashboard)
- ✅ REST API Integration
- ✅ Input Validation & Error Handling
- ✅ Image Upload Support
- ✅ Role-based Access Control (RBAC)
- ✅ Refresh Token Rotation
- ✅ Pagination & Sorting
- ✅ Docker Support

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Axios, React Router
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: bcrypt, helmet, cors
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
user-management-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── initializeAdmin.js
│   │   ├── jwt.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docs/
│   └── postman-collection.json
├── docker-compose.yml
└── README.md
```

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) or MongoDB Atlas account
- npm or yarn
- Docker (optional, for containerized deployment)

## 🚀 Installation & Setup

### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/balawpugazh11/Harvee-project.git
cd Harvee-project
```

2. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user_management
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
NODE_ENV=development
```

3. Run with Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user_management
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the backend server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm start
```

## 🔑 Default Admin Account

After starting the server, an admin account is automatically created:
- **Email**: admin@admin.com
- **Password**: Admin@123

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token

### Users (Protected - Admin Only)
- `GET /api/users` - Get all users (with pagination, sorting, search)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Query Parameters for GET /api/users:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Field to sort by (default: createdAt)
- `sortOrder` - asc or desc (default: desc)
- `search` - Search in name, email, state, city
- `state` - Filter by state
- `city` - Filter by city

## 🧪 Testing

Import the Postman collection from `docs/postman-collection.json` to test the API endpoints.

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based authentication
- Refresh token rotation
- CORS enabled for frontend origin
- Helmet.js for security headers
- Input validation (backend & frontend)
- Rate limiting
- No sensitive data in API responses

## 📤 Image Upload

Profile images are uploaded to `backend/uploads/profiles/` directory. 
- Supported formats: JPG, PNG
- Maximum size: 2MB

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required, min 3 chars, alphabets only),
  email: String (required, unique, valid email),
  phone: String (required, 10-15 digits),
  password: String (required, hashed with bcrypt),
  profile_image: String (optional, URL/path),
  address: String (optional, max 150 chars),
  state: String (required),
  city: String (required),
  country: String (required),
  pincode: String (required, 4-10 digits),
  role: String (default: 'user', enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🐳 Docker Commands

Build and start all services:
```bash
docker-compose up --build
```

Start in detached mode:
```bash
docker-compose up -d
```

Stop all services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f
```

## 📝 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

MIT License

## 👤 Author

Developed for Harvey Designs Full Stack Developer Assessment

## 🔗 Links

- Repository: https://github.com/balawpugazh11/Harvee-project

