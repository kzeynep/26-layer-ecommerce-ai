import { useState } from 'react';
import { Search, ShoppingBag, Star, TrendingUp, ThumbsUp, ThumbsDown, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { callAI } from '../lib/supabase';

interface Recommendation {
  name: string;
  category: string;
  priceRange: string;
  pros: string[];
  cons: string[];
  rating: number;
  bestFor: string;
  platforms: string[];
  pricePerformance: string;
}

interface AIResponse {
  recommendations: Recommendation[];
  summary: string;
  tips: string[];
}

const QUICK_EXAMPLES = [
  'Annemin doğum günü için 500 TL altı hediye öner',
  'Yazlık için hafif ve şık bir çanta arıyorum',
  'Gaming setup için RGB klavye ve mouse öner',
  'Öğrenci için en iyi laptop seçenekleri neler',
  '2000 TL bütçeyle en iyi kulaklık hangisi',
];

export default function ProductAssistant() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState('');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  async function handleSubmit(q?: string) {
    const finalQuery = q || query;
    if (!finalQuery.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setExpandedCard(null);
    try {
      const res = await callAI('product_assistant', { query: finalQuery });
      if (res.success && res.data) setResult(res.data as AIResponse);
      else throw new Error(res.error || 'Sonuç alınamadı');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : i < rating ? 'text-amber-400 fill-amber-200' : 'text-gray-600'}
      />
    ));
  }

  return (
    <div className="space-y-6">
      {/* Quick Examples */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Hizli Ornekler</p>
        <div className="flex flex-col gap-2">
          {QUICK_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); handleSubmit(ex); }}
              className="text-left text-sm text-gray-300 hover:text-white bg-gray-700/40 hover:bg-gray-700 border border-gray-700/50 hover:border-gray-500 rounded-xl px-4 py-2.5 transition-all duration-200"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Ne ariyorsunuz? Butcenizi, kullanim amacinizi yazin..."
            className="w-full bg-gray-800 border border-gray-700 rounded-2xl pl-11 pr-4 py-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            rows={3}
          />
        </div>
        <button
          onClick={() => handleSubmit()}
          disabled={loading || !query.trim()}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-900/30"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Urunler Arastiriliyor...</span>
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              <span>Urun Oner</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && !result.recommendations?.length && (
        <div className="bg-amber-900/20 border border-amber-700/40 rounded-2xl p-4 text-amber-300 text-sm">
          AI yanıt verdi ancak ürün listesi oluşturulamadı. Lütfen sorguyu tekrar gönderin.
        </div>
      )}

      {result && result.recommendations?.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-blue-900/20 border border-blue-700/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">AI Ozeti</span>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{result.summary}</p>
          </div>

          {/* Product Cards */}
          <div className="space-y-3">
            {result.recommendations?.map((rec, i) => (
              <div key={i} className="bg-gray-800/60 border border-gray-700/50 rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded-full">#{i + 1}</span>
                        <span className="text-xs text-gray-500 truncate">{rec.category}</span>
                      </div>
                      <h3 className="text-white font-semibold text-base leading-snug">{rec.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-green-400 font-bold text-sm">{rec.priceRange}</div>
                      <div className="flex gap-0.5 mt-1 justify-end">{renderStars(rec.rating)}</div>
                    </div>
                  </div>

                  <p className="text-gray-400 text-xs mb-3">{rec.bestFor}</p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <ThumbsUp size={12} className="text-green-400" />
                        <span className="text-xs font-semibold text-green-400">Artilari</span>
                      </div>
                      {rec.pros?.slice(0, 3).map((p, j) => (
                        <div key={j} className="text-xs text-gray-300 flex gap-1 mb-1">
                          <span className="text-green-500 shrink-0">+</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1.5">
                        <ThumbsDown size={12} className="text-red-400" />
                        <span className="text-xs font-semibold text-red-400">Eksileri</span>
                      </div>
                      {rec.cons?.slice(0, 2).map((c, j) => (
                        <div key={j} className="text-xs text-gray-300 flex gap-1 mb-1">
                          <span className="text-red-500 shrink-0">-</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {expandedCard === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expandedCard === i ? 'Daha az goster' : 'Daha fazla goster'}
                  </button>

                  {expandedCard === i && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-2">
                      <div className="flex items-start gap-2">
                        <TrendingUp size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-amber-400">Fiyat/Performans: </span>
                          <span className="text-xs text-gray-300">{rec.pricePerformance}</span>
                        </div>
                      </div>
                      {rec.platforms?.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-500">Platform:</span>
                          {rec.platforms.map((p) => (
                            <span key={p} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          {result.tips?.length > 0 && (
            <div className="bg-amber-900/20 border border-amber-700/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-amber-400" />
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Alisveris Ipuclari</span>
              </div>
              <ul className="space-y-1.5">
                {result.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-gray-300 flex gap-2">
                    <span className="text-amber-500 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
