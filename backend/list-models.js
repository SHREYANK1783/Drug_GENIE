// List available Gemini models for your API key
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

console.log('=================================');
console.log('🔍 Checking Available Models');
console.log('=================================');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : '❌ NOT FOUND');
console.log('=================================\n');

if (!apiKey) {
  console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('📡 Fetching list of available models...\n');
    
    // Try to list models using the API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ ERROR:', error.error?.message || 'Failed to fetch models');
      console.error('\n📋 This means:');
      console.error('1. Your API key is invalid, OR');
      console.error('2. The Generative Language API is NOT enabled for this key');
      console.error('\n✅ SOLUTION:');
      console.error('Go to: https://aistudio.google.com/app/apikey');
      console.error('Create a NEW API key in a NEW project');
      console.error('This will automatically enable all required APIs');
      return;
    }
    
    const data = await response.json();
    
    if (!data.models || data.models.length === 0) {
      console.error('❌ No models available for this API key!');
      console.error('\n✅ SOLUTION: Create a new API key in Google AI Studio');
      return;
    }
    
    console.log('✅ Available models for your API key:\n');
    data.models.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
      if (model.displayName) console.log(`   Display Name: ${model.displayName}`);
      if (model.description) console.log(`   Description: ${model.description}`);
      console.log('');
    });
    
    console.log('\n🎯 Recommended model to use:');
    const recommendedModel = data.models.find(m => 
      m.name.includes('gemini-1.5-flash') || 
      m.name.includes('gemini-pro')
    );
    
    if (recommendedModel) {
      const modelName = recommendedModel.name.replace('models/', '');
      console.log(`   "${modelName}"`);
      console.log('\n📝 Update your aiController.ts to use this model name.');
    } else {
      console.log('   Use the first model from the list above');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\n📋 Your API key cannot access the Generative Language API');
    console.error('\n✅ SOLUTION:');
    console.error('1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    console.error('2. Enable the "Generative Language API"');
    console.error('3. OR create a new API key at: https://aistudio.google.com/app/apikey');
  }
}

listModels();
