import { Bell, Check, X, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_URL } from '@/config';

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
                  const response = await fetch(`${API_URL}/access/pending`, {
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
            if (action === 'reject') {
                  // For now, we don't have a reject endpoint, so just hide it locally
                  toast.info('Request rejected locally');
                  setRequests(prev => prev.filter(r => r._id !== requestId));
                  return;
            }

            try {
                  const token = localStorage.getItem('token');

                  // MOCK KEYS for now since frontend crypto isn't fully ready
                  // In production, these would be derived from the user's wallet/keys
                  const mockSymmetricKey = "mock-symmetric-key-" + Date.now();
                  const mockGranteePublicKey = "mock-public-key-" + Math.random();

                  const response = await fetch(`${API_URL}/access/grant`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                              requestId,
                              symmetricKey: mockSymmetricKey,
                              granteePublicKey: mockGranteePublicKey
                        })
                  });

                  if (response.ok) {
                        toast.success('Access Granted Successfully');
                        setRequests(prev => prev.filter(r => r._id !== requestId));
                  } else {
                        const error = await response.json();
                        toast.error(error.error || 'Failed to grant access');
                  }
            } catch (error) {
                  console.error('Grant error:', error);
                  toast.error('Failed to process request');
            }
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
