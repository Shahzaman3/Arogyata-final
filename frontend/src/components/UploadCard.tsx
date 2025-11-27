import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  hash: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'error';
  url?: string;
}

interface UploadCardProps {
  onUploadComplete: (file: UploadedFile) => void;
}

export const UploadCard = ({ onUploadComplete }: UploadCardProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const generateHash = (filename: string) => {
    const timestamp = Date.now().toString();
    const combined = filename + timestamp + user?.id;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Read file as Data URL for mock storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedFile: UploadedFile = {
        id: crypto.randomUUID(),
        name: selectedFile.name,
        size: selectedFile.size,
        hash: generateHash(selectedFile.name),
        timestamp: new Date(),
        status: 'success',
        url: e.target?.result as string
      };

      onUploadComplete(uploadedFile);

      toast.success('File uploaded successfully');

      setSelectedFile(null);
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-xl border border-border/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Upload Data</h3>
          <p className="text-sm text-muted-foreground">
            Securely store your files on the blockchain
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label
          htmlFor="file-upload"
          className="border-2 border-dashed border-border/50 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <Upload className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <p className="text-sm font-medium text-center mb-1">
            Click to select file
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Supports any file type, max 50MB
          </p>
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>

        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-lg bg-background/50 border border-border/30"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full bg-primary hover:bg-primary-glow text-primary-foreground disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload to Blockchain'}
        </Button>
      </div>
    </motion.div>
  );
};
