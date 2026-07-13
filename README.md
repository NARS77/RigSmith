# ⚙️ Rigsmith — PC Rig Telemetry & Builder

A full-stack **PC Build Configuration & Telemetry Platform** that helps users design custom PC builds with real-time compatibility validation, performance benchmarking, price analytics, and affiliate monetization.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.x-092E20?logo=django&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Features

### Core Builder
- **Drag & Drop PC Builder** — Select CPU, Motherboard, RAM, GPU, PSU, and Case from a curated catalog
- **Real-Time Compatibility Engine** — Socket matching, RAM type validation, PSU wattage checks, case form-factor & GPU clearance verification
- **Virtual Assembly Blueprint** — Interactive SVG visualization showing components in a PC chassis layout
- **Smart Budget Assistant** — Budget slider, cost meter, and quick-load rig templates (Budget, Mid-Range, Ultimate)

### Performance & Analytics
- **FPS Performance Estimator** — Estimated frame rates at 1080p, 1440p, and 4K based on GPU/CPU selection
- **Bottleneck Calculator** — Detects CPU/GPU imbalances and provides optimization advice
- **Interactive Price Trend Charts** — 30-day simulated price history with hover tooltips
- **Price Drop Alerts** — Register email notifications for target price thresholds

### Community & Monetization
- **Community Showcase Feed** — Browse and share builds with the community
- **Rig Comparison Board** — Side-by-side comparison of up to 3 builds with FPS benchmarks and specs
- **Amazon Affiliate Integration** — "Buy Part" buttons with tracked affiliate clicks
- **Creator Analytics Dashboard** (Pro) — Commission tracking, top parts leaderboard, earnings chart
- **PDF Spec Sheet Export** (Pro) — Print-ready specification sheets

### Authentication & Pro System
- **User Registration & Login** — Token-based authentication (Django REST)
- **Pro Tier Upgrade** — Unlock advanced features (Analytics, PDF Export, Price Alerts, unlimited saves)
- **Build Persistence** — Save, load, update, and delete custom configurations

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite 6 |
| **Backend** | Django 5 + Django REST Framework |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Containerization** | Docker + Docker Compose |
| **Styling** | Vanilla CSS with CSS Custom Properties |
| **State Management** | React Context API |

---

## 📁 Project Structure

```
RIG_telemetry/
├── backend/                  # Django REST API
│   ├── compatibility/        # Parts models, serializers, views, compatibility engine
│   ├── pc_rig_project/       # Django project settings, URLs, WSGI
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── context/          # React Context (BuildContext)
│   │   ├── index.css         # Design system & global styles
│   │   └── main.jsx          # Entry point
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml        # Multi-container orchestration
└── .gitignore
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **Docker** (optional, for containerized setup)

### Quick Start (Docker)

```bash
docker-compose up --build
```

Frontend: `http://localhost:5173` | Backend API: `http://localhost:8000/api/`

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_parts     # Populate component catalog
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/catalog/` | Full parts catalog (CPUs, GPUs, etc.) |
| `GET/POST` | `/api/builds/` | List / create saved builds |
| `PUT/DELETE` | `/api/builds/:id/` | Update / delete a build |
| `GET` | `/api/prebuilts/` | Pre-configured rig templates |
| `GET` | `/api/showcase/` | Community showcase feed |
| `POST` | `/api/register/` | User registration |
| `POST` | `/api/login/` | User login (returns token) |
| `POST` | `/api/upgrade-pro/` | Upgrade to Pro tier |
| `POST` | `/api/affiliate-click/` | Track affiliate link clicks |
| `GET` | `/api/analytics/` | Creator analytics (Pro only) |
| `POST` | `/api/price-alerts/` | Register price drop alerts |

---

## 🎯 Key Technical Highlights

- **Zero-dependency compatibility engine** — Pure algorithmic validation across 5 hardware constraint rules
- **Deterministic FPS estimation** — GPU benchmark tier mapping with CPU bottleneck correction
- **SVG-based virtual blueprint** — Interactive, hover-synced PC assembly visualization
- **Token-based auth** — Stateless API authentication with Django REST Framework's TokenAuthentication
- **Affiliate tracking pipeline** — Click attribution with per-part commission analytics

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

Built with ❤️ as a full-stack portfolio project.
