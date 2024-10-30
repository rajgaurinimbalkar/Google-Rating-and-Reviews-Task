# Google Places Rating and Review Audit

This Node.js application audits the ratings and review counts of businesses listed in an Excel file against data fetched from the Google Places API. It provides a useful tool for verifying and updating existing data based on reliable sources.

## Use Case

This application is particularly useful for businesses, marketers, or analysts who need to ensure that their records of ratings and reviews are accurate. By cross-referencing internal data with real-time data from Google, users can maintain updated records, enhance their reputation management strategies, and improve customer engagement.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Functionality](#functionality)
- [Code Structure](#code-structure)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 12 or higher)
- npm (Node Package Manager)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   Install the required dependencies:
   ```

bash
Copy code
npm install
Create a .env file in the root of the project and add your Google API Key:

plaintext
Copy code
API_KEY=your_google_api_key
Usage
Prepare your input data:

Create an Excel file named input.xlsx with a list of company names, existing ratings, and review counts.
Save this file in the ../Documents/ directory relative to the script.
Run the application:

bash
Copy code
node new.js
Output:

The results will be saved in a new Excel file named output.xlsx in the same ../Documents/ directory.
Environment Variables
The application requires the following environment variable:

API_KEY: Your Google Places API key. To obtain this, you need to create a Google Cloud account and enable the Places API.
Functionality
Loading Data: The script reads the first 50 rows from an Excel file to extract company names, existing ratings, and review counts.

Fetching Place Data:

Get Place ID: For each company, the script fetches the Place ID using the Google Places Find Place API.
Get Ratings and Reviews: Using the Place ID, it retrieves the rating and total number of reviews via the Google Places Details API.
Data Comparison: The fetched data is compared with the existing data:

Ratings and review counts are cleaned and formatted to ensure accurate comparison.
Results include whether the fetched ratings and review counts match the existing records.
Output Generation: The results are saved into a new Excel file, providing a clear view of discrepancies and confirmations.

Code Structure
dotenv: Loads environment variables from the .env file.
axios: Used for making HTTP requests to the Google Places API.
xlsx: Handles reading and writing Excel files.
path: Assists in managing file paths.
License
This project is licensed under the MIT License. See the LICENSE file for details.

vbnet
Copy code

### Instructions for Using the README

1. **Replace `<repository-url>` and `<repository-directory>`**: Update the placeholders in the "Installation" section with the actual URL of your repository and the name of the directory where the repository is cloned.

2. **Adjust the License Section**: If your project uses a different license, update the license information accordingly.

3. **Modify Any Sections as Needed**: Feel free to adapt any sections to better suit your application's specific requirements or additional features.

### Additional Tips

- Save this content as `README.md` in the root of your project.
- Ensure that the formatting appears correctly when viewed on GitHub or other platforms that render Markdown files.

This documentation should provide clear guidance on using your script and understanding it
