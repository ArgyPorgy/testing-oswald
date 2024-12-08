const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Paths to the reports
const report1Path = path.resolve(__dirname, "slither_report.json");
const report2Path = path.resolve(__dirname, "quill_report.json");
const consensusReportPath = path.resolve(__dirname, "consensus-report.json");

const findConsensusWithGemini = async () => {
  try {
    console.log("Reading Agent 1 report...");
    const report1 = JSON.parse(fs.readFileSync(report1Path, "utf-8"));

    console.log("Reading Agent 2 report...");
    const report2 = JSON.parse(fs.readFileSync(report2Path, "utf-8"));

    // Preparing the input for Gemini API
    const prompt = `
    Given two audit reports, identify the common vulnerabilities. Here are the reports:

    Report 1:
    ${JSON.stringify(report1, null, 2)}

    Report 2:
    ${JSON.stringify(report2, null, 2)}

    Return only the common bugs as text in the format:
    {
      "auditSummary": {
        "totalBugs": <total_count>
      },
      "bugs": [<list_of_common_bugs>]
    }`;

    console.log("Generating consensus...");

    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Fetching the response
    const result = await model.generateContent(prompt);

    // Log the raw response for debugging
    console.log("Raw API Response:", result.response.text());

    // Extract the response text and parse it as JSON
    // const consensusReport = JSON.parse(result.response.text());

    

    // console.log("Consensus report saved to:", consensusReportPath);
  } 
  catch (error) {
    console.error("Error using Gemini API for consensus:", error.message);
    process.exit(1);
  }
};

// Call the function
findConsensusWithGemini();
