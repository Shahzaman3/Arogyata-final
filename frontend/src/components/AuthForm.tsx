import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('individual');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, loginWithMetaMask } = useAuth();
  const { connect, address } = useWallet();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Logged in successfully');
      } else {
        await signup(email, password, name, role);
        toast.success('Account created successfully');
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    setIsLoading(true);
    try {
      if (!address) {
        await connect();
      }
      const walletAddress = address || (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
      await loginWithMetaMask(walletAddress);
      toast.success('Logged in with MetaMask');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'MetaMask login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card p-8 rounded-2xl border border-border/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gradient-primary mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-muted-foreground">
            {isLogin ? 'Sign in to access your dashboard' : 'Join the Web3 privacy revolution'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="glass-input"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-input"
            />
          </div>

          {!isLogin && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                Select Role
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  onClick={() => setRole('individual')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'individual'
                      ? 'border-primary bg-primary/10 shadow-glow-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">Individual</div>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => setRole('institution')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role === 'institution'
                      ? 'border-primary bg-primary/10 shadow-glow-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Building2 className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">Institution</div>
                </motion.button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-glow text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          onClick={handleMetaMaskLogin}
          variant="outline"
          className="w-full border-primary/50 hover:bg-primary/10 hover:border-primary"
          disabled={isLoading}
        >
          <Wallet className="w-4 h-4 mr-2" />
          Sign in with MetaMask
        </Button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
