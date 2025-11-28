import { Search, QrCode, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { API_URL } from '@/config';

interface Patient {
      _id: string;
      name: string;
      email: string;
      address: string;
}

export const PatientSearch = () => {
      const [searchQuery, setSearchQuery] = useState('');
      const [foundPatient, setFoundPatient] = useState<Patient | null>(null);
      const [isLoading, setIsLoading] = useState(false);

      const handleSearch = async () => {
            if (!searchQuery.trim()) return;

            setIsLoading(true);
            setFoundPatient(null);

            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`${API_URL}/dashboard/institution/search`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ query: searchQuery })
                  });

                  if (response.ok) {
                        const data = await response.json();
                        setFoundPatient(data);
                        toast.success('Patient found');
                  } else {
                        toast.error('Patient not found');
                  }
            } catch (error) {
                  console.error('Search error:', error);
                  toast.error('Search failed');
            } finally {
                  setIsLoading(false);
            }
      };

      const handleRequest = async () => {
            if (!foundPatient) return;

            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`${API_URL}/access/request`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                              patientId: foundPatient._id,
                              purpose: "General Medical History Access" // You could make this dynamic based on checkboxes
                        })
                  });

                  if (response.ok) {
                        toast.success('Access Request Sent to Patient');
                        setFoundPatient(null);
                        setSearchQuery('');
                  } else {
                        const error = await response.json();
                        toast.error(error.error || 'Failed to send request');
                  }
            } catch (error) {
                  console.error('Request error:', error);
                  toast.error('Failed to send request');
            }
      };

      return (
            <div className="space-y-6">
                  <div className="flex gap-4">
                        <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <Input
                                    placeholder="Search Patient Wallet Address / Email"
                                    className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                              />
                        </div>
                        <Button variant="outline" size="icon">
                              <QrCode className="w-4 h-4" />
                        </Button>
                        <Button onClick={handleSearch} className="bg-cyan-600 hover:bg-cyan-700" disabled={isLoading}>
                              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                        </Button>
                  </div>

                  {foundPatient && (
                        <Card className="glass-card border-cyan-500/30 bg-cyan-950/20 animate-in fade-in slide-in-from-top-4">
                              <CardHeader>
                                    <CardTitle className="text-lg text-cyan-400">
                                          Patient Found: {foundPatient.name || foundPatient.email}
                                          <span className="block text-xs text-muted-foreground mt-1">{foundPatient.address}</span>
                                    </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-cyan-900/50 bg-black/20">
                                                <Checkbox id="history" />
                                                <Label htmlFor="history">General History</Label>
                                          </div>
                                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-cyan-900/50 bg-black/20">
                                                <Checkbox id="lab" />
                                                <Label htmlFor="lab">Lab Reports</Label>
                                          </div>
                                          <div className="flex items-center space-x-2 p-3 rounded-lg border border-cyan-900/50 bg-black/20">
                                                <Checkbox id="rx" />
                                                <Label htmlFor="rx">Prescriptions</Label>
                                          </div>
                                    </div>

                                    <Button onClick={handleRequest} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)] transition-all">
                                          <Send className="w-4 h-4 mr-2" />
                                          Send Access Request
                                    </Button>
                              </CardContent>
                        </Card>
                  )}
            </div>
      );
};
