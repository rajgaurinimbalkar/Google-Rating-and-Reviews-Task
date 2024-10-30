require("dotenv").config(); // Load environment variables from .env file
const axios = require("axios");
const xlsx = require("xlsx");
const path = require("path");

// Access environment variables, Your Google API Key
const apiKey = process.env.API_KEY;

// Load and parse the Excel file
const workbook = xlsx.readFile("../Documents/input.xlsx");
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Extract place names from the Excel file (first 50 rows)
const data = xlsx.utils.sheet_to_json(worksheet).slice(0, 50); // Get first 50 entries

// Function to get Place ID using Place Search API
async function getPlaceId(placeName) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: placeName,
          inputtype: "textquery",
          fields: "place_id",
          key: apiKey,
        },
      }
    );
    return response.data.candidates[0]?.place_id || null;
  } catch (error) {
    console.error(`Error fetching place ID for ${placeName}:`, error.message);
    return null;
  }
}

// Function to get rating and reviews count using Place Details API
async function getPlaceDetails(placeId) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          fields: "rating,user_ratings_total",
          key: apiKey,
        },
      }
    );
    const rating = response.data.result.rating || "No Rating";
    const reviewsCount = response.data.result.user_ratings_total || 0;
    return { rating, reviewsCount };
  } catch (error) {
    console.error(
      `Error fetching details for place ID ${placeId}:`,
      error.message
    );
    return { rating: "Error", reviewsCount: 0 };
  }
}

// Main function to process places and save results
async function processPlaces() {
  const auditData = [];

  for (const row of data) {
    const placeName = row.Company;
    const existingRating = row["Rating . Review"];
    const existingReviewCount = row["Total Number of Reviews"];

    try {
      // Get Place ID
      const placeId = await getPlaceId(placeName);
      if (!placeId) {
        console.log(`No place ID found for ${placeName}`);
        auditData.push({
          ...row,
          "Correct Rating out of 5": "N/A",
          "Rating . Review": "Wrong",
          "Correct Google Reviews (Yes/No)": "No",
          "Correct Total Number of Reviews": "N/A",
        });
        continue;
      }

      // Get Rating and Reviews Count
      const { rating, reviewsCount } = await getPlaceDetails(placeId);

      // Convert both rating values to strings, trim, and compare
      const apiRatingString = String(rating).trim(); // Convert API rating to a string and trim
      const existingRatingString = String(existingRating).trim(); // Convert existing rating to a string and trim
      const ratingMatch =
        apiRatingString === existingRatingString ? "Right" : "Wrong"; // Direct string comparison
      const correctRating =
        apiRatingString !== "0" && apiRatingString !== ""
          ? apiRatingString
          : "N/A"; // Check if the string is valid

      // Convert both review count values to strings, trim, and compare
      const apiReviewCountString = String(reviewsCount).trim(); // Convert API review count to a string and trim
      const existingReviewCountString = String(existingReviewCount).trim(); // Convert existing review count to a string and trim
      const reviewCountMatch =
        apiReviewCountString === existingReviewCountString ? "Yes" : "No"; // Direct string comparison
      const correctReviewCount =
        apiReviewCountString !== "0" && apiReviewCountString !== ""
          ? apiReviewCountString
          : "N/A"; // Check if the string is valid

      auditData.push({
        ...row,
        "Correct Rating out of 5": correctRating,
        "Rating . Review": ratingMatch,
        "Correct Google reviews ( Yes/No)": reviewCountMatch,
        "Correct Total Number of Reviews": correctReviewCount,
      });
    } catch (error) {
      console.log(`Error with company ${placeName}:`, error.message);
      auditData.push({
        ...row,
        "Correct Rating out of 5": "Error",
        "Rating . Review": "Error",
        "Correct Google Reviews (Yes/No)": "Error",
        "Correct Total Number of Reviews": "Error",
      });
    }
  }

  // Write results to new Excel file
  const newSheet = xlsx.utils.json_to_sheet(auditData);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, sheetName);
  xlsx.writeFile(
    newWorkbook,
    path.resolve(__dirname, "../Documents/output.xlsx")
  );

  console.log("Audit completed and saved in Updated_Review_Rating_Audit.xlsx");
}

processPlaces();
