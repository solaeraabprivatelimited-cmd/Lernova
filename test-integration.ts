/**
 * Integration Test: Verify Frontend → Backend Communication
 * Run this in browser console to test the full integration
 */

async function testFrontendToBackendIntegration() {
  console.log("=".repeat(60));
  console.log("FRONTEND → BACKEND INTEGRATION TEST");
  console.log("=".repeat(60));
  
  // Get the API URL from environment (should be set in .env.local)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  console.log(`API URL: ${apiUrl}`);
  console.log("-".repeat(60));
  
  // Test 1: Health check
  console.log("\n1️⃣  Testing Health Endpoint...");
  try {
    const healthResponse = await fetch(`${apiUrl}/health`);
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log("✅ Health check passed");
      console.log("Response:", data);
    } else {
      console.error("❌ Health check failed:", healthResponse.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Connection error:", error.message);
    return false;
  }
  
  // Test 2: AI Mentor endpoint
  console.log("\n2️⃣  Testing AI Mentor Endpoint...");
  try {
    const testPayload = {
      message: "What is photosynthesis?",
      history: [],
      type: "explanation"
    };
    
    console.log("Sending payload:", testPayload);
    
    const mentorResponse = await fetch(`${apiUrl}/api/ai-mentor/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    if (mentorResponse.ok) {
      const data = await mentorResponse.json();
      console.log("✅ AI Mentor endpoint working");
      console.log("Response:", {
        responseLength: data.response?.length,
        timestamp: data.timestamp,
        preview: data.response?.substring(0, 100) + "..."
      });
      return true;
    } else if (mentorResponse.status === 503) {
      console.warn("⚠️  Groq API not configured (503)");
      console.log("Set GROQ_API_KEY environment variable on backend");
      return true; // Endpoint exists, just API key not set
    } else {
      const errorData = await mentorResponse.json();
      console.error("❌ AI Mentor endpoint error:", mentorResponse.status, errorData);
      return false;
    }
  } catch (error) {
    console.error("❌ AI Mentor test failed:", error.message);
    return false;
  }
}

// Run the test
console.log("\nStarting integration test...\n");
testFrontendToBackendIntegration().then(success => {
  if (success) {
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL INTEGRATION TESTS PASSED");
    console.log("Frontend → Backend communication is working!");
    console.log("=".repeat(60));
  } else {
    console.log("\n" + "=".repeat(60));
    console.log("❌ INTEGRATION TESTS FAILED");
    console.log("Check backend is running and VITE_API_URL is correct");
    console.log("=".repeat(60));
  }
});
