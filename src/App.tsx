import { useState } from 'react';
import { ShoppingBag, Star, PenLine, Zap, BarChart2, TrendingUp, Store, Users } from 'lucide-react';
import ProductAssistant from './components/ProductAssistant';
import ReviewAnalyzer from './components/ReviewAnalyzer';
import DescriptionGenerator from './components/DescriptionGenerator';

type Tab = 'product' | 'review' | 'description';

const TABS = [
  {
    id: 'product' as Tab,
    label: 'Urun Asistani',
    sublabel: 'Dogal dille urun onerisi',
    icon: ShoppingBag,
    gradient: 'from-blue-600 to-blue-500',
  },
  {
    id: 'review' as Tab,
    label: 'Yorum Analizi',
    sublabel: 'Duygu & ozet analizi',
    icon: Star,
    gradient: 'from-teal-600 to-teal-500',
  },
  {
    id: 'description' as Tab,
    label: 'Aciklama Uretici',
    sublabel: 'SEO uyumlu icerik',
    icon: PenLine,
    gradient: 'from-orange-600 to-orange-500',
  },
];

const STATS = [
  { label: 'AI Destekli', value: '3 Modul', icon: Zap },
  { label: 'Analiz Suresi', value: '< 5 sn', icon: BarChart2 },
  { label: 'Buyuyen Pazar', value: 'Turkiye', icon: TrendingUp },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('product');
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-teal-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-orange-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md mx-auto px-4 py-8 pb-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <Store size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              <span className="text-white">E-Commerce </span>
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">AI Suite</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm">E-Ticaret Odakli Yapay Zeka Platformu</p>

          <div className="grid grid-cols-3 gap-2 mt-5">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 backdrop-blur">
                  <Icon size={14} className="text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-bold text-xs">{s.value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audience */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          <div className="flex items-center gap-1.5 bg-blue-900/30 border border-blue-700/40 rounded-full px-3 py-1.5">
            <Users size={11} className="text-blue-400" />
            <span className="text-xs text-blue-300">Alicilar</span>
          </div>
          <div className="flex items-center gap-1.5 bg-teal-900/30 border border-teal-700/40 rounded-full px-3 py-1.5">
            <Store size={11} className="text-teal-400" />
            <span className="text-xs text-teal-300">Saticilar</span>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-900/30 border border-orange-700/40 rounded-full px-3 py-1.5">
            <BarChart2 size={11} className="text-orange-400" />
            <span className="text-xs text-orange-300">Marka Sahipleri</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-1.5 mb-6 backdrop-blur">
          <div className="grid grid-cols-3 gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl p-2.5 transition-all duration-200 text-center ${
                    isActive
                      ? `bg-gradient-to-b ${tab.gradient} shadow-lg text-white`
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon size={16} className="mx-auto mb-1" />
                  <div className="text-xs font-semibold leading-tight">{tab.label}</div>
                  <div className={`text-xs mt-0.5 leading-tight ${isActive ? 'text-white/70' : 'text-gray-600'}`}>
                    {tab.sublabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="relative">
          <div
            className={`absolute -inset-px rounded-2xl bg-gradient-to-b ${currentTab.gradient} opacity-20 blur-sm pointer-events-none`}
          />
          <div className="relative bg-gray-900/80 border border-gray-700/50 rounded-2xl p-5 backdrop-blur">
            {activeTab === 'product' && <ProductAssistant />}
            {activeTab === 'review' && <ReviewAnalyzer />}
            {activeTab === 'description' && <DescriptionGenerator />}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-600">
            Powered by <span className="text-gray-500">Gemini AI</span> &middot; 26.Layer &middot;{' '}
            <span className="text-gray-500">BTK Hackathon&apos;26</span>
          </p>
        </div>
      </div>
    </div>
  );
}
