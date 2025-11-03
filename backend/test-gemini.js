// Simple test script to verify Gemini API key
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

console.log('=================================');
console.log('🧪 Testing Gemini API Key');
console.log('=================================');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : '❌ NOT FOUND');
console.log('Key Length:', apiKey ? apiKey.length : 0);
console.log('=================================\n');

if (!apiKey) {
  console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
  const modelsToTry = [
    'gemini-pro-latest',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-flash-latest'
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`📡 Trying model: ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello in one word');
      const response = result.response;
      const text = response.text();
      
      console.log(`\n✅ SUCCESS! Model "${modelName}" is working!`);
      console.log('Response from Gemini:', text);
      console.log('\n🎉 Your Gemini AI integration is ready to use!');
      console.log(`\n📝 Use this model name in your code: "${modelName}"`);
      return;
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message.split('\n')[0]}`);
    }
  }
  
  console.error('\n❌ ERROR: None of the models worked!');
  console.error('\n📋 This means your API key has restrictions or the API is not enabled:');
  console.error('1. Go to: https://aistudio.google.com/app/apikey');
  console.error('2. Create a NEW API key');
  console.error('3. Make sure to select "Create API key in new project"');
  console.error('4. Copy the new key and replace it in your .env file');
}

testAPI();
