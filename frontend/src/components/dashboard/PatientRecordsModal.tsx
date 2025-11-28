import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Loader2, X, Eye, ShieldCheck, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { API_URL } from '@/config';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PatientRecordsModalProps {
      isOpen: boolean;
      onClose: () => void;
      patientId: string;
      patientName: string;
}

interface Record {
      _id: string;
      title: string;
      description: string;
      summary: string;
      createdAt: string;
      ipfsHash: string;
}

interface FullRecord extends Record {
      data: string;
}

export const PatientRecordsModal = ({ isOpen, onClose, patientId, patientName }: PatientRecordsModalProps) => {
      const [records, setRecords] = useState<Record[]>([]);
      const [isLoading, setIsLoading] = useState(true);
      const [selectedRecord, setSelectedRecord] = useState<FullRecord | null>(null);
      const [isLoadingDetails, setIsLoadingDetails] = useState(false);

      useEffect(() => {
            if (isOpen && patientId) {
                  fetchRecords();
            }
      }, [isOpen, patientId]);

      const fetchRecords = async () => {
            setIsLoading(true);
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`${API_URL}/dashboard/institution/patient/${patientId}/records`, {
                        headers: {
                              'Authorization': `Bearer ${token}`
                        }
                  });

                  if (response.ok) {
                        const data = await response.json();
                        setRecords(data);
                  } else {
                        const error = await response.json();
                        toast.error(error.error || 'Failed to fetch records');
                  }
            } catch (error) {
                  console.error('Error fetching records:', error);
                  toast.error('Failed to fetch records');
            } finally {
                  setIsLoading(false);
            }
      };

      const handleViewDetails = async (recordId: string) => {
            setIsLoadingDetails(true);
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`${API_URL}/dashboard/institution/record/${recordId}`, {
                        headers: {
                              'Authorization': `Bearer ${token}`
                        }
                  });

                  if (response.ok) {
                        const data = await response.json();
                        setSelectedRecord(data);
                  } else {
                        const error = await response.json();
                        toast.error(error.error || 'Failed to fetch record details');
                  }
            } catch (error) {
                  console.error('Error fetching details:', error);
                  toast.error('Failed to fetch record details');
            } finally {
                  setIsLoadingDetails(false);
            }
      };

      return (
            <>
                  <Dialog open={isOpen} onOpenChange={onClose}>
                        <DialogContent className="max-w-6xl bg-slate-950/95 backdrop-blur-xl border-slate-800 text-slate-200 shadow-2xl">
                              <DialogHeader>
                                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                                <FileText className="w-5 h-5 text-cyan-400" />
                                          </div>
                                          <div>
                                                Medical Records
                                                <span className="block text-sm font-normal text-slate-400 mt-1">
                                                      Patient: <span className="text-cyan-400 font-medium">{patientName}</span>
                                                </span>
                                          </div>
                                    </DialogTitle>
                              </DialogHeader>

                              <div className="mt-6">
                                    {isLoading ? (
                                          <div className="flex flex-col items-center justify-center py-12 gap-3">
                                                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                                                <p className="text-sm text-slate-500">Loading records...</p>
                                          </div>
                                    ) : records.length === 0 ? (
                                          <div className="flex flex-col items-center justify-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                                                <FileText className="w-12 h-12 mb-3 opacity-20" />
                                                <p>No records found for this patient.</p>
                                          </div>
                                    ) : (
                                          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/20">
                                                <Table>
                                                      <TableHeader className="bg-slate-900/50">
                                                            <TableRow className="border-slate-800 hover:bg-slate-900/50">
                                                                  <TableHead className="text-slate-400 font-medium w-[150px]">Date</TableHead>
                                                                  <TableHead className="text-slate-400 font-medium">Title</TableHead>
                                                                  <TableHead className="text-slate-400 font-medium">Description</TableHead>
                                                                  <TableHead className="text-slate-400 font-medium">AI Summary</TableHead>
                                                                  <TableHead className="text-right text-slate-400 font-medium">Actions</TableHead>
                                                            </TableRow>
                                                      </TableHeader>
                                                      <TableBody>
                                                            {records.map((record) => (
                                                                  <TableRow key={record._id} className="border-slate-800 hover:bg-slate-900/40 transition-colors">
                                                                        <TableCell className="font-mono text-xs text-slate-400">
                                                                              <div className="flex items-center gap-2">
                                                                                    <Calendar className="w-3 h-3 text-cyan-500/50" />
                                                                                    {new Date(record.createdAt).toLocaleDateString()}
                                                                              </div>
                                                                        </TableCell>
                                                                        <TableCell className="font-medium text-slate-200">
                                                                              {record.title || 'Untitled Record'}
                                                                        </TableCell>
                                                                        <TableCell className="text-slate-400 max-w-[200px] truncate text-sm">
                                                                              {record.description}
                                                                        </TableCell>
                                                                        <TableCell className="text-slate-400 max-w-[250px] truncate text-sm">
                                                                              {record.summary || <span className="text-slate-600 italic">No summary</span>}
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                              <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="h-8 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                                                                                    onClick={() => handleViewDetails(record._id)}
                                                                                    disabled={isLoadingDetails}
                                                                              >
                                                                                    {isLoadingDetails ? (
                                                                                          <Loader2 className="w-3 h-3 animate-spin" />
                                                                                    ) : (
                                                                                          <>
                                                                                                <Eye className="w-3 h-3 mr-2" />
                                                                                                View Details
                                                                                          </>
                                                                                    )}
                                                                              </Button>
                                                                        </TableCell>
                                                                  </TableRow>
                                                            ))}
                                                      </TableBody>
                                                </Table>
                                          </div>
                                    )}
                              </div>
                        </DialogContent>
                  </Dialog>

                  {/* Details Modal */}
                  <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
                        <DialogContent className="max-w-6xl bg-slate-950 border-slate-800 text-slate-200 p-0 shadow-2xl">
                              <div className="h-full flex flex-col">
                                    <DialogHeader className="p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950">
                                          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
                                                <div className="p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                                </div>
                                                Record Details
                                          </DialogTitle>
                                          <DialogDescription className="text-slate-400 text-base ml-1">
                                                Securely decrypted content from IPFS.
                                          </DialogDescription>
                                    </DialogHeader>

                                    {selectedRecord && (
                                          <ScrollArea className="max-h-[70vh]">
                                                <div className="p-8 space-y-8">
                                                      {/* Metadata Grid */}
                                                      <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                                                                  <label className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-2">
                                                                        <FileText className="w-3 h-3" /> Record Name
                                                                  </label>
                                                                  <p className="text-lg font-semibold text-slate-200 leading-tight">{selectedRecord.title}</p>
                                                            </div>

                                                            <div className="space-y-1.5 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
                                                                  <label className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-2">
                                                                        <Calendar className="w-3 h-3" /> Uploaded Date
                                                                  </label>
                                                                  <p className="text-base text-slate-300 font-mono leading-tight">
                                                                        {new Date(selectedRecord.createdAt).toLocaleString()}
                                                                  </p>
                                                            </div>
                                                      </div>

                                                      {/* Data Section */}
                                                      <div className="space-y-3">
                                                            <div className="flex items-center justify-between px-1">
                                                                  <label className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-2">
                                                                        <Eye className="w-3 h-3" /> Decrypted Data
                                                                  </label>
                                                                  <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-7 text-xs border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all"
                                                                        onClick={() => {
                                                                              navigator.clipboard.writeText(selectedRecord.data);
                                                                              toast.success("Copied to clipboard");
                                                                        }}
                                                                  >
                                                                        <Copy className="w-3 h-3 mr-2" />
                                                                        Copy Content
                                                                  </Button>
                                                            </div>

                                                            <div className="relative group">
                                                                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                                                  <div className="relative bg-black/80 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
                                                                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
                                                                              <div className="flex gap-1.5">
                                                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                                                                              </div>
                                                                              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                                                                    {selectedRecord.data.startsWith('data:image') ? 'Image Preview' : 'Secure View'}
                                                                              </span>
                                                                        </div>
                                                                        <div className="p-6 overflow-x-auto custom-scrollbar flex justify-center">
                                                                              {selectedRecord.data.startsWith('data:image') ? (
                                                                                    <img
                                                                                          src={selectedRecord.data}
                                                                                          alt="Decrypted Record"
                                                                                          className="max-w-full max-h-[500px] object-contain rounded-lg border border-slate-800"
                                                                                    />
                                                                              ) : (
                                                                                    <pre className="font-mono text-sm text-cyan-300/90 whitespace-pre-wrap break-words leading-relaxed selection:bg-cyan-500/30 selection:text-cyan-100 w-full text-left">
                                                                                          {selectedRecord.data}
                                                                                    </pre>
                                                                              )}
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                          </ScrollArea>
                                    )}
                              </div>
                        </DialogContent>
                  </Dialog>
            </>
      );
};
