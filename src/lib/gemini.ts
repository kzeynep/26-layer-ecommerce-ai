import { buildPrompts } from './prompts';
import { parseAIResponse } from './parseResponse';

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
] as const;

const configuredModel = import.meta.env.VITE_GEMINI_MODEL;

async function generateWithModel(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: {
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      }),
    },
  );

  if (!response.ok) {
    const errBody = await response.text();
    const err = new Error(errBody) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];

  // gemini-2.5: thought + asıl cevap ayrı part'larda gelebilir
  const text =
    parts
      .filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought)
      .map((p: { text: string }) => p.text)
      .join('') ||
    parts
      .map((p: { text?: string }) => p.text)
      .filter(Boolean)
      .join('');

  if (!text) {
    const reason = data.candidates?.[0]?.finishReason ?? 'bilinmiyor';
    throw new Error(`Gemini yanıtında metin yok (finishReason: ${reason})`);
  }

  return text;
}

async function generateWithGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY tanımlı değil');
  }

  const models = configuredModel ? [configuredModel] : [...GEMINI_MODELS];
  let lastError = '';

  for (const model of models) {
    try {
      return await generateWithModel(apiKey, model, systemPrompt, userMessage);
    } catch (e) {
      const err = e as Error & { status?: number };
      lastError = err.message;

      // 429 kota veya model yok → sonraki modeli dene
      const isQuota = err.status === 429 || lastError.includes('RESOURCE_EXHAUSTED');
      const isNotFound = err.status === 404 || lastError.includes('NOT_FOUND');
      if (isQuota || isNotFound) continue;

      throw new Error(`Gemini API hatası (${model}): ${lastError}`);
    }
  }

  throw new Error(
    'Gemini kotası doldu veya free tier bu modeller için kapalı. ' +
      'Birkaç dakika bekleyip tekrar dene, yeni API key al veya Google AI Studio\'da faturalandırmayı aç. ' +
      `Son hata: ${lastError.slice(0, 200)}`,
  );
}

export async function callGemini(module: string, payload: Record<string, unknown>) {
  const prompts = buildPrompts(module, payload);
  if (!prompts) {
    throw new Error('Geçersiz modül');
  }

  const textContent = await generateWithGemini(prompts.systemPrompt, prompts.userMessage);
  const data = parseAIResponse(module, textContent);

  return { success: true, data };
}
