import { motion } from 'framer-motion';
import { IdentityCard } from './IdentityCard';
import { RecordsVault } from './RecordsVault';
import { AccessRequests } from './AccessRequests';
import { SmartPermissions } from './SmartPermissions';
import { AuditLog } from './AuditLog';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';

export const PatientDashboard = () => {
      const { address } = useWallet();
      const { user } = useAuth();

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
            <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
            >
                  {/* Top Section: Identity & Requests */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <motion.div variants={itemVariants} className="lg:col-span-1">
                              <IdentityCard address={address || '0x...'} />
                        </motion.div>
                        <motion.div variants={itemVariants} className="lg:col-span-2">
                              <AccessRequests />
                        </motion.div>
                  </div>

                  {/* Middle Section: Records Vault */}
                  <motion.div variants={itemVariants}>
                        <RecordsVault />
                  </motion.div>

                  {/* Bottom Section: Permissions & Audit */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div variants={itemVariants}>
                              <SmartPermissions />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                              <AuditLog />
                        </motion.div>
                  </div>
            </motion.div>
      );
};
