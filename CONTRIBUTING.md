# Contributing to ICRT (India Corporate Renewables Terminal)

Thank you for your interest in contributing to the **India Corporate Renewables Terminal (ICRT)**! We welcome contributions from developers, quantitative analysts, sustainability researchers, and financial data engineers.

---

## 🧭 Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating.

---

## 🚀 How Can You Contribute?

You can contribute to ICRT in several ways:
1. **Expanding Corporate Clean Energy Datasets**: Adding updated BRSR (Business Responsibility and Sustainability Reporting) energy disclosures for Indian listed companies.
2. **Improving UI / UX Components**: Refining animations, responsive layouts, accessibility (a11y), and chart visualizer performance.
3. **Backend & API Enhancements**: Adding new analytical endpoints, caching layers, or database indexing.
4. **Data Verification & Bug Fixes**: Reporting or correcting financial metrics, P/E ratios, or renewable capacity metrics.
5. **Documentation**: Enhancing guides, mathematical models, and API documentation.

---

## 🛠️ Development Workflow

### 1. Fork & Clone the Repository
```bash
git clone https://github.com/princebavishi/ICRT-India-Corporate-Renewables-Terminal.git
cd ICRT-India-Corporate-Renewables-Terminal
```

### 2. Set Up the Backend (Python & FastAPI)
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python server.py
```
Backend API will be available at `http://127.0.0.1:8000`.

### 3. Set Up the Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
Frontend development server will launch at `http://localhost:5173`.

---

## 🌿 Branching Conventions

- `feature/your-feature-name` — for new features and UI components
- `fix/issue-description` — for bug fixes and data corrections
- `docs/doc-update` — for documentation improvements
- `perf/optimization` — for performance improvements

---

## 📝 Commit Guidelines

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add carbon offset calculation card`
- `fix: resolve mobile overflow in directory table`
- `docs: update API documentation for /api/stocks`
- `style: refine typography and card border radius`
- `refactor: optimize scatter chart hover rendering`

---

## 📬 Pull Request Process

1. Ensure your code compiles cleanly without errors (`npm run build` in `frontend/`).
2. Update the README or relevant documentation if your change introduces new features or endpoints.
3. Push your branch to your fork and submit a Pull Request to `main`.
4. Fill out the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) detailing the changes and verification steps.
