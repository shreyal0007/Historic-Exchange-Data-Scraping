const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const moment = require("moment"); // For date manipulation

const app = express();
const PORT = 3000;


const db = new sqlite3.Database("exchange_data.db");
const cors = require("cors");
app.use(cors());


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


app.post("/api/forex-data", async (req, res) => {
  console.log("Query parameters:", req.query);
  const { from, to, period } = req.query;

  if (!from || !to || !period) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  const startDate = getStartDate(period);
  if (!startDate) {
    return res.status(400).json({ error: "Invalid period format" });
  }

  console.log("Calculated start date:", startDate);

  const quote = `${from}${to}=X`;


  db.all(
    "SELECT * FROM exchange_data WHERE date >= ? AND from_currency = ? AND to_currency = ? ORDER BY date ASC",
    [startDate, from, to], 
    (err, rows) => {
      if (err) {
        console.error("Error querying database:", err.message);
        res.status(500).json({ error: "Database query failed" });
      } else {
        if (rows.length === 0) {
          console.log("No data found for the given period and currencies.");
        } else {
          console.log("Rows fetched:", rows); 
        }
        res.json({ quote, data: rows });
      }
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
