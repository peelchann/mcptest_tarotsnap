import { generateTarotReading, checkOpenRouterHealth } from './openrouter';

async function testOpenRouter() {
  console.log('🔮 Testing OpenRouter Tarot Reading Integration...\n');

  // Test 1: Health Check
  console.log('1. Testing OpenRouter Health Check...');
  try {
    const isHealthy = await checkOpenRouterHealth();
    console.log(`✅ Health Check: ${isHealthy ? 'PASSED' : 'FAILED'}\n`);
  } catch (error) {
    console.log(`❌ Health Check: FAILED - ${error}\n`);
    return;
  }

  // Test 2: Generate Tarot Reading
  console.log('2. Testing Tarot Reading Generation...');
  try {
    const result = await generateTarotReading("What should I focus on in my career?");
    const reading = result.reading;

    console.log('✅ Reading Generated Successfully!');
    console.log(`📇 Card: ${reading.card}`);
    console.log(`💫 Meaning: ${reading.meaning}`);
    console.log(`🔍 Interpretation: ${reading.interpretation}`);
    console.log(`🧭 Guidance: ${reading.guidance}`);
    console.log(`⚡ Energy: ${reading.energy}`);
    console.log(`⏰ Timeframe: ${reading.timeframe}\n`);

    // Validate response structure
    const requiredFields = ['card', 'meaning', 'interpretation', 'guidance', 'energy', 'timeframe'];
    const missingFields = requiredFields.filter(field => !reading[field as keyof typeof reading]);

    if (missingFields.length === 0) {
      console.log('✅ Response Structure: VALID\n');
    } else {
      console.log(`❌ Response Structure: INVALID - Missing fields: ${missingFields.join(', ')}\n`);
    }

  } catch (error) {
    console.log(`❌ Reading Generation: FAILED - ${error}\n`);
  }

  // Test 3: Test different question types
  console.log('3. Testing Different Question Types...');
  const testQuestions = [
    "Will I find love soon?",
    "What does the future hold for my finances?",
    "How can I improve my spiritual growth?"
  ];

  for (const question of testQuestions) {
    try {
      console.log(`Testing: "${question}"`);
      const result = await generateTarotReading(question);
      const reading = result.reading;
      console.log(`✅ Generated: ${reading.card} - ${reading.interpretation.substring(0, 50)}...\n`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`❌ Failed for "${question}": ${error}\n`);
    }
  }

  console.log('🎯 OpenRouter Integration Test Complete!');
}

// Run the test if this file is executed directly
if (require.main === module) {
  testOpenRouter().catch(console.error);
}

export { testOpenRouter }; 