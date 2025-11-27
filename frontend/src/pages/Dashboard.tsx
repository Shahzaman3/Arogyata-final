import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { PatientDashboard } from '@/components/dashboard/PatientDashboard';
import { InstitutionDashboard } from '@/components/dashboard/InstitutionDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {user?.role === 'institution' ? 'Ops Center' : 'My Health Dashboard'}
            </h1>
            <Button
              variant="ghost"
              className="hover:bg-transparent hover:text-primary"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {user?.role === 'institution' ? (
            <InstitutionDashboard />
          ) : (
            <PatientDashboard />
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;

