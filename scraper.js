const puppeteer = require("puppeteer");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

async function fetchDataWithPuppeteer(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log("Page loaded successfully!");

    const pageContent = await page.content();
    console.log("Page content (first 1000 chars):", pageContent.slice(0, 1000));

    try {
      await page.waitForSelector('table[data-test="historical-prices"]', {
        visible: true,
        timeout: 60000,
      });
      console.log("Data table found!");
    } catch (error) {
      console.error("Error while waiting for the table:", error.message);
    }

    const data = await page.evaluate(() => {
      const rows = [];
      const tableRows = document.querySelectorAll(
        'table[data-test="historical-prices"] tbody tr'
      );
      tableRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length === 7) {
          rows.push({
            date: cells[0].innerText,
            open: parseFloat(cells[1].innerText.replace(/,/g, "")),
            high: parseFloat(cells[2].innerText.replace(/,/g, "")),
            low: parseFloat(cells[3].innerText.replace(/,/g, "")),
            close: parseFloat(cells[4].innerText.replace(/,/g, "")),
            adjClose: parseFloat(cells[5].innerText.replace(/,/g, "")),
            volume: cells[6].innerText.replace(/,/g, ""),
          });
        }
      });
      return rows;
    });

    console.log("Fetched Data:", data);
    await browser.close();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    await browser.close();
    return [];
  }
}

async function main() {
  const dbFilePath = "exchange_data.db";

  // If the database file exists, delete it for fresh creation
  if (fs.existsSync(dbFilePath)) {
    fs.unlinkSync(dbFilePath);
    console.log("Deleted existing database file.");
  }

  const db = new sqlite3.Database(dbFilePath);
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS exchange_data (
      date TEXT,
      open REAL,
      high REAL,
      low REAL,
      close REAL,
      adj_close REAL,
      volume TEXT
    )`,
      function (err) {
        if (err) {
          console.error("Error creating table:", err.message);
        } else {
          console.log("Table created successfully or already exists.");
        }
      }
    );
  });

  const quote = "EURUSD=X";
  const fromDate = 1713149515;
  const toDate = 1721011871;
  const url = `https://finance.yahoo.com/quote/${encodeURIComponent(
    quote
  )}/history?period1=${fromDate}&period2=${toDate}`;

  try {
    const data = await fetchDataWithPuppeteer(url);
    console.log("Data to be inserted into DB:", data);

    if (data.length > 0) {
      const stmt = db.prepare(
        `INSERT INTO exchange_data (date, open, high, low, close, adj_close, volume) VALUES (?, ?, ?, ?, ?, ?, ?)`
      );
      data.forEach((row) => {
        stmt.run(
          row.date,
          row.open,
          row.high,
          row.low,
          row.close,
          row.adjClose,
          row.volume
        );
      });
      stmt.finalize();
      console.log("Data inserted into the database successfully.");

      db.all("SELECT * FROM exchange_data", (err, rows) => {
        if (err) {
          console.error("Error querying database:", err.message);
        } else {
          console.log("Stored Exchange Data from DB:", rows);
        }
      });
    } else {
      console.log("No data found to insert into the database.");
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  } finally {
    db.close((err) => {
      if (err) {
        console.error("Error closing the database:", err.message);
      } else {
        console.log("Database closed successfully.");
      }
    });
  }
}

main();
