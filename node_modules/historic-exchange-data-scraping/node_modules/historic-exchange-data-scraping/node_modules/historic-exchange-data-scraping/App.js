const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const moment = require("moment"); // For date manipulation
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors()); // Allow cross-origin requests

// Connect to the SQLite database
const db = new sqlite3.Database("exchange_data.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Helper function to calculate start date based on the period
function getStartDate(period) {
  const now = moment();
  switch (period) {
    case "1W":
      return now.subtract(1, "week").format("YYYY-MM-DD");
    case "1M":
      return now.subtract(1, "month").format("YYYY-MM-DD");
    case "3M":
      return now.subtract(3, "months").format("YYYY-MM-DD");
    case "6M":
      return now.subtract(6, "months").format("YYYY-MM-DD");
    case "1Y":
      return now.subtract(1, "year").format("YYYY-MM-DD");
    default:
      return null;
  }
}

// POST API endpoint
app.post("/api/forex-data", (req, res) => {
  console.log("Query parameters:", req.query);

  const { from, to, period } = req.query;

  // Validate required query parameters
  if (!from || !to || !period) {
    return res
      .status(400)
      .json({ error: "Missing query parameters: from, to, or period" });
  }

  // Calculate the start date based on the period
  const startDate = getStartDate(period);
  if (!startDate) {
    return res
      .status(400)
      .json({ error: "Invalid period format. Use 1W, 1M, 3M, 6M, or 1Y." });
  }

  console.log("Calculated start date:", startDate);

  // Query the database
  const query = `
    SELECT date, open, high, low, close, adj_close, volume
    FROM exchange_data
    WHERE date >= ?
    ORDER BY date ASC
  `;

  db.all(query, [startDate], (err, rows) => {
    if (err) {
      console.error("Error querying database:", err.message);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (rows.length === 0) {
      console.log("No data found for the given period and currencies.");
      return res.status(404).json({ error: "No data found" });
    }

    console.log("Rows fetched:", rows);
    res.json({ data: rows });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
