import { useState, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export function UploadArea({ onFileSelect, isLoading }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{name: string, size: string} | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFile = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert("Unsupported format. Use PNG, JPEG, or WEBP.");
      return;
    }
    
    setFileInfo({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB"
    });
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors duration-200 ${
          isDragging ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary/50'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Drag & Drop Image Here</h3>
          <p className="text-sm text-muted-foreground">Supported Formats: PNG, JPEG, WEBP</p>
          
          <div className="relative">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              accept="image/png, image/jpeg, image/webp"
              disabled={isLoading}
            />
            <Button disabled={isLoading}>Browse Files</Button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="glass-panel p-6 rounded-xl border bg-card text-card-foreground shadow space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Image Preview
          </h3>
          <div className="flex gap-6 items-start">
            <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
              <img src={preview} alt="Preview" className="object-cover w-full h-full" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">{fileInfo?.name}</p>
              <p className="text-sm text-muted-foreground">Size: {fileInfo?.size}</p>
              <p className="text-sm text-muted-foreground">Status: {isLoading ? 'Analyzing...' : 'Ready to analyze or analyzed'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
