import { useState, useEffect } from 'react'
import { UploadArea } from './components/UploadArea'
import { ResultsDashboard } from './components/ResultsDashboard'
import { AutoDemo } from './components/AutoDemo'
import { analyzeImage, AnalysisResponse } from './lib/api'
import { Button } from './components/ui/button'
import { Palette, Moon, Sun, MonitorPlay, UploadCloud, RefreshCw } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState<'upload' | 'demo'>('demo')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setAnalysisResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await analyzeImage(selectedFile)
      setAnalysisResult(result)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Processing failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetState = () => {
    setSelectedFile(null)
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Palette className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-foreground">ColorVision <span className="text-primary">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-muted/50 p-1 rounded-lg border">
              <Button 
                variant={activeTab === 'upload' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setActiveTab('upload')}
                className="rounded-md"
              >
                <UploadCloud className="w-4 h-4 mr-2"/> Upload
              </Button>
              <Button 
                variant={activeTab === 'demo' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setActiveTab('demo')}
                className="rounded-md"
              >
                <MonitorPlay className="w-4 h-4 mr-2"/> Auto Demo
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {activeTab === 'demo' ? (
          <AutoDemo />
        ) : (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Extract colors with <span className="text-primary">pixel-perfect</span> accuracy.
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload any image to analyze its color distribution and instantly map every pixel to standard color categories.
              </p>
            </div>

            <UploadArea onFileSelect={handleFileSelect} isLoading={isLoading} />

            {error && (
              <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4 text-center mx-auto max-w-2xl flex items-center justify-center gap-4">
                <p>{error}</p>
                <Button variant="outline" size="sm" onClick={handleAnalyze}>Retry</Button>
              </div>
            )}

            {selectedFile && !analysisResult && !isLoading && !error && (
              <div className="flex justify-center mt-8">
                <Button size="lg" onClick={handleAnalyze} className="w-48 text-lg shadow-lg hover:shadow-primary/25 transition-shadow">
                  Analyze Image
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-muted-foreground animate-pulse">Analyzing every pixel... please wait.</p>
                <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/2 rounded-full animate-[progress_1s_ease-in-out_infinite]"></div>
                </div>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold tracking-tight">Analysis Complete</h2>
                  <Button variant="ghost" onClick={resetState} className="text-muted-foreground hover:text-foreground">
                    <RefreshCw className="w-4 h-4 mr-2" /> Start Over
                  </Button>
                </div>
                <ResultsDashboard results={analysisResult} />
              </div>
            )}
          </div>
        )}
      </main>

    </div>
  )
}

export default App
