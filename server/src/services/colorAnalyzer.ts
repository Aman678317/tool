import sharp from 'sharp';
import { rgbToHsv, classifyColor } from '../utils/colorMapping';

export interface ColorResult {
  name: string;
  pixels: number;
  percentage: number;
}

export interface AnalysisResponse {
  colors: ColorResult[];
  dominantColor: string;
  totalPixels: number;
}

export async function analyzeImage(buffer: Buffer): Promise<AnalysisResponse> {
  // Resize to a maximum of 400x400 to speed up processing while keeping decent accuracy
  const { data, info } = await sharp(buffer)
    .resize({ width: 400, height: 400, fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const totalPixels = info.width * info.height;
  const channels = info.channels;
  
  const colorCounts: Record<string, number> = {
    White: 0, Black: 0, Gray: 0, Red: 0, Green: 0,
    Blue: 0, Yellow: 0, Orange: 0, Brown: 0, Pink: 0, Purple: 0
  };

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Ignore transparent pixels if there's an alpha channel
    if (channels === 4 && data[i + 3] === 0) {
      continue; 
    }

    const hsv = rgbToHsv(r, g, b);
    const colorCategory = classifyColor(hsv.h, hsv.s, hsv.v);
    colorCounts[colorCategory]++;
  }

  const colorsList: ColorResult[] = [];
  let dominantColor = 'White';
  let maxPixels = 0;

  for (const [name, pixels] of Object.entries(colorCounts)) {
    if (pixels > 0) {
      if (pixels > maxPixels) {
        maxPixels = pixels;
        dominantColor = name;
      }
      colorsList.push({
        name,
        pixels,
        percentage: Number(((pixels / totalPixels) * 100).toFixed(2))
      });
    }
  }

  // Sort by percentage descending
  colorsList.sort((a, b) => b.percentage - a.percentage);

  return {
    colors: colorsList,
    dominantColor,
    totalPixels
  };
}
