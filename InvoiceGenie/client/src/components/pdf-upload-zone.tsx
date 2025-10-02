import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFUploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function PDFUploadZone({ onFileSelect }: PDFUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Invoice PDF</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your PDF file here, or click to browse
          </p>
          <Button variant="outline" asChild data-testid="button-browse-file">
            <label className="cursor-pointer">
              Browse Files
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileInput}
                data-testid="input-file"
              />
            </label>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm" data-testid="text-filename">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            data-testid="button-remove-file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
