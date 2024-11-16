# Forex Data Scraper and API

This project provides a backend service to fetch historical forex data, store it in an SQLite database, and expose it via an API. A cron job is implemented to scrape updated forex data daily from Yahoo Finance.

---

## Features

- **API** to fetch historical forex data for currency pairs and specified time periods.
- **SQLite database** to store and manage the scraped exchange data.
- **Cron job** to update forex data daily for configured currency pairs and periods.

---

## Requirements

- **Node.js** (version 14.x or above)
- **SQLite3** installed locally
- Access to the internet (to scrape data from Yahoo Finance)

---

## Installation

### 1. Clone the repository:

```bash
git clone <repository_url>



## 1. Start the Backend API

### Navigate to the `src/services` directory:
```bash
cd src/services
Start the server:
bash
Copy code
node App.js
The API will be available at http://localhost:3000.


##2. Schedule Data Scraping
Run the cron job to scrape forex data daily:

bash
Copy code
node cron-scraper.js
Data Scraping Details:
The cron job will scrape forex data for the following currency pairs and time periods:

GBP-INR for: 1W, 1M, 3M, 6M, 1Y
AED-INR for: 1W, 1M, 3M, 6M, 1Y
Scraped data will be stored in the exchange_data.db SQLite database.

##3. API Endpoints
POST /api/forex-data
This endpoint fetches historical forex data for a specific currency pair and time period.

Query Parameters:
from: The base currency (e.g., GBP).
to: The target currency (e.g., INR).
period: The time period for historical data (1W, 1M, 3M, 6M, 1Y).
Example Request:
http
Copy code
POST http://localhost:3000/api/forex-data?from=GBP&to=INR&period=1M
