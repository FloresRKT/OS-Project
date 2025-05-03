const express = require("express");
const listRoutes = require("express-list-routes");
const cors = require("cors");
const db = require("./db/database");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api", routes);

// List all API routes
listRoutes(app);

// Status check
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
