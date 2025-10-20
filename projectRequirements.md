# 💞 Snugglr — Backend Requirements & Documentation

> **Version**: MVP + Scalable Architecture  
> **Last Updated**: October 2025

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Tech Stack](#️-tech-stack)
3. [Folder Structure](#-folder-structure)
4. [Database Schemas](#-database-schemas)
5. [API Routes](#-api-routes)
6. [Socket.io Events](#-socketio-events)
7. [Middleware](#-middleware)
8. [Scalability & Architecture](#-scalability--architecture)
9. [Environment Variables](#-environment-variables)
10. [Installation & Setup](#-installation--setup)
11. [Development Timeline](#-development-timeline)
12. [Future Scope](#-future-scope)

---

## 🧠 Overview

**Snugglr** is an anonymous dating & confession platform where users can:

- ✨ Swipe to match with others anonymously
- 💬 Chat without revealing their identity
- 🎮 Play a "Guess-to-Reveal" game to unlock names & profile details
- ⚙️ Manage their profile and preferences

### What This Documentation Covers

1. Complete folder structure and architecture
2. Core models and database relationships
3. REST API endpoints and structure
4. Real-time Socket.io events
5. Scalability considerations
6. Future extension roadmap

---

## ⚙️ Tech Stack

| Layer                        | Technology                       |
| ---------------------------- | -------------------------------- |
| **Runtime**                  | Node.js                          |
| **Framework**                | Express.js                       |
| **Database**                 | MongoDB (Mongoose ODM)           |
| **Realtime**                 | Socket.IO                        |
| **Auth**                     | JWT + bcrypt                     |
| **Uploads (MVP)**            | Multer (local)                   |
| **Deployment (recommended)** | Render / Railway + MongoDB Atlas |

---

## 🧱 Folder Structure

```
backend/
├── server.js                # Entry point
├── package.json
├── .env                     # Environment variables
│
├── config/
│   └── db.js                # MongoDB connection
│
├── models/
│   ├── User.js              # User schema
│   ├── Match.js             # Match schema
│   ├── Chat.js              # Chat schema
│   └── Message.js           # Message schema
│
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── userRoutes.js        # User profile routes
│   ├── matchRoutes.js       # Matching routes
│   └── chatRoutes.js        # Chat routes
│
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── userController.js    # User logic
│   ├── matchController.js   # Match logic
│   └── chatController.js    # Chat logic
│
├── middleware/
│   └── authMiddleware.js    # JWT verification
│
├── sockets/
│   └── chatSocket.js        # Socket.io event handlers
│
└── utils/
    ├── generateToken.js     # JWT token generator
    └── errorHandler.js      # Error handling utility
```

## 🗄️ Database Schemas

### 👤 User Schema

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
    },
    bio: {
      type: String,
    },
    interests: [String],
    image: {
      type: String,
      default: "default-avatar.png",
    },
    guesses: [
      {
        chatId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Chat",
        },
        guess: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
```

---

### 💞 Match Schema

```javascript
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "matched"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);
```

**Logic**:

- When user A "likes" user B → create a **pending** match
- If user B also "likes" user A → update status to **matched** → automatically create a Chat room

---

### 💬 Chat Schema

```javascript
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    revealed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
```

---

### 💭 Message Schema

```javascript
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
```

---

## 🚀 API Routes

### 🔐 Authentication Routes

**Base URL**: `/api/auth`

| Route       | Method | Description                      | Auth Required |
| ----------- | ------ | -------------------------------- | ------------- |
| `/register` | POST   | Create new user account          | ❌ No         |
| `/login`    | POST   | Login and receive JWT token      | ❌ No         |
| `/me`       | GET    | Fetch authenticated user profile | ✅ Yes        |

---

### 💞 Match Routes

**Base URL**: `/api/match`

| Route      | Method | Description                       | Auth Required |
| ---------- | ------ | --------------------------------- | ------------- |
| `/swipe`   | POST   | Swipe right (like) or left (pass) | ✅ Yes        |
| `/matches` | GET    | Fetch all mutual matches          | ✅ Yes        |

**Swipe Logic**:

1. User A swipes right on User B → creates **pending** match
2. If User B also swipes right on User A → both matches become **matched**
3. Chat room is automatically created for both users

---

### 💬 Chat Routes

**Base URL**: `/api/chat`

| Route               | Method | Description                                     | Auth Required |
| ------------------- | ------ | ----------------------------------------------- | ------------- |
| `/:chatId/messages` | GET    | Fetch all messages for a chat                   | ✅ Yes        |
| `/:chatId/message`  | POST   | Send message to chat                            | ✅ Yes        |
| `/guess`            | POST   | Submit a name guess                             | ✅ Yes        |
| `/reveal/:chatId`   | POST   | Reveal both users (when both guessed correctly) | ✅ Yes        |

**Guess & Reveal Logic**:

1. Both users submit their guesses via `/guess`
2. Server checks if both guesses are correct
3. If yes → `/reveal/:chatId` unlocks and reveals identities
4. Socket.io emits `reveal_identity` event to both users

---

## ⚡ Socket.io Events

### Real-time Events

| Event              | Direction       | Description                             |
| ------------------ | --------------- | --------------------------------------- |
| `join_chat`        | Client → Server | User joins a specific chat room         |
| `new_message`      | Client → Server | Sends message to server                 |
| `message_received` | Server → Client | Broadcasts message to chat participants |
| `guess_submit`     | Client → Server | Sends a name guess for identity reveal  |
| `reveal_identity`  | Server → Client | Fires when both guesses are correct     |

### Example Implementation

```javascript
// Server-side (chatSocket.js)
io.on("connection", (socket) => {
  // Join chat room
  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
  });

  // Send message
  socket.on("new_message", async (data) => {
    const { chatId, text, senderId } = data;

    // Save to DB
    const message = await Message.create({ chatId, sender: senderId, text });

    // Broadcast to room
    io.to(chatId).emit("message_received", message);
  });

  // Submit guess
  socket.on("guess_submit", async (data) => {
    const { chatId, guess, userId } = data;

    // Save guess to user
    await User.findByIdAndUpdate(userId, {
      $push: { guesses: { chatId, guess } },
    });

    // Check if both users have guessed
    const chat = await Chat.findById(chatId).populate("users");
    const bothGuessed = chat.users.every((user) =>
      user.guesses.some((g) => g.chatId.toString() === chatId)
    );

    if (bothGuessed) {
      // Check if both guesses are correct
      const allCorrect = checkGuesses(chat);

      if (allCorrect) {
        io.to(chatId).emit("reveal_identity", chat);
      }
    }
  });
});
```

---

## 🔒 Middleware

### Authentication Middleware

**File**: `middleware/authMiddleware.js`

```javascript
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized - No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
```

**Usage**:

```javascript
const authMiddleware = require("./middleware/authMiddleware");

// Protect routes
router.get("/profile", authMiddleware, userController.getProfile);
```

---

## 🏗️ Scalability & Architecture

### 1. **Code Modularity**

✅ **Domain-Driven Structure**

- Every domain (auth, chat, match) has its own:
  - Controller (business logic)
  - Route (endpoints)
  - Model (database schema)
- Adding new features (confessions, stories, notifications) only requires:
  - New model
  - New controller
  - New route file

### 2. **Socket.io Scalability**

**MVP (Single Instance)**:

```javascript
const io = require("socket.io")(server);
```

**Production (Horizontal Scaling with Redis)**:

```javascript
const io = require("socket.io")(server);
const redisAdapter = require("socket.io-redis");

io.adapter(
  redisAdapter({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })
);
```

### 3. **Database Optimization**

**Indexing** for frequently queried fields:

```javascript
// In User model
userSchema.index({ email: 1 });

// In Message model
messageSchema.index({ chatId: 1, createdAt: -1 });
```

**Pagination** for chat history:

```javascript
const messages = await Message.find({ chatId })
  .sort({ createdAt: -1 })
  .limit(50)
  .skip(page * 50);
```

### 4. **Security Best Practices**

| Feature              | Implementation                   |
| -------------------- | -------------------------------- |
| **Password Hashing** | bcrypt with salt rounds          |
| **JWT Tokens**       | Secure token generation          |
| **Secure Headers**   | Helmet middleware                |
| **Rate Limiting**    | Express-rate-limit (auth routes) |
| **Input Validation** | express-validator                |
| **CORS**             | Configured for frontend origin   |

### 5. **Deployment Strategy**

**Database**: MongoDB Atlas (cloud)  
**Backend**: Render or Railway  
**Frontend**: Vercel or Netlify

```javascript
// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
```

---

## 🔧 Environment Variables

### Example `.env` File

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/snugglr?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# File Uploads (Optional)
UPLOAD_PATH=./uploads
```

---

## 🛠️ Installation & Setup

### Prerequisites

```bash
Node.js >= 18.x
npm >= 9.x
MongoDB (local or Atlas)
```

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/snugglr-backend.git
cd snugglr-backend

# 2. Install dependencies
npm install

# 3. Create .env file
touch .env
# (Fill in environment variables from example above)

# 4. Run development server
npm run dev

# 5. For production
npm start
```

### Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "socket.io": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-validator": "^7.0.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## 📅 Development Timeline

### Recommended Milestone Breakdown

| Phase              | Duration | Target                           |
| ------------------ | -------- | -------------------------------- |
| **MVP Setup**      | Day 1    | Auth + Models + Routes           |
| **Match System**   | Day 2    | Swipes + Mutual Matching         |
| **Chat System**    | Day 3    | Real-time Messaging (Socket.io)  |
| **Guess & Reveal** | Day 4    | Identity Unlock Feature          |
| **Integration**    | Day 5    | Frontend Connection + Deployment |

### Development Order

1. ✅ Set up Express server + MongoDB connection
2. ✅ Create User model + Auth routes (register/login)
3. ✅ Create Match model + Swipe logic
4. ✅ Create Chat + Message models
5. ✅ Implement Socket.io for real-time messaging
6. ✅ Add guess & reveal functionality
7. ✅ Connect to frontend
8. ✅ Deploy to production

---

## 🔮 Future Scope (Post-MVP)

### Planned Features

| Feature                 | Description                                     | Priority |
| ----------------------- | ----------------------------------------------- | -------- |
| 🕵️‍♀️ **Confessions**      | Anonymous confession posting & commenting       | High     |
| 📸 **Stories**          | Temporary photo/video stories (Instagram-style) | High     |
| 🔔 **Notifications**    | Real-time + persistent notifications            | Medium   |
| ☁️ **Cloud Storage**    | Google Drive API for image uploads              | High     |
| 🧩 **AI Matching**      | Recommend matches based on interaction history  | Low      |
| 🛡️ **Admin Panel**      | Manage reports, users, moderation               | Medium   |
| 💰 **In-App Purchases** | Coins for boosts / priority matches             | Low      |
| 🔎 **Advanced Filters** | Match based on interests or vibe levels         | Medium   |

### Extension Points

The architecture is designed to easily add:

- New models (Confession, Story, Notification)
- New routes (confessionRoutes.js, storyRoutes.js)
- New controllers (confessionController.js, storyController.js)
- New Socket.io events (story_viewed, confession_liked)

---

## 💡 Developer Notes

### Best Practices

✅ **Keep console logs meaningful** for debugging  
✅ **Don't hardcode IDs or tokens** — always use environment variables  
✅ **Start simple**: Auth → Match → Chat → Guess → Deploy  
✅ **After MVP submission**: Expand with Confessions & Notifications  
✅ **Write modular code**: Easy to test and maintain  
✅ **Document your code**: Future you will thank you

### Common Pitfalls to Avoid

❌ Not validating user input  
❌ Forgetting to hash passwords  
❌ Exposing sensitive data in API responses  
❌ Not handling Socket.io disconnections  
❌ Hardcoding configuration values

---

## 📊 Summary

### What This Backend Provides

✅ **Modular Express.js backend** with clean architecture  
✅ **Clean MongoDB schemas** with Mongoose ODM  
✅ **Real-time anonymous chat** via Socket.IO  
✅ **Guess-to-reveal game** for identity unlock  
✅ **Scalable & extendable structure** for future features  
✅ **Security best practices** (JWT, bcrypt, validation)  
✅ **Production-ready deployment** strategy

### Core Value Proposition

> Snugglr MVP is designed to **work today** and **scale tomorrow**.

The architecture prioritizes:

- 🚀 Fast development speed
- 🔧 Easy maintenance
- 📈 Horizontal scalability
- 🛡️ Security by default
- 🎯 Feature extensibility

---

**Ready to build!** 🚀

For frontend integration, see `readme.md`  
For detailed API documentation, generate with Swagger/Postman
