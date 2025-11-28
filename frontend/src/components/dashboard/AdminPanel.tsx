import { ShieldAlert, FileSearch, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { API_URL } from '@/config';

interface AuditEntry {
      _id: string;
      actor: string;
      action: string;
      target: {
            name: string;
            email: string;
      };
      createdAt: string;
      hash: string;
}

export const AdminPanel = () => {
      const [logs, setLogs] = useState<AuditEntry[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
            const fetchLogs = async () => {
                  try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`${API_URL}/dashboard/institution/audit-logs`, {
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
            <Card className="glass-card border-slate-700 bg-slate-900/50">
                  <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                              <ShieldAlert className="w-5 h-5" />
                              Admin Audit Panel
                        </CardTitle>
                  </CardHeader>
                  <CardContent>
                        <div className="rounded-md border border-slate-800">
                              <Table>
                                    <TableHeader className="bg-slate-900">
                                          <TableRow className="hover:bg-slate-900 border-slate-800">
                                                <TableHead className="text-slate-400">Time</TableHead>
                                                <TableHead className="text-slate-400">Action</TableHead>
                                                <TableHead className="text-slate-400">Target User</TableHead>
                                                <TableHead className="text-slate-400">Tx Hash</TableHead>
                                          </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                          {isLoading ? (
                                                <TableRow>
                                                      <TableCell colSpan={4} className="text-center py-4">
                                                            <Loader2 className="w-4 h-4 animate-spin mx-auto text-slate-400" />
                                                      </TableCell>
                                                </TableRow>
                                          ) : logs.length === 0 ? (
                                                <TableRow>
                                                      <TableCell colSpan={4} className="text-center py-4 text-slate-500">
                                                            No audit logs found.
                                                      </TableCell>
                                                </TableRow>
                                          ) : (
                                                logs.map((entry) => (
                                                      <TableRow key={entry._id} className="hover:bg-slate-800/50 border-slate-800">
                                                            <TableCell className="font-mono text-xs text-slate-400">
                                                                  {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </TableCell>
                                                            <TableCell>
                                                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800 text-xs text-slate-300">
                                                                        <FileSearch className="w-3 h-3" />
                                                                        {entry.action}
                                                                  </span>
                                                            </TableCell>
                                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                                  {entry.target?.name || entry.target?.email || 'System'}
                                                            </TableCell>
                                                            <TableCell className="font-mono text-xs text-cyan-600 truncate max-w-[100px]" title={entry.hash}>
                                                                  {entry.hash}
                                                            </TableCell>
                                                      </TableRow>
                                                ))
                                          )}
                                    </TableBody>
                              </Table>
                        </div>
                  </CardContent>
            </Card>
      );
};
