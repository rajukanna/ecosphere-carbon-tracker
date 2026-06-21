# 🌲 EcoSphere: Carbon Footprint Tracker & Reduction Advisor

> ### 🌐 [Live Web App on Google Cloud Platform](https://ecosphere-rajukanna.storage.googleapis.com/index.html)

EcoSphere is a premium, high-fidelity single-page web application built with **React, TypeScript, and Vite**. It helps individuals track, understand, and reduce their carbon footprint through scientific metrics, gamified habits, and interactive trip comparisons.

---

## 🎯 Chosen Vertical

This project is designed under the **Personal Sustainability & Individual Climate Action** vertical. The goal is to demystify carbon footprints by translating raw, abstract greenhouse gas metrics into a visually compelling, action-oriented dashboard that guides users toward a sustainable lifestyle.

---

## 💡 Approach and Logic

We address individual carbon reduction through a three-stage loop: **Track, Optimize, and Balance**:

1.  **Dynamic Activity Logging**:
    *   *Transportation*: Captures fuel types (gasoline, diesel, hybrid, electric), flights, and public transit mileage.
    *   *Energy*: Evaluates grid consumption (kWh) offset by a slider-controlled clean energy tariff share.
    *   *Diet*: Accounts for red meat frequency, food-miles (locally sourced share), and food waste penalties.
    *   *Waste*: Models trash bag weight, recycling rates, and aerobic composting credits.
2.  **Context-Aware Action Guidance**:
    *   *Travel Route Planner*: Displays side-by-side carbon impact graphs for travel corridors to encourage cleaner transits.
    *   *AI Eco-Advisor Chatbot*: Offers instant, contextual tips on key topics (e.g. phantom electricity load, local diets).
    *   *Habit Challenges*: Encourages joining gamified "Quests" (e.g. cold-water washing, plant-based week) with clear carbon-saving points.
3.  **Simulated Neutrality (Offsetting)**:
    *   *Offset Marketplace*: Showcases certified projects (reforestation, wind farms, blue carbon mangroves) where users simulate purchasing offset credits to lower their net footprint score to zero.

---

## ⚙️ How the Solution Works

```mermaid
graph TD
    User([User Actions]) -->|Log Activity| Tracker[Activity Tracker Form]
    User -->|Choose Route| Planner[Travel Route Planner]
    User -->|Simulate Offsetting| OffsetMarket[Offset Marketplace]
    User -->|Accept Quests| Challenges[Eco Challenges]
    User -->|Ask Advice| AIAdvisor[AI Eco-Advisor Chatbot]

    Tracker -->|Category Inputs| Formulae[Carbon Calculators]
    Formulae -->|Update Metrics| LocalStorage[(LocalStorage Sync)]
    
    LocalStorage -->|Sync Gross Score| Dashboard[Dashboard KPI Gauges]
    OffsetMarket -->|Deduct Carbon Credits| Dashboard
    
    Dashboard -->|Annual Projections| Reports[History & Exporter]
    Reports -->|Ctrl + P| PDF[PDF Audit Ledger]
    
    style User fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff
    style Dashboard fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style LocalStorage fill:#1f2937,stroke:#374151,stroke-width:2px,color:#94a3b8
```

1.  **Dashboard Gauges**: Real-time monthly gross and net footprint indicators comparing current stats against the Paris Agreement recommended threshold (~167 kg CO₂/month).
2.  **State-Driven Tab Routing**: The application handles page navigations client-side through local React state (`activeTab`), preventing server round-trip delays and offering instant tab switches.
3.  **Local Storage Synchronization**: All calculator parameters, active/completed challenges, and offset cart values are synced to browser `localStorage` automatically, enabling persistence without requiring user registration.
4.  **Print/Save Exporter**: Activates a print-friendly document stylesheet when the user clicks "Print/Save PDF" or presses `Ctrl + P`, exporting a clean, certificate-style carbon footprint ledger.

---

## 📌 Assumptions Made

1.  **Representative Emission Factors**: Custom calculation formulas use generalized national average proxies (e.g., standard gasoline car is modeled at `0.20 kg CO₂/km`, subways/public trains at `0.04 kg CO₂/km`, grid electricity at `0.38 kg/kWh`).
2.  **Linear Offsetting**: Supported offset credits are subtracted directly from the monthly gross footprint total to calculate the final net footprint.
3.  **Aviation Takeoff Constant**: Flight emissions are calculated at `150 kg CO₂/hour` plus a base takeoff/landing buffer of `50 kg` per trip to represent high landing-cycle fuel burns.
4.  **Composting Credit**: Aerobic composting is assumed to prevent anaerobic decay in landfills, reducing landfill-based emissions by `15%` when enabled.

---

## 📐 Carbon Calculation Models

| Category | Parameter | Emission Factor / Calculation |
| :--- | :--- | :--- |
| **Transportation** | Private Vehicle | Petrol: `0.20 kg/km`, Diesel: `0.18 kg/km`, Hybrid: `0.10 kg/km`, Electric (EV): `0.04 kg/km` |
| | Public Transit | Bus / Train: `0.04 kg/km` |
| | Aviation | Flights: `150 kg / flight hour` (distributed monthly) |
| **Home Energy** | Grid Electricity | `0.38 kg/kWh` (reduced by Clean Energy Tariff Share percentage) |
| | Natural Gas | `0.185 kg/kWh` |
| **Diet & Food** | Diet Type base | Heavy Meat: `210 kg/mo`, Medium Meat: `142 kg/mo`, Veg: `80 kg/mo`, Vegan: `40 kg/mo` |
| | Food Miles / Waste | Deducts up to `15%` for local sourcing; adds `10-25 kg` penalty for high food wastage |
| **Waste** | Household Trash | `1.5 kg CO₂` per kg of trash; credits up to `40%` for recycling; `15%` credit for composting |

---

## 🛠️ Installation & Local Setup

### System Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/rajukanna/ecosphere-carbon-tracker.git
    cd ecosphere-carbon-tracker
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    Open **[http://localhost:5173](http://localhost:5173)** in your browser.

4.  **Build for Production**:
    ```bash
    npm run build
    ```

---

## ☁️ Google Cloud Platform (GCP) Deployment

This project is deployed live on Google Cloud Storage (GCS) as a serverless static web application under Project ID `genai-apac-491916`:
1.  **Bucket Location**: `gs://ecosphere-rajukanna` (US Central).
2.  **Web Properties**: Main index file set to `index.html`.
3.  **Public Permissions**: Public read access configured using IAM policy binding (`allUsers` -> `roles/storage.objectViewer`).

For alternative container-based deployments, a `Dockerfile` and `nginx.conf` are provided at the root directory to deploy a lightweight Nginx web server on GCP Cloud Run.
