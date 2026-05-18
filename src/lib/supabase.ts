import { createClient } from '@supabase/supabase-js';
import { callGemini } from './gemini';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AI_ENDPOINT = `${supabaseUrl}/functions/v1/ecommerce-ai`;

async function callEdgeFunction(module: string, payload: Record<string, unknown>) {
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
      Apikey: supabaseAnonKey,
    },
    body: JSON.stringify({ module, payload }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'AI isteği başarısız oldu');
  }
  return res.json();
}

export async function callAI(module: string, payload: Record<string, unknown>) {
  if (geminiApiKey) {
    return callGemini(module, payload);
  }
  return callEdgeFunction(module, payload);
}
