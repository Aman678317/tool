# Product Requirements Document (PRD)

## 1. Product Overview
**Name:** ColorVision AI
**Purpose:** A modern web application that analyzes uploaded images pixel-by-pixel to calculate the exact percentage distribution of colors.
**Target Audience:** Designers, artists, researchers, and developers who need robust color analysis.

## 2. Features
- Drag & Drop Image Upload (PNG, JPEG, WEBP)
- Image Preview with file stats (Resolution, Size)
- Pixel-by-pixel Analysis using Sharp (Node.js) and custom HSV mapping.
- Data Visualization (Recharts Pie & Bar charts)
- Auto Demo Mode (analyze bundled test images automatically)
- Optional Gemini 2.5 Flash AI insight generation.
- Data export (CSV, JSON, PNG)

## 3. Architecture
- **Frontend:** React 19 + Vite + Tailwind v4
- **Backend:** Express API
- **Processing:** `sharp` resizes the image down to max 400x400 to maintain high performance while retaining accurate color averages. The raw pixel buffer is iterated, calculating HSV mathematically.
