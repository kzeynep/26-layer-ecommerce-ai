export function buildPrompts(
  module: string,
  payload: Record<string, unknown>,
): { systemPrompt: string; userMessage: string } | null {
  if (module === 'product_assistant') {
    const { query } = payload;
    return {
      systemPrompt: `Sen Türkiye'nin önde gelen e-ticaret platformlarında uzmanlaşmış bir yapay zeka ürün asistanısın.
Kullanıcının ihtiyaçlarını anlayarak kişiselleştirilmiş ürün önerileri sunuyorsun.
MUTLAKA geçerli JSON formatında yanıt ver. Anahtar isimleri İngilizce olmalı. Markdown veya açıklama ekleme.
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
3 farklı ürün öner.`,
      userMessage: String(query),
    };
  }

  if (module === 'review_analyzer') {
    const { reviews, productName } = payload;
    return {
      systemPrompt: `Sen bir e-ticaret ürün yorumu analiz uzmanısın. Verilen yorumları derinlemesine analiz ederek satıcı ve alıcılara değerli içgörüler sunuyorsun.
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
}`,
      userMessage: `Ürün: ${productName}\n\nYorumlar:\n${reviews}\n\nTüm analiz metinlerini Türkçe yaz.`,
    };
  }

  if (module === 'description_generator') {
    const { productName, features, tone, platform } = payload;
    return {
      systemPrompt: `Sen Türk e-ticaret pazarı için SEO uyumlu ürün açıklamaları yazan uzman bir içerik yazarısın.
MUTLAKA geçerli JSON formatında yanıt ver. Anahtar isimleri İngilizce olmalı. Markdown veya açıklama ekleme.
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
}`,
      userMessage: `Ürün Adı: ${productName}\nÖzellikler: ${features}\nTon: ${tone}\nPlatform: ${platform}`,
    };
  }

  return null;
}
