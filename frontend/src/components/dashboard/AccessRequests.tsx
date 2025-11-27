import { Bell, Check, X, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Request {
      _id: string;
      requester: {
            name: string;
            email: string;
            role: string;
      };
      purpose: string;
      createdAt: string;
}

export const AccessRequests = () => {
      const [requests, setRequests] = useState<Request[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
            fetchRequests();
      }, []);

      const fetchRequests = async () => {
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('http://localhost:3000/api/access/pending', {
                        headers: {
                              'Authorization': `Bearer ${token}`
                        }
                  });

                  if (response.ok) {
                        const data = await response.json();
                        if (Array.isArray(data)) {
                              setRequests(data);
                        } else {
                              console.error('Received non-array data for access requests:', data);
                              setRequests([]);
                        }
                  }
            } catch (error) {
                  console.error('Error fetching requests:', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const handleAction = async (requestId: string, action: 'grant' | 'reject') => {
            // Placeholder for grant/reject logic
            // For now just remove from list to simulate action
            toast.success(`Request ${action}ed`);
            setRequests(prev => prev.filter(r => r._id !== requestId));
      };

      return (
            <Card className="glass-card border-orange-500/20 bg-orange-500/5">
                  <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                              <CardTitle className="text-lg font-semibold text-orange-600 flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    Access Requests
                              </CardTitle>
                              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">
                                    {requests.length} Pending
                              </Badge>
                        </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                        {isLoading ? (
                              <div className="flex justify-center py-4">
                                    <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                              </div>
                        ) : requests.length === 0 ? (
                              <div className="text-center p-4 text-muted-foreground text-sm">
                                    No pending requests.
                              </div>
                        ) : (
                              requests.map((req) => (
                                    <div key={req._id} className="p-3 rounded-lg bg-background/60 border border-orange-200/20 backdrop-blur-sm">
                                          <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                      <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20">
                                                            <User className="w-4 h-4 text-orange-600" />
                                                      </div>
                                                      <div>
                                                            <p className="text-sm font-medium">
                                                                  <span className="font-bold">{req.requester?.name || req.requester?.email || 'Unknown User'}</span> is requesting access
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                  For: <span className="text-foreground font-medium">{req.purpose}</span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                  {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {req.requester?.role || 'N/A'}
                                                            </p>
                                                      </div>
                                                </div>
                                                <div className="flex gap-2">
                                                      <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                                                            onClick={() => handleAction(req._id, 'reject')}
                                                      >
                                                            <X className="w-4 h-4" />
                                                      </Button>
                                                      <Button
                                                            size="icon"
                                                            className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white border-none shadow-sm shadow-green-900/20"
                                                            onClick={() => handleAction(req._id, 'grant')}
                                                      >
                                                            <Check className="w-4 h-4" />
                                                      </Button>
                                                </div>
                                          </div>
                                    </div>
                              ))
                        )}
                  </CardContent>
            </Card>
      );
};
