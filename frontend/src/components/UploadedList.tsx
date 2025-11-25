import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  hash: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'error';
}

interface UploadedListProps {
  files: UploadedFile[];
  roleFilter?: 'all' | 'private' | 'public';
}

export const UploadedList = ({ files, roleFilter = 'all' }: UploadedListProps) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Hash copied to clipboard');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      success: 'bg-accent/10 text-accent border-accent/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      error: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return styles[status as keyof typeof styles] || styles.success;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-6 rounded-xl border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Uploaded Files</h3>
        <span className="text-sm text-muted-foreground">{files.length} files</span>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {getStatusIcon(file.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {formatFileSize(file.size)} • {formatDate(file.timestamp)}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded truncate max-w-[200px]">
                      {file.hash.slice(0, 20)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(file.hash)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground hover:text-primary" />
                    </button>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(
                    file.status
                  )} flex-shrink-0`}
                >
                  {file.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
