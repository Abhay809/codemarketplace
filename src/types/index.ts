
export interface CodeListing {
  id: string;
  title: string;
  description: string;
  price: number;
  language: string;
  category: string;
  previewCode: string;
  sellerAddress: string;
  createdAt: number; // timestamp
  imageUrl?: string;
  demo?: string;
  tags: string[];
}

export interface User {
  address: string;
  purchases: string[]; // Array of code listing IDs
  listings: string[]; // Array of code listing IDs
  joinedAt: number; // timestamp
}

export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface Transaction {
  id: string;
  buyerAddress: string;
  sellerAddress: string;
  listingId: string;
  amount: number;
  status: TransactionStatus;
  timestamp: number;
  txHash?: string;
}

export type WalletProvider = {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    selectedAddress?: string;
    isMetaMask?: boolean;
  };
};

export type MetaMaskError = {
  code: number;
  message: string;
};
