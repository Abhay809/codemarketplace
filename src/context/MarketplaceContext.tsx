
// import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// import { CodeListing, Transaction, User } from '@/types';
// import { toast } from 'sonner';
// import { useWallet } from '@/hooks/useWallet';
// import { 
//   getListings, 
//   addListing as supabaseAddListing, 
//   getUserListings as supabaseGetUserListings,
//   getUserPurchases as supabaseGetUserPurchases,
//   getListingById as supabaseGetListingById,
//   addTransaction as supabaseAddTransaction
// } from '@/lib/supabase';

// // Define the context type
// type MarketplaceContextType = {
//   listings: CodeListing[];
//   transactions: Transaction[];
//   userListings: CodeListing[];
//   userPurchases: CodeListing[];
//   addListing: (listing: Omit<CodeListing, 'id' | 'createdAt'>) => Promise<CodeListing>;
//   purchaseListing: (listingId: string, buyerAddress: string) => Promise<boolean>;
//   getUserListings: (address: string) => Promise<CodeListing[]>;
//   getUserPurchases: (address: string) => Promise<CodeListing[]>;
//   getListingById: (id: string) => Promise<CodeListing | undefined>;
//   loading: boolean;
//   refreshListings: () => Promise<void>;
// };

// // Mock data for initial development in case Supabase has no data
// const MOCK_LISTINGS: CodeListing[] = [
//   {
//     id: '1',
//     title: 'Smart Contract Boilerplate',
//     description: 'A secure and gas-optimized smart contract template for NFT marketplaces.',
//     price: 0.05,
//     language: 'Solidity',
//     category: 'Blockchain',
//     previewCode: 'contract NFTMarket {\n    // Basic contract structure\n    // View more after purchase\n}',
//     sellerAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
//     createdAt: Date.now() - 86400000 * 2,
//     tags: ['smart-contract', 'ethereum', 'NFT'],
//     imageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop',
//   },
//   {
//     id: '2',
//     title: 'React State Management Library',
//     description: 'A lightweight alternative to Redux with hooks-based API.',
//     price: 0.03,
//     language: 'TypeScript',
//     category: 'Frontend',
//     previewCode: 'export const createStore = (initialState) => {\n  // Store implementation\n  // Purchase to see full code\n}',
//     sellerAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
//     createdAt: Date.now() - 86400000,
//     tags: ['react', 'state-management', 'typescript'],
//     imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2670&auto=format&fit=crop',
//   },
//   {
//     id: '3',
//     title: 'AI Image Generation API',
//     description: 'Backend service for AI-powered image generation with multiple model support.',
//     price: 0.08,
//     language: 'Python',
//     category: 'Backend',
//     previewCode: 'class ImageGenerator:\n    def __init__(self, model="stable-diffusion"):\n        # Initialization code\n        # Full implementation available after purchase',
//     sellerAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
//     createdAt: Date.now() - 86400000 * 3,
//     tags: ['AI', 'python', 'API'],
//     imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2830&auto=format&fit=crop',
//   },
// ];

// // Create context with default values
// const MarketplaceContext = createContext<MarketplaceContextType>({
//   listings: [],
//   transactions: [],
//   userListings: [],
//   userPurchases: [],
//   addListing: async () => ({} as CodeListing),
//   purchaseListing: async () => false,
//   getUserListings: async () => [],
//   getUserPurchases: async () => [],
//   getListingById: async () => undefined,
//   loading: true,
//   refreshListings: async () => {},
// });

// export const useMarketplace = () => useContext(MarketplaceContext);

// export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [listings, setListings] = useState<CodeListing[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [userListings, setUserListings] = useState<CodeListing[]>([]);
//   const [userPurchases, setUserPurchases] = useState<CodeListing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { address, sendTransaction, ethToWei } = useWallet();
  
//   // Load data from Supabase
//   const refreshListings = async () => {
//     setLoading(true);
//     try {
//       const fetchedListings = await getListings();
//       if (fetchedListings.length > 0) {
//         setListings(fetchedListings);
//       } else {
//         // If no listings found, use mock data for development
//         console.log('No listings found in Supabase, using mock data');
//         setListings(MOCK_LISTINGS);
//       }
//     } catch (error) {
//       console.error('Error loading data from Supabase:', error);
//       // Fallback to mock data
//       setListings(MOCK_LISTINGS);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial data load
//   useEffect(() => {
//     refreshListings();
//   }, []);

//   // Update user specific listings and purchases when address changes
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (address) {
//         try {
//           const [userListingsData, userPurchasesData] = await Promise.all([
//             getUserListings(address),
//             getUserPurchases(address)
//           ]);
//           setUserListings(userListingsData);
//           setUserPurchases(userPurchasesData);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       } else {
//         setUserListings([]);
//         setUserPurchases([]);
//       }
//     };

//     fetchUserData();
//   }, [address, listings, transactions]);

//   // Add a new code listing
//   const addListing = async (listingData: Omit<CodeListing, 'id' | 'createdAt'>): Promise<CodeListing> => {
//     try {
//       const newListing = await supabaseAddListing(listingData);
      
//       if (!newListing) {
//         throw new Error('Failed to create listing');
//       }
      
//       // Update local state
//       setListings(prev => [newListing, ...prev]);
      
//       toast.success('Your code has been listed successfully!');
//       return newListing;
//     } catch (error: any) {
//       console.error('Error adding listing:', error);
//       let errorMessage = 'Failed to create listing. Please try again.';
      
//       // Check if it's a Supabase error with a specific message
//       if (error.message.includes('relation') && error.message.includes('does not exist')) {
//         errorMessage = 'Database tables have not been created. Please set up your Supabase tables first.';
//       }
      
//       toast.error(errorMessage);
//       throw error;
//     }
//   };

//   // Purchase a code listing
//   const purchaseListing = async (listingId: string, buyerAddress: string): Promise<boolean> => {
//     try {
//       const listing = listings.find(item => item.id === listingId);
//       if (!listing) {
//         toast.error('Listing not found');
//         return false;
//       }
      
//       // Use sendTransaction from useWallet hook
//       const valueInWei = ethToWei ? ethToWei(listing.price) : '0x' + (listing.price * 10**18).toString(16);
      
//       const txHash = await sendTransaction?.(listing.sellerAddress, valueInWei);
      
//       if (!txHash) {
//         return false; // Error is already handled in sendTransaction
//       }
      
//       // Create transaction record
//       try {
//         const newTransaction = await supabaseAddTransaction({
//           buyerAddress,
//           sellerAddress: listing.sellerAddress,
//           listingId: listing.id,
//           amount: listing.price,
//           status: 'success',
//           txHash,
//         });
        
//         if (!newTransaction) {
//           throw new Error('Failed to record transaction');
//         }
        
//         // Update local state
//         setTransactions(prev => [newTransaction, ...prev]);
        
//         // Refresh user purchases
//         const updatedPurchases = await getUserPurchases(buyerAddress);
//         setUserPurchases(updatedPurchases);
        
//         toast.success('Purchase successful! You can now access the full code.');
//         return true;
//       } catch (error) {
//         console.error('Error recording transaction:', error);
//         toast.warning('Payment was successful, but there was an issue recording the transaction.');
//         return true; // Return true since payment was successful
//       }
//     } catch (error) {
//       console.error('Error purchasing listing:', error);
//       toast.error('Transaction failed. Please try again.');
//       return false;
//     }
//   };

//   // Get listings by a specific user address
//   const getUserListings = async (address: string): Promise<CodeListing[]> => {
//     try {
//       return await supabaseGetUserListings(address);
//     } catch (error) {
//       console.error('Error getting user listings:', error);
//       return [];
//     }
//   };

//   // Get purchases by a specific user address
//   const getUserPurchases = async (address: string): Promise<CodeListing[]> => {
//     try {
//       return await supabaseGetUserPurchases(address);
//     } catch (error) {
//       console.error('Error getting user purchases:', error);
//       return [];
//     }
//   };

//   // Get a listing by its ID
//   const getListingById = async (id: string): Promise<CodeListing | undefined> => {
//     try {
//       const listing = await supabaseGetListingById(id);
//       return listing || undefined;
//     } catch (error) {
//       console.error('Error getting listing by id:', error);
//       return undefined;
//     }
//   };

//   const value = {
//     listings,
//     transactions,
//     userListings,
//     userPurchases,
//     addListing,
//     purchaseListing,
//     getUserListings,
//     getUserPurchases,
//     getListingById,
//     loading,
//     refreshListings,
//   };

//   return (
//     <MarketplaceContext.Provider value={value}>
//       {children}
//     </MarketplaceContext.Provider>
//   );
// };
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CodeListing, Transaction } from '@/types';
import { toast } from 'sonner';
import { useWallet } from '@/hooks/useWallet';
import { 
  getListings, 
  addListing as supabaseAddListing, 
  getUserListings as supabaseGetUserListings,
  getUserPurchases as supabaseGetUserPurchases,
  getListingById as supabaseGetListingById,
  addTransaction as supabaseAddTransaction
} from '@/lib/supabase';

// Create Context
const MarketplaceContext = createContext(null);
export const useMarketplace = () => useContext(MarketplaceContext);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<CodeListing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userListings, setUserListings] = useState<CodeListing[]>([]);
  const [userPurchases, setUserPurchases] = useState<CodeListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, sendTransaction, ethToWei } = useWallet();

  // ✅ Prevent Infinite Loop by using a Ref
  const hasFetchedListings = React.useRef(false);

  // ✅ Refactored Refresh Listings Function
  const refreshListings = async () => {
    if (hasFetchedListings.current) return; // Prevent multiple calls
    hasFetchedListings.current = true;
    
    setLoading(true);
    try {
      const fetchedListings = await getListings();
      setListings(fetchedListings.length > 0 ? fetchedListings : []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to fetch listings.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Listings on Initial Render (Once)
  useEffect(() => {
    refreshListings();
  }, []);

  // ✅ Fetch User-Specific Data Only When Address Changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!address) {
        setUserListings([]);
        setUserPurchases([]);
        return;
      }

      try {
        const [userListingsData, userPurchasesData] = await Promise.all([
          getUserListings(address),
          getUserPurchases(address)
        ]);
        setUserListings(userListingsData);
        setUserPurchases(userPurchasesData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [address]);

  // ✅ Define `addListing`
  const addListing = async (listingData: Omit<CodeListing, 'id' | 'createdAt'>): Promise<CodeListing> => {
    try {
      const newListing = await supabaseAddListing(listingData);
      if (!newListing) throw new Error('Failed to create listing');
      
      setListings(prev => [newListing, ...prev]);
      toast.success('Your code has been listed successfully!');
      return newListing;
    } catch (error: any) {
      console.error('Error adding listing:', error);
      toast.error('Failed to create listing. Please try again.');
      throw error;
    }
  };

  // ✅ Define `purchaseListing`
  const purchaseListing = async (listingId: string, buyerAddress: string): Promise<boolean> => {
    try {
      const listing = listings.find(item => item.id === listingId);
      if (!listing) {
        toast.error('Listing not found');
        return false;
      }

      const valueInWei = ethToWei ? ethToWei(listing.price) : '0x' + (listing.price * 10**18).toString(16);
      const txHash = await sendTransaction?.(listing.sellerAddress, valueInWei);
      if (!txHash) return false;

      try {
        const newTransaction = await supabaseAddTransaction({
          buyerAddress,
          sellerAddress: listing.sellerAddress,
          listingId: listing.id,
          amount: listing.price,
          status: 'success',
          txHash,
        });

        if (!newTransaction) throw new Error('Failed to record transaction');
        setTransactions(prev => [newTransaction, ...prev]);

        const updatedPurchases = await getUserPurchases(buyerAddress);
        setUserPurchases(updatedPurchases);

        toast.success('Purchase successful! You can now access the full code.');
        return true;
      } catch (error) {
        console.error('Error recording transaction:', error);
        toast.warning('Payment was successful, but there was an issue recording the transaction.');
        return true; 
      }
    } catch (error) {
      console.error('Error purchasing listing:', error);
      toast.error('Transaction failed. Please try again.');
      return false;
    }
  };

  // ✅ Define `getUserListings`
  const getUserListings = async (address: string): Promise<CodeListing[]> => {
    try {
      return await supabaseGetUserListings(address);
    } catch (error) {
      console.error('Error getting user listings:', error);
      return [];
    }
  };

  // ✅ Define `getUserPurchases`
  const getUserPurchases = async (address: string): Promise<CodeListing[]> => {
    try {
      return await supabaseGetUserPurchases(address);
    } catch (error) {
      console.error('Error getting user purchases:', error);
      return [];
    }
  };

  // ✅ Define `getListingById`
  const getListingById = async (id: string): Promise<CodeListing | undefined> => {
    try {
      const listing = await supabaseGetListingById(id);
      return listing || undefined;
    } catch (error) {
      console.error('Error getting listing by id:', error);
      return undefined;
    }
  };

  // ✅ Ensure All Functions Are Available Inside `useMemo`
  const value = React.useMemo(() => ({
    listings,
    transactions,
    userListings,
    userPurchases,
    addListing, // ✅ Fixed missing function reference
    purchaseListing,
    getUserListings,
    getUserPurchases,
    getListingById,
    loading,
    refreshListings,
  }), [listings, transactions, userListings, userPurchases, loading]);

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};
