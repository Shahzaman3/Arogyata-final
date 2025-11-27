import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/DashboardLayout';
import { WalletConnectPanel } from '@/components/WalletConnectPanel';
import { UploadCard } from '@/components/UploadCard';
import { UploadedList } from '@/components/UploadedList';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Mail, Shield, Wallet as WalletIcon } from 'lucide-react';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  hash: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'error';
  url?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { address, isConnected } = useWallet();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Action states
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null);
  const [deletingFile, setDeletingFile] = useState<UploadedFile | null>(null);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`arogyta_uploads_${user?.id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUploadedFiles(parsed.map((f: any) => ({ ...f, timestamp: new Date(f.timestamp) })));
    }
  }, [user?.id]);

  const handleUploadComplete = (file: UploadedFile) => {
    const updated = [file, ...uploadedFiles];
    setUploadedFiles(updated);
    localStorage.setItem(`arogyta_uploads_${user?.id}`, JSON.stringify(updated));
  };

  const handleView = (file: UploadedFile) => {
    setPreviewFile(file);
  };

  const handleEdit = (file: UploadedFile) => {
    setEditingFile(file);
    setNewName(file.name);
  };

  const handleSaveEdit = () => {
    if (!editingFile || !newName.trim()) return;

    const updatedFiles = uploadedFiles.map(f =>
      f.id === editingFile.id ? { ...f, name: newName } : f
    );

    setUploadedFiles(updatedFiles);
    localStorage.setItem(`arogyta_uploads_${user?.id}`, JSON.stringify(updatedFiles));
    setEditingFile(null);
    toast.success("File renamed successfully");
  };

  const handleDelete = (file: UploadedFile) => {
    setDeletingFile(file);
  };

  const confirmDelete = () => {
    if (!deletingFile) return;

    const updatedFiles = uploadedFiles.filter(f => f.id !== deletingFile.id);
    setUploadedFiles(updatedFiles);
    localStorage.setItem(`arogyta_uploads_${user?.id}`, JSON.stringify(updatedFiles));
    setDeletingFile(null);
    toast.success("File deleted successfully");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Header />
      <DashboardLayout>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button
              variant="ghost"
              className="hover:bg-transparent hover:text-primary"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {/* Profile Summary */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <WalletIcon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wallet</p>
                  <p className="text-sm font-medium">
                    {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not connected'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Wallet & Upload */}
            <motion.div variants={itemVariants} className="space-y-6">
              <WalletConnectPanel />
              <UploadCard onUploadComplete={handleUploadComplete} />
            </motion.div>

            {/* Right Column - Uploaded Files */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              {user?.role === 'institution' ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="all">All Data</TabsTrigger>
                    <TabsTrigger value="private">Private</TabsTrigger>
                    <TabsTrigger value="public">Public</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <UploadedList
                      files={uploadedFiles}
                      roleFilter="all"
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </TabsContent>
                  <TabsContent value="private">
                    <UploadedList
                      files={uploadedFiles}
                      roleFilter="private"
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </TabsContent>
                  <TabsContent value="public">
                    <UploadedList
                      files={uploadedFiles}
                      roleFilter="public"
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <UploadedList
                  files={uploadedFiles}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </DashboardLayout >

      {/* Edit Dialog */}
      <Dialog open={!!editingFile} onOpenChange={(open) => !open && setEditingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit File</DialogTitle>
            <DialogDescription>
              Make changes to your file details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFile(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={!!deletingFile} onOpenChange={(open) => !open && setDeletingFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file
              "{deletingFile?.name}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* File Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewFile?.name}
              <span className="text-xs font-normal text-muted-foreground px-2 py-1 rounded-full bg-secondary/10">
                {previewFile?.size ? (previewFile.size / 1024).toFixed(2) + ' KB' : ''}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-full min-h-0 bg-muted/20 rounded-lg border border-border/50 overflow-hidden relative">
            {previewFile?.url ? (
              previewFile.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full border-0"
                  title={previewFile.name}
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                <p className="mb-4">Preview not available for this file type or legacy file.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const ipfsUrl = `https://ipfs.io/ipfs/${previewFile?.hash}`;
                    window.open(ipfsUrl, '_blank');
                  }}
                >
                  Open in IPFS Gateway
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
