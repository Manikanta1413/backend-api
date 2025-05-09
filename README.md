# User Management API

A secure and scalable backend API for managing user profiles with:

- JWT-based Authentication
- Role-Based Authorization (Admin/User)
- Profile Picture Upload
- Pagination
- MongoDB Integration

## 🔧 Technologies Used

- Node.js + Express
- MongoDB + Mongoose
- Multer (file uploads)
- JWT (authentication)
- Helmet, CORS, Rate Limiting (security)
- bcryptjs (password hashing)
- dotenv (env config)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/user-management-api.git
cd user-management-api
```

### 2. Install Dependencies

npm install

### 3.Setup environment variables

PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
NODE_ENV=development

### 4.Start the Server

# Start with nodemon (dev)

npm run dev

# Start normally

npm start
