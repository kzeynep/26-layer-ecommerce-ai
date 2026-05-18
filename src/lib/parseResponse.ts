function stripMarkdownJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : trimmed;
}

export function extractJson(text: string): unknown {
  const cleaned = stripMarkdownJson(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    /* try substring */
  }

  const objStart = cleaned.indexOf('{');
  const objEnd = cleaned.lastIndexOf('}');
  if (objStart !== -1 && objEnd > objStart) {
    try {
      return JSON.parse(cleaned.slice(objStart, objEnd + 1));
    } catch {
      /* continue */
    }
  }

  const arrStart = cleaned.indexOf('[');
  const arrEnd = cleaned.lastIndexOf(']');
  if (arrStart !== -1 && arrEnd > arrStart) {
    try {
      return JSON.parse(cleaned.slice(arrStart, arrEnd + 1));
    } catch {
      /* continue */
    }
  }

  throw new Error('AI yanıtı JSON olarak okunamadı');
}

function unwrap(obj: Record<string, unknown>): Record<string, unknown> {
  const nested = obj.data ?? obj.result ?? obj.response ?? obj.output;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return unwrap(nested as Record<string, unknown>);
  }
  return obj;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

function normalizeRecommendation(item: unknown) {
  const r = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
  return {
    name: asString(r.name ?? r.ad ?? r.urun_adi ?? r.title ?? r.baslik),
    category: asString(r.category ?? r.kategori),
    priceRange: asString(r.priceRange ?? r.fiyat_araligi ?? r.fiyat ?? r.price),
    pros: asArray(r.pros ?? r.artilar ?? r.avantajlar).map(asString),
    cons: asArray(r.cons ?? r.eksiler ?? r.dezavantajlar).map(asString),
    rating: Number(r.rating ?? r.puan ?? 4) || 4,
    bestFor: asString(r.bestFor ?? r.kime_uygun ?? r.uygun),
    platforms: asArray(r.platforms ?? r.platformlar).map(asString),
    pricePerformance: asString(r.pricePerformance ?? r.fiyat_performans ?? r.degerlendirme),
  };
}

export function normalizeByModule(module: string, parsed: unknown): Record<string, unknown> {
  if (Array.isArray(parsed)) {
    if (module === 'product_assistant') {
      return {
        recommendations: parsed.map(normalizeRecommendation),
        summary: '',
        tips: [],
      };
    }
    throw new Error('Beklenmeyen AI yanıt formatı');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('AI yanıtı boş veya geçersiz');
  }

  const obj = unwrap(parsed as Record<string, unknown>);

  if (module === 'product_assistant') {
    const recommendations = asArray(
      obj.recommendations ?? obj.oneriler ?? obj.products ?? obj.urunler ?? obj.items,
    ).map(normalizeRecommendation);

    return {
      recommendations,
      summary: asString(obj.summary ?? obj.ozet ?? obj.genel_ozet),
      tips: asArray(obj.tips ?? obj.ipuclari ?? obj.alisveris_ipuclari).map(asString),
    };
  }

  if (module === 'review_analyzer') {
    const dimensions = (obj.dimensions ?? obj.boyutlar ?? {}) as Record<string, unknown>;
    return {
      satisfactionScore: Number(obj.satisfactionScore ?? obj.memnuniyet_skoru ?? obj.skor ?? 0) || 0,
      summary: asString(obj.summary ?? obj.ozet),
      positives: asArray(obj.positives ?? obj.olumlu ?? obj.artilar).map(asString),
      negatives: asArray(obj.negatives ?? obj.olumsuz ?? obj.eksiler).map(asString),
      suitableFor: asArray(obj.suitableFor ?? obj.uygun).map(asString),
      notSuitableFor: asArray(obj.notSuitableFor ?? obj.uygun_degil).map(asString),
      dimensions: {
        quality: Number(dimensions.quality ?? dimensions.kalite ?? 0) || 0,
        pricePerformance: Number(dimensions.pricePerformance ?? dimensions.fiyat_performans ?? 0) || 0,
        satisfaction: Number(dimensions.satisfaction ?? dimensions.memnuniyet ?? 0) || 0,
        delivery: Number(dimensions.delivery ?? dimensions.teslimat ?? 0) || 0,
      },
      sellerAdvice: asString(obj.sellerAdvice ?? obj.satici_onerisi),
      buyerAdvice: asString(obj.buyerAdvice ?? obj.alici_onerisi),
      sentiment: asString(obj.sentiment ?? obj.duygu ?? 'neutral'),
      topKeywords: asArray(obj.topKeywords ?? obj.anahtar_kelimeler).map(asString),
    };
  }

  if (module === 'description_generator') {
    return {
      title: asString(obj.title ?? obj.baslik),
      shortDescription: asString(obj.shortDescription ?? obj.kisa_aciklama),
      fullDescription: asString(obj.fullDescription ?? obj.tam_aciklama ?? obj.aciklama),
      bulletPoints: asArray(obj.bulletPoints ?? obj.maddeler ?? obj.ozellikler).map(asString),
      technicalSpecs: asArray(obj.technicalSpecs ?? obj.teknik_ozellikler).map(asString),
      callToAction: asString(obj.callToAction ?? obj.cta),
      seoKeywords: asArray(obj.seoKeywords ?? obj.anahtar_kelimeler).map(asString),
      targetAudience: asString(obj.targetAudience ?? obj.hedef_kitle),
      uniqueSellingPoints: asArray(obj.uniqueSellingPoints ?? obj.usp).map(asString),
    };
  }

  return obj;
}

export function parseAIResponse(module: string, text: string): Record<string, unknown> {
  const parsed = extractJson(text);
  const normalized = normalizeByModule(module, parsed);

  if (module === 'product_assistant') {
    const recs = normalized.recommendations as unknown[];
    if (!recs?.length) {
      throw new Error('AI ürün önerisi döndürmedi. Lütfen tekrar deneyin.');
    }
  }

  if (module === 'review_analyzer' && !normalized.summary) {
    throw new Error('AI analiz özeti döndürmedi. Lütfen tekrar deneyin.');
  }

  if (module === 'description_generator' && !normalized.title && !normalized.fullDescription) {
    throw new Error('AI açıklama üretmedi. Lütfen tekrar deneyin.');
  }

  return normalized;
}
