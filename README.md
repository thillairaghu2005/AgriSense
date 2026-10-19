# AgriSense 🌱

> **AgriSense** is a modern, responsive, and multilingual digital farming assistant web application designed to empower Indian farmers with smart crop recommendations, advisory, market trends, weather insights, and agricultural knowledge.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌾 Overview

**AgriSense** provides accessible, localized, and practical agricultural guidance tailored to Indian farming contexts. Built with a clean mobile-first design, it brings together critical farm management modules—from soil health and weather forecasts to mandi prices and government schemes—into an intuitive, accessible dashboard.

---

## ✨ Key Features

- **🌾 Crop Recommendation & Catalogue:** Smart crop suitability matching based on soil type, water availability, region, and season with comprehensive crop growing guides.
- **🌤️ Weather & Farming Advisory:** Multi-day forecasts, rainfall predictions, spray/irrigation feasibility warnings, and extreme weather alerts.
- **📈 Mandi Market Prices:** Commodity price tracking across state/district mandis with trends, price variations, and MSP comparison.
- **🧪 Soil Health Card & NPK Guidance:** Soil testing interpretation, N-P-K nutrient status indicators, and personalized fertilizer balance advice.
- **🔍 Pest & Disease Diagnosis:** Interactive symptom-based diagnosis guide with preventive cultural practices and integrated pest management (IPM) recommendations.
- **🏛️ Government Schemes Directory:** Curated catalog of central and state agricultural subsidies, insurance schemes (e.g. PM-KISAN, PMFBY), eligibility criteria, and application links.
- **💰 Farm Finance & Expense Tracker:** Local expense and income tracker to monitor input costs (seeds, fertilizers, labor) and harvest revenues.
- **📅 Crop Activity Calendar:** Seasonal schedule and reminder system for sowing, weeding, fertilization, and harvesting milestones.
- **🤖 Agri AI Assistant:** Farmer-friendly interactive advisory chatbot for answering common agronomy and crop management queries.
- **🌐 Multilingual Support:** Built-in localization support for Indian languages (**English, हिन्दी, தமிழ், తెలుగు, मराठी**).
- **📱 PWA & Offline Support:** Lightweight Progressive Web App with offline service worker caching for reliable low-connectivity field usage.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Visualizations & Charts:** [Recharts](https://recharts.org/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Linting:** [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18+ recommended) and `npm` installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thillairaghu2005/AgriSense.git
   cd AgriSense
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server with HMR. |
| `npm run build` | Type-checks code and builds optimized production bundles. |
| `npm run preview` | Previews the production build locally. |
| `npm run test` | Executes unit tests with Vitest. |
| `npm run lint` | Runs fast Oxlint checks across the codebase. |

---

## 📂 Project Structure

```text
agrisense/
├── public/                 # Static assets, icons, manifest, service worker
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── app/                # App wrapper, routing, context providers
│   ├── assets/             # Images, graphics, illustrations
│   ├── components/         # Reusable UI, layout, feedback, and form components
│   ├── data/               # Regional crops, mandis, weather, schemes, translations
│   │   └── translations/   # en, hi, ta, te, mr locales
│   ├── features/           # Module-based feature views
│   │   ├── assistant/      # AI Agricultural Chatbot
│   │   ├── calendar/       # Crop Seasonal Calendar
│   │   ├── crops/          # Crop Catalogue & Details
│   │   ├── dashboard/      # Primary Farmer Dashboard
│   │   ├── finances/       # Revenue & Cost Ledger
│   │   ├── knowledge/      # Agronomy Articles & Guides
│   │   ├── market/         # Mandi Prices & Trends
│   │   ├── pests-diseases/ # Diagnosis & Protection
│   │   ├── recommendations/# Crop Advisory Engine
│   │   ├── schemes/        # Government Schemes
│   │   ├── soil/           # Soil Testing & NPK Advisory
│   │   └── weather/        # Weather Forecasts & Alerts
│   ├── lib/                # Utilities, storage helpers, recommendation rules
│   ├── styles/             # Global CSS and Tailwind definitions
│   └── types/              # TypeScript interface definitions
├── package.json
└── vite.config.ts
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
