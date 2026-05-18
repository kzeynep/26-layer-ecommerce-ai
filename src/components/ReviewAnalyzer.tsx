import { useState } from 'react';
import { MessageSquare, BarChart2, TrendingUp, TrendingDown, Users, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { callAI } from '../lib/supabase';

interface Dimensions {
  quality: number;
  pricePerformance: number;
  satisfaction: number;
  delivery: number;
}

interface AnalysisResult {
  satisfactionScore: number;
  summary: string;
  positives: string[];
  negatives: string[];
  suitableFor: string[];
  notSuitableFor: string[];
  dimensions: Dimensions;
  sellerAdvice: string;
  buyerAdvice: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  topKeywords: string[];
}

const SAMPLE_REVIEWS = `Ürün gerçekten çok kaliteli, fotoğraftakiyle birebir aynı. Hızlı kargo geldi, paketleme de süperdi. Kesinlikle tavsiye ederim.
Fiyatına göre harika bir ürün. Biraz küçük geldi ama genel olarak memnun kaldım. İkinci kez alacağım.
Kalitesi berbat, 2 haftada bozuldu. Satıcı müşteri hizmetleri de ilgisiz. Para israfı oldu.
Çok beğendim, annem de beğendi. Rengi tam beklediğim gibi. Hızlı teslimat yapıldı.
Orta kalitede bir ürün. Ne çok iyi ne çok kötü. Fiyatı biraz yüksek bulsam da iş görüyor.`;

export default function ReviewAnalyzer() {
  const [productName, setProductName] = useState('');
  const [reviews, setReviews] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');

  async function handleAnalyze() {
    if (!reviews.trim() || !productName.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await callAI('review_analyzer', { reviews, productName });
      if (res.success) setResult(res.data);
      else throw new Error(res.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bir hata olustu');
    } finally {
      setLoading(false);
    }
  }

  function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{label}</span>
          <span className="text-xs font-bold text-white">{value}/100</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${color}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  }

  const sentimentConfig = {
    positive: { color: 'text-green-400', bg: 'bg-green-900/30 border-green-700/40', label: 'Olumlu' },
    neutral: { color: 'text-amber-400', bg: 'bg-amber-900/30 border-amber-700/40', label: 'Notr' },
    negative: { color: 'text-red-400', bg: 'bg-red-900/30 border-red-700/40', label: 'Olumsuz' },
  };

  const scoreColor = (s: number) =>
    s >= 75 ? 'text-green-400' : s >= 50 ? 'text-amber-400' : 'text-red-400';
  const scoreBg = (s: number) =>
    s >= 75 ? 'from-green-500 to-emerald-600' : s >= 50 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-600';

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-3">
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Urun adi (ornek: Sony WH-1000XM5 Kulaklik)"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
        />
        <div className="relative">
          <textarea
            value={reviews}
            onChange={(e) => setReviews(e.target.value)}
            placeholder="Musteri yorumlarini buraya yapistirin (her yorum yeni satirda)..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none text-sm"
            rows={5}
          />
          <button
            onClick={() => setReviews(SAMPLE_REVIEWS)}
            className="absolute bottom-3 right-3 text-xs text-blue-400 hover:text-blue-300 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-lg transition-all"
          >
            Ornek Doldur
          </button>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !reviews.trim() || !productName.trim()}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-900/30"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Yorumlar Analiz Ediliyor...</span>
            </>
          ) : (
            <>
              <BarChart2 size={18} />
              <span>Analiz Et</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Score + Sentiment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4 flex flex-col items-center justify-center">
              <div className={`text-4xl font-black ${scoreColor(result.satisfactionScore)}`}>
                {result.satisfactionScore}
              </div>
              <div className="text-xs text-gray-400 mt-1">Memnuniyet Skoru</div>
              <div className="w-full mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${scoreBg(result.satisfactionScore)}`}
                  style={{ width: `${result.satisfactionScore}%` }}
                />
              </div>
            </div>
            <div className={`border rounded-2xl p-4 flex flex-col items-center justify-center ${sentimentConfig[result.sentiment]?.bg || 'bg-gray-800/60 border-gray-700/50'}`}>
              <MessageSquare size={24} className={sentimentConfig[result.sentiment]?.color || 'text-gray-400'} />
              <div className={`text-sm font-bold mt-2 ${sentimentConfig[result.sentiment]?.color || 'text-gray-400'}`}>
                {sentimentConfig[result.sentiment]?.label || result.sentiment}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Genel Duygu</div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
            <p className="text-gray-200 text-sm leading-relaxed">{result.summary}</p>
            {result.topKeywords?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {result.topKeywords.map((kw) => (
                  <span key={kw} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{kw}</span>
                ))}
              </div>
            )}
          </div>

          {/* Dimensions */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Degerlendirme Boyutlari</p>
            <ScoreBar label="Kalite" value={result.dimensions.quality} color="bg-gradient-to-r from-blue-500 to-blue-400" />
            <ScoreBar label="Fiyat/Performans" value={result.dimensions.pricePerformance} color="bg-gradient-to-r from-green-500 to-emerald-400" />
            <ScoreBar label="Memnuniyet" value={result.dimensions.satisfaction} color="bg-gradient-to-r from-amber-500 to-orange-400" />
            <ScoreBar label="Teslimat" value={result.dimensions.delivery} color="bg-gradient-to-r from-teal-500 to-cyan-400" />
          </div>

          {/* Positives / Negatives */}
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-green-900/20 border border-green-700/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <TrendingUp size={14} className="text-green-400" />
                <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">En Cok Begenilen</span>
              </div>
              <ul className="space-y-1.5">
                {result.positives?.map((p, i) => (
                  <li key={i} className="text-xs text-gray-300 flex gap-2">
                    <CheckCircle size={12} className="text-green-500 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-900/20 border border-red-700/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <TrendingDown size={14} className="text-red-400" />
                <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">En Cok Sikayet</span>
              </div>
              <ul className="space-y-1.5">
                {result.negatives?.map((n, i) => (
                  <li key={i} className="text-xs text-gray-300 flex gap-2">
                    <AlertCircle size={12} className="text-red-500 shrink-0 mt-0.5" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suitability */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-blue-400" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Kimler Icin Uygun?</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-green-400 font-semibold mb-2">Uygun</p>
                {result.suitableFor?.map((s, i) => (
                  <p key={i} className="text-xs text-gray-300 mb-1 flex gap-1"><span className="text-green-500">+</span>{s}</p>
                ))}
              </div>
              <div>
                <p className="text-xs text-red-400 font-semibold mb-2">Uygun Degil</p>
                {result.notSuitableFor?.map((s, i) => (
                  <p key={i} className="text-xs text-gray-300 mb-1 flex gap-1"><span className="text-red-500">-</span>{s}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Advice tabs */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="flex border-b border-gray-700/50">
              <button
                onClick={() => setActiveTab('buyer')}
                className={`flex-1 py-3 text-xs font-semibold transition-all ${activeTab === 'buyer' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Alici Tavsiyesi
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className={`flex-1 py-3 text-xs font-semibold transition-all ${activeTab === 'seller' ? 'bg-teal-600/20 text-teal-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Satici Tavsiyesi
              </button>
            </div>
            <div className="p-4 flex gap-2">
              <Lightbulb size={14} className={activeTab === 'buyer' ? 'text-blue-400 shrink-0 mt-0.5' : 'text-teal-400 shrink-0 mt-0.5'} />
              <p className="text-sm text-gray-300 leading-relaxed">
                {activeTab === 'buyer' ? result.buyerAdvice : result.sellerAdvice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
