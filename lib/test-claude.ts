// Test script for Claude integration
// This will help verify the setup works once you add your API key

import { generateTarotReading, isValidQuestion } from './claude';

export async function testClaudeIntegration() {
  console.log('🔮 Testing TarotSnap Claude Integration...\n');
  
  // Test 1: Question validation
  console.log('Test 1: Question Validation');
  console.log('✅ Valid question:', isValidQuestion('What should I focus on today?'));
  console.log('❌ Invalid question (too short):', isValidQuestion('Hi'));
  console.log('❌ Invalid question (inappropriate):', isValidQuestion('I hate everything'));
  console.log('');
  
  // Test 2: API Key check
  console.log('Test 2: API Key Configuration');
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('❌ ANTHROPIC_API_KEY not found in environment variables');
    console.log('📝 Please create .env.local file with: ANTHROPIC_API_KEY=your_key_here');
    console.log('');
    return false;
  } else {
    console.log('✅ ANTHROPIC_API_KEY found');
    console.log('');
  }
  
  // Test 3: Real API call (only if API key is configured)
  try {
    console.log('Test 3: Generating Test Reading...');
    const testReading = await generateTarotReading({
      question: 'What energy should I embrace today?',
      spread: 'single'
    });
    
    console.log('✅ Reading generated successfully!');
    console.log('📇 Card drawn:', testReading.cards[0].name);
    console.log('🔍 Orientation:', testReading.cards[0].upright ? 'Upright' : 'Reversed');
    console.log('🔮 Interpretation preview:', testReading.interpretation.slice(0, 100) + '...');
    console.log('');
    
    return true;
  } catch (error) {
    console.log('❌ Error generating reading:', error);
    console.log('');
    return false;
  }
}

// Run test if called directly
if (require.main === module) {
  testClaudeIntegration()
    .then(success => {
      if (success) {
        console.log('🎉 All tests passed! Your TarotSnap integration is ready.');
      } else {
        console.log('⚠️  Please fix the issues above and try again.');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Test failed with error:', error);
      process.exit(1);
    });
} 