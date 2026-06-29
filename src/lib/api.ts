import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ColorData {
  name: string;
  pixels: number;
  percentage: number;
}

export interface AnalysisResponse {
  colors: ColorData[];
  dominantColor: string;
  totalPixels: number;
  aiInsight?: string | null;
}

export const analyzeImage = async (file: File): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axios.post<AnalysisResponse>(`${API_BASE_URL}/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
