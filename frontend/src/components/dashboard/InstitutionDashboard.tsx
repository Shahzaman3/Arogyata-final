import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, FileText, Settings, ShieldAlert } from 'lucide-react';
import { PatientSearch } from './PatientSearch';
import { ActiveConsultations } from './ActiveConsultations';
import { WriteToChain } from './WriteToChain';
import { AdminPanel } from './AdminPanel';
import { Button } from '@/components/ui/button';

export const InstitutionDashboard = () => {
      const [activeView, setActiveView] = useState<'ops' | 'records' | 'admin'>('ops');

      const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                  opacity: 1,
                  transition: {
                        staggerChildren: 0.1,
                  },
            },
      };

      return (
            <div className="flex flex-col lg:flex-row gap-6 min-h-[80vh]">
                  {/* Sidebar Navigation */}
                  <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="w-full lg:w-64 flex-shrink-0 space-y-2"
                  >
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 mb-4">
                              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Ops Center</h2>
                              <nav className="space-y-1">
                                    <Button
                                          variant={activeView === 'ops' ? 'secondary' : 'ghost'}
                                          className={`w-full justify-start ${activeView === 'ops' ? 'bg-cyan-950/50 text-cyan-400' : 'text-slate-400 hover:text-cyan-400'}`}
                                          onClick={() => setActiveView('ops')}
                                    >
                                          <LayoutDashboard className="w-4 h-4 mr-2" />
                                          Overview
                                    </Button>
                                    <Button
                                          variant={activeView === 'records' ? 'secondary' : 'ghost'}
                                          className={`w-full justify-start ${activeView === 'records' ? 'bg-purple-950/50 text-purple-400' : 'text-slate-400 hover:text-purple-400'}`}
                                          onClick={() => setActiveView('records')}
                                    >
                                          <FileText className="w-4 h-4 mr-2" />
                                          EHR Entry
                                    </Button>
                                    <Button
                                          variant={activeView === 'admin' ? 'secondary' : 'ghost'}
                                          className={`w-full justify-start ${activeView === 'admin' ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200'}`}
                                          onClick={() => setActiveView('admin')}
                                    >
                                          <ShieldAlert className="w-4 h-4 mr-2" />
                                          Audit Logs
                                    </Button>
                              </nav>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h2>
                              <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start text-xs border-slate-700 text-slate-400">
                                          <Users className="w-3 h-3 mr-2" />
                                          Staff Directory
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start text-xs border-slate-700 text-slate-400">
                                          <Settings className="w-3 h-3 mr-2" />
                                          System Settings
                                    </Button>
                              </div>
                        </div>
                  </motion.div>

                  {/* Main Content Area */}
                  <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 space-y-6"
                  >
                        {activeView === 'ops' && (
                              <>
                                    <PatientSearch />
                                    <ActiveConsultations />
                              </>
                        )}

                        {activeView === 'records' && (
                              <WriteToChain />
                        )}

                        {activeView === 'admin' && (
                              <AdminPanel />
                        )}
                  </motion.div>
            </div>
      );
};
