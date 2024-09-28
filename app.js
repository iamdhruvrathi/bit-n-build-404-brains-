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
    cb(null, 'public/uploads/'); // Save images in 'public/uploads' directory
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
  res.render("files/home", { wardrobeItems });
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
app.get("/add-collection", (req, res) => {
  res.render("addCollection");
});

// POST route for adding a new collection
app.post("/add-collection", upload.single("image"), (req, res) => {
  const { type, color } = req.body;
  const image = req.file.filename; // Get the uploaded file's name

  const sql =
    "INSERT INTO collections (type, color, image) VALUES (?, ?, ?)";
  connection.query(sql, [type, color, image], (err, result) => {
    if (err) {
      console.error("Error inserting collection: " + err.message);
      return res.status(500).send("Error adding collection");
    }
    console.log("Collection added successfully");
    res.redirect("/view-collections"); // Redirect to view collections page
  });
});

// GET route for viewing collections
app.get("/view-collections", (req, res) => {
  const sql = "SELECT * FROM collections";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching collections: " + err.message);
      return res.status(500).send("Error fetching collections");
    }
    res.render("viewCollections", { collections: results });
  });
});





const wardrobeItems = {
  shirts: [
    {
      name: "Classic White Shirt",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/shirt/01b3083f-4387-4753-8ae2-a2470dc53f19.jpg?raw=true",
      color: "White",
    },
    {
      name: "Classic Blue Shirt",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/shirt/0e99edde-0ed8-4c8c-a405-0517c1b801a4.jpg?raw=true",
      color: "Blue",
    },
    {
      name: "Brown Shirt",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/shirt/161b57e7-ed65-429a-a795-099b8ce44d08.jpg?raw=true",
      color: "Brown",
    },
    {
      name: "Grey Shirt",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/shirt/36ad54ae-3450-4264-9655-4de51e6a1a32.jpg?raw=true",
      color: "Grey",
    },
    {
      name: "Red Shirt",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/shirt/4cfe336a-6f8c-4f87-a88d-ae4e3897215f.jpg?raw=true",
      color: "Red",
    },
    {
      name: "Black Shirt",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/shirt/9cedcef4-0138-4386-9fb5-d394971dc2f0.jpg?raw=true",
      color: "Black",
    },
  ],
  pants: [
    {
      name: "Navy Blue Pants",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/pants/15a1e02b-ad2a-4b9f-9d44-0e4d260594a8.jpg?raw=true",
      color: "Navy Blue",
    },
    {
      name: "Yellow Pants",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/pants/52f73c9e-93da-47ae-bf67-f0e7b8216fe1.jpg?raw=true",
      color: "Yellow",
    },
    {
      name: "Black Pants",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/pants/25e7d73a-cd9a-4c2b-ab36-594ee2827745.jpg?raw=true",
      color: "Black",
    },
    {
      name: "Grey Pants",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/pants/046d0a65-f5a6-47f6-afaf-e692bfcfcb00.jpg?raw=true",
      color: "Grey",
    },
    {
      name: "Olive Pants",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/pants/05814dc4-0520-47e6-91e0-402a971ba40a.jpg?raw=true",
      color: "Olive",
    },
    {
      name: "Red Pants",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/pants/241836fb-0adb-402a-8417-9825051f8912.jpg?raw=true",
      color: "Red",
    },
  ],
  watches: [
    {
      name: "Silver Watch",
      link: "", // Add link if available
      color: "Silver",
    },
    {
      name: "Black Watch",
      link: "", // Add link if available
      color: "Black",
    },
    {
      name: "Gold Watch",
      link: "", // Add link if available
      color: "Gold",
    },
  ],
  belts: [
    {
      name: "Brown Leather Belt",
      link: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvCuXTJWcj23rg6YJZuG4fqtfoqBD85Tbg7A&s",
      color: "Brown",
    },
    {
      name: "Black Leather Belt",
      link: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6wAeHPfQztqc-Tn8Ybqb4i5bI4pKH4u_cdQ&s",
      color: "Black",
    },
    {
      name: "Tan Leather Belt",
      link: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmSRY5j9Sunr1XIPJ7LJkSBHxfiSYr2s7N3Q&s",
      color: "Tan",
    },
  ],
  shoes: [
    {
      name: "Black Shoe",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/shoes/16fd381e-9da4-493b-aa53-c217eab6bff0.jpg?raw=true",
      color: "Black",
    },
    {
      name: "Brown Shoe",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/shoes/20209905-0830-4a6d-a1cf-7382051f8f18.jpg?raw=true",
      color: "Brown",
    },
    {
      name: "Orange Shoe",
      link: "https://github.com/iamdhruvrathi/clothing-dataset-small/blob/master/test/shoes/6911b9c4-e3f6-4ff0-9451-610dce3c6ebf.jpg?raw=true",
      color: "Orange",
    },
  ],
  perfume: [
    {
      name: "Floral Essence",
      link: "https://www.example.com/floral-essence",
      color: "Floral",
    },
    
  ],
};
