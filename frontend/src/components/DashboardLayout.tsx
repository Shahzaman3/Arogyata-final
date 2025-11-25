import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { User, Building2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-lg bg-primary/10">
              {user?.role === 'institution' ? (
                <Building2 className="w-6 h-6 text-primary" />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient-primary">
                Welcome back, {user?.name}
              </h1>
              <p className="text-muted-foreground">
                {user?.role === 'institution' ? 'Institution Dashboard' : 'Personal Dashboard'}
              </p>
            </div>
          </div>
        </motion.div>

        {children}
      </div>
    </div>
  );
};
