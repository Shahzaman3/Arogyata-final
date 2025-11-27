import { Shield, UserCheck, Clock, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Permission {
      _id: string;
      requester: {
            name: string;
            role: string;
            email: string;
      };
      status: string;
      updatedAt: string;
}

export const SmartPermissions = () => {
      const [permissions, setPermissions] = useState<Permission[]>([]);
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
            fetchPermissions();
      }, []);

      const fetchPermissions = async () => {
            try {
                  const token = localStorage.getItem('token');
                  const response = await fetch('http://localhost:3000/api/dashboard/patient/permissions', {
                        headers: {
                              'Authorization': `Bearer ${token}`
                        }
                  });

                  if (response.ok) {
                        const data = await response.json();
                        setPermissions(data);
                  }
            } catch (error) {
                  console.error('Error fetching permissions:', error);
            } finally {
                  setIsLoading(false);
            }
      };

      const handleRevoke = async (id: string) => {
            // Placeholder for revoke logic
            toast.success('Access Revoked');
            setPermissions(prev => prev.filter(p => p._id !== id));
      };

      return (
            <Card className="glass-card border-primary/20">
                  <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                              <Shield className="w-5 h-5 text-primary" />
                              Smart Permissions Control Center
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                              Toggle to instantly revoke access via smart contract.
                        </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                        {isLoading ? (
                              <div className="flex justify-center py-4">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                              </div>
                        ) : permissions.length === 0 ? (
                              <div className="text-center p-4 text-muted-foreground text-sm">
                                    No active permissions found.
                              </div>
                        ) : (
                              permissions.map((perm) => (
                                    <div key={perm._id} className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
                                          <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-full bg-green-500/10 text-green-600">
                                                      <UserCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                      <h4 className="font-medium text-sm">{perm.requester.name || perm.requester.email}</h4>
                                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <span>{perm.requester.role}</span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                  <Clock className="w-3 h-3" /> {new Date(perm.updatedAt).toLocaleDateString()}
                                                            </span>
                                                      </div>
                                                </div>
                                          </div>

                                          <div className="flex items-center gap-4">
                                                <div className="text-right hidden sm:block">
                                                      <p className="text-xs font-medium">Full Access</p>
                                                      <p className="text-[10px] text-green-600">
                                                            Active on Chain
                                                      </p>
                                                </div>
                                                <Switch checked={true} onCheckedChange={() => handleRevoke(perm._id)} />
                                          </div>
                                    </div>
                              ))
                        )}
                  </CardContent>
            </Card>
      );
};
