import { Users, FileText, Activity, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { API_URL } from '@/config';

export const StatsOverview = () => {
      const [stats, setStats] = useState({
            totalPatients: 0,
            activeConsultations: 0,
            recordsProcessed: 0,
            systemStatus: 'Secure'
      });
      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
            const fetchStats = async () => {
                  try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`${API_URL}/dashboard/institution/stats`, {
                              headers: {
                                    'Authorization': `Bearer ${token}`
                              }
                        });

                        if (response.ok) {
                              const data = await response.json();
                              setStats(data);
                        }
                  } catch (error) {
                        console.error('Error fetching stats:', error);
                  } finally {
                        setIsLoading(false);
                  }
            };

            fetchStats();
      }, []);

      const statItems = [
            {
                  title: "Total Patients",
                  value: stats.totalPatients,
                  change: "Unique patients",
                  icon: Users,
                  color: "text-cyan-400",
                  bg: "bg-cyan-950/30",
                  border: "border-cyan-500/20"
            },
            {
                  title: "Active Consultations",
                  value: stats.activeConsultations,
                  change: "Access granted",
                  icon: Activity,
                  color: "text-emerald-400",
                  bg: "bg-emerald-950/30",
                  border: "border-emerald-500/20"
            },
            {
                  title: "Records Processed",
                  value: stats.recordsProcessed,
                  change: "Total entries",
                  icon: FileText,
                  color: "text-purple-400",
                  bg: "bg-purple-950/30",
                  border: "border-purple-500/20"
            },
            {
                  title: "System Status",
                  value: stats.systemStatus,
                  change: "Audit logs active",
                  icon: ShieldCheck,
                  color: "text-orange-400",
                  bg: "bg-orange-950/30",
                  border: "border-orange-500/20"
            }
      ];

      if (isLoading) {
            return (
                  <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                  </div>
            );
      }

      return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {statItems.map((stat, index) => (
                        <Card key={index} className={`glass-card ${stat.border} ${stat.bg}`}>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                          {stat.title}
                                    </CardTitle>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                              </CardHeader>
                              <CardContent>
                                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                          {stat.change}
                                    </p>
                              </CardContent>
                        </Card>
                  ))}
            </div>
      );
};
