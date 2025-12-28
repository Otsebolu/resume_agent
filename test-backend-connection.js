/**
 * Quick test script to verify backend connection
 * Run with: node test-backend-connection.js
 */

const BACKEND_URL = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000';

async function testConnection() {
  console.log(`Testing connection to: ${BACKEND_URL}`);
  
  try {
    // Test 1: Health check
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${BACKEND_URL}/`);
    const healthData = await healthResponse.json();
    console.log('✓ Health check passed:', healthData);
    
    // Test 2: Check if /api/analyze endpoint exists
    console.log('\n2. Testing /api/analyze endpoint (without file)...');
    const formData = new FormData();
    formData.append('job_description', 'Test job description');
    
    // Create a minimal test PDF blob
    const testPdfContent = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\nxref\n0 1\ntrailer\n<< /Root 1 0 R >>\n%%EOF';
    const testPdfBlob = new Blob([testPdfContent], { type: 'application/pdf' });
    formData.append('cv_file', testPdfBlob, 'test.pdf');
    
    const analyzeResponse = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    });
    
    if (analyzeResponse.status === 400) {
      console.log('✓ Endpoint exists (expected validation error for test PDF)');
    } else {
      console.log(`Response status: ${analyzeResponse.status}`);
      const responseText = await analyzeResponse.text();
      console.log('Response:', responseText.substring(0, 200));
    }
    
    console.log('\n✓ Backend connection test completed!');
    console.log('\nIf you see errors above, check:');
    console.log('  - Is the backend running?');
    console.log('  - Is the URL correct?');
    console.log('  - Are CORS settings configured?');
    
  } catch (error) {
    console.error('\n✗ Connection failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Ensure backend is running: uvicorn api.index:app --reload');
    console.error('  2. Check BACKEND_URL:', BACKEND_URL);
    console.error('  3. Verify backend is accessible at:', BACKEND_URL);
    process.exit(1);
  }
}

testConnection();


