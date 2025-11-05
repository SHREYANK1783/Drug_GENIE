import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AIConsultationLog from '../models/aiConsultationLogModel';
import { logActivity } from './activityController';

// System prompt for health assistant
const SYSTEM_PROMPT = `You are a specialized AI health assistant for Drug GENIE, a healthcare application. You ONLY answer questions related to health, medicine, and wellness.

YOUR EXPERTISE AREAS:
1. General health information and medical guidance
2. Common symptoms, conditions, and diseases
3. Medications, drug interactions, and side effects
4. Lifestyle and wellness advice (diet, exercise, sleep)
5. Medical terms and procedures explained simply
6. When to seek professional medical help
7. Preventive healthcare and health maintenance

STRICT GUIDELINES:
- ONLY respond to health and medicine-related questions
- If asked about non-health topics (sports, politics, entertainment, etc.), politely decline and redirect to health topics
- Always emphasize you provide general information, NOT personalized medical advice
- Encourage users to consult healthcare professionals for diagnosis and treatment
- Be empathetic, supportive, and professional
- Provide clear, accurate, evidence-based information
- If unsure, admit limitations and suggest consulting a doctor
- NEVER diagnose conditions or prescribe specific medications
- Focus on education and general wellness guidance

RESPONSE FORMAT:
- Keep responses SHORT and concise (maximum 3-4 sentences or 1-2 short paragraphs)
- Use bullet points for lists to make information scannable
- Use simple, easy-to-understand language
- Be friendly but professional
- Get straight to the point - no lengthy explanations
- Only include essential information
- Add disclaimers only when necessary, keep them brief

If a question is NOT related to health or medicine, respond with:
"I'm a specialized health assistant and can only answer questions about health, medicine, and wellness. Please ask me about symptoms, medications, health conditions, or general wellness topics. How can I help you with your health today?"`;

// Chat with AI Assistant
export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        message: 'Message is required and must be a string' 
      });
    }

    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ 
        message: 'Gemini API key not configured' 
      });
    }

    // Initialize Gemini AI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the generative model (using gemini-pro-latest for best results)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

    // Build conversation context
    let prompt = SYSTEM_PROMPT + '\n\n';
    
    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.type === 'user') {
          prompt += `User: ${msg.content}\n`;
        } else if (msg.type === 'ai') {
          prompt += `Assistant: ${msg.content}\n`;
        }
      });
    }
    
    // Add current user message
    prompt += `User: ${message}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const aiResponse = response.text();

    // Log the consultation to database
    try {
      await AIConsultationLog.create({
        userId,
        question: message,
        response: aiResponse,
      });
    } catch (logError) {
      console.error('Error logging AI consultation:', logError);
      // Don't fail the request if logging fails
    }

    // Log activity
    const user = (req as any).user;
    if (user) {
      await logActivity(
        userId,
        user.name || 'User',
        'ai_consultation',
        'AI consultation completed',
        `Asked: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
        { questionLength: message.length, responseLength: aiResponse.length }
      );
    }

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date(),
    });

  } catch (error: any) {
    console.error('Error in AI chat:', error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        message: 'Invalid or missing API key',
        error: 'Please check your Gemini API configuration',
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return res.status(429).json({
        message: 'API rate limit exceeded',
        error: 'Please try again in a few moments',
      });
    }

    res.status(500).json({
      message: 'Error generating AI response',
      error: error.message || 'Unknown error occurred',
    });
  }
};

// Get AI consultation history for a user
export const getConsultationHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const consultations = await AIConsultationLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await AIConsultationLog.countDocuments({ userId });

    res.json({
      success: true,
      consultations,
      total,
      limit,
      skip,
    });

  } catch (error: any) {
    console.error('Error fetching consultation history:', error);
    res.status(500).json({
      message: 'Error fetching consultation history',
      error: error.message,
    });
  }
};

// Clear consultation history for a user
export const clearConsultationHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const result = await AIConsultationLog.deleteMany({ userId });

    res.json({
      success: true,
      message: 'Consultation history cleared',
      deletedCount: result.deletedCount,
    });

  } catch (error: any) {
    console.error('Error clearing consultation history:', error);
    res.status(500).json({
      message: 'Error clearing consultation history',
      error: error.message,
    });
  }
};
