# Interview Notes & Presentation Script

## Technical Interview Explanation

**Interviewer:** Can you walk me through the architecture of ColorVision AI?
**Candidate:** Yes. ColorVision AI has a decoupled client-server architecture. The frontend is built with React 19 and Vite for an ultra-fast developer experience. It handles UI state, drag-and-drop mechanics, and renders D3-based charts using Recharts. 

When a user uploads an image, we send it via a `multipart/form-data` POST request to the Express Node.js backend. Rather than processing directly in the browser (which can freeze the main thread on large images), we delegate it to the backend. The backend uses the `sharp` library to immediately downsize the image to a manageable max boundary (e.g. 400x400) while keeping aspect ratio. This makes pixel iteration O(n) where n is max 160,000 pixels instead of tens of millions, keeping the response time under 100ms.

We then iterate over the raw pixel buffer, grab the R, G, B channels, convert them to HSV using a standard algorithm, and pass it through a rigid set of boundary rules to bucket it into one of the 11 base colors. 

**Interviewer:** How did you handle edge cases in color mapping?
**Candidate:** Pure RGB is very difficult to map linearly to human perception (like "Brown"). Converting to HSV (Hue, Saturation, Value) made this much easier. For example, White is just any Hue with very low Saturation and very high Value. Brown overlaps with Orange/Red in Hue, but has a distinctly lower Value. We accounted for these mathematical boundaries in `colorMapping.ts`.

## Presentation Script
"Welcome to ColorVision AI. Have you ever wondered exactly what colors make up the Mona Lisa? 
With ColorVision AI, you don't have to guess. Built on React and Node.js, we process every single pixel of an uploaded image.
Here in our Auto Demo mode, you can see how it performs instantly across multiple test cases. We extract a raw buffer, run an HSV mathematical translation, and give you a beautiful, exportable dashboard in seconds. 
And because we support Gemini AI, you can even get instant natural language insights describing the mood or setting based on the color palette."
