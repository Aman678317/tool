import { useState } from 'react';
import { Button } from './ui/button';
import { analyzeImage, AnalysisResponse } from '@/lib/api';
import { ResultsDashboard } from './ResultsDashboard';
import { Loader2, Play } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const DEMO_IMAGES = [
  { id: 1, name: 'Mona Lisa', path: '/test-images/TestImage1.jpg' },
  { id: 2, name: 'Flowers', path: '/test-images/TestImage2.jpg' },
  { id: 3, name: 'Colorful Village', path: '/test-images/TestImage3.jpg' },
  { id: 4, name: 'Van Gogh Landscape', path: '/test-images/TestImage4.jpg' }
];

interface DemoResult {
  image: typeof DEMO_IMAGES[0];
  result: AnalysisResponse;
}

export function AutoDemo() {
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [results, setResults] = useState<DemoResult[]>([]);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);

  const fetchImageAsFile = async (path: string, filename: string): Promise<File> => {
    const res = await fetch(path);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleAnalyze = async (img: typeof DEMO_IMAGES[0]) => {
    setLoadingIds(prev => [...prev, img.id]);
    try {
      const file = await fetchImageAsFile(img.path, img.name + '.jpg');
      const data = await analyzeImage(file);
      setResults(prev => {
        const existing = prev.filter(r => r.image.id !== img.id);
        return [...existing, { image: img, result: data }].sort((a, b) => a.image.id - b.image.id);
      });
    } catch (e) {
      console.error(`Failed to analyze ${img.name}`, e);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== img.id));
    }
  };

  const handleAnalyzeAll = async () => {
    setIsAnalyzingAll(true);
    for (const img of DEMO_IMAGES) {
      // Analyze one by one sequentially
      await handleAnalyze(img);
    }
    setIsAnalyzingAll(false);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Auto Demo Mode</h2>
        <Button onClick={handleAnalyzeAll} disabled={isAnalyzingAll || loadingIds.length > 0} className="gap-2">
          {isAnalyzingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Analyze All Images
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEMO_IMAGES.map((img) => (
          <Card key={img.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden bg-muted">
              <img src={img.path} alt={img.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-medium text-sm">{img.name}</span>
              <Button 
                size="sm" 
                variant="secondary"
                disabled={loadingIds.includes(img.id) || isAnalyzingAll}
                onClick={() => handleAnalyze(img)}
              >
                {loadingIds.includes(img.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analyze"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length > 0 && (
        <div className="space-y-16 mt-16 pt-8 border-t">
          <h2 className="text-3xl font-bold text-center">Analysis Results</h2>
          
          {/* Summary Stats (If all 4 are done, or just show current) */}
          {results.length === 4 && (
             <Card className="bg-primary/5 border-primary/20">
               <CardHeader><CardTitle className="text-center">Dashboard Summary</CardTitle></CardHeader>
               <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                 <div><div className="text-sm text-muted-foreground">Total Images</div><div className="text-2xl font-bold">4</div></div>
                 <div>
                   <div className="text-sm text-muted-foreground">Most Common Color</div>
                   <div className="text-xl font-bold mt-1">
                     {
                       Object.entries(
                         results.reduce((acc, r) => {
                           acc[r.result.dominantColor] = (acc[r.result.dominantColor] || 0) + 1;
                           return acc;
                         }, {} as Record<string, number>)
                       ).sort((a,b) => b[1]-a[1])[0][0]
                     }
                   </div>
                 </div>
                 <div>
                   <div className="text-sm text-muted-foreground">Most Colorful</div>
                   <div className="text-lg font-bold mt-1">{
                     [...results].sort((a,b) => b.result.colors.length - a.result.colors.length)[0].image.name
                   }</div>
                 </div>
                 <div>
                   <div className="text-sm text-muted-foreground">Least Colorful</div>
                   <div className="text-lg font-bold mt-1">{
                     [...results].sort((a,b) => a.result.colors.length - b.result.colors.length)[0].image.name
                   }</div>
                 </div>
               </CardContent>
             </Card>
          )}

          {results.map(({ image, result }) => (
            <div key={image.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden border shadow-sm">
                  <img src={image.path} alt={image.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-semibold">Image {image.id}: {image.name}</h3>
              </div>
              <ResultsDashboard results={result} />
              <hr className="border-border/50" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
