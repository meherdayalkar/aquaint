# AQUAINT — AI Water Intelligence

> **Existing water systems tell users how much water they consumed. AQUAINT helps users understand what happened, why it happened, what they should do, and how much water they could save.**

$$\text{\bf Measure} \longrightarrow \text{\bf Understand} \longrightarrow \text{\bf Detect} \longrightarrow \text{\bf Explain} \longrightarrow \text{\bf Simulate} \longrightarrow \text{\bf Recommend} \longrightarrow \text{\bf Save}$$

---

## 🚀 How to Run the Project

### 1. Prerequisites
- **Node.js** (v18 or higher installed)
- **npm** (comes with Node.js)

### 2. Install Dependencies
Open your terminal inside the project directory (`AQUAINT`) and run:
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Open in Your Browser
Once the dev server starts, open your browser and navigate to:
```
http://localhost:5174/
```
*(or `http://localhost:5173/` depending on port availability).*

---

## 🔐 Authentication & Access Modes

AQUAINT provides both real cryptographic authentication and frictionless 1-click evaluation access:

### 1. ⚡ Hackathon Guest Demo Mode (Immediate 1-Click Entry)
Judges and evaluators do **not** need to register to test the application!
- Click **"Explore Demo"** or **"Continue as Guest"** on the login screen.
- Instantly explore all 6 demo scenarios, 24h consumption envelopes, What-If simulator toggles, Zone Matrix telemetry, and the 7-step guided tour.
- Clearly marked with a **GUEST DEMO MODE** banner.

### 2. 👤 Real User Authentication & Database
AQUAINT includes a real backend user model and session service (`data/users.json`):
- **Pre-configured Administrator:**
  - **Email:** `elena.vance@greenwood.edu`
  - **Password:** `Password123!`
  - **Role:** Chief Hydrologist
- **Registration Flow:**
  - Full Name, Email, Password, Confirm Password, and Campus Role.
  - Server-side PBKDF2 cryptographic hashing (SHA-512 with 100,000 iterations & 16-byte random salt).
  - Duplicate account prevention with clear validation alerts.
- **Personalized First-Time Onboarding:**
  - Automatically welcomes newly registered hydrologists and prompts them to take the 7-step guided tour.
- **Tour Persistence:**
  - Remembers whether an account or guest has completed or skipped the tour.
  - Doesn't repeatedly disrupt returning users.

---

## 🧭 Interactive 7-Step Guided Tour

Experience the full water intelligence pipeline step-by-step:
1. **Welcome to AQUAINT:** Introduction to AI-powered autonomous water intelligence.
2. **Water Intelligence Dashboard:** Measure total consumption against weather-adjusted dynamic budget caps.
3. **Telemetry & Hydraulic Envelope:** Diurnal confidence bands, actual vs. expected flow, and nocturnal baseflow breaches.
4. **Campus Zone Criticality Matrix:** Sector drill-downs, smart hydro-meters, pressure streams, and pipe integrity scores.
5. **AI Insights & Water-Waste Fingerprints:** Pattern classification of pipe leaks, tank overflows, and weather-blind irrigation.
6. **Digital Twin What-If Simulator:** Interactive intervention modeling, projected volume savings, $/mo cost recovery, kWh, and CO₂ reductions.
7. **Action Priority & Conservation:** Algorithmic maintenance ranking, one-click rapid plumbing squad dispatch, and ISO 50001 / LEED executive audit reports.

**Tour Controls & Features:**
- Previous & Next navigation.
- Element spotlight cutout halo targeting relevant UI components.
- Progress counter ("Step 3 of 7" with visual progress bar).
- Skip Tour anytime and Finish Tour with celebratory confetti.
- **Replay anytime** from the Sidebar ("Guided 7-Step Tour"), Header ("Tour" button), or Guest Banner!

---

## 🔍 AI Insight Transparency & Responsible AI

Every anomaly investigation card and modal clearly categorizes data into four distinct dimensions:
1. 📡 **Physical Sensor Telemetry:** Direct flow rate (e.g. 15.4 L/min) and static line pressure from smart meter node UID.
2. 🧠 **Model-Derived Inference:** Probabilistic pattern match with statistical confidence score (e.g. 94%), clearly presented as an algorithmic diagnosis rather than a certified certainty.
3. 📊 **Projected Resource Impact:** Estimated unmitigated volume loss (L/day) and monthly financial exposure ($/mo) calculated with local water tariffs.
4. 🔧 **Remediation & Field Protocol:** Exact shut-off valve code coordinates, field verification checklist, and rapid squad dispatch.

---

## 🌟 Key Features & Live Demo Guide

### 1. 🎛️ Hackathon Demo Bar (Top Bar)
Use the 1-click deterministic scenario injectors at the top of the screen:
- **🌿 Normal Baseline:** All 6 campus zones operating strictly within their expected diurnal envelopes.
- **🚨 Scenario 1: Block B Leak:** Injects a 15.4 L/min nocturnal baseflow (01:00 AM – 05:00 AM) while residential occupancy is at 3%.
- **🌧️ Scenario 2: Rain Over-Irrigation:** Sprinklers dispense 32.5 L/min during an 18.5 mm rainfall storm.
- **🌊 Scenario 3: Tank Overflow:** Rooftop tank float valve failure causing 48.0 L/min stormwater loss.
- **🚰 Scenario 4: Hostel Tap:** Stuck toilet flushometer / open faucet drawing 11.5 L/min for 4+ hours.
- **▶️ Start 7-Step Tour:** Launches the interactive 7-step onboarding walkthrough.

### 2. 🔍 Root-Cause AI & Water-Waste Fingerprints
- Click **"Root-Cause Details"** on any active anomaly card or on the red anomaly points on the 24h timeline.
- Inspect the **"Why is this happening?"** probabilistic diagnosis, physical evidence grounding, and isolation valve coordinates.
- Click **"Dispatch Maintenance Team"** to generate an immediate work order.

### 3. 🧪 Interactive What-If Simulator
- Switch to the **What-If Simulator** tab (or click *"Simulate Fix in What-If Engine"*).
- Toggle specific repairs (*"Fix Block B Leak"*, *"Pause Rain Irrigation"*, etc.) or adjust the irrigation schedule slider.
- See real-time projections for:
  - Daily & monthly litres saved
  - Financial utility bill savings ($\$ / \text{month}$)
  - Electrical pumping energy avoided ($\text{kWh}$)
  - Carbon emissions offset ($\text{kg CO}_2\text{e}$)
  - Simulated green dashed consumption curve overlay

### 4. 🏢 Zone Matrix
- Inspect individual sub-meters across **Block A**, **Block B**, **Block C**, **Central Lawns**, **Overhead Tank 2**, and **Hostel Wing North**.

### 5. 📄 Executive Briefing
- Click **"Briefing"** in the top navigation bar to generate an audit report with print and JSON export capabilities.

---

## 📂 Project Architecture

```
AQUAINT/
├── index.html                     # HTML5 entry with Plus Jakarta Sans & Outfit fonts
├── package.json                   # Project dependencies (React 19, Lucide, Confetti)
├── src/
│   ├── main.jsx                   # React entry point
│   ├── App.jsx                    # Core application layout & view coordinator
│   ├── index.css                  # Custom design tokens, glassmorphism, animations
│   ├── data/
│   │   └── mockData.js            # Smart-meter synthetic streams & normal baselines
│   ├── services/
│   │   └── aiEngine.js            # Baseline modeling, anomaly detection, fingerprinting, What-If simulation
│   └── components/
│       ├── Navbar.jsx             # Top bar with status pill & weather widget
│       ├── DemoControlBar.jsx     # Hackathon scenario switcher & auto tour
│       ├── KPICards.jsx           # Measured, Dynamic Budget, Waste, Savings cards
│       ├── ConsumptionChart.jsx   # 24-hour SVG telemetry chart with hover inspection
│       ├── FingerprintCard.jsx    # Water-Waste Fingerprint pattern card
│       ├── RootCauseModal.jsx     # Forensic root-cause modal (7-step pipeline)
│       ├── WhatIfSimulator.jsx    # Interactive predictive intervention sandbox
│       ├── ActionPriorityQueue.jsx# Multi-factor ranked priority queue
│       ├── ZoneMatrix.jsx         # 6-zone sub-meter matrix
│       ├── ExecutiveReportModal.jsx# Audit report with print & JSON download
│       └── WorkOrderToast.jsx     # Live maintenance ticket dispatch notification
```
