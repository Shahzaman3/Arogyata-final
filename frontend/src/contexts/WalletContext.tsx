import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  network: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  useEffect(() => {
    const storedAddress = localStorage.getItem('arogyta_wallet');
    if (storedAddress && window.ethereum) {
      setAddress(storedAddress);
      detectNetwork();
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
      toast.info('MetaMask disconnected');
    } else {
      setAddress(accounts[0]);
      localStorage.setItem('arogyta_wallet', accounts[0]);
      toast.success('Account changed');
    }
  };

  const handleChainChanged = () => {
    detectNetwork();
    toast.info('Network changed');
  };

  const detectNetwork = async () => {
    if (!window.ethereum) return;
    
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const networks: Record<string, string> = {
      '0x1': 'Ethereum Mainnet',
      '0x5': 'Goerli Testnet',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet',
    };
    setNetwork(networks[chainId] || `Unknown (${chainId})`);
  };

  const connect = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not installed');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      setAddress(accounts[0]);
      localStorage.setItem('arogyta_wallet', accounts[0]);
      await detectNetwork();
      toast.success('Wallet connected successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect wallet');
    }
  };

  const disconnect = () => {
    setAddress(null);
    setNetwork(null);
    localStorage.removeItem('arogyta_wallet');
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        network,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
