const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const port = 3000;
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();
const [JWT_SECRET] = process.env.JWT_SECRET;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ball_position_tracking",
});

db.connect((err) => {
  if (err) {
    console.log("Error: " + err);
  } else {
    console.log("connected");
  }
});

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
        const token = jwt.sign({ id: results.insertId, email }, JWT_SECRET, {
          expiresIn: "24h",
        });
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

app.listen(port, () => {
  console.log("Listening...");
});
