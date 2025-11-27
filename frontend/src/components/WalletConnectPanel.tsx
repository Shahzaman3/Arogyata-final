import { motion } from 'framer-motion';
import { Wallet, Power, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';

export const WalletConnectPanel = () => {
  const { address, isConnected, network, connect, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-xl border border-border/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Wallet Connection</h3>
          <p className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Connect your MetaMask wallet'}
          </p>
        </div>
      </div>

      {isConnected ? (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-background/50 border border-border/30">
            <div className="text-xs text-muted-foreground mb-1">Wallet Address</div>
            <div className="font-mono text-sm text-primary">{formatAddress(address!)}</div>
          </div>

          {network && (
            <div className="p-3 rounded-lg bg-background/50 border border-border/30 flex items-center gap-2">
              <Network className="w-4 h-4 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Network</div>
                <div className="text-sm font-medium">{network}</div>
              </div>
            </div>
          )}

          <Button
            onClick={disconnect}
            variant="outline"
            className="w-full border-destructive/50 hover:bg-destructive/10 hover:border-destructive"
          >
            <Power className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={async () => {
            await connect();
          }}
          className="w-full bg-primary hover:bg-primary-glow text-primary-foreground glow-primary animate-glow-pulse"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect MetaMask
        </Button>
      )}
    </motion.div>
  );
};
