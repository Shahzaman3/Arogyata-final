import { Clock, Eye, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface Consultation {
      _id: string;
      owner: {
            name: string;
            email: string;
            address: string;
      };
      status: string;
}

export const ActiveConsultations = () => {
      const [consultations, setConsultations] = useState<Consultation[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
            const fetchConsultations = async () => {
                  try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('http://localhost:3000/api/dashboard/institution/consultations', {
                              headers: {
                                    'Authorization': `Bearer ${token}`
                              }
                        });

                        if (response.ok) {
                              const data = await response.json();
                              setConsultations(data);
                        }
                  } catch (error) {
                        console.error('Error fetching consultations:', error);
                  } finally {
                        setIsLoading(false);
                  }
            };

            fetchConsultations();
      }, []);

      return (
            <Card className="glass-card border-cyan-500/20">
                  <CardHeader>
                        <CardTitle className="text-lg font-semibold text-cyan-500 flex items-center gap-2">
                              <User className="w-5 h-5" />
                              Active Consultations
                        </CardTitle>
                  </CardHeader>
                  <CardContent>
                        {isLoading ? (
                              <div className="flex justify-center py-4">
                                    <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                              </div>
                        ) : consultations.length === 0 ? (
                              <div className="text-center p-4 text-muted-foreground text-sm">
                                    No active consultations.
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {consultations.map((consult) => (
                                          <div
                                                key={consult._id}
                                                className="p-4 rounded-xl border border-cyan-900/30 bg-cyan-950/10"
                                          >
                                                <div className="flex justify-between items-start mb-3">
                                                      <div>
                                                            <h3 className="font-semibold">{consult.owner.name || consult.owner.email}</h3>
                                                            <p className="text-xs text-muted-foreground font-mono truncate max-w-[150px]" title={consult.owner.address}>
                                                                  {consult.owner.address}
                                                            </p>
                                                      </div>
                                                      <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
                                                            <Clock className="w-3 h-3" />
                                                            Active
                                                      </div>
                                                </div>

                                                <Button size="sm" className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30">
                                                      <Eye className="w-4 h-4 mr-2" />
                                                      View Records
                                                </Button>
                                          </div>
                                    ))}
                              </div>
                        )}
                  </CardContent>
            </Card>
      );
};
