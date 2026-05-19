<div align="center">

# 🛍️ E-Commerce AI Suite

### AI-Powered E-Commerce Platform for Turkish Market

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-26Layer_AI-blue?style=for-the-badge)](https://26-layer-ecommerce-ai-x81b.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Edge_Functions-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![BTK Hackathon](https://img.shields.io/badge/BTK_Hackathon-2026-orange?style=for-the-badge)](https://btkakademi.gov.tr/)

<br/>

**Built by [26.Layer](https://github.com/26-layer) · BTK Hackathon '26**

</div>

---

## 📖 English

### About

**E-Commerce AI Suite** is an intelligent platform powered by Google Gemini AI, designed specifically for the Turkish e-commerce ecosystem. It brings together three powerful AI modules — **Product Assistant**, **Review Analyzer**, and **Description Generator** — into a sleek, mobile-first interface.

Whether you're a buyer looking for the perfect product, a seller wanting to improve your listing, or a brand owner aiming to understand customer sentiment, this suite has you covered.

### ✨ Features

#### 🛒 Product Assistant
- Natural language product search in Turkish
- Returns up to 3 tailored product recommendations
- Shows price range, pros/cons, star rating, best use case, and available platforms
- Includes shopping tips and an AI summary
- Expandable cards with price/performance insights

#### ⭐ Review Analyzer
- Analyzes customer reviews for any product
- Outputs a satisfaction score (0–100) and sentiment classification
- Displays positive/negative highlights, suitable buyer profiles, and dimension scores (quality, price-performance, delivery, satisfaction)
- Personalized advice for both buyers and sellers
- Top keyword extraction

#### ✍️ Description Generator
- Generates SEO-optimized product descriptions for Turkish e-commerce platforms
- Supports 4 writing tones: Professional, Friendly, Premium, Energetic
- Targets major platforms: Trendyol, Hepsiburada, Amazon TR, N11
- Outputs title, short & full descriptions, bullet points, technical specs, CTA, SEO keywords, target audience, and unique selling points
- One-click copy for each content block

### 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Lucide React |
| AI Engine | Google Gemini 2.5 Flash (with fallback chain) |
| Backend | Supabase Edge Functions (Deno) |
| Database | Supabase PostgreSQL + Row Level Security |
| Deployment | Vercel |

### 🚀 Getting Started

#### Prerequisites
- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key (free tier works)
- A [Supabase](https://supabase.com/) project (optional — for production backend)

#### Installation

```bash
# Clone the repo
git clone https://github.com/26-layer/26-layer-ecommerce-ai.git
cd 26-layer-ecommerce-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

#### Environment Variables

Edit `.env` with your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key

# Optional: pin to a specific Gemini model
# VITE_GEMINI_MODEL=gemini-2.5-flash
```

> **Note:** If `VITE_GEMINI_API_KEY` is set, the app calls Gemini directly from the browser. Otherwise, it routes requests through the Supabase Edge Function for production use.

#### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Supabase Setup (Optional)

```bash
# Apply database migrations
supabase db push

# Deploy the edge function
supabase functions deploy ecommerce-ai

# Set the Gemini API key as a secret
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

### 🗄️ Database Schema

```sql
-- Stores all AI query history for analytics
CREATE TABLE ai_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL DEFAULT '',
  module text NOT NULL DEFAULT 'product_assistant',
  input text NOT NULL DEFAULT '',
  output jsonb,
  created_at timestamptz DEFAULT now()
);

-- Tracks product search queries for trending analysis
CREATE TABLE product_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL DEFAULT '',
  budget text DEFAULT '',
  category text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
```

RLS is enabled on all tables. Anonymous inserts are allowed; no unauthenticated reads (privacy by design).

### 🤖 AI Architecture

The app uses a **Gemini model fallback chain**:

```
gemini-2.5-flash → gemini-2.0-flash-lite → gemini-1.5-flash
```

If a model hits a quota limit (429) or is unavailable (404), the next one is tried automatically. All prompts are structured to return **strict JSON** — no markdown, no preambles — with Turkish text values and English JSON keys.

### 📁 Project Structure

```
src/
├── App.tsx                      # Main layout, tabs, stats
├── components/
│   ├── ProductAssistant.tsx      # 🛒 Product recommendation module
│   ├── ReviewAnalyzer.tsx        # ⭐ Review analysis module
│   └── DescriptionGenerator.tsx  # ✍️ Description generation module
├── lib/
│   ├── gemini.ts                 # Gemini API client with fallback
│   ├── prompts.ts                # Structured prompts for each module
│   ├── parseResponse.ts          # AI response parser & validator
│   └── supabase.ts               # Supabase client + callAI router
supabase/
├── functions/ecommerce-ai/       # Deno edge function
└── migrations/                   # PostgreSQL schema
```

### 🌐 Live Demo

👉 **[https://26-layer-ecommerce-ai-x81b.vercel.app/](https://26-layer-ecommerce-ai-x81b.vercel.app/)**

### 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---
---

## 📖 Türkçe

### Hakkında

**E-Commerce AI Suite**, Türkiye'nin e-ticaret ekosistemine özel olarak geliştirilen, Google Gemini AI destekli akıllı bir platformdur. **Ürün Asistanı**, **Yorum Analizi** ve **Açıklama Üretici** olmak üzere üç güçlü yapay zeka modülünü şık, mobil öncelikli bir arayüzde bir araya getirir.

Mükemmel ürünü arayan bir alıcı, listesini geliştirmek isteyen bir satıcı veya müşteri yorumlarını anlamak isteyen bir marka sahibi olsanız da bu platform ihtiyacınızı karşılar.

### ✨ Özellikler

#### 🛒 Ürün Asistanı
- Türkçe doğal dil ile ürün arama
- Bütçe ve kullanım amacına göre 3 kişiselleştirilmiş ürün önerisi
- Fiyat aralığı, artılar/eksiler, yıldız puanı, en uygun kullanım senaryosu ve platform bilgisi
- Alışveriş ipuçları ve AI özeti
- Fiyat/performans analizi içeren genişletilebilir ürün kartları

#### ⭐ Yorum Analizi
- Herhangi bir ürün için müşteri yorumlarını analiz eder
- Memnuniyet skoru (0–100) ve duygu sınıflandırması üretir
- Pozitif/negatif öne çıkanlar, uygun alıcı profilleri ve boyutsal skorlar (kalite, fiyat/performans, teslimat, memnuniyet)
- Alıcı ve satıcı için kişiselleştirilmiş tavsiyeler
- Anahtar kelime çıkarımı

#### ✍️ Açıklama Üretici
- Türk e-ticaret platformları için SEO uyumlu ürün açıklamaları üretir
- 4 farklı yazım tonu: Profesyonel, Samimi, Premium, Genç & Enerjik
- Trendyol, Hepsiburada, Amazon TR, N11 platformlarına özel optimizasyon
- Başlık, kısa ve tam açıklama, madde listesi, teknik özellikler, CTA, SEO anahtar kelimeleri, hedef kitle ve benzersiz satış noktaları
- Her içerik bloğu için tek tıkla kopyalama

### 🏗️ Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Stil | Tailwind CSS, Lucide React |
| Yapay Zeka | Google Gemini 2.5 Flash (yedek zincirle) |
| Backend | Supabase Edge Functions (Deno) |
| Veritabanı | Supabase PostgreSQL + Satır Düzeyi Güvenlik |
| Deployment | Vercel |

### 🚀 Kurulum

#### Gereksinimler
- Node.js 18+
- [Google AI Studio](https://aistudio.google.com/) API anahtarı (ücretsiz kullanım yeterli)
- [Supabase](https://supabase.com/) projesi (isteğe bağlı — üretim backend'i için)

#### Kurulum Adımları

```bash
# Repoyu klonla
git clone https://github.com/26-layer/26-layer-ecommerce-ai.git
cd 26-layer-ecommerce-ai

# Bağımlılıkları yükle
npm install

# Ortam değişkenlerini ayarla
cp .env.example .env
```

#### Ortam Değişkenleri

`.env` dosyasını kendi bilgilerinizle doldurun:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key

# İsteğe bağlı: belirli bir Gemini modeline sabitle
# VITE_GEMINI_MODEL=gemini-2.5-flash
```

> **Not:** `VITE_GEMINI_API_KEY` tanımlanmışsa uygulama Gemini'yi doğrudan tarayıcıdan çağırır. Tanımlanmamışsa istekler üretim kullanımı için Supabase Edge Function üzerinden yönlendirilir.

#### Yerel Geliştirme

```bash
npm run dev
```

Tarayıcınızda [http://localhost:5173](http://localhost:5173) adresini açın.

#### Supabase Kurulumu (İsteğe Bağlı)

```bash
# Veritabanı migration'larını uygula
supabase db push

# Edge function'ı deploy et
supabase functions deploy ecommerce-ai

# Gemini API anahtarını secret olarak ayarla
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

### 🗄️ Veritabanı Şeması

```sql
-- Tüm AI sorgu geçmişini analitik için saklar
CREATE TABLE ai_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL DEFAULT '',
  module text NOT NULL DEFAULT 'product_assistant',
  input text NOT NULL DEFAULT '',
  output jsonb,
  created_at timestamptz DEFAULT now()
);

-- Trend analizi için ürün arama sorgularını izler
CREATE TABLE product_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL DEFAULT '',
  budget text DEFAULT '',
  category text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
```

Tüm tablolarda RLS etkindir. Anonim ekleme işlemlerine izin verilir; kimliği doğrulanmamış okuma yoktur (tasarım gereği gizlilik).

### 🤖 Yapay Zeka Mimarisi

Uygulama bir **Gemini model yedek zinciri** kullanır:

```
gemini-2.5-flash → gemini-2.0-flash-lite → gemini-1.5-flash
```

Bir model kota sınırına (429) ulaştığında veya kullanılamaz olduğunda (404) bir sonraki otomatik olarak denenir. Tüm promptlar **sıkı JSON** döndürecek şekilde yapılandırılmıştır — markdown veya başlangıç metni olmaksızın; metin değerleri Türkçe, JSON anahtarları İngilizce.

### 📁 Proje Yapısı

```
src/
├── App.tsx                      # Ana düzen, sekmeler, istatistikler
├── components/
│   ├── ProductAssistant.tsx      # 🛒 Ürün öneri modülü
│   ├── ReviewAnalyzer.tsx        # ⭐ Yorum analizi modülü
│   └── DescriptionGenerator.tsx  # ✍️ Açıklama üretim modülü
├── lib/
│   ├── gemini.ts                 # Yedekli Gemini API istemcisi
│   ├── prompts.ts                # Her modül için yapılandırılmış promptlar
│   ├── parseResponse.ts          # AI yanıt ayrıştırıcısı ve doğrulayıcısı
│   └── supabase.ts               # Supabase istemcisi + callAI yönlendiricisi
supabase/
├── functions/ecommerce-ai/       # Deno edge function
└── migrations/                   # PostgreSQL şeması
```

### 🌐 Canlı Demo

👉 **[https://26-layer-ecommerce-ai-x81b.vercel.app/](https://26-layer-ecommerce-ai-x81b.vercel.app/)**

### 📄 Lisans

MIT Lisansı. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

<div align="center">

Powered by **Gemini AI** · Built with ❤️ by **26.Layer** · **BTK Hackathon '26**

</div>
