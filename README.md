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



2. Install dependencies:

npm install
3. Set up the SQLite database:
Ensure that SQLite3 is installed and accessible. You will also need to configure the database if necessary.

1. Start the Backend API
Navigate to the src/services directory:

cd src/services
Start the server:
node App.js
The API will be available at http://localhost:3000.

2. Schedule Data Scraping
Run the cron job to scrape forex data daily:

bash
Copy code
node cron-scraper.js
Data Scraping Details:
The cron job will scrape forex data for the following currency pairs and time periods:

GBP-INR for: 1W, 1M, 3M, 6M, 1Y
AED-INR for: 1W, 1M, 3M, 6M, 1Y
Scraped data will be stored in the exchange_data.db SQLite database.

3. API Endpoints
POST /api/forex-data
This endpoint fetches historical forex data for a specific currency pair and time period.

Query Parameters:
from: The base currency (e.g., GBP).
to: The target currency (e.g., INR).
period: The time period for historical data (1W, 1M, 3M, 6M, 1Y).
Example Request:
POST http://localhost:3000/api/forex-data?from=GBP&to=INR&period=1M
Example Response:

{
  "data": [
    {
      "date": "2024-10-01",
      "rate": 100.50
    },
    {
      "date": "2024-10-02",
      "rate": 101.20
    },
    {
      "date": "2024-10-03",
      "rate": 102.10
    },
    ...
  ]
}
4. Data Storage
The scraped forex data is stored in the exchange_data.db SQLite database with the following structure:

Currency Pair: (e.g., GBP-INR, AED-INR)
Date: Date of data entry.
Rate: Exchange rate on the specified date.
5. Running Specific Files
Here’s how to run the individual files within the project:

1. App.js - Start the Backend API
Purpose: Initializes the backend server that provides the API.
Command to run:
node src/services/App.js
2. cron-scraper.js - Run the Data Scraping Cron Job
Purpose: Scrapes forex data daily for the specified currency pairs and time periods.
Command to run:
node src/services/cron-scraper.js
6. Conclusion
This API provides access to historical forex data for specific currency pairs and time periods. The cron job ensures that data is scraped and updated daily, ensuring accurate and up-to-date information.


