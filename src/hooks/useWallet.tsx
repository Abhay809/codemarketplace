
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MetaMaskError, WalletProvider } from '@/types';

// Constants for Ethereum network - Updated with correct Sepolia values
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // Hexadecimal for 11155111
const SEPOLIA_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'SEP',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
};

declare global {
  interface Window extends WalletProvider {}
}

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if we're on the Sepolia network and switch if needed
  const checkNetwork = async () => {
    if (!window.ethereum) return false;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError: any) {
          // This error code indicates the chain hasn't been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [SEPOLIA_CONFIG],
              });
            } catch (addError) {
              console.error('Error adding network:', addError);
              return false;
            }
          } else {
            console.error('Error switching network:', switchError);
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Error checking/switching network:', error);
      return false;
    }
  };

  // Send transaction through MetaMask
  const sendTransaction = async (to: string, value: string): Promise<string | null> => {
    if (!window.ethereum || !isConnected) {
      toast.error('Please connect your wallet first');
      return null;
    }
    
    try {
      // Ensure we're on the correct network
      const networkOk = await checkNetwork();
      if (!networkOk) {
        toast.error('Please switch to the Sepolia test network');
        return null;
      }
      
      // Get current gas price
      const gasPrice = await window.ethereum.request({
        method: 'eth_gasPrice',
      });
      
      // Prepare transaction
      const transactionParameters = {
        to,
        from: address,
        value: value, // Wei amount as hex string
        gasPrice, // Use current gas price
      };
      
      // Send transaction
      try {
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
        
        return txHash;
      } catch (error: any) {
        // Handle user rejection gracefully
        if (error.code === 4001) {
          toast.error('Transaction was rejected by user');
        } else {
          toast.error(`Transaction error: ${error.message || 'Unknown error'}`);
        }
        console.error('Transaction error:', error);
        return null;
      }
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'Transaction failed');
      return null;
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed. Please install MetaMask to use this marketplace.');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Check if we're on the correct network
      const networkOk = await checkNetwork();
      if (!networkOk) {
        toast.error('Please switch to the Sepolia test network in MetaMask.');
        setIsConnecting(false);
        return;
      }

      // Request account access
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          toast.success('Wallet connected successfully!');
        }
      } catch (error: any) {
        // Handle user rejection gracefully
        if (error.code === 4001) {
          toast.error('Connection was rejected by user');
        } else {
          toast.error(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
        }
        console.error('Error connecting wallet:', error);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet (frontend only)
  const disconnectWallet = () => {
    setAddress('');
    setIsConnected(false);
    toast.info('Wallet disconnected');
  };

  // Format address for display (0x1234...5678)
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Convert ETH to Wei (for transaction value)
  const ethToWei = (ethAmount: number) => {
    const weiValue = ethAmount * 10**18;
    return '0x' + weiValue.toString(16);
  };

  // Initialize wallet connection and setup event listeners
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            // Verify network after connection
            await checkNetwork();
          }
        } catch (error) {
          console.error('Error checking accounts:', error);
        }
      }
    };

    checkConnection();

    // Setup listeners for account and network changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        toast.info('Account changed');
      } else {
        setAddress('');
        setIsConnected(false);
        toast.info('Disconnected from wallet');
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    // Cleanup on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return {
    isConnected,
    address,
    isConnecting,
    connectWallet,
    disconnectWallet,
    formatAddress,
    sendTransaction,
    ethToWei,
  };
};

export default useWallet;
