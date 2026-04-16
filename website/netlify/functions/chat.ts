import { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const resolveNvidiaApiKey = (requestKey?: string) => {
  const candidates = [
    requestKey,
    process.env.NVIDIA_API_KEY,
    process.env.NVIDIA_NIM_API_KEY,
    process.env.NIM_API_KEY,
    process.env.NVIDA_API_KEY, // common typo fallback
  ];

  return candidates.find((key) => typeof key === 'string' && key.trim().startsWith('nvapi-'))?.trim();
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages, systemInstruction, nvidiaApiKey } = JSON.parse(event.body || '{}');
    const apiKey = resolveNvidiaApiKey(nvidiaApiKey);

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Missing NVIDIA API key. Set NVIDIA_API_KEY on the server or provide it from the client.',
        }),
      };
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const response = await openai.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
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
      body: JSON.stringify({
        error: error?.message || 'Unknown chat function error',
      }),
    };
  }
};

export { handler };
