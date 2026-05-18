const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"];

async function generateWithGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ortam değişkeni tanımlı değil");
  }

  let lastError = "";

  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: {
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      },
    );

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini yanıtında metin bulunamadı");
      return text;
    }

    lastError = await response.text();
    if (response.status === 429 || response.status === 404) continue;
    throw new Error(`Gemini API hatası (${model}): ${lastError}`);
  }

  throw new Error(
    `Gemini kotası doldu. Birkaç dakika bekleyip tekrar dene veya yeni API key al. Son hata: ${lastError.slice(0, 200)}`,
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { module, payload } = await req.json();

    let systemPrompt = "";
    let userMessage = "";

    if (module === "product_assistant") {
      const { query } = payload;
      systemPrompt = `Sen Türkiye'nin önde gelen e-ticaret platformlarında uzmanlaşmış bir yapay zeka ürün asistanısın.
Kullanıcının ihtiyaçlarını anlayarak kişiselleştirilmiş ürün önerileri sunuyorsun.
MUTLAKA JSON formatında yanıt ver. Başka hiçbir metin ekleme.
Format:
{
  "recommendations": [
    {
      "name": "Ürün Adı",
      "category": "Kategori",
      "priceRange": "Fiyat aralığı (örn: 500-800 TL)",
      "pros": ["artı1", "artı2", "artı3"],
      "cons": ["eksi1", "eksi2"],
      "rating": 4.5,
      "bestFor": "Bu ürün kime uygun",
      "platforms": ["Trendyol", "Hepsiburada"],
      "pricePerformance": "Fiyat/performans değerlendirmesi"
    }
  ],
  "summary": "Genel öneri özeti",
  "tips": ["alışveriş ipucu 1", "alışveriş ipucu 2"]
}
3 farklı ürün öner.`;
      userMessage = query;
    } else if (module === "review_analyzer") {
      const { reviews, productName } = payload;
      systemPrompt = `Sen bir e-ticaret ürün yorumu analiz uzmanısın. Verilen yorumları derinlemesine analiz ederek satıcı ve alıcılara değerli içgörüler sunuyorsun.
MUTLAKA geçerli JSON formatında yanıt ver. JSON anahtarları İngilizce olmalı (summary, positives vb.).
Tüm metin değerleri, liste maddeleri, öneriler ve açıklamalar KESİNLİKLE Türkçe yazılmalı. İngilizce kelime veya cümle kullanma.
Markdown veya açıklama ekleme.
Format:
{
  "satisfactionScore": 85,
  "summary": "Genel özet",
  "positives": ["en çok beğenilen 1", "en çok beğenilen 2", "en çok beğenilen 3"],
  "negatives": ["en çok şikayet edilen 1", "en çok şikayet edilen 2"],
  "suitableFor": ["Bu ürün şunlar için uygun: 1", "2"],
  "notSuitableFor": ["Bu ürün şunlar için uygun değil: 1"],
  "dimensions": {
    "quality": 80,
    "pricePerformance": 75,
    "satisfaction": 85,
    "delivery": 90
  },
  "sellerAdvice": "Satıcıya öneriler",
  "buyerAdvice": "Alıcıya öneriler",
  "sentiment": "positive|neutral|negative",
  "topKeywords": ["kelime1", "kelime2", "kelime3"]
}`;
      userMessage = `Ürün: ${productName}\n\nYorumlar:\n${reviews}`;
    } else if (module === "description_generator") {
      const { productName, features, tone, platform } = payload;
      systemPrompt = `Sen Türk e-ticaret pazarı için SEO uyumlu ürün açıklamaları yazan uzman bir içerik yazarısın.
MUTLAKA JSON formatında yanıt ver. Başka hiçbir metin ekleme.
Format:
{
  "title": "SEO uyumlu başlık",
  "shortDescription": "Kısa açıklama (2-3 cümle)",
  "fullDescription": "Tam ürün açıklaması",
  "bulletPoints": ["özellik 1", "özellik 2", "özellik 3", "özellik 4", "özellik 5"],
  "technicalSpecs": ["teknik detay 1", "teknik detay 2"],
  "callToAction": "Satın alma çağrısı",
  "seoKeywords": ["anahtar kelime 1", "anahtar kelime 2", "anahtar kelime 3"],
  "targetAudience": "Hedef kitle tanımı",
  "uniqueSellingPoints": ["USP 1", "USP 2"]
}`;
      userMessage = `Ürün Adı: ${productName}\nÖzellikler: ${features}\nTon: ${tone}\nPlatform: ${platform}`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid module" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const textContent = await generateWithGemini(systemPrompt, userMessage);

    let parsed;
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(textContent);
    } catch {
      parsed = { raw: textContent };
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
