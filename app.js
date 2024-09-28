const express = require("express");
const path = require("path");
const mysql = require("mysql2");
require("dotenv").config();
const ejsMate = require("ejs-mate");
const bcrypt = require("bcrypt");
const multer = require("multer");

const app = express();
const port = 8080;

// Set up database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Save images in 'public/uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid name collisions
  },
});

const upload = multer({ storage: storage });

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
    return;
  }
  console.log("Connected to the database.");
});

// Routes
app.get("/", (req, res) => {
  res.render("files/home");
});

app.get("/login", (req, res) => {
  res.render("files/signin");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM user_info WHERE username = ?";
  connection.query(sql, [username], async (err, result) => {
    if (err) {
      console.error("Error logging in: " + err.message);
      return res.status(500).send("Error logging in");
    }

    if (result.length === 0) {
      return res.status(404).send("Invalid username or password");
    }

    const user = result[0];
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(404).send("Invalid username or password");
    }

    console.log("User logged in successfully");
    res.render("files/home2", { username });
  });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const checkUserSql =
    "SELECT * FROM user_info WHERE username = ? OR email = ?";
  connection.query(checkUserSql, [username, email], async (err, result) => {
    if (err) {
      console.error("Error checking user: " + err.message);
      return res.status(500).send("Error checking user");
    }

    if (result.length > 0) {
      return res.status(400).send("Username or email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO user_info (username, email, password) VALUES (?, ?, ?)";
    connection.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting user: " + err.message);
        return res.status(500).send("Error registering user");
      }
      console.log("User registered successfully");
      res.redirect("/login");
    });
  });
});

// GET route for Add Collection
app.get("/add-collections", (req, res) => {
  res.render("files/addcollections");
});

// POST route for adding a new collection
app.post("/add-collection", upload.single("image"), (req, res) => {
  const { type, color } = req.body;
  const image = req.file.filename; // Get the uploaded file's name

  const sql = "INSERT INTO collections (type, color, image) VALUES (?, ?, ?)";
  connection.query(sql, [type, color, image], (err, result) => {
    if (err) {
      console.error("Error inserting collection: " + err.message);
      return res.status(500).send("Error adding collection");
    }
    console.log("Collection added successfully");
    res.render("files/home");
  });
});

