// Import the scraping function and any required modules
const { scrapeForexData } = require("./scraper");
const cron = require("node-cron");

// Define the currency pairs and periods
const currencyPairs = [
  { from: "GBP", to: "INR" },
  { from: "AED", to: "INR" },
];

const periods = ["1W", "1M", "3M", "6M", "1Y"];


async function runScraping() {
  for (const { from, to } of currencyPairs) {
    for (const period of periods) {
      try {
        console.log(`Scraping data for ${from}-${to} for period ${period}...`);
        await scrapeForexData(from, to, period); 
        console.log(
          `Data for ${from}-${to} for period ${period} scraped successfully.`
        );
      } catch (error) {
        console.error(
          `Error scraping data for ${from}-${to} for period ${period}:`,
          error
        );
      }
    }
  }
}

// Schedule the script to run every day at midnight (adjust as necessary)
// This cron expression can be changed based on your needs.
cron.schedule("0 0 * * *", () => {
  console.log("Starting scheduled scraping job...");
  runScraping();
});
