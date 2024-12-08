const fs = require('fs');
const path = require('path');
require('dotenv').config();


const QUILLSHIELD_API_URL = 'https://shield-api.quillai.network/api/v1/projects/audit';

// Path to the JSON file to be created in the main directory
const REPORT_FILE = path.join(__dirname, 'audit-results.json');

const analyzeWithQuillShield = async () => {
  const { UPLOAD_ID, USER_ID, API_KEY } = process.env;

  if (!UPLOAD_ID || !USER_ID || !API_KEY) {
    console.error('Error: Missing required environment variables (UPLOAD_ID, USER_ID, API_KEY).');
    process.exit(1);
  }

  try {
    console.log('Starting QuillShield audit...');
    const response = await fetch(QUILLSHIELD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify({ uploadId: UPLOAD_ID, userId: USER_ID }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Save the JSON response to a file in the main directory
    fs.writeFileSync(REPORT_FILE, JSON.stringify(data, null, 2));
    console.log('Audit completed. JSON file saved at:', REPORT_FILE);

    console.log('\nAudit Summary:');
    console.log('Total Lines of Code:', data.totalLines);
    console.log('Audited Files:', data.auditedFiles);
    console.log('Security Score:', data.securityScore);
    console.log('Vulnerability Count:', data.vulnerabilityCount);
    console.log('Report Link:', data.projectReportLink);
  } catch (error) {
    console.error('Failed to complete QuillShield audit:', error.message);
    process.exit(1);
  }
};

// analyzeWithQuillShield();
