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

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  hash: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'error';
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { address, isConnected } = useWallet();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState('all');

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
                    <UploadedList files={uploadedFiles} roleFilter="all" />
                  </TabsContent>
                  <TabsContent value="private">
                    <UploadedList files={uploadedFiles} roleFilter="private" />
                  </TabsContent>
                  <TabsContent value="public">
                    <UploadedList files={uploadedFiles} roleFilter="public" />
                  </TabsContent>
                </Tabs>
              ) : (
                <UploadedList files={uploadedFiles} />
              )}
            </motion.div>
          </div>
        </motion.div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
