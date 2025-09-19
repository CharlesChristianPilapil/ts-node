📖 Project Title
  - Authentication with TypeScript, Node.js, Express, and MongoDB.

🚀 Features 
  - User authentication with **Passport.js**  
  - Two-factor authentication (**2FA**)  
  - Session management with **MongoDB**  

🛠️ Tech Stack
  - TypeScript
  - Node.js / Express.js
  - Zod (for validation)
  - MongoDB (with Mongoose)
  - Passport.js (local strategy)
  - Nodemailer (for sending OTP/2FA emails)
  
📂 Project Structure
  - src/
     ├── config/         # App and DB config
     ├── controllers/    # Route handlers (auth, users, etc.)
     ├── middlewares/    # Authentication and validation middleware
     ├── models/         # Mongoose models
     ├── routes/         # Express routes
     ├── schemas/        # Schemas for validation
     ├── strategies/     # Passport authentication strategies
     ├── utils/          # Helper functions (hashing, OTP, etc.)
     ├── app.ts          # Express app setup
     └── server.ts       # Entry point

🔧 Environment Variables
    - PORT=3000
    - NODE_ENV=development/production/staging
    - MONGO_URI=mongodb://localhost:27017/myapp
    - SESSION_SECRET=your-secret-key
    - EMAIL_USER=your-email@example.com
    - EMAIL_PASS=your-gmail-app-password(not actuall password)
