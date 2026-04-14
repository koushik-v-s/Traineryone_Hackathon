<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2hpMWIzMTcxNmFqOTAzbXo0ZjF0cXZoeGtzNmJ1NXRjcWQwbGNveiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9zjR4Rk1290/giphy.gif" alt="Hero Animation" width="100%" style="border-radius:20px"/>

  <br />
  <br />

  <h1>🚀 TraineryOne Employee Dashboard 🚀</h1>

  **A Next-Generation, Production-Ready Workforce Analytics Platform**  
  *Built with extreme performance, deep insights, and a breathtaking full-screen UI.*

  <p align="center">
    <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="react" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="ts" />
    <img src="https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="tailwind" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="prisma" />
    <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="sqlite" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="express" />
  </p>
</div>

<br/>

## ☄️ Overview

TraineryOne Dashboard is a state-of-the-art enterprise analytics platform designed for immediate, zero-configuration local deployment. It elegantly tracks workforce demographics, calculates percentile compensation, maps employee learning journeys, and aggregates company performance. 

Gone are the days of sterile enterprise software. The dashboard is powered by a **dynamic `LiquidEther` WebGL-like canvas** that fluidly reacts to user mouse movements natively, complete with bespoke CSS rotating `ElectricBorders`.

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com/?font=Inter&weight=600&size=24&pause=1000&color=06B6D4&center=true&vCenter=true&width=800&lines=Zero-Configuration+Deployment;Lightning+Fast+API+with+Express+%2B+Prisma;Beautiful+Recharts+Visualizations;Reactive+Metaball+Layout" alt="Typing SVG" />
</p>

---

## ✨ Features

- 🌌 **Immersive UI/UX**: Custom `LiquidEther` animated background and rotating `ElectricBorder` widgets that dynamically resize to fill empty spaces structurally using CSS Grid layout mechanics.
- 📊 **Advanced Analytics**: Pre-configured aggregations calculating Top Performers, Department Compensations (Max, Min, Avg), Course completions by Topic, and Location demographics.
- 🚀 **Zero-Config Database**: Shipped entirely with an embedded **SQLite** database via Prisma. *No Postgres URLs, no server credentials required to run locally!*
- ⚡ **Type-Safe Fullstack**: End-to-end type safety using TypeScript strictly typed interfaces synced with the Prisma Schema and React Query (`verbatimModuleSyntax: true` compliant).

## 🗂️ Architecture details

1. **Frontend**: Vite (`port: 5173`) serving React 18, utilizing the brand new Tailwind V4 engine using inline `@theme` directives instead of hefty config files. Recharts handles SVGs.
2. **Backend**: Express.js server (`port: 3001`). Takes raw stringified SQLite JSON arrays and natively maps them via `JSON.parse()` for seamless schema bypasses. Prisma natively handles `.groupBy()` query functions.
3. **Database**: SQLite `dev.db`. Seeded procedurally with 55 mock enterprise users across multiple locations, titles, and backgrounds seamlessly.

---

## 🌐 API Documentation

The Express backend exposes several aggregated metric endpoints available at `http://localhost:3001/api`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/employees` | `GET` | Paginated list of all employees (supports `?page` and `?limit`) |
| `/api/stats/performance-distribution` | `GET` | Aggregated employee counts mapped to performance score brackets |
| `/api/stats/employees-by-location` | `GET` | Headcount breakdown sorted by office location |
| `/api/stats/employees-by-job-title` | `GET` | Headcount sorted by specific job titles |
| `/api/stats/learning-journey` | `GET` | Matrix mapping of employees to training course completions |
| `/api/stats/compensation-by-department` | `GET` | Max, Min, and Average salary groupings by department |
| `/api/stats/performance-vs-compensation` | `GET` | Raw dataset for rendering compensation & performance scatter plots |
| `/api/stats/top-performers` | `GET` | Returns the absolute top 10 ranked employees globally |

---

## 🛠️ Quick Start Guide

You are 4 commands away from running this entire platform!

### 1. Install Dependencies
```bash
# Terminal 1 - Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# Terminal 2 - Frontend
cd frontend
npm install
```

### 2. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Open Application
Navigate your browser to `http://localhost:5173` to see it in action!

---

<div align="center">
  <i>Developed with 🧠 by <a href="https://github.com/koushik-v-s">KOUSHIK V S</a> for the Hackathon</i>
</div>
