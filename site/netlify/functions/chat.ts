import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages, systemInstruction } = JSON.parse(event.body || '{}');
    
    // Use the provided NVIDIA key or fallback to environment variable
    const apiKey = process.env.NVIDIA_API_KEY || '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';
    
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1', // Explicitly using NVIDIA's API endpoint
    });

    const response = await openai.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct", // Lightweight and credit-efficient model
      messages: [
        { role: 'system', content: systemInstruction },
        ...messages
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        text: response.choices[0].message.content 
      }),
    };
  } catch (error: any) {
    console.error('Chat Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
