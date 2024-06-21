const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const port = 3000;
const mysql = require("mysql");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
require("dotenv").config();
const [JWT_SECRET] = process.env.JWT_SECRET;

app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(bodyParser.json());

// creating connection with mysql database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ball_position_tracking",
});

// checking connection with mysql
db.connect((err) => {
  if (err) {
    console.log("Error: " + err);
  } else {
    console.log("connected");
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Error verifying token:", err.message);
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
};

// SIGNUP ENDPOINT
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("400");
    return res
      .status(400)
      .json({ message: "Please provide all fields: name, email, password" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Save user to database
  db.query(
    "INSERT INTO user (name, email, password, created_at) VALUES (?, ?, ?, NOW())",
    [name, email, password],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to register user" });
      } else {
        console.error("User registered");
        const token = jwt.sign(
          { id: results.insertId, email },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );
        res
          .status(201)
          .json({ message: "User registered successfully", token });
      }
    }
  );
});

// LOGIN ENDPOINT
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Check if user exists in database
  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to login" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      const user = results[0];

      // Check password
      if (password != user.password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.ID, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res
        .status(200)
        .json({ message: "Login successful", token, user: results[0] });
    }
  );
});

// API endpoint to receive ball position
app.post("/ballPositions", authenticateToken, (req, res) => {
  const { x, y, z } = req.body;
  if (typeof x === "number" && typeof y === "number" && typeof z === "number") {
    const userId = req.user.id; // Extracted from the JWT token
    const position = { x, y, z };

    // Save the position to the MySQL database
    const query =
      "INSERT INTO ballPositions (ID, latitude, longitude, altitude) VALUES (?, ?, ?, ?)";
    db.query(query, [userId, x, y, z], (err, result) => {
      if (err) {
        console.error("Error saving position to database:", err);
        return res.status(500).send({ message: "Database error" });
      }

      io.emit("ballPosition", position); // Broadcast new position to all clients
      res.status(201).send({ message: "Position recorded", position });
    });
  } else {
    res.status(400).send({ message: "Invalid coordinates" });
  }
});

app.get("/initialCoordinates", authenticateToken, (req, res) => {
  const userId = req.user.id; // Extracted from JWT token

  const query =
    "SELECT latitude as x, longitude as y, altitude as z FROM ballPositions WHERE ID = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching initial coordinates:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch initial coordinates" });
    }
    res.status(200).json(results);
  });
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("ballPosition", (position) => {
    console.log("Received ball position:", position);
    // Broadcast to all clients
    io.emit("ballPosition", position);
  });
});

server.listen(port, () => {
  console.log("Listening...");
});
