import { Lock, FileText, Folder, Loader2, Eye, Edit, Trash2, MoreVertical, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogFooter,
} from "@/components/ui/dialog";
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Record {
      _id: string;
      title: string;
      createdAt: string;
      description: string;
      ipfsHash: string;
}

export const RecordsVault = () => {
      const [records, setRecords] = useState<Record[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      // Action States
      const [viewRecord, setViewRecord] = useState<{ record: Record, content: string } | null>(null);
      const [editRecord, setEditRecord] = useState<Record | null>(null);
      const [deleteId, setDeleteId] = useState<string | null>(null);

      // Edit Form State
      const [editForm, setEditForm] = useState({ title: '', description: '', content: '' });
      const [isProcessing, setIsProcessing] = useState(false);

      useEffect(() => {
            fetchRecords();
      }, []);

      const fetchRecords = async () => {
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('http://localhost:3000/api/content', {
                        headers: {
                              'Authorization': `Bearer ${token}`
                        }
                  });

                  if (response.ok) {
                        const data = await response.json();
                        setRecords(data);
                  } else {
                        console.error('Failed to fetch records');
                  }
            } catch (error) {
                  console.error('Error fetching records:', error);
                  toast.error('Failed to load records');
            } finally {
                  setIsLoading(false);
            }
      };

      const handleView = async (record: Record) => {
            const toastId = toast.loading('Decrypting record...');
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:3000/api/content/${record._id}/retrieve`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                        }
                  });

                  if (response.ok) {
                        const data = await response.json();
                        setViewRecord({ record, content: data.data });
                        toast.dismiss(toastId);
                  } else {
                        throw new Error('Failed to retrieve content');
                  }
            } catch (error) {
                  console.error('View error:', error);
                  toast.error('Failed to decrypt record', { id: toastId });
            }
      };

      const handleEditClick = async (record: Record) => {
            // Fetch content first to populate edit form
            const toastId = toast.loading('Loading record for editing...');
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:3000/api/content/${record._id}/retrieve`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                        }
                  });

                  if (response.ok) {
                        const data = await response.json();
                        setEditRecord(record);
                        setEditForm({
                              title: record.title,
                              description: record.description,
                              content: data.data
                        });
                        toast.dismiss(toastId);
                  } else {
                        throw new Error('Failed to load content');
                  }
            } catch (error) {
                  console.error('Edit load error:', error);
                  toast.error('Failed to load record', { id: toastId });
            }
      };

      const handleSaveEdit = async () => {
            if (!editRecord) return;
            setIsProcessing(true);
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:3000/api/content/${editRecord._id}/modify`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                              title: editForm.title,
                              description: editForm.description,
                              newData: editForm.content
                        })
                  });

                  if (response.ok) {
                        toast.success('Record updated successfully');
                        setEditRecord(null);
                        fetchRecords();
                  } else {
                        throw new Error('Update failed');
                  }
            } catch (error) {
                  console.error('Update error:', error);
                  toast.error('Failed to update record');
            } finally {
                  setIsProcessing(false);
            }
      };

      const handleDelete = async () => {
            if (!deleteId) return;
            setIsProcessing(true);
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:3000/api/content/${deleteId}`, {
                        method: 'DELETE',
                        headers: {
                              'Authorization': `Bearer ${token}`
                        }
                  });

                  if (response.ok) {
                        toast.success('Record deleted successfully');
                        setDeleteId(null);
                        fetchRecords();
                  } else {
                        throw new Error('Delete failed');
                  }
            } catch (error) {
                  console.error('Delete error:', error);
                  toast.error('Failed to delete record');
            } finally {
                  setIsProcessing(false);
            }
      };

      if (isLoading) {
            return (
                  <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
            );
      }

      return (
            <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        My Records Vault
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {records.length === 0 ? (
                              <div className="col-span-full text-center p-8 text-muted-foreground bg-card/30 rounded-xl border border-dashed border-border">
                                    No records found. Add your first health record securely.
                              </div>
                        ) : (
                              records.map((record, index) => (
                                    <motion.div
                                          key={record._id}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: index * 0.1 }}
                                          className="group relative p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                                    >
                                          <div className="absolute top-2 right-2 z-10">
                                                <DropdownMenu>
                                                      <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10">
                                                                  <MoreVertical className="w-3 h-3 text-muted-foreground" />
                                                            </Button>
                                                      </DropdownMenuTrigger>
                                                      <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleView(record)}>
                                                                  <Eye className="w-3 h-3 mr-2" /> View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleEditClick(record)}>
                                                                  <Edit className="w-3 h-3 mr-2" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setDeleteId(record._id)}>
                                                                  <span className="text-destructive focus:text-destructive flex items-center w-full">
                                                                        <Trash2 className="w-3 h-3 mr-2" /> Delete
                                                                  </span>
                                                            </DropdownMenuItem>
                                                      </DropdownMenuContent>
                                                </DropdownMenu>
                                          </div>

                                          <div className="flex flex-col items-center gap-3 py-2 cursor-pointer" onClick={() => handleView(record)}>
                                                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                      <Folder className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="text-center space-y-1 w-full">
                                                      <p className="font-medium text-sm truncate w-full px-2" title={record.title}>
                                                            {record.title || 'Untitled Record'}
                                                      </p>
                                                      <p className="text-xs text-muted-foreground">
                                                            {new Date(record.createdAt).toLocaleDateString()}
                                                      </p>
                                                </div>
                                          </div>
                                    </motion.div>
                              ))
                        )}

                        {/* Add New Record */}
                        <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 }}
                              className="relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-all cursor-pointer bg-transparent hover:bg-primary/5"
                        >
                              <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;

                                          const toastId = toast.loading('Uploading record...');
                                          try {
                                                const readFileAsDataURL = (file: File): Promise<string> => {
                                                      return new Promise((resolve, reject) => {
                                                            const reader = new FileReader();
                                                            reader.onload = () => resolve(reader.result as string);
                                                            reader.onerror = reject;
                                                            reader.readAsDataURL(file);
                                                      });
                                                };

                                                const dataUrl = await readFileAsDataURL(file);

                                                // Sanitize filename (remove path if present)
                                                const fileName = file.name.split('\\').pop()?.split('/').pop() || file.name;

                                                if (!dataUrl.startsWith('data:')) {
                                                      throw new Error('Invalid file data');
                                                }

                                                const token = localStorage.getItem('token');

                                                const response = await fetch('http://localhost:3000/api/content/upload', {
                                                      method: 'POST',
                                                      headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${token}`
                                                      },
                                                      body: JSON.stringify({
                                                            title: fileName,
                                                            description: `Uploaded on ${new Date().toLocaleDateString()}`,
                                                            data: dataUrl
                                                      })
                                                });

                                                if (response.ok) {
                                                      toast.success('Record uploaded successfully', { id: toastId });
                                                      fetchRecords(); // Refresh list
                                                } else {
                                                      throw new Error('Upload failed');
                                                }
                                          } catch (error) {
                                                console.error('Upload error:', error);
                                                toast.error(error instanceof Error ? error.message : 'Failed to upload record', { id: toastId });
                                          }
                                    }}
                              />
                              <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 mb-2 pointer-events-none">
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <p className="text-sm font-medium text-muted-foreground pointer-events-none">Upload Record</p>
                        </motion.div>
                  </div>

                  {/* View Dialog */}
                  <Dialog open={!!viewRecord} onOpenChange={(open) => !open && setViewRecord(null)}>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                    <DialogTitle>{viewRecord?.record.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                          <p>Created: {viewRecord?.record.createdAt && new Date(viewRecord.record.createdAt).toLocaleString()}</p>
                                          <p>Description: {viewRecord?.record.description}</p>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg font-mono text-sm whitespace-pre-wrap break-words overflow-auto max-h-[60vh]">
                                          {(() => {
                                                const content = viewRecord?.content || '';
                                                if (!content.startsWith('data:')) {
                                                      // Legacy text content
                                                      return content;
                                                }

                                                if (content.startsWith('data:image')) {
                                                      return <img src={content} alt="Record Content" className="max-w-full h-auto rounded-lg mx-auto" />;
                                                }

                                                if (content.startsWith('data:application/pdf')) {
                                                      return <iframe src={content} className="w-full h-[500px] border-none" title="PDF Content" />;
                                                }

                                                // Try to decode text-based formats
                                                if (content.startsWith('data:text') || content.startsWith('data:application/json')) {
                                                      try {
                                                            const base64 = content.split(',')[1];
                                                            const decoded = atob(base64);
                                                            return decoded;
                                                      } catch (e) {
                                                            return "Error decoding text content.";
                                                      }
                                                }

                                                // Fallback for other binary types
                                                return (
                                                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                                            <FileText className="w-12 h-12 mb-2 opacity-50" />
                                                            <p>Preview not available for this file type.</p>
                                                            <p className="text-xs mt-1">Please download the file to view it.</p>
                                                      </div>
                                                );
                                          })()}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                          <Button variant="outline" onClick={() => {
                                                const content = viewRecord?.content || '';
                                                if (!content) return;

                                                try {
                                                      let blob;
                                                      if (content.startsWith('data:')) {
                                                            const [header, base64] = content.split(',');
                                                            const type = header.split(':')[1].split(';')[0];
                                                            const byteCharacters = atob(base64);
                                                            const byteNumbers = new Array(byteCharacters.length);
                                                            for (let i = 0; i < byteCharacters.length; i++) {
                                                                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                                                            }
                                                            const byteArray = new Uint8Array(byteNumbers);
                                                            blob = new Blob([byteArray], { type: type });
                                                      } else {
                                                            // Legacy text content
                                                            blob = new Blob([content], { type: 'text/plain' });
                                                      }

                                                      const url = URL.createObjectURL(blob);
                                                      window.open(url, '_blank');
                                                } catch (e) {
                                                      console.error('Error opening file:', e);
                                                      toast.error('Could not open file');
                                                }
                                          }}>
                                                <Eye className="w-4 h-4 mr-2" />
                                                Open in New Tab
                                          </Button>
                                          <Button onClick={() => {
                                                const content = viewRecord?.content || '';
                                                if (!content) return;

                                                try {
                                                      let blob;
                                                      if (content.startsWith('data:')) {
                                                            const [header, base64] = content.split(',');
                                                            const type = header.split(':')[1].split(';')[0];
                                                            const byteCharacters = atob(base64);
                                                            const byteNumbers = new Array(byteCharacters.length);
                                                            for (let i = 0; i < byteCharacters.length; i++) {
                                                                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                                                            }
                                                            const byteArray = new Uint8Array(byteNumbers);
                                                            blob = new Blob([byteArray], { type: type });
                                                      } else {
                                                            // Legacy text content
                                                            blob = new Blob([content], { type: 'text/plain' });
                                                      }

                                                      const url = URL.createObjectURL(blob);
                                                      const link = document.createElement('a');
                                                      link.href = url;
                                                      link.download = viewRecord?.record.title || 'download';
                                                      document.body.appendChild(link);
                                                      link.click();
                                                      document.body.removeChild(link);
                                                      URL.revokeObjectURL(url);
                                                } catch (e) {
                                                      console.error('Error downloading file:', e);
                                                      toast.error('Could not download file');
                                                }
                                          }}>
                                                <Download className="w-4 h-4 mr-2" />
                                                Download Original File
                                          </Button>
                                    </div>
                              </div>
                        </DialogContent>
                  </Dialog>

                  {/* Edit Dialog */}
                  <Dialog open={!!editRecord} onOpenChange={(open) => !open && setEditRecord(null)}>
                        <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                    <DialogTitle>Edit Record</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                          <Label>Title</Label>
                                          <Input
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                          />
                                    </div>
                                    <div className="space-y-2">
                                          <Label>Description</Label>
                                          <Input
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                          />
                                    </div>
                                    <div className="space-y-2">
                                          <Label>Content</Label>
                                          <Textarea
                                                value={editForm.content}
                                                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                                className="min-h-[200px] font-mono"
                                          />
                                    </div>
                              </div>
                              <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditRecord(null)}>Cancel</Button>
                                    <Button onClick={handleSaveEdit} disabled={isProcessing}>
                                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                          Save Changes
                                    </Button>
                              </DialogFooter>
                        </DialogContent>
                  </Dialog>

                  {/* Delete Alert */}
                  <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                        <AlertDialogContent>
                              <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete the record from your vault.
                                    </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                          Delete
                                    </AlertDialogAction>
                              </AlertDialogFooter>
                        </AlertDialogContent>
                  </AlertDialog>
            </div>
      );
};

