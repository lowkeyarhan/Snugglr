import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import confessionRoutes from "./routes/confessionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import domainRoutes from "./routes/domainRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import chatSocket from "./sockets/chatSocket.js";
import notificationSocket from "./sockets/notificationSocket.js";

dotenv.config();
const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Snugglr API is running!",
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/confessions", confessionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/domains", domainRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);
app.set("io", io);
chatSocket(io);
notificationSocket(io);

let PORT = parseInt(process.env.PORT) || 8081;

const startServer = async () => {
  try {
    await connectDB();

    const tryListen = (port) => {
      server
        .listen(port)
        .on("listening", () => {
          console.log(`Server running on port ${port}`);
          console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
          console.log(`Socket.io enabled for real-time features`);
        })
        .on("error", (err) => {
          if (err.code === "EADDRINUSE") {
            console.log(`Port ${port} is busy, trying ${port + 1}...`);
            tryListen(port + 1);
          } else {
            console.error(`Error starting server: ${err.message}`);
            process.exit(1);
          }
        });
    };

    tryListen(PORT);
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
