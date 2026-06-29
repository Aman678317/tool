import { Request, Response } from 'express';
import { analyzeImage } from '../services/colorAnalyzer';
import { generateInsights } from '../services/geminiService';

export const analyzeImageController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Empty upload' });
      return;
    }

    // Process image
    const analysisResult = await analyzeImage(req.file.buffer);

    // Optional AI insights
    const aiInsight = await generateInsights(analysisResult.colors, analysisResult.dominantColor);

    res.json({
      ...analysisResult,
      aiInsight
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
};
