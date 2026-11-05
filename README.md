# DAWARE OPTICIANS — Optical Store Management System

A full-stack boutique optical store management portal engineered for **DAWARE OPTICIANS** (Store Owner & Licensed Optometrist: **Shruti Daware**).

Connected directly to a live **MySQL** database (`daware_opticals`) via a **Python FastAPI** REST backend, paired with a modern **React + Vite + Tailwind CSS** dashboard.

---

## 🎨 Design System & Color Palette

- **Deep Graphite** (`#16191E` / `#23272F`): Sidebar, headers, primary buttons, borders, and typography.
- **Soft White** (`#F8F9FA`): Glare-free canvas with crisp elevated white cards (`#FFFFFF`).
- **Sunshine Yellow** (`#FACC15`): Official **DAWARE OPTICIANS** brand mark, "+ Create New Bill" CTA, active indicator bars, and focus outlines.

---

## 🔒 Security & Authentication

- Dedicated store owner authentication gate.
- Single authorized administrator: **Shruti Daware** (`shrutidaware06`).
- Session persistence with quick Sign Out controls in the top bar and sidebar.
- Zero hardcoded secrets: database credentials are configured strictly via environment variables.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy, PyMySQL, Uvicorn, Pydantic |
| **Database** | MySQL Server (`daware_opticals` schema across 12 operational tables) |

---

## 📋 Comprehensive Store Modules

1. **Store Overview**: Real-time sales KPIs, dues collection watchlist, low-stock reorder alerts, and recent bills.
2. **Customers & Patients**: Directory synced directly with MySQL customer records, purchase tracking, and contact logs.
3. **Inventory Management**: Designer frames, lenses, sunglasses, real-time stock levels, and automated reorder badges.
4. **Prescriptions (Rx)**: OD/OS refraction parameters (SPH, CYL, Axis, ADD, PD) and printable prescription slips.
5. **Sales & Billing (POS)**: Multi-item invoice generation, balance due calculations, and printable tax receipts.
6. **Payments & Dues**: Partial and full payment receipts, UPI/Card/Cash ledger, and real-time dues tracking.
7. **Suppliers & Vendors**: Eyewear distributors and distributor contact records.
8. **Repairs & Workshop**: Workshop service jobs, lens fitting, and repair status pipeline.
9. **Appointments**: Scheduled vision screenings and fitting sessions.
10. **Business Reports**: Store analytics, category breakdowns, and data export.
11. **Store Settings**: GST details, clinic configuration, and store location information.

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MySQL Server (with `daware_opticals` database loaded)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure your environment variables
# Copy .env.example to .env and configure your MySQL credentials:
cp .env.example .env

# Start FastAPI backend server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be accessible at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
# Navigate to the root directory
cd ..

# Install NPM dependencies
npm install

# Start Vite development server
npm run dev
```
The application will launch at: `http://localhost:3000`

---

## 🛡️ License & Privacy
Internal store management system. Confidential & proprietary to **DAWARE OPTICIANS**. All rights reserved.
