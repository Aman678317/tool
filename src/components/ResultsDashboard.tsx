import { AnalysisResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DownloadCloud, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';

// Same mapping as backend for visualization
const HEX_MAP: Record<string, string> = {
  White: '#FFFFFF', Black: '#000000', Gray: '#808080', Red: '#FF0000',
  Green: '#008000', Blue: '#0000FF', Yellow: '#FFD700', Orange: '#FFA500',
  Brown: '#A52A2A', Pink: '#FFC0CB', Purple: '#800080'
};

export function ResultsDashboard({ results }: { results: AnalysisResponse }) {
  if (!results || !results.colors) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "color_analysis.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDownloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Color,Pixels,Percentage\n";
    results.colors.forEach(c => {
      csvContent += `${c.name},${c.pixels},${c.percentage}\n`;
    });
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", encodeURI(csvContent));
    downloadAnchorNode.setAttribute("download", "color_analysis.csv");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDownloadPNG = async () => {
    const element = document.getElementById('dashboard-export-area');
    if (element) {
      const canvas = await html2canvas(element, { backgroundColor: null });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "dashboard_export.png";
      a.click();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* Action Bar */}
      <div className="flex flex-wrap gap-4 justify-end">
        <Button variant="outline" onClick={handleDownloadJSON}><DownloadCloud className="w-4 h-4 mr-2" /> JSON</Button>
        <Button variant="outline" onClick={handleDownloadCSV}><DownloadCloud className="w-4 h-4 mr-2" /> CSV</Button>
        <Button variant="outline" onClick={handleDownloadPNG}><DownloadCloud className="w-4 h-4 mr-2" /> PNG</Button>
      </div>

      <div id="dashboard-export-area" className="space-y-8 p-4 bg-background/50 rounded-2xl">
        
        {/* Top Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader><CardTitle>Dominant Color</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div 
                className="w-24 h-24 rounded-full shadow-lg border-4 border-muted"
                style={{ backgroundColor: HEX_MAP[results.dominantColor] || '#ccc' }}
              />
              <h2 className="text-3xl font-bold">{results.dominantColor}</h2>
            </CardContent>
          </Card>

          {results.aiInsight && (
            <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="text-primary w-5 h-5"/> AI Insights</CardTitle></CardHeader>
              <CardContent>
                <p className="text-lg italic leading-relaxed text-muted-foreground">"{results.aiInsight}"</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Color Distribution (Pie)</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={results.colors} dataKey="percentage" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {results.colors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={HEX_MAP[entry.name] || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Color Composition (Bar)</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.colors}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                    {results.colors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={HEX_MAP[entry.name] || '#8884d8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Table & Color Cards */}
        <Card>
          <CardHeader><CardTitle>Detailed Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-3">Color</th>
                    <th className="px-6 py-3">Hex Approx</th>
                    <th className="px-6 py-3 text-right">Pixels</th>
                    <th className="px-6 py-3 text-right">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {results.colors.map((color) => (
                    <tr key={color.name} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: HEX_MAP[color.name] }}></div>
                        {color.name}
                      </td>
                      <td className="px-6 py-4 font-mono">{HEX_MAP[color.name]}</td>
                      <td className="px-6 py-4 text-right">{color.pixels.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-semibold">{color.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
