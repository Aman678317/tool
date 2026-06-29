# ColorVision AI

ColorVision AI is a modern, production-quality local web application that analyzes an uploaded image pixel by pixel and calculates the exact color composition across 11 standard color categories.

## Features
- **Accurate Pixel Analysis:** Processes raw RGB pixels and converts them to HSV for robust categorization.
- **Auto Demo Mode:** Try the application instantly with built-in placeholder images (Mona Lisa, Flowers, Colorful Village, Van Gogh Landscape).
- **Responsive Dashboard:** Beautiful UI featuring glassmorphism, Recharts, and Framer Motion.
- **Export Options:** Download results as JSON, CSV, or a PNG snapshot of the dashboard.
- **AI Insights:** Optional integration with Gemini 2.5 Flash for natural-language analysis.

## Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS v4, TypeScript, Recharts, Lucide Icons
- **Backend:** Node.js, Express, TypeScript, Sharp (for image buffer processing), Multer

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository and install dependencies for both frontend and backend:

\`\`\`bash
# Install frontend dependencies
npm install

# Setup backend
cd server
npm install
\`\`\`

2. Start the Backend API (runs on port 5000):
\`\`\`bash
cd server
npm run dev
\`\`\`

3. Start the Frontend (runs on Vite's default port, e.g., 5173):
\`\`\`bash
npm run dev
\`\`\`

### Testing with Images
The application automatically includes 4 test images in \`/public/test-images/\`. Simply click the "Auto Demo" tab on the frontend to process them all automatically or individually.

### Optional AI Insights
To enable Gemini natural-language insights:
1. Open \`server/.env\`
2. Add your API key: \`GEMINI_API_KEY=your_key_here\`
3. Restart the backend.

If no API key is provided, the application will simply skip AI insights and operate normally.
