import { useState } from 'react';
import { PenLine, Copy, Check, Tag, Target, Zap, List } from 'lucide-react';
import { callAI } from '../lib/supabase';

interface GeneratedContent {
  title: string;
  shortDescription: string;
  fullDescription: string;
  bulletPoints: string[];
  technicalSpecs: string[];
  callToAction: string;
  seoKeywords: string[];
  targetAudience: string;
  uniqueSellingPoints: string[];
}

const TONES = [
  { id: 'professional', label: 'Profesyonel', desc: 'Resmi ve guvenilir' },
  { id: 'friendly', label: 'Samimi', desc: 'Sicak ve yakin' },
  { id: 'premium', label: 'Premium', desc: 'Luks ve ozgun' },
  { id: 'energetic', label: 'Genc & Enerjik', desc: 'Dinamik ve heyecanli' },
];

const PLATFORMS = [
  { id: 'trendyol', label: 'Trendyol' },
  { id: 'hepsiburada', label: 'Hepsiburada' },
  { id: 'amazon', label: 'Amazon TR' },
  { id: 'n11', label: 'N11' },
];

export default function DescriptionGenerator() {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('trendyol');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');

  async function handleGenerate() {
    if (!productName.trim() || !features.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await callAI('description_generator', { productName, features, tone, platform });
      if (res.success) setResult(res.data);
      else throw new Error(res.error);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bir hata olustu');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  }

  function CopyButton({ text, field }: { text: string; field: string }) {
    return (
      <button
        onClick={() => copyToClipboard(text, field)}
        className="p-1.5 rounded-lg hover:bg-gray-600 transition-all text-gray-400 hover:text-white shrink-0"
        title="Kopyala"
      >
        {copiedField === field ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
      </button>
    );
  }

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="space-y-3">
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Urun adi (ornek: Xiaomi Mi 11 Ultra Akilli Telefon)"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
        />
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder="Urun ozellikleri ve teknik detaylar (renk, boyut, malzeme, garanti, ozellikler...)"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all resize-none text-sm"
          rows={3}
        />
      </div>

      {/* Tone */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Yaziim Tonu</p>
        <div className="grid grid-cols-2 gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`p-3 rounded-xl border text-left transition-all ${tone === t.id ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
            >
              <div className="text-sm font-semibold">{t.label}</div>
              <div className="text-xs opacity-70 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Hedef Platform</p>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${platform === p.id ? 'bg-teal-600/20 border-teal-500 text-teal-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !productName.trim() || !features.trim()}
        className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/30"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Aciklama Olusturuluyor...</span>
          </>
        ) : (
          <>
            <PenLine size={18} />
            <span>Aciklama Uret</span>
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Title */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag size={13} className="text-blue-400" />
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">SEO Baslik</span>
              </div>
              <CopyButton text={result.title} field="title" />
            </div>
            <p className="text-white font-semibold text-sm">{result.title}</p>
          </div>

          {/* Short Description */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-amber-400" />
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Kisa Aciklama</span>
              </div>
              <CopyButton text={result.shortDescription} field="short" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{result.shortDescription}</p>
          </div>

          {/* Full Description */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PenLine size={13} className="text-green-400" />
                <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Tam Aciklama</span>
              </div>
              <CopyButton text={result.fullDescription} field="full" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{result.fullDescription}</p>
          </div>

          {/* Bullet Points */}
          {result.bulletPoints?.length > 0 && (
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <List size={13} className="text-teal-400" />
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">Ozellik Listesi</span>
                </div>
                <CopyButton text={result.bulletPoints.map(b => `• ${b}`).join('\n')} field="bullets" />
              </div>
              <ul className="space-y-1.5">
                {result.bulletPoints.map((b, i) => (
                  <li key={i} className="text-xs text-gray-300 flex gap-2">
                    <span className="text-teal-500 shrink-0">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* USPs */}
          {result.uniqueSellingPoints?.length > 0 && (
            <div className="bg-orange-900/20 border border-orange-700/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={13} className="text-orange-400" />
                <span className="text-xs font-semibold text-orange-400 uppercase tracking-widest">Benzersiz Degerler</span>
              </div>
              <ul className="space-y-1.5">
                {result.uniqueSellingPoints.map((u, i) => (
                  <li key={i} className="text-xs text-gray-300 flex gap-2">
                    <span className="text-orange-500 shrink-0">★</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SEO Keywords + Target */}
          <div className="grid grid-cols-1 gap-3">
            {result.seoKeywords?.length > 0 && (
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">SEO Anahtar Kelimeler</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.seoKeywords.map((kw) => (
                    <span key={kw} className="text-xs bg-blue-900/40 text-blue-300 border border-blue-700/40 px-2 py-0.5 rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
            )}
            {result.targetAudience && (
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={13} className="text-blue-400" />
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Hedef Kitle</span>
                </div>
                <p className="text-xs text-gray-300">{result.targetAudience}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          {result.callToAction && (
            <div className="bg-green-900/20 border border-green-700/40 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap size={13} className="text-green-400" />
                  <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Cagri-Eylem</span>
                </div>
                <CopyButton text={result.callToAction} field="cta" />
              </div>
              <p className="text-white font-semibold text-sm">{result.callToAction}</p>
            </div>
          )}

          {/* Copy All */}
          <button
            onClick={() => copyToClipboard(
              `${result.title}\n\n${result.shortDescription}\n\n${result.fullDescription}\n\n${result.bulletPoints?.map(b => `• ${b}`).join('\n')}\n\n${result.callToAction}`,
              'all'
            )}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-all text-sm"
          >
            {copiedField === 'all' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            {copiedField === 'all' ? 'Kopyalandi!' : 'Tamamini Kopyala'}
          </button>
        </div>
      )}
    </div>
  );
}
