import { Activity, Terminal, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { API_URL } from '@/config';

interface LogEntry {
      _id: string;
      createdAt: string;
      action: string;
      actor: {
            name: string;
            role: string;
      };
      details: string;
      hash: string;
}

export const AuditLog = () => {
      const [logs, setLogs] = useState<LogEntry[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
            const fetchLogs = async () => {
                  try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`${API_URL}/dashboard/patient/audit-logs`, {
                              headers: {
                                    'Authorization': `Bearer ${token}`
                              }
                        });

                        if (response.ok) {
                              const data = await response.json();
                              setLogs(data);
                        }
                  } catch (error) {
                        console.error('Error fetching logs:', error);
                  } finally {
                        setIsLoading(false);
                  }
            };

            fetchLogs();
      }, []);

      return (
            <Card className="glass-card border-border/50 bg-black/5 dark:bg-black/20">
                  <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                              <Activity className="w-5 h-5 text-primary" />
                              Audit Log (Transparency Page)
                        </CardTitle>
                  </CardHeader>
                  <CardContent>
                        <div className="rounded-lg bg-black/90 p-4 font-mono text-xs md:text-sm text-green-400 shadow-inner h-[200px] overflow-y-auto custom-scrollbar">
                              <div className="flex items-center gap-2 mb-4 border-b border-green-900/50 pb-2">
                                    <Terminal className="w-4 h-4" />
                                    <span>Trustless Security Log // Immutable Ledger</span>
                              </div>

                              {isLoading ? (
                                    <div className="flex justify-center py-4">
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                              ) : (
                                    <div className="space-y-3">
                                          {logs.length === 0 ? (
                                                <div className="text-white/50 italic">No activity recorded yet.</div>
                                          ) : (
                                                logs.map((log) => (
                                                      <div key={log._id} className="flex gap-3 items-start opacity-90 hover:opacity-100 transition-opacity">
                                                            <span className="text-green-600 shrink-0">
                                                                  [{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                                                            </span>
                                                            <span className="text-white/80">
                                                                  {log.action} by <span className="text-green-300">{log.actor?.name || 'System'}</span>
                                                            </span>
                                                            <span className="ml-auto text-green-600 text-[10px] uppercase tracking-wider border border-green-900 px-1 rounded" title={log.hash}>
                                                                  Verified
                                                            </span>
                                                      </div>
                                                ))
                                          )}
                                          <div className="animate-pulse text-green-600 mt-2">_</div>
                                    </div>
                              )}
                        </div>
                  </CardContent>
            </Card>
      );
};
